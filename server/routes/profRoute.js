import express from 'express';

import * as Prof from '../controller/profController.js';
import { assignmentRoute } from './assignmentRoute.js';
import { catchAsync } from '../utils/catchAsync.js';

export const profRoute = express.Router();

profRoute.post('/sign-up', catchAsync(Prof.signup));
profRoute.post('/deleteMe', catchAsync(Prof.deleteMe));
profRoute.post('/login', Prof.login);
profRoute.post('/change-password', Prof.protect, Prof.updatePassword);
profRoute.use('/assignment', Prof.protect, assignmentRoute);
profRoute.get('/me', Prof.protect, Prof.getMe);
