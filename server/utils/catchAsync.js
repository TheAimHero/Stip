/* eslint-disable no-console */
function catchAsync(fn) {
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

export default catchAsync;
