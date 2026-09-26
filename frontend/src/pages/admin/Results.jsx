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
        return <p style={{ textAlign: "center" }}>Loading results...</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Quiz Results</h1>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
                        <th style={{ padding: "8px" }}>Student</th>
                        <th style={{ padding: "8px" }}>Quiz</th>
                        <th style={{ padding: "8px" }}>Score</th>
                        <th style={{ padding: "8px" }}>Percentage</th>
                        <th style={{ padding: "8px" }}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result) => (
                        <tr key={result._id} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "8px" }}>
                                {result.student?.name} ({result.student?.email})
                            </td>
                            <td style={{ padding: "8px" }}>{result.quiz?.title}</td>
                            <td style={{ padding: "8px" }}>{result.score}/{result.totalQuestions}</td>
                            <td style={{ padding: "8px" }}>{result.percentage}%</td>
                            <td style={{ padding: "8px" }}>
                                {new Date(result.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Results; 