function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      mensaje: 'Error de validación',
      detalles: err.errors.map((e) => e.message),
    });
  }

  const status = err.status || 500;
  res.status(status).json({ mensaje: err.message || 'Error interno del servidor' });
}

module.exports = errorHandler;
