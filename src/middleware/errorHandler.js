const logger = require("../utils/logger");
const { ApiError } = require("../utils/errors");

/**
 * Middleware de gestion des erreurs
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Erreur interne du serveur";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  logger.error(`${statusCode} - ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = { errorHandler };
