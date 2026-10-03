const express = require("express");

const router = express.Router();

const categoryController = require("../controllers/categoryController");

const authMiddleware = require("../middleware/authMiddleware");

// CREATE CATEGORY
router.post("/create", authMiddleware, categoryController.createCategory);

router.get("/", categoryController.getCategories,);
router.get("/:id", categoryController.getCategoryById);
router.delete("/:id", categoryController.deleteCategory);
router.put("/:id", categoryController.updateCategory);

module.exports = router;