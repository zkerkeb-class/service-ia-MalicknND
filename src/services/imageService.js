const axios = require("axios");
const logger = require("../utils/logger");

class ImageService {
  constructor() {
    this.imageServiceUrl =
      process.env.IMAGE_SERVICE_URL || "http://localhost:5002";
  }

  /**
   * Sauvegarder une image générée via le service Image
   * @param {Object} imageData - Données de l'image à sauvegarder
   * @param {string} imageData.prompt - Le prompt utilisé pour générer l'image
   * @param {string} imageData.imageData - Les données de l'image en base64
   * @param {Object} imageData.metadata - Métadonnées optionnelles
   * @param {string} userToken - Token d'authentification de l'utilisateur
   * @returns {Promise<Object>} - Réponse du service Image
   */
  async saveGeneratedImage(imageData, userToken = null) {
    try {
      logger.info("Sauvegarde de l'image générée via le service Image...");

      // Utiliser le token utilisateur Clerk fourni
      if (!userToken) {
        throw new Error("Token d'authentification Clerk requis");
      }

      logger.info(
        `Utilisation du token Clerk: ${userToken.substring(0, 20)}...`
      );

      const response = await axios.post(
        `${this.imageServiceUrl}/api/images`,
        {
          prompt: imageData.prompt,
          imageData: imageData.imageData,
          metadata: imageData.metadata || {},
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30 secondes de timeout
        }
      );

      logger.info(
        `Image sauvegardée avec succès: ${response.data.data.image_id}`
      );
      return response.data;
    } catch (error) {
      logger.error(`Erreur lors de la sauvegarde de l'image: ${error.message}`);

      if (error.response) {
        logger.error(
          `Détails de l'erreur: ${JSON.stringify(error.response.data)}`
        );
      }

      throw new Error(`Impossible de sauvegarder l'image: ${error.message}`);
    }
  }

  /**
   * Vérifier la santé du service Image
   * @returns {Promise<boolean>} - True si le service est opérationnel
   */
  async healthCheck() {
    try {
      const response = await axios.get(`${this.imageServiceUrl}/api/health`, {
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      logger.error(`Service Image non accessible: ${error.message}`);
      return false;
    }
  }

  /**
   * Récupérer les images d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @param {Object} options - Options de pagination
   * @param {string} userToken - Token d'authentification de l'utilisateur
   * @returns {Promise<Object>} - Liste des images
   */
  async getUserImages(userId, options = {}, userToken = null) {
    try {
      const { page = 1, limit = 10, status } = options;
      let url = `${this.imageServiceUrl}/api/images/user?page=${page}&limit=${limit}`;

      if (status) {
        url += `&status=${status}`;
      }

      if (!userToken) {
        throw new Error("Token d'authentification Clerk requis");
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      return response.data;
    } catch (error) {
      logger.error(
        `Erreur lors de la récupération des images: ${error.message}`
      );
      throw error;
    }
  }

  /**
   * Supprimer une image
   * @param {string} imageId - ID de l'image à supprimer
   * @param {string} userToken - Token d'authentification de l'utilisateur
   * @returns {Promise<Object>} - Réponse de suppression
   */
  async deleteImage(imageId, userToken = null) {
    try {
      if (!userToken) {
        throw new Error("Token d'authentification Clerk requis");
      }

      const response = await axios.delete(
        `${this.imageServiceUrl}/api/images/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      logger.error(
        `Erreur lors de la suppression de l'image: ${error.message}`
      );
      throw error;
    }
  }
}

module.exports = ImageService;
