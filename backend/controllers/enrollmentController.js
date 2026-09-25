const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// Enroll student in a course
const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        const alreadyEnrolled = await Enrollment.findOne({
            student: req.user._id,
            course: courseId,
        });

        if (alreadyEnrolled) {
            return res.status(400).json({
                message: "Already enrolled in this course",
            });
        }

        const enrollment = await Enrollment.create({
            student: req.user._id,
            course: courseId,
        });

        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get courses enrolled by logged-in student
const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({
            student: req.user._id,
        }).populate("course");

        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Check whether student is enrolled in a course
const checkEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({
            student: req.user._id,
            course: req.params.courseId,
        });

        res.status(200).json({
            enrolled: !!enrollment,
            enrollment,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    enrollInCourse,
    getMyEnrollments,
    checkEnrollment,
};