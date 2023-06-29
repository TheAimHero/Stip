import catchAsync from '../utils/catchAsync.js';

export function getMe() {
  return catchAsync(async (req, res, next) => {
    const { user } = req;
    user.password = undefined;
    user.passwordChangedAt = undefined;
    user.__v = undefined;
    user.role = undefined;

    res.status(200).json({ status: 'success', data: { user } });
  });
}
