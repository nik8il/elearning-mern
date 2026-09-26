const Course = require("../models/Course");

// @desc   Create a new course (admin only)
// @route  POST /api/courses
const createCourse = async (req, res, next) => {
    try {
        const { title, description, category, instructor, thumbnail } = req.body;

        if (!title || !description || !category || !instructor) {
            res.status(400);
            throw new Error("Please provide title, description, category and instructor");
        }

        const course = await Course.create({
            title,
            description,
            category,
            instructor,
            thumbnail: thumbnail || "",
            createdBy: req.user._id, // comes from the "protect" middleware
        });

        res.status(201).json(course);
    } catch (error) {
        next(error);
    }
};

// @desc   Get all courses (public)
// @route  GET /api/courses
const getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.status(200).json(courses);
    } catch (error) {
        next(error);
    }
};

// @desc   Get a single course by ID (public)
// @route  GET /api/courses/:id
const getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            res.status(404);
            throw new Error("Course not found");
        }

        res.status(200).json(course);
    } catch (error) {
        next(error);
    }
};

// @desc   Update a course (admin only)
// @route  PUT /api/courses/:id
const updateCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            res.status(404);
            throw new Error("Course not found");
        }

        const { title, description, category, instructor, thumbnail } = req.body;

        course.title = title || course.title;
        course.description = description || course.description;
        course.category = category || course.category;
        course.instructor = instructor || course.instructor;
        course.thumbnail = thumbnail !== undefined ? thumbnail : course.thumbnail;

        const updatedCourse = await course.save();
        res.status(200).json(updatedCourse);
    } catch (error) {
        next(error);
    }
};

// @desc   Delete a course (admin only)
// @route  DELETE /api/courses/:id
const deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            res.status(404);
            throw new Error("Course not found");
        }

        await course.deleteOne();
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
}; 