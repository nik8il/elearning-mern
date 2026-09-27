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
        return <p style={{ textAlign: "center", padding: "60px" }} className="text-muted">Loading result...</p>;
    }

    if (error) {
        return <p style={{ textAlign: "center", color: "var(--color-danger)", padding: "60px" }}>{error}</p>;
    }

    const passed = attempt.percentage >= 50;

    return (
        <div className="page-container" style={{ maxWidth: "700px" }}>
            <div className="card" style={{ textAlign: "center", marginBottom: "24px" }}>
                <div style={{ fontSize: "44px", marginBottom: "8px" }}>{passed ? "🎉" : "📊"}</div>
                <h2 style={{ margin: "0 0 4px" }}>{attempt.quiz.title}</h2>
                <p className="text-muted" style={{ marginBottom: "20px" }}>Quiz Result</p>

                <div style={{ fontSize: "42px", fontWeight: 800, color: passed ? "var(--color-success)" : "var(--color-accent)" }}>
                    {attempt.percentage}%
                </div>
                <p className="text-muted" style={{ marginBottom: "20px" }}>
                    Score: {attempt.score}/{attempt.totalQuestions}
                </p>

                <div style={{ display: "flex", justifyContent: "center", gap: "24px" }}>
                    <span className="badge badge-success">✓ Correct: {attempt.correctAnswers}</span>
                    <span className="badge badge-danger">✗ Wrong: {attempt.wrongAnswers}</span>
                </div>
            </div>

            <h3 style={{ marginBottom: "14px" }}>Review Your Answers</h3>

            {attempt.answers.map((answer, index) => (
                <div
                    key={answer._id}
                    className="card"
                    style={{
                        marginBottom: "12px",
                        borderLeft: `4px solid ${answer.isCorrect ? "var(--color-success)" : "var(--color-danger)"}`,
                    }}
                >
                    <p style={{ fontWeight: 700, marginBottom: "8px" }}>
                        <span className="text-faint" style={{ fontWeight: 500 }}>Q{index + 1}.</span> {answer.question.questionText}
                    </p>
                    <p style={{ margin: "4px 0", fontSize: "14px" }}>
                        Your answer: <strong>{answer.question.options[answer.selectedOptionIndex]}</strong>
                        {" "}
                        {answer.isCorrect ? "✅" : "❌"}
                    </p>
                    {!answer.isCorrect && (
                        <p style={{ margin: "4px 0", fontSize: "14px", color: "var(--color-success)" }}>
                            Correct answer: <strong>{answer.question.options[answer.question.correctAnswerIndex]}</strong>
                        </p>
                    )}
                </div>
            ))}

            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <Link to="/quiz-history">
                    <button className="btn-outline">View Quiz History</button>
                </Link>
                <Link to="/my-courses">
                    <button>Back to My Courses</button>
                </Link>
            </div>
        </div>
    );
}

export default QuizResult; 