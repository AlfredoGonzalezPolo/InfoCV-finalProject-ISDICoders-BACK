import mongoose from 'mongoose';
import { password, user, db } from '../config.js';

export const dbConnect = () => {
  const uri = `mongodb+srv://${user}:${password}@cluster0.xefczmb.mongodb.net/${db}?retryWrites=true&w=majority`;
  console.log(uri);
  return mongoose.connect(uri);
};
