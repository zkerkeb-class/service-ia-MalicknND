const StabilityAIService = require("../services/stabilityAIService");
const ImageService = require("../services/imageService");
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
        metadata = {}, // Métadonnées optionnelles
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

      // Si une seule image est demandée
      if (samples === 1) {
        const imageBuffer = result.images[0].image;

        // Sauvegarde automatique de l'image
        try {
          // Récupérer le token d'authentification du frontend
          const authHeader = req.headers.authorization;
          const userToken = authHeader ? authHeader.split(" ")[1] : null;

          logger.info(
            `Token reçu du frontend: ${
              userToken ? userToken.substring(0, 20) + "..." : "null"
            }`
          );

          const imageService = new ImageService();
          const savedImage = await imageService.saveGeneratedImage(
            {
              prompt,
              imageData: imageBuffer.toString("base64"),
              metadata: {
                ...metadata,
                width,
                height,
                steps,
                cfgScale,
                model: "stability-ai",
                generated_at: new Date().toISOString(),
              },
            },
            userToken
          ); // Passer le token utilisateur

          logger.info(
            `Image sauvegardée avec succès: ${savedImage.data.image_id}`
          );

          // Renvoyer l'image avec les informations de sauvegarde
          res.setHeader("Content-Type", "image/png");
          res.setHeader("X-Image-ID", savedImage.data.image_id);
          res.setHeader("X-Image-URL", savedImage.data.image_url);
          res.setHeader("X-Saved", "true");
          return res.send(imageBuffer);
        } catch (saveError) {
          logger.error(`Erreur lors de la sauvegarde: ${saveError.message}`);
          // Continuer sans sauvegarde si ça échoue
          res.setHeader("Content-Type", "image/png");
          res.setHeader("X-Saved", "false");
          return res.send(imageBuffer);
        }
      }

      // Si plusieurs images sont demandées
      const images = result.images.map((img) => ({
        id: img.id,
        seed: img.seed,
        finishReason: img.finishReason,
      }));

      // Sauvegarde automatique de toutes les images
      try {
        // Récupérer le token d'authentification du frontend
        const authHeader = req.headers.authorization;
        const userToken = authHeader ? authHeader.split(" ")[1] : null;

        logger.info(
          `Token reçu du frontend (multiple): ${
            userToken ? userToken.substring(0, 20) + "..." : "null"
          }`
        );

        const imageService = new ImageService();
        const savedImages = [];

        for (let i = 0; i < result.images.length; i++) {
          const savedImage = await imageService.saveGeneratedImage(
            {
              prompt: `${prompt} (variation ${i + 1})`,
              imageData: result.images[i].image.toString("base64"),
              metadata: {
                ...metadata,
                width,
                height,
                steps,
                cfgScale,
                model: "stability-ai",
                variation: i + 1,
                generated_at: new Date().toISOString(),
              },
            },
            userToken
          ); // Passer le token utilisateur
          savedImages.push(savedImage.data);
        }

        logger.info(`${savedImages.length} images sauvegardées avec succès`);

        return res.status(200).json({
          success: true,
          images: images,
          savedImages: savedImages,
        });
      } catch (saveError) {
        logger.error(
          `Erreur lors de la sauvegarde multiple: ${saveError.message}`
        );
        // Continuer sans sauvegarde si ça échoue
        return res.status(200).json({
          success: true,
          images: images,
          savedImages: [],
        });
      }
    } catch (error) {
      logger.error(`Erreur lors de la génération d'image: ${error.message}`);
      next(error);
    }
  },
};

module.exports = imageController;
