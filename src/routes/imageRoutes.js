const express = require("express");
const { body } = require("express-validator");
const imageController = require("../controllers/imageController");
const { validateRequest } = require("../middleware/validator");

const router = express.Router();

/**
 * @route POST /api/images/generate
 * @desc Générer une image avec Stability AI
 */
router.post(
  "/generate",
  [
    body("prompt").notEmpty().withMessage("Le prompt est requis"),
    body("width")
      .optional()
      .isInt({ min: 512, max: 2048 })
      .withMessage("La largeur doit être entre 512 et 2048 pixels"),
    body("height")
      .optional()
      .isInt({ min: 512, max: 2048 })
      .withMessage("La hauteur doit être entre 512 et 2048 pixels"),
    body("samples")
      .optional()
      .isInt({ min: 1, max: 4 })
      .withMessage("Le nombre d'échantillons doit être entre 1 et 4"),
    body("steps")
      .optional()
      .isInt({ min: 10, max: 50 })
      .withMessage("Le nombre d'étapes doit être entre 10 et 50"),
    body("cfgScale")
      .optional()
      .isFloat({ min: 0, max: 35 })
      .withMessage("Le paramètre cfg_scale doit être entre 0 et 35"),
    validateRequest,
  ],
  imageController.generateImage
);

module.exports = router;
