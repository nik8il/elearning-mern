import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";

function TakeQuiz() {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: optionIndex }
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
        // Check every question has been answered
        if (Object.keys(selectedAnswers).length < questions.length) {
            alert("Please answer all questions before submitting.");
            return;
        }

        setSubmitting(true);

        try {
            // Convert { questionId: optionIndex } into the array format the backend expects
            const answers = questions.map((q) => ({
                questionId: q._id,
                selectedOptionIndex: selectedAnswers[q._id],
            }));

            const response = await API.post(
                `/quizzes/${quizId}/submit`,
                { answers },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Go to the result page, passing the attempt ID
            navigate(`/quiz-result/${response.data._id}`);
        } catch (err) {
            setError("Failed to submit quiz. Please try again.");
            setSubmitting(false);
        }
    };

    if (loading) {
        return <p style={{ textAlign: "center" }}>Loading quiz...</p>;
    }

    if (error) {
        return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
    }

    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <h1>{quiz.title}</h1>
            <p>{questions.length} questions</p>

            {questions.map((question, index) => (
                <div
                    key={question._id}
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "16px",
                        marginBottom: "16px",
                    }}
                >
                    <p><strong>Q{index + 1}. {question.questionText}</strong></p>

                    {question.options.map((option, optionIndex) => (
                        <label
                            key={optionIndex}
                            style={{ display: "block", padding: "6px 0", cursor: "pointer" }}
                        >
                            <input
                                type="radio"
                                name={question._id}
                                checked={selectedAnswers[question._id] === optionIndex}
                                onChange={() => handleSelect(question._id, optionIndex)}
                                style={{ marginRight: "8px" }}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            ))}

            <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{ padding: "10px 24px", fontSize: "16px", cursor: "pointer" }}
            >
                {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
        </div>
    );
}

export default TakeQuiz;