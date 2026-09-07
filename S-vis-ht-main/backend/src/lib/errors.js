const env = require('../config/env');

class AppError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code || 'ERROR';
    this.expose = true;
  }
}

const badRequest = (msg = 'Demann lan pa valid.') => new AppError(400, msg, 'BAD_REQUEST');
const unauthorized = (msg = 'Otantifikasyon nesesè.') => new AppError(401, msg, 'UNAUTHORIZED');
const forbidden = (msg = 'Ou pa gen pèmisyon pou aksyon sa a.') => new AppError(403, msg, 'FORBIDDEN');
const notFound = (msg = 'Resous sa a pa jwenn.') => new AppError(404, msg, 'NOT_FOUND');
const conflict = (msg = 'Konfli ak done ki egziste deja.') => new AppError(409, msg, 'CONFLICT');
const tooMany = (msg = 'Twòp demann. Tanpri eseye ankò pita.') => new AppError(429, msg, 'RATE_LIMITED');

// Wraps an async handler so rejections reach the central error handler.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Demann lan twò gwo.', code: 'PAYLOAD_TOO_LARGE' });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON lan pa valid.', code: 'BAD_JSON' });
  }
  if (err.name === 'MulterError') {
    const msg = err.code === 'LIMIT_FILE_SIZE' ? 'Fichye a twò gwo (maks 2MB).' : 'Upload lan pa valid.';
    return res.status(400).json({ error: msg, code: 'UPLOAD_INVALID' });
  }
  if (err.expose && err.status) {
    return res.status(err.status).json({ error: err.message, code: err.code });
  }

  // Unknown error: log internally (no request body, which may hold secrets) and return a generic message.
  console.error('[error]', req.method, req.originalUrl, err.message, env.isProduction ? '' : err.stack);
  return res.status(500).json({ error: 'Yon erè entèn fèt. Tanpri eseye ankò.', code: 'INTERNAL' });
}

module.exports = {
  AppError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  tooMany,
  asyncHandler,
  errorHandler,
};
