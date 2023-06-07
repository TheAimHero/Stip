export function sanitizeUser(body) {
  body.passoword = undefined;
  body.passowordChangedAt = undefined;
  body._id = undefined;
  body.__v = undefined;
  return body;
}
