const express = require("express");
const router = express.Router();
const {
    createLesson,
    getLessonsByCourse,
    getLessonById,
    updateLesson,
    deleteLesson,
} = require("../controllers/lessonController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes — anyone can view lessons
router.get("/course/:courseId", getLessonsByCourse);
router.get("/:id", getLessonById);

// Admin-only routes
router.post("/", protect, adminOnly, createLesson);
router.put("/:id", protect, adminOnly, updateLesson);
router.delete("/:id", protect, adminOnly, deleteLesson);

module.exports = router;