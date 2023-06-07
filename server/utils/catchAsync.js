/* eslint-disable no-console */
export function catchAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(err => {
      console.log(err.name);
      console.log(err.code);
      console.log(err.message);
      // next(err);
      next(err);
    });
  };
}
