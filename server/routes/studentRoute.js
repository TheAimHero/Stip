import express from 'express';
// import multer from 'multer';

import * as Student from '../controller/studentController.js';
import catchAsync from '../utils/catchAsync.js';
import assignmentRoute from './assignmentRoute.js';

const studentRoute = express.Router();

studentRoute.post(
  '/sign-up',
  // @todo: Add multer for file upload and form data parsing
  // upload.single('photo'),
  catchAsync(Student.signup)
);

studentRoute.post('/login', Student.login);

studentRoute.post('/update-password', Student.protect, Student.updatePassword);

studentRoute.get('/me', Student.protect, Student.getMe);

studentRoute.use('/assignment', Student.protect, assignmentRoute);

// @note: Not implementer just for dev purposes
studentRoute.post('/deleteMe', Student.deleteMe);

export default studentRoute;
