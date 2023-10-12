import * as dotenv from 'dotenv';

dotenv.config();
export const user = process.env.DB_USER;
export const password = process.env.DB_PASSWORD;
export const db = process.env.DB_NAME;
export const secret = process.env.JWT_SECRET;
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'infocv-3c91e.firebaseapp.com',
  projectId: 'infocv-3c91e',
  storageBucket: 'infocv-3c91e.appspot.com',
  messagingSenderId: '589364090241',
  appId: '1:589364090241:web:dc65bc038f9f8d76e18480',
};
