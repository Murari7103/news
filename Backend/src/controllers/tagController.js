const slugify = require("slugify");

const Tag = require("../models/Tags");

// ========================================
// CREATE TAG
// ========================================
exports.createTag = async (req, res) => {
  try {
    const { name, slug, description, status } = req.body;

    // VALIDATION
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tag name is required",
      });
    }

    // CHECK DUPLICATE NAME
    const existingTag = await Tag.findOne({
      name: name.trim(),
    });

    if (existingTag) {
      return res.status(400).json({
        success: false,
        message: "Tag already exists",
      });
    }

    // GENERATE TAG ID
    const lastTag = await Tag.findOne({
      tagId: { $exists: true },
    }).sort({
      tagId: -1,
    });

    const tagId = Number(lastTag?.tagId || 0) + 1;

    // GENERATE SLUG
    const finalSlug =
      slug?.trim() ||
      slugify(name, {
        lower: true,
        strict: true,
      });

    // CHECK DUPLICATE SLUG
    const existingSlug = await Tag.findOne({
      slug: finalSlug,
    });

    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: "Tag slug already exists",
      });
    }

    // CREATE TAG
    const tag = await Tag.create({
      tagId,
      name: name.trim(),
      slug: finalSlug,
      description: description || "",
      status: status || "Active",
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Tag created successfully",
      tag,
    });
  } catch (error) {
    console.error("Create Tag Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET ALL TAGS
// ========================================
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find().populate("createdBy", "name email").sort({
      tagId: 1,
    });

    return res.status(200).json({
      success: true,
      tags,
    });
  } catch (error) {
    console.error("Get Tags Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET SINGLE TAG
// ========================================
exports.getTagById = async (req, res) => {
  try {
    const tagId = parseInt(req.params.id, 10);

    // VALIDATE TAG ID
    if (isNaN(tagId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tag ID.",
      });
    }

    const tag = await Tag.findOne({
      tagId,
    }).populate("createdBy", "name email");

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found.",
      });
    }

    return res.status(200).json({
      success: true,
      tag,
    });
  } catch (error) {
    console.error("Get Tag Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tag.",
    });
  }
};

// ========================================
// UPDATE TAG
// ========================================
exports.updateTag = async (req, res) => {
  try {
    const { name, slug, description, status } = req.body;

    // VALIDATION
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tag name is required",
      });
    }

    const tagId = Number(req.params.id);

    // FIND TAG
    const existingTag = await Tag.findOne({
      tagId,
    });

    if (!existingTag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    // CHECK DUPLICATE NAME
    const duplicateName = await Tag.findOne({
      name: name.trim(),
      tagId: { $ne: tagId },
    });

    if (duplicateName) {
      return res.status(400).json({
        success: false,
        message: "Tag name already exists",
      });
    }

    // GENERATE SLUG
    const finalSlug =
      slug?.trim() ||
      slugify(name, {
        lower: true,
        strict: true,
      });

    // CHECK DUPLICATE SLUG
    const duplicateSlug = await Tag.findOne({
      slug: finalSlug,
      tagId: { $ne: tagId },
    });

    if (duplicateSlug) {
      return res.status(400).json({
        success: false,
        message: "Tag slug already exists",
      });
    }

    // UPDATE
    existingTag.name = name.trim();
    existingTag.slug = finalSlug;
    existingTag.description = description || "";
    existingTag.status = status || existingTag.status;

    await existingTag.save();

    return res.status(200).json({
      success: true,
      message: "Tag updated successfully",
      tag: existingTag,
    });
  } catch (error) {
    console.error("Update Tag Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// DELETE TAG
// ========================================
exports.deleteTag = async (req, res) => {
  try {
    const tagId = Number(req.params.id);

    const tag = await Tag.findOneAndDelete({
      tagId,
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tag deleted successfully",
    });
  } catch (error) {
    console.error("Delete Tag Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
