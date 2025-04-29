const express = require("express");
const imageRoutes = require("./imageRoutes");

const router = express.Router();

router.use("/images", imageRoutes);

// Route de santé
router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

module.exports = router;
