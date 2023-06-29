import express from 'express';

import * as announce from '../controller/announceController.js';
import * as auth from '../controller/authController.js';
import catchAsync from '../utils/catchAsync.js';

const announceRoute = express.Router({ mergeParams: true });

announceRoute
  .route('/')
  .get(catchAsync(announce.getAnnouncement))
  .post(auth.restrict('prof'), catchAsync(announce.addAnnouncement));

export default announceRoute;
