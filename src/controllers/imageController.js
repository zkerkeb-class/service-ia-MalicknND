const StabilityAIService = require("../services/stabilityAIService");
const logger = require("../utils/logger");

/**
 * Contrôleur pour la génération d'images
 */
const imageController = {
  /**
   * Générer une image avec Stability AI
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   * @param {Function} next - Middleware suivant
   */
  generateImage: async (req, res, next) => {
    try {
      const {
        prompt,
        width = 1024,
        height = 1024,
        samples = 1,
        steps = 30,
        cfgScale = 7,
      } = req.body;

      logger.info(`Génération d'image avec prompt: ${prompt}`);

      const stabilityService = new StabilityAIService();
      const result = await stabilityService.generateImage({
        prompt,
        width,
        height,
        samples,
        steps,
        cfgScale,
      });

      // Si une seule image est demandée, renvoyer directement l'image
      if (samples === 1) {
        res.setHeader("Content-Type", "image/png");
        return res.send(result.images[0].image);
      }

      // Si plusieurs images sont demandées, renvoyer un tableau d'images
      return res.status(200).json({
        success: true,
        images: result.images.map((img) => ({
          id: img.id,
          seed: img.seed,
          finishReason: img.finishReason,
        })),
      });
    } catch (error) {
      logger.error(`Erreur lors de la génération d'image: ${error.message}`);
      next(error);
    }
  },
};

module.exports = imageController;
