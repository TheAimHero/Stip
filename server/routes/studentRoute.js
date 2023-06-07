import express from 'express';
// import multer from 'multer';

import * as Student from '../controller/studentController.js';
import { catchAsync } from '../utils/catchAsync.js';

export const studentRoute = express.Router();

// NOTE: For later Reference
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads');
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ dest: 'uploads', storage: multerStorage });

studentRoute.post(
  '/sign-up',
  // TODO: Add multer for file upload and form data parsing
  // upload.single('photo'),
  catchAsync(Student.signup)
);

studentRoute.post('/login', Student.login);

studentRoute.post('/update-password', Student.protect, Student.updatePassword);

studentRoute.get('/me', Student.protect, Student.getMe);

// NOTE: Not implementer just for dev purposes
studentRoute.post('/deleteMe', Student.deleteMe);
