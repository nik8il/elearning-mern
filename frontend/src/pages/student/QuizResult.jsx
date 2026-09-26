import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/axios";

function QuizResult() {
    const { attemptId } = useParams();

    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchAttempt = async () => {
            try {
                const response = await API.get(`/quizzes/attempts/${attemptId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAttempt(response.data);
            } catch (err) {
                setError("Failed to load result.");
            } finally {
                setLoading(false);
            }
        };

        fetchAttempt();
    }, [attemptId]);

    if (loading) {
        return <p style={{ textAlign: "center" }}>Loading result...</p>;
    }

    if (error) {
        return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
    }

    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <h1>{attempt.quiz.title} - Result</h1>

            <div style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "20px",
                textAlign: "center",
            }}>
                <h2>Score: {attempt.score}/{attempt.totalQuestions}</h2>
                <p style={{ fontSize: "24px", margin: "10px 0" }}>{attempt.percentage}%</p>
                <p>
                    <span style={{ color: "green" }}>Correct: {attempt.correctAnswers}</span>
                    {"  |  "}
                    <span style={{ color: "red" }}>Wrong: {attempt.wrongAnswers}</span>
                </p>
            </div>

            <h2>Review Your Answers</h2>

            {attempt.answers.map((answer, index) => (
                <div
                    key={answer._id}
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "16px",
                        marginBottom: "12px",
                        background: answer.isCorrect ? "#e8f5e9" : "#ffebee",
                    }}
                >
                    <p><strong>Q{index + 1}. {answer.question.questionText}</strong></p>
                    <p>
                        Your answer: {answer.question.options[answer.selectedOptionIndex]}
                        {" "}
                        {answer.isCorrect ? "✅" : "❌"}
                    </p>
                    {!answer.isCorrect && (
                        <p style={{ color: "green" }}>
                            Correct answer: {answer.question.options[answer.question.correctAnswerIndex]}
                        </p>
                    )}
                </div>
            ))}

            <div style={{ marginTop: "20px" }}>
                <Link to="/quiz-history">
                    <button style={{ padding: "10px 20px", cursor: "pointer", marginRight: "10px" }}>
                        View Quiz History
                    </button>
                </Link>
                <Link to="/my-courses">
                    <button style={{ padding: "10px 20px", cursor: "pointer" }}>
                        Back to My Courses
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default QuizResult; 