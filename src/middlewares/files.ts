import path from 'path';
import multer from 'multer';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import sharp from 'sharp';

import createDebug from 'debug';
import { FireBase } from '../services/firebase.js';
const debug = createDebug('INFOCV:FileMiddleware');

const optionsSets: {
  [key: string]: {
    width: number;
    height: number;
    fit: keyof sharp.FitEnum;
    position: string;
    quality: number;
  };
} = {
  photo: {
    width: 550,
    height: 300,
    fit: 'inside',
    position: 'top',
    quality: 100,
  },
};

export class FileMiddleware {
  constructor() {
    debug('Instantiate');
  }

  singleFileStore(fileName = 'photo', fileSize = 8_000_000) {
    const upload = multer({
      storage: multer.diskStorage({
        destination: 'public/uploads',
        filename(request, file, callback) {
          const suffix = crypto.randomUUID();
          const extension = path.extname(file.originalname);
          const basename = path.basename(file.originalname, extension);
          const filename = `${basename}-${suffix}${extension}`;
          debug('Called Multer');
          callback(null, filename);
        },
      }),
      limits: {
        fileSize,
      },
    });
    const middleware = upload.single(fileName);
    return (request: Request, response: Response, next: NextFunction) => {
      const previousBody = request.body;
      middleware(request, response, next);
      request.body = { ...previousBody, ...request.body };
    };
  }

  async optimization(request: Request, response: Response, next: NextFunction) {
    try {
      if (!request.file) {
        throw new HttpError(406, 'Not Acceptable', 'Not valid image file');
      }

      const options = optionsSets.photo;
      const fileName = request.file.filename;
      const baseFileName = `${path.basename(fileName, path.extname(fileName))}`;

      const imageData = await sharp(path.join('public/uploads', fileName))
        .resize(options.width, options.height, {
          fit: options.fit,
          position: options.position,
        })
        .webp({ quality: options.quality })
        .toFormat('webp')
        .toFile(path.join('public/uploads', `${baseFileName}.webp`));

      request.file.originalname = request.file.path;
      request.file.filename = `${baseFileName}.${imageData.format}`;
      request.file.mimetype = `image/${imageData.format}`;
      request.file.path = path.join('public/uploads', request.file.filename);
      request.file.size = imageData.size;

      next();
    } catch (error) {
      next(error);
    }
  }

  saveImage = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      debug('Called saveImage', request.file);
      if (!request.file)
        throw new HttpError(406, 'Not Acceptable', 'Not valid image file');

      const userImage = request.file.filename;

      const firebase = new FireBase();
      const backupImage = await firebase.uploadFile(userImage);

      request.body[request.file.fieldname] = {
        urlOriginal: request.file.originalname,
        url: backupImage,
        mimetype: request.file.mimetype,
        size: request.file.size,
      };
      console.log(request.file);
      next();
    } catch (error) {
      next(error);
    }
  };
}
