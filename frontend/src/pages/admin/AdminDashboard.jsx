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
        return <p style={{ textAlign: "center", padding: "60px" }} className="text-muted">Loading dashboard...</p>;
    }

    if (error) {
        return <p style={{ textAlign: "center", color: "var(--color-danger)", padding: "60px" }}>{error}</p>;
    }

    const statCards = [
        { icon: "👥", label: "Total Students", value: stats.totalStudents, color: "#4f46e5" },
        { icon: "📚", label: "Total Courses", value: stats.totalCourses, color: "#059669" },
        { icon: "📝", label: "Total Quizzes", value: stats.totalQuizzes, color: "#d97706" },
        { icon: "🎯", label: "Total Enrollments", value: stats.totalEnrollments, color: "#db2777" },
    ];

    const links = [
        { to: "/admin/courses", icon: "📚", label: "Manage Courses", desc: "Add, edit or remove courses" },
        { to: "/admin/lessons", icon: "🎬", label: "Manage Lessons", desc: "Organize lessons per course" },
        { to: "/admin/quizzes", icon: "📝", label: "Manage Quizzes", desc: "Create quizzes with questions" },
        { to: "/admin/students", icon: "👥", label: "View Students", desc: "See all registered students" },
        { to: "/admin/results", icon: "📊", label: "View Results", desc: "Review all quiz attempts" },
    ];

    return (
        <div className="page-container">
            <h1 style={{ marginBottom: "4px" }}>Admin Dashboard</h1>
            <p className="text-muted" style={{ marginBottom: "28px" }}>Overview of your platform's activity.</p>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                marginBottom: "36px",
            }}>
                {statCards.map((s) => (
                    <div key={s.label} className="card" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{
                            width: "48px", height: "48px", borderRadius: "10px",
                            background: `${s.color}18`, display: "flex",
                            alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0,
                        }}>
                            {s.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: "24px", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                            <div className="text-muted" style={{ fontSize: "13px", marginTop: "4px" }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <h2 style={{ marginBottom: "16px" }}>Manage</h2>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "16px",
            }}>
                {links.map((link) => (
                    <Link key={link.to} to={link.to}>
                        <div className="card card-hover" style={{ height: "100%" }}>
                            <div style={{ fontSize: "26px", marginBottom: "10px" }}>{link.icon}</div>
                            <h3 style={{ margin: "0 0 4px", fontSize: "16px" }}>{link.label}</h3>
                            <p className="text-muted" style={{ fontSize: "13px", margin: 0 }}>{link.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard; 