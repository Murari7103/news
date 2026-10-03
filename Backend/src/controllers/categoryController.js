const slugify = require("slugify");

const Category = require("../models/Category");

// CREATE CATEGORY
exports.createCategory = async (req, res) => {
  try {
    const { name, slug,  description, image, status, seoTitle, seoDescription } =
      req.body;

    // VALIDATION
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    // GENERATE CATEGORY ID
    const lastCategory = await Category.findOne({
      categoryId: { $exists: true },
    }).sort({
      categoryId: -1,
    });

    const categoryId = Number(lastCategory?.categoryId || 0) + 1;

    // GENERATE SLUG
  const finalSlug =
    slug ||
    slugify(name, {
      lower: true,
      strict: true,
    });

    // CREATE CATEGORY
    const category = await Category.create({
      categoryId,
      name,
      slug: finalSlug,
      description,
      image,
      status,
      seoTitle,
      seoDescription,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL CATEGORIES
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({
      categoryId: 1,
    });

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE CATEGORY
exports.getCategoryById = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id, 10);

    // Validate categoryId
    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID.",
      });
    }

    const category = await Category.findOne({ categoryId });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch category.",
    });
  }
};

// UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
  try {
    const {
  name,
  description,
  image,
  status,
  seoTitle,
  seoDescription,
} = req.body;

const slug = slugify(name, {
  lower: true,
  strict: true,
});

  const category = await Category.findOneAndUpdate(
  {
    categoryId: Number(req.params.id),
  },
  {
    name,
    slug,
    description,
    image,
    status,
    seoTitle,
    seoDescription,
  },
  {
    new: true,
  }
);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      categoryId: Number(req.params.id),
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
