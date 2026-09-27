import { useState, useEffect } from "react";
import API from "../../api/axios";

function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await API.get("/admin/students", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStudents(response.data);
            } catch (err) {
                alert("Failed to load students.");
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    if (loading) {
        return <p style={{ textAlign: "center", padding: "60px" }} className="text-muted">Loading students...</p>;
    }

    return (
        <div className="page-container">
            <h1 style={{ marginBottom: "24px" }}>Students ({students.length})</h1>

            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <table>
                    <thead>
                        <tr style={{ background: "var(--color-bg)", textAlign: "left" }}>
                            <th style={{ padding: "14px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Name</th>
                            <th style={{ padding: "14px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Email</th>
                            <th style={{ padding: "14px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student._id} style={{ borderTop: "1px solid var(--color-border)" }}>
                                <td style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{
                                        width: "28px", height: "28px", borderRadius: "50%",
                                        background: "var(--color-primary)", color: "white",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "12px", fontWeight: "bold",
                                    }}>
                                        {student.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span style={{ fontWeight: 600 }}>{student.name}</span>
                                </td>
                                <td style={{ padding: "14px 20px" }} className="text-muted">{student.email}</td>
                                <td style={{ padding: "14px 20px" }} className="text-muted">
                                    {new Date(student.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Students; 