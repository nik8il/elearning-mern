const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true,
        },

        answers: [
            {
                question: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Question",
                },
                selectedOptionIndex: {
                    type: Number,
                },
                isCorrect: {
                    type: Boolean,
                },
            },
        ],

        totalQuestions: {
            type: Number,
            required: true,
        },

        correctAnswers: {
            type: Number,
            required: true,
        },

        wrongAnswers: {
            type: Number,
            required: true,
        },

        score: {
            type: Number,
            required: true,
        },

        percentage: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);