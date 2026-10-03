const express = require("express");

const router = express.Router();

const {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
  getBreakingNews,
} = require("../controllers/newsController");

const authMiddleware = require("../middleware/authMiddleware");

// CREATE NEWS
router.post("/", authMiddleware, createNews);

// GET ALL NEWS
router.get("/", getAllNews);

// GET BREAKING NEWS
router.get("/breaking", getBreakingNews);

// GET SINGLE NEWS
router.get("/:id", getNewsById);

// UPDATE NEWS
router.put("/:id", authMiddleware, updateNews);

// DELETE NEWS
router.delete("/:id", authMiddleware, deleteNews);

module.exports = router;
