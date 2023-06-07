import * as auth from './authController.js';
import * as generic from './genericController.js';
import * as authUtils from '../utils/authUtils.js';
import { studentModel } from '../model/studentModel.js';

export async function signup(req, res, next) {
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Passwords do not match' });
  }

  if (!authUtils.checkStrongPassword(password)) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Password is too weak' });
  }

  req.body.role = undefined;

  const student = await studentModel.create(req.body);

  const token = authUtils.signToken(student._id);
  authUtils.addCookie(res, token);

  res.status(201).json({ status: 'success', token, data: { student } });
}

export const login = auth.login(studentModel);

export const getMe = generic.getMe(studentModel);

export const updatePassword = auth.updatePassword(studentModel);

export const protect = auth.protect(studentModel);

// NOTE: Get assignments
// export async function getAssignments(req, res, next) {
//   const student = await studentModel
//     .findById(req.user._id)
//     .populate('assignments.assignment');
//   res.status(200).json({ status: 'success', data: { student } });
// }

export async function deleteMe(req, res, next) {
  await studentModel.deleteMany({});
  res.status(200).json({ status: 'success', data: {} });
}
