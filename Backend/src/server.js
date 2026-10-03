const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const morgan = require("morgan");

require("dotenv").config();

// ROUTES
const authRoutes = require("./routes/authRoutes");

const categoryRoutes = require("./routes/categoryRoutes");
const newsRoutes = require("./routes/newsRoute");
const tagRoutes = require("./routes/tagRoutes");
const liveStreamRoutes = require("./routes/liveStreamRoutes");
// APP
const app = express();

// ================= MIDDLEWARE =================

app.use(cors());

app.use(
  express.json({
    limit: "10mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);
app.use(morgan("dev"));

// ================= DATABASE =================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ================= ROUTES =================

// Auth APIs
app.use("/api/auth", authRoutes);

// Category APIs
app.use("/api/category", categoryRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/tag", tagRoutes);
app.use("/api/live-streams", liveStreamRoutes);
// Health Route
app.get("/", (req, res) => {
  res.send("🚀 NewsIQ API Running...");
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`

🚀Server Running on Port ${PORT}

`);
});
