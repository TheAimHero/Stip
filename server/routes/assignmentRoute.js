import express from 'express';
import multer from 'multer';

import catchAsync from '../utils/catchAsync.js';

import * as assignment from '../controller/assignmentController.js';
import * as auth from '../controller/authController.js';

const assignmentRoute = express.Router({ mergeParams: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
  fileFilter: (req, file, cb) => {
    const filetype = file.mimetype.split('/')[1];
    if (filetype === 'pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
});

assignmentRoute
  .route('/')
  .post(
    auth.restrict('prof'),
    upload.single('file'),
    catchAsync(assignment.addAssignment)
  )
  .get(catchAsync(assignment.getAssignments))
  .delete(auth.restrict('prof'), catchAsync(assignment.deleteAssignment));

export default assignmentRoute;
