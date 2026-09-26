import { useState, useEffect } from "react";
import API from "../../api/axios";

function ManageQuizzes() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [quizzes, setQuizzes] = useState([]);

    const [quizTitle, setQuizTitle] = useState("");
    const [questions, setQuestions] = useState([
        { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
    ]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        API.get("/courses").then((res) => setCourses(res.data));
    }, []);

    const fetchQuizzes = async (courseId) => {
        if (!courseId) {
            setQuizzes([]);
            return;
        }
        const response = await API.get(`/quizzes/course/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setQuizzes(response.data);
    };

    useEffect(() => {
        fetchQuizzes(selectedCourse);
    }, [selectedCourse]);

    const handleQuestionTextChange = (index, value) => {
        const updated = [...questions];
        updated[index].questionText = value;
        setQuestions(updated);
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[optIndex] = value;
        setQuestions(updated);
    };

    const handleCorrectAnswerChange = (qIndex, value) => {
        const updated = [...questions];
        updated[qIndex].correctAnswerIndex = Number(value);
        setQuestions(updated);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
        ]);
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setQuizTitle("");
        setQuestions([{ questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCourse) {
            alert("Please select a course first.");
            return;
        }

        try {
            await API.post(
                "/quizzes",
                { title: quizTitle, course: selectedCourse, questions },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            resetForm();
            fetchQuizzes(selectedCourse);
            alert("Quiz created successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create quiz.");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Manage Quizzes</h1>

            <div style={{ marginBottom: "20px" }}>
                <label><strong>Select Course:</strong></label><br />
                <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    style={{ padding: "8px", marginTop: "6px", minWidth: "250px" }}
                >
                    <option value="">-- Choose a course --</option>
                    {courses.map((course) => (
                        <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                </select>
            </div>

            {selectedCourse && (
                <>
                    <h3>Existing Quizzes</h3>
                    {quizzes.length === 0 ? (
                        <p>No quizzes yet for this course.</p>
                    ) : (
                        <ul>
                            {quizzes.map((quiz) => (
                                <li key={quiz._id}>{quiz.title}</li>
                            ))}
                        </ul>
                    )}

                    <h3>Create New Quiz</h3>
                    <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
                        <input
                            type="text"
                            placeholder="Quiz Title"
                            value={quizTitle}
                            onChange={(e) => setQuizTitle(e.target.value)}
                            required
                            style={{ width: "100%", padding: "8px", marginBottom: "16px" }}
                        />

                        {questions.map((question, qIndex) => (
                            <div
                                key={qIndex}
                                style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    padding: "16px",
                                    marginBottom: "16px",
                                }}
                            >
                                <p><strong>Question {qIndex + 1}</strong></p>
                                <input
                                    type="text"
                                    placeholder="Question text"
                                    value={question.questionText}
                                    onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                                    required
                                    style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
                                />

                                {question.options.map((option, optIndex) => (
                                    <div key={optIndex} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                                        <input
                                            type="radio"
                                            name={`correct-${qIndex}`}
                                            checked={question.correctAnswerIndex === optIndex}
                                            onChange={() => handleCorrectAnswerChange(qIndex, optIndex)}
                                            style={{ marginRight: "8px" }}
                                        />
                                        <input
                                            type="text"
                                            placeholder={`Option ${optIndex + 1}`}
                                            value={option}
                                            onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                                            required
                                            style={{ flex: 1, padding: "6px" }}
                                        />
                                    </div>
                                ))}
                                <p style={{ fontSize: "13px", color: "#666" }}>
                                    Select the radio button next to the correct option.
                                </p>

                                {questions.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(qIndex)}
                                        style={{ cursor: "pointer", color: "red" }}
                                    >
                                        Remove Question
                                    </button>
                                )}
                            </div>
                        ))}

                        <button type="button" onClick={addQuestion} style={{ padding: "8px 16px", cursor: "pointer", marginBottom: "16px" }}>
                            + Add Another Question
                        </button>
                        <br />
                        <button type="submit" style={{ padding: "10px 24px", cursor: "pointer" }}>
                            Create Quiz
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}

export default ManageQuizzes; 