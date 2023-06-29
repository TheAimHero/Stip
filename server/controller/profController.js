import profModel from '../model/profModel.js';
import * as authUtils from '../utils/authUtils.js';
import * as auth from './authController.js';
import * as generic from './genericController.js';

export async function signup(req, res, next) {
  const { password, confirmPassword, adminKey } = req.body;
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

  if (!authUtils.timedEqual(adminKey, process.env.ADMIN_KEY)) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Invalid Admin Key' });
  }

  req.body.role = undefined;

  const teacher = await profModel.create(req.body);

  const token = authUtils.signToken(teacher._id);
  authUtils.addCookie(res, token);

  res.status(201).json({ status: 'success', token, data: { teacher } });
}

export const login = auth.login(profModel);

export const updatePassword = auth.updatePassword(profModel);

export const getMe = generic.getMe(profModel);

export const protect = auth.protect(profModel);

export const restrict = auth.restrict('prof');

// @todo: Still work in progress not yet implemented at all for dev only
export async function deleteMe(req, res, next) {
  await profModel.deleteMany({});
  res.status(200).json({ status: 'success', data: {} });
}
