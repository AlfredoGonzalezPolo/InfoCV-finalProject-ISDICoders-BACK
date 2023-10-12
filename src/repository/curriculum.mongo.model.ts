import { Schema, model } from 'mongoose';
import { Curriculum } from '../entities/curriculum.js';

const curriculumSchema = new Schema<Curriculum>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  photo: {
    type: {
      urlOriginal: { type: String },
      url: { type: String },
      mimetype: { type: String },
      size: { type: Number },
    },
    required: true,
    unique: true,
  },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  age: { type: Number, required: true },
  studies: { type: String, required: true },
  experience: { type: String, required: true },
  skills: { type: String, required: true },
  languages: { type: String, required: true },
  occupation: { type: String },
});

curriculumSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.password;
  },
});
export const CurriculumModel = model(
  'Curriculum',
  curriculumSchema,
  'curriculums'
);
