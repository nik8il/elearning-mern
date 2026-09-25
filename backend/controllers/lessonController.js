const Lesson = require("../models/Lesson");
const Course = require("../models/Course");

// @desc   Create a new lesson for a course (admin only)
// @route  POST /api/lessons
const createLesson = async (req, res, next) => {
    try {
        const { title, content, videoUrl, order, course } = req.body;

        if (!title || !content || !course) {
            res.status(400);
            throw new Error("Please provide title, content and course");
        }

        // Check the course actually exists
        const courseExists = await Course.findById(course);
        if (!courseExists) {
            res.status(404);
            throw new Error("Course not found");
        }

        const lesson = await Lesson.create({
            title,
            content,
            videoUrl: videoUrl || "",
            order: order || 1,
            course,
        });

        res.status(201).json(lesson);
    } catch (error) {
        next(error);
    }
};

// @desc   Get all lessons for a specific course (public)
// @route  GET /api/lessons/course/:courseId
const getLessonsByCourse = async (req, res, next) => {
    try {
        const lessons = await Lesson.find({ course: req.params.courseId }).sort({ order: 1 });
        res.status(200).json(lessons);
    } catch (error) {
        next(error);
    }
};

// @desc   Get a single lesson by ID (public)
// @route  GET /api/lessons/:id
const getLessonById = async (req, res, next) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            res.status(404);
            throw new Error("Lesson not found");
        }

        res.status(200).json(lesson);
    } catch (error) {
        next(error);
    }
};

// @desc   Update a lesson (admin only)
// @route  PUT /api/lessons/:id
const updateLesson = async (req, res, next) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            res.status(404);
            throw new Error("Lesson not found");
        }

        const { title, content, videoUrl, order } = req.body;

        lesson.title = title || lesson.title;
        lesson.content = content || lesson.content;
        lesson.videoUrl = videoUrl !== undefined ? videoUrl : lesson.videoUrl;
        lesson.order = order || lesson.order;

        const updatedLesson = await lesson.save();
        res.status(200).json(updatedLesson);
    } catch (error) {
        next(error);
    }
};

// @desc   Delete a lesson (admin only)
// @route  DELETE /api/lessons/:id
const deleteLesson = async (req, res, next) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            res.status(404);
            throw new Error("Lesson not found");
        }

        await lesson.deleteOne();
        res.status(200).json({ message: "Lesson deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createLesson,
    getLessonsByCourse,
    getLessonById,
    updateLesson,
    deleteLesson,
};