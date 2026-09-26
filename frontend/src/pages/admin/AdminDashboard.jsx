import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await API.get("/admin/stats", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStats(response.data);
            } catch (err) {
                setError("Failed to load dashboard stats.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <p style={{ textAlign: "center" }}>Loading dashboard...</p>;
    }

    if (error) {
        return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
    }

    const statCards = [
        { label: "Total Students", value: stats.totalStudents },
        { label: "Total Courses", value: stats.totalCourses },
        { label: "Total Quizzes", value: stats.totalQuizzes },
        { label: "Total Enrollments", value: stats.totalEnrollments },
    ];

    const links = [
        { to: "/admin/courses", label: "Manage Courses" },
        { to: "/admin/lessons", label: "Manage Lessons" },
        { to: "/admin/quizzes", label: "Manage Quizzes" },
        { to: "/admin/students", label: "View Students" },
        { to: "/admin/results", label: "View Results" },
    ];

    return (
        <div style={{ padding: "20px" }}>
            <h1>Admin Dashboard</h1>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "30px" }}>
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "20px",
                            width: "160px",
                            textAlign: "center",
                        }}
                    >
                        <p style={{ fontSize: "28px", margin: 0, fontWeight: "bold" }}>{card.value}</p>
                        <p style={{ margin: 0, color: "#666" }}>{card.label}</p>
                    </div>
                ))}
            </div>

            <h2>Manage</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {links.map((link) => (
                    <Link key={link.to} to={link.to}>
                        <button style={{ padding: "10px 20px", cursor: "pointer" }}>
                            {link.label}
                        </button>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard; 