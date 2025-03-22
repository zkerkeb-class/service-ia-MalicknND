require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { errorHandler } = require("./middleware/errorHandler");
const routes = require("./routes");
const logger = require("./utils/logger");

// Initialisation de l'application Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware de base
app.use(helmet()); // Sécurité
app.use(cors()); // Gestion des requêtes cross-origin
app.use(express.json()); // Parsing du corps des requêtes JSON
app.use(morgan("combined")); // Logging des requêtes HTTP

// Routes de l'API
app.use("/api", routes);

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Démarrage du serveur
app.listen(port, () => {
  logger.info(`Serveur démarré sur le port ${port}`);
});

module.exports = app; // Pour les tests
