export function errorController(err, req, res, next) {
  res.status(500).json({
    status: 'error',
    name: err.name,
    message: err.message,
    code: err.code,
    stack: err.stack,
  });
}
