import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

function TakeQuiz() {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await API.get(`/quizzes/${quizId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setQuiz(response.data.quiz);
                setQuestions(response.data.questions);
            } catch (err) {
                setError("Failed to load quiz.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);

    const handleSelect = (questionId, optionIndex) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: optionIndex,
        });
    };

    const handleSubmit = async () => {
        if (Object.keys(selectedAnswers).length < questions.length) {
            alert("Please answer all questions before submitting.");
            return;
        }

        setSubmitting(true);

        try {
            const answers = questions.map((q) => ({
                questionId: q._id,
                selectedOptionIndex: selectedAnswers[q._id],
            }));

            const response = await API.post(
                `/quizzes/${quizId}/submit`,
                { answers },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            navigate(`/quiz-result/${response.data._id}`);
        } catch (err) {
            setError("Failed to submit quiz. Please try again.");
            setSubmitting(false);
        }
    };

    if (loading) {
        return <p style={{ textAlign: "center", padding: "60px" }} className="text-muted">Loading quiz...</p>;
    }

    if (error) {
        return <p style={{ textAlign: "center", color: "var(--color-danger)", padding: "60px" }}>{error}</p>;
    }

    const answeredCount = Object.keys(selectedAnswers).length;

    return (
        <div className="page-container" style={{ maxWidth: "700px" }}>
            <div style={{ marginBottom: "24px" }}>
                <span className="badge badge-primary" style={{ marginBottom: "10px" }}>Quiz</span>
                <h1 style={{ margin: "0 0 8px" }}>{quiz.title}</h1>
                <p className="text-muted" style={{ margin: 0 }}>
                    {answeredCount} of {questions.length} questions answered
                </p>
                <div className="progress-track" style={{ marginTop: "10px" }}>
                    <div className="progress-fill" style={{
                        width: `${(answeredCount / questions.length) * 100}%`,
                        background: "var(--color-primary)",
                    }}></div>
                </div>
            </div>

            {questions.map((question, index) => (
                <div key={question._id} className="card" style={{ marginBottom: "16px" }}>
                    <p style={{ fontWeight: 700, marginBottom: "16px" }}>
                        <span className="text-faint" style={{ fontWeight: 500 }}>Q{index + 1}.</span> {question.questionText}
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {question.options.map((option, optionIndex) => {
                            const selected = selectedAnswers[question._id] === optionIndex;
                            return (
                                <label
                                    key={optionIndex}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        padding: "12px 14px",
                                        borderRadius: "var(--radius-sm)",
                                        border: selected ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
                                        background: selected ? "var(--color-primary-light)" : "white",
                                        cursor: "pointer",
                                        transition: "all 0.15s ease",
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name={question._id}
                                        checked={selected}
                                        onChange={() => handleSelect(question._id, optionIndex)}
                                        style={{ margin: 0 }}
                                    />
                                    <span style={{ fontSize: "14px", fontWeight: selected ? 600 : 400 }}>{option}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            ))}

            <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{ width: "100%", padding: "14px", fontSize: "15px" }}
            >
                {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
        </div>
    );
}

export default TakeQuiz; 