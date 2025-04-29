const axios = require("axios");
const logger = require("../utils/logger");
const { ApiError } = require("../utils/errors");

/**
 * Service pour interagir avec l'API Stability AI
 */
class StabilityAIService {
  constructor() {
    this.apiKey = process.env.STABILITY_API_KEY;
    this.apiUrl = process.env.STABILITY_API_URL;

    if (!this.apiKey) {
      throw new Error("La clé API Stability AI est manquante");
    }
  }

  /**
   * Générer une image avec Stability AI
   * @param {Object} params - Paramètres de génération
   * @returns {Promise<Object>} - Résultat de la génération
   */
  async generateImage(params) {
    const { prompt, width, height, samples, steps, cfgScale } = params;

    try {
      const response = await axios({
        method: "post",
        url: this.apiUrl,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        data: {
          text_prompts: [
            {
              text: prompt,
              weight: 1.0,
            },
          ],
          height,
          width,
          samples,
          steps,
          cfg_scale: cfgScale,
        },
      });

      return {
        success: true,
        images: response.data.artifacts.map((img) => ({
          id: img.id,
          image: Buffer.from(img.base64, "base64"),
          seed: img.seed,
          finishReason: img.finish_reason,
        })),
      };
    } catch (error) {
      logger.error(`Erreur Stability AI: ${error.message}`);

      if (error.response) {
        throw new ApiError(
          error.response.data.message || "Erreur de l'API Stability AI",
          error.response.status
        );
      }

      throw new ApiError(
        "Erreur lors de la communication avec l'API Stability AI",
        500
      );
    }
  }
}

module.exports = StabilityAIService;
