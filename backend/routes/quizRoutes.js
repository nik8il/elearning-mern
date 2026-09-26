const express = require("express");
const router = express.Router();
const {
    createQuiz,
    getQuizzesByCourse,
    getQuizForAttempt,
    submitQuiz,
    getMyAttempts,
    getAttemptById,
} = require("../controllers/quizController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Student routes (must be logged in)
router.get("/my-attempts", protect, getMyAttempts);
router.get("/attempts/:attemptId", protect, getAttemptById);
router.get("/course/:courseId", protect, getQuizzesByCourse);
router.get("/:id", protect, getQuizForAttempt);
router.post("/:id/submit", protect, submitQuiz);

// Admin only
router.post("/", protect, adminOnly, createQuiz);

module.exports = router;