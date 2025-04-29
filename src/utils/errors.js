// Fichier: src/utils/errors.js
/**
 * Erreur personnalisée pour l'API
 */
class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

module.exports = { ApiError };
