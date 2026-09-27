import { useState, useEffect } from "react";
import API from "../../api/axios";

function Results() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await API.get("/admin/results", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setResults(response.data);
            } catch (err) {
                alert("Failed to load results.");
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    if (loading) {
        return <p style={{ textAlign: "center", padding: "60px" }} className="text-muted">Loading results...</p>;
    }

    return (
        <div className="page-container">
            <h1 style={{ marginBottom: "24px" }}>Quiz Results</h1>

            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <table>
                    <thead>
                        <tr style={{ background: "var(--color-bg)", textAlign: "left" }}>
                            <th style={{ padding: "14px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Student</th>
                            <th style={{ padding: "14px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Quiz</th>
                            <th style={{ padding: "14px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Score</th>
                            <th style={{ padding: "14px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Percentage</th>
                            <th style={{ padding: "14px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result) => (
                            <tr key={result._id} style={{ borderTop: "1px solid var(--color-border)" }}>
                                <td style={{ padding: "14px 20px" }}>
                                    <div style={{ fontWeight: 600 }}>{result.student?.name}</div>
                                    <div className="text-faint" style={{ fontSize: "12px" }}>{result.student?.email}</div>
                                </td>
                                <td style={{ padding: "14px 20px" }}>{result.quiz?.title}</td>
                                <td style={{ padding: "14px 20px" }}>{result.score}/{result.totalQuestions}</td>
                                <td style={{ padding: "14px 20px" }}>
                                    <span className={`badge ${result.percentage >= 50 ? "badge-success" : "badge-danger"}`}>
                                        {result.percentage}%
                                    </span>
                                </td>
                                <td style={{ padding: "14px 20px" }} className="text-muted">
                                    {new Date(result.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Results; 