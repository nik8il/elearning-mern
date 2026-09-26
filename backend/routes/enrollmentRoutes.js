const express = require("express");

const {
    enrollInCourse,
    getMyEnrollments,
    checkEnrollment,
    markLessonComplete,
} = require("../controllers/enrollmentController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Enroll in a course
router.post("/", protect, enrollInCourse);

// Get logged-in student's enrollments
router.get("/my-courses", protect, getMyEnrollments);

// Check enrollment status
router.get("/check/:courseId", protect, checkEnrollment);
router.put("/complete", protect, markLessonComplete); 

module.exports = router;