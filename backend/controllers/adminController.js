const User = require("../models/User");
const Course = require("../models/Course");
const Quiz = require("../models/Quiz");
const Enrollment = require("../models/Enrollment");
const QuizAttempt = require("../models/QuizAttempt");

// @desc   Get dashboard statistics
// @route  GET /api/admin/stats
const getStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: "student" });
        const totalCourses = await Course.countDocuments();
        const totalQuizzes = await Quiz.countDocuments();
        const totalEnrollments = await Enrollment.countDocuments();

        res.status(200).json({
            totalStudents,
            totalCourses,
            totalQuizzes,
            totalEnrollments,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get all students
// @route  GET /api/admin/students
const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: "student" }).select("-password");
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get all quiz results (every attempt, every student)
// @route  GET /api/admin/results
const getAllResults = async (req, res) => {
    try {
        const results = await QuizAttempt.find()
            .populate("student", "name email")
            .populate("quiz", "title")
            .sort({ createdAt: -1 });

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStats,
    getAllStudents,
    getAllResults,
}; 