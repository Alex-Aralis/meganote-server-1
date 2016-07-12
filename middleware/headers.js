module.exports = (req, res, next) => {
  // Allow CORS.
  res.header('Access-Control-Allow-Origin', '*');

  // Allow Content-Type header (for JSON payloads).
  res.header('Access-Control-Allow-Headers', 'Content-Type,Autherization');

  // Allow more HTTP verbs.
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');

  // Continue processing the request.
  next();
};
