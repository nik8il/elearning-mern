import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

function QuizHistory() {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                const response = await API.get("/quizzes/my-attempts", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAttempts(response.data);
            } catch (err) {
                setError("Failed to load quiz history.");
            } finally {
                setLoading(false);
            }
        };

        fetchAttempts();
    }, []);

    if (loading) {
        return <p style={{ textAlign: "center" }}>Loading quiz history...</p>;
    }

    if (error) {
        return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
    }

    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <h1>Quiz History</h1>

            {attempts.length === 0 ? (
                <p>You haven't attempted any quizzes yet.</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
                            <th style={{ padding: "8px" }}>Quiz</th>
                            <th style={{ padding: "8px" }}>Score</th>
                            <th style={{ padding: "8px" }}>Percentage</th>
                            <th style={{ padding: "8px" }}>Date</th>
                            <th style={{ padding: "8px" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {attempts.map((attempt) => (
                            <tr key={attempt._id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "8px" }}>{attempt.quiz.title}</td>
                                <td style={{ padding: "8px" }}>
                                    {attempt.score}/{attempt.totalQuestions}
                                </td>
                                <td style={{ padding: "8px" }}>{attempt.percentage}%</td>
                                <td style={{ padding: "8px" }}>
                                    {new Date(attempt.createdAt).toLocaleDateString()}
                                </td>
                                <td style={{ padding: "8px" }}>
                                    <Link to={`/quiz-result/${attempt._id}`}>View Details</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default QuizHistory; 