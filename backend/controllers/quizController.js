const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const QuizAttempt = require("../models/QuizAttempt");

// @desc   Create a new quiz with questions (admin only)
// @route  POST /api/quizzes
const createQuiz = async (req, res) => {
    try {
        const { title, course, questions } = req.body;

        if (!title || !course || !questions || questions.length === 0) {
            return res.status(400).json({
                message: "Please provide title, course, and at least one question",
            });
        }

        // 1. Create the quiz itself
        const quiz = await Quiz.create({ title, course });

        // 2. Create each question, linked to this quiz
        const createdQuestions = [];
        for (const q of questions) {
            const question = await Question.create({
                quiz: quiz._id,
                questionText: q.questionText,
                options: q.options,
                correctAnswerIndex: q.correctAnswerIndex,
            });
            createdQuestions.push(question);
        }

        res.status(201).json({
            quiz,
            questions: createdQuestions,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get all quizzes for a course (public - just titles, no questions)
// @route  GET /api/quizzes/course/:courseId
const getQuizzesByCourse = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ course: req.params.courseId });
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get a quiz WITHOUT correct answers (for the student to attempt)
// @route  GET /api/quizzes/:id
const getQuizForAttempt = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        const questions = await Question.find({ quiz: quiz._id });

        // IMPORTANT: strip out correctAnswerIndex before sending to frontend
        const safeQuestions = questions.map((q) => ({
            _id: q._id,
            questionText: q.questionText,
            options: q.options,
        }));

        res.status(200).json({
            quiz,
            questions: safeQuestions,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Submit a quiz attempt (student)
// @route  POST /api/quizzes/:id/submit
const submitQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        const { answers } = req.body; // [{ questionId, selectedOptionIndex }, ...]

        const questions = await Question.find({ quiz: quizId });

        if (questions.length === 0) {
            return res.status(404).json({ message: "No questions found for this quiz" });
        }

        let correctCount = 0;
        const gradedAnswers = [];

        // Check each question against what the student submitted
        for (const question of questions) {
            const studentAnswer = answers.find(
                (a) => a.questionId === question._id.toString()
            );

            const selectedOptionIndex = studentAnswer ? studentAnswer.selectedOptionIndex : -1;
            const isCorrect = selectedOptionIndex === question.correctAnswerIndex;

            if (isCorrect) correctCount++;

            gradedAnswers.push({
                question: question._id,
                selectedOptionIndex,
                isCorrect,
            });
        }

        const totalQuestions = questions.length;
        const wrongCount = totalQuestions - correctCount;
        const percentage = Math.round((correctCount / totalQuestions) * 100);

        const attempt = await QuizAttempt.create({
            student: req.user._id,
            quiz: quizId,
            answers: gradedAnswers,
            totalQuestions,
            correctAnswers: correctCount,
            wrongAnswers: wrongCount,
            score: correctCount,
            percentage,
        });

        res.status(201).json(attempt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get logged-in student's quiz attempt history
// @route  GET /api/quizzes/my-attempts
const getMyAttempts = async (req, res) => {
    try {
        const attempts = await QuizAttempt.find({ student: req.user._id })
            .populate("quiz")
            .sort({ createdAt: -1 });

        res.status(200).json(attempts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get one specific attempt's full details (with correct/wrong review)
// @route  GET /api/quizzes/attempts/:attemptId
const getAttemptById = async (req, res) => {
    try {
        const attempt = await QuizAttempt.findById(req.params.attemptId)
            .populate("quiz")
            .populate("answers.question");

        if (!attempt) {
            return res.status(404).json({ message: "Attempt not found" });
        }

        res.status(200).json(attempt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createQuiz,
    getQuizzesByCourse,
    getQuizForAttempt,
    submitQuiz,
    getMyAttempts,
    getAttemptById,
};