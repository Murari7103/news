const express = require("express");

const router = express.Router();

const tagController = require("../controllers/tagController");

const authMiddleware = require("../middleware/authMiddleware");

// ========================================
// CREATE TAG
// ========================================
router.post("/create", authMiddleware, tagController.createTag);

// ========================================
// GET ALL TAGS
// ========================================
router.get("/", tagController.getAllTags);

// ========================================
// GET SINGLE TAG
// ========================================
router.get("/:id", tagController.getTagById);

// ========================================
// UPDATE TAG
// ========================================
router.put("/:id", tagController.updateTag);

// ========================================
// DELETE TAG
// ========================================
router.delete("/:id", tagController.deleteTag);

module.exports = router;
