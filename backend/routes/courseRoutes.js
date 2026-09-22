const express = require("express");
const router = express.Router();
const {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
} = require("../controllers/courseController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes — anyone can view courses
router.get("/", getCourses);
router.get("/:id", getCourseById);

// Admin-only routes — must be logged in AND be an admin
router.post("/", protect, adminOnly, createCourse);
router.put("/:id", protect, adminOnly, updateCourse);
router.delete("/:id", protect, adminOnly, deleteCourse);

module.exports = router;