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
        return <p style={{ textAlign: "center" }}>Loading students...</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Students</h1>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
                        <th style={{ padding: "8px" }}>Name</th>
                        <th style={{ padding: "8px" }}>Email</th>
                        <th style={{ padding: "8px" }}>Joined</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student._id} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "8px" }}>{student.name}</td>
                            <td style={{ padding: "8px" }}>{student.email}</td>
                            <td style={{ padding: "8px" }}>
                                {new Date(student.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Students; 