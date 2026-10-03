const slugify = require("slugify");

const News = require("../models/News");
const Category = require("../models/Category");
exports.createNews = async (req, res) => {
  try {
    const {
      title,
      category,
      shortDescription,
      tags,
      content,
      featuredImage,
      status,
      isFeatured,
      isBreaking,
      seoTitle,
      seoDescription,
    } = req.body;
    // Validation,we will do there
    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "News title is must",
      });
    }
    if (!category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }
    if (!content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "News Content is required.",
      });
    }
    // Check for Category

    const exisitingCategory = await Category.findById(category);
    if (!exisitingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category not Found",
      });
    }
    const lastNews = await News.findOne({
      newsId: { $exists: true },
    }).sort({
      newsId: -1,
    });
    const newsId = Number(lastNews?.newsId || 0) + 1;
    // Generate Slug

    const slug = slugify(title, {
      lower: true,
      strict: true,
    });

    // Duplicate Slug Checker
    const existingNews = await News.findOne({ slug });

    if (existingNews) {
      return res.status(400).json({
        success: false,
        message: "News with this title already exists",
      });
    }
    //  published Date

    const newsStatus = status || "Draft";
    const publishedAt = newsStatus === "Published" ? new Date() : null;

    // Create News

    const news = await News.create({
      newsId,
      title,
      slug,
      category,
      tags: tags || [],
      shortDescription,
      content,
      featuredImage,
      status: newsStatus,
      isFeatured: Boolean(isFeatured),
      isBreaking: Boolean(isBreaking),
      publishedAt,
      seoTitle,
      seoDescription,
      createdBy: req.user._id,
    });
    await news.populate("category", "categoryId name slug status");

    return res.status(201).json({
      success: true,
      message: "News created successfully",
      news,
    });
  } catch (error) {
    console.error("Create News Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// GET ALL NEWS
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find()
      .populate("category", "categoryId name slug status")
      .populate("createdBy", "name email")
      .populate("tags", "tagId name slug")
      .sort({
        newsId: -1,
      });

    return res.status(200).json({
      success: true,
      total: news.length,
      news,
    });
  } catch (error) {
    console.error("Get All News Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// GET SINGLE NEWS
exports.getNewsById = async (req, res) => {
  try {
    const newsId = parseInt(req.params.id, 10);

    if (isNaN(newsId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid news ID",
      });
    }

    const news = await News.findOne({
      newsId,
    })
      .populate("category", "categoryId name slug status")
      .populate("createdBy", "name email")
      .populate("tags", "tagId name slug");

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      success: true,
      news,
    });
  } catch (error) {
    console.error("Get Single News Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==========================================
// UPDATE NEWS
// ==========================================
exports.updateNews = async (req, res) => {
  try {
    const newsId = parseInt(req.params.id, 10);

    if (isNaN(newsId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid news ID",
      });
    }

    // =========================
    // FIND EXISTING NEWS
    // =========================

    const existingNews = await News.findOne({
      newsId,
    });

    if (!existingNews) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    // =========================
    // GET REQUEST DATA
    // =========================

    const {
      title,
      category,
      tags,
      shortDescription,
      content,
      featuredImage,
      status,
      isFeatured,
      isBreaking,
      seoTitle,
      seoDescription,
    } = req.body;

    // =========================
    // VALIDATE ONLY IF PROVIDED
    // =========================

    if (title !== undefined && !title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "News title is required",
      });
    }

    if (category !== undefined && !category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    if (content !== undefined && !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "News content is required",
      });
    }

    // =========================
    // CHECK CATEGORY
    // =========================

    if (category !== undefined) {
      const existingCategory = await Category.findById(category);

      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    // =========================
    // GENERATE SLUG
    // =========================

    let slug = existingNews.slug;

    if (title !== undefined && title !== existingNews.title) {
      slug = slugify(title, {
        lower: true,
        strict: true,
      });

      // Check duplicate slug
      const duplicateNews = await News.findOne({
        slug,
        newsId: {
          $ne: newsId,
        },
      });

      if (duplicateNews) {
        return res.status(400).json({
          success: false,
          message: "News with this title already exists",
        });
      }
    }

    // =========================
    // HANDLE PUBLISHED DATE
    // =========================

    let publishedAt = existingNews.publishedAt;

    if (
      status !== undefined &&
      status === "Published" &&
      existingNews.status !== "Published"
    ) {
      publishedAt = new Date();
    }

    if (status !== undefined && status === "Draft") {
      publishedAt = null;
    }

    // =========================
    // UPDATE ONLY SENT FIELDS
    // =========================

    if (title !== undefined) {
      existingNews.title = title;
    }

    if (category !== undefined) {
      existingNews.category = category;
    }

    if (tags !== undefined) {
      existingNews.tags = tags;
    }

    if (shortDescription !== undefined) {
      existingNews.shortDescription = shortDescription;
    }

    if (content !== undefined) {
      existingNews.content = content;
    }

    if (featuredImage !== undefined) {
      existingNews.featuredImage = featuredImage;
    }

    if (status !== undefined) {
      if (!["Draft", "Published"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      existingNews.status = status;
    }

    if (isFeatured !== undefined) {
      existingNews.isFeatured = Boolean(isFeatured);
    }

    if (isBreaking !== undefined) {
      existingNews.isBreaking = Boolean(isBreaking);
    }

    if (seoTitle !== undefined) {
      existingNews.seoTitle = seoTitle;
    }

    if (seoDescription !== undefined) {
      existingNews.seoDescription = seoDescription;
    }

    existingNews.slug = slug;
    existingNews.publishedAt = publishedAt;

    // =========================
    // SAVE
    // =========================

    await existingNews.save();

    // =========================
    // POPULATE
    // =========================

    await existingNews.populate("category", "categoryId name slug status");

    await existingNews.populate("tags", "tagId name slug");

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
      success: true,
      message: "News updated successfully",
      news: existingNews,
    });
  } catch (error) {
    console.error("Update News Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE NEWS
exports.deleteNews = async (req, res) => {
  try {
    const newsId = parseInt(req.params.id, 10);

    if (isNaN(newsId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid news ID",
      });
    }

    const news = await News.findOneAndDelete({
      newsId,
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    console.error("Delete News Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET BREAKING NEWS
// ==========================================
exports.getBreakingNews = async (req, res) => {
  try {
    const { status = "active" } = req.query;

    let filter = {};

    if (status === "active") {
      filter.isBreaking = true;
    }

    if (status === "inactive") {
      filter.isBreaking = false;
    }

    const news = await News.find(filter)
      .populate("category", "categoryId name slug status")
      .populate("tags", "tagId name slug")
      .populate("createdBy", "name email")
      .sort({
        newsId: -1,
      });

    return res.status(200).json({
      success: true,
      total: news.length,
      news,
    });
  } catch (error) {
    console.error("Get Breaking News Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};