import * as authUtils from '../utils/authUtils.js';
import { catchAsync } from '../utils/catchAsync.js';

export function protect(model) {
  return catchAsync(async (req, res, next) => {
    const { authorization: bearerToken } = req.headers;
    const token = bearerToken && authUtils.extractToken(bearerToken);
    const decoded = token && authUtils.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }

    const user = await model.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }

    if (authUtils.checkPasswordChanged(user.passwordChangedAt, decoded.iat)) {
      return res.status(401).json({ status: 'fail', message: 'Token Expired' });
    }

    req.user = user;
    next();
  });
}

export function login(model) {
  return catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await model
      .findOne({ email })
      .select('-passwordChangedAt -__v');
    if (!user) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Invalid email or password' });
    }
    if (!(await authUtils.compareHash(password, user.password))) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Invalid email or password' });
    }

    const token = authUtils.signToken(user._id);
    authUtils.addCookie(res, token);
    user.password = undefined;
    res.status(200).json({ status: 'success', token, data: { user } });
  });
}

export function updatePassword() {
  return catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Passwords do not match' });
    }
    if (!authUtils.compareHash(currentPassword, req.user.password)) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Invalid credentials' });
    }
    req.user.password = newPassword;
    await req.user.save();

    res.status(200).json({ status: 'success', data: { user: req.user } });
  });
}
