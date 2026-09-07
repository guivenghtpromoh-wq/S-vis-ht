const errorHandler = (err, req, res, next) => {
  console.error('API Error Stack:', err.stack || err.message);

  const statusCode = err.statusCode || res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    error: err.message || 'Erè Entèn Sèvè',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = {
  errorHandler,
};
