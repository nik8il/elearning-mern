import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function MyCourses() {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [lessonCounts, setLessonCounts] = useState({});
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const enrollRes = await API.get("/enrollments/my-courses", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEnrollments(enrollRes.data);

                const counts = {};
                for (const enrollment of enrollRes.data) {
                    const lessonsRes = await API.get(`/lessons/course/${enrollment.course._id}`);
                    counts[enrollment.course._id] = lessonsRes.data.length;
                }
                setLessonCounts(counts);

                const attemptsRes = await API.get("/quizzes/my-attempts", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAttempts(attemptsRes.data);
            } catch (err) {
                setError("Failed to load your courses.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p style={{ textAlign: "center", padding: "60px" }} className="text-muted">Loading your courses...</p>;
    }

    if (error) {
        return <p style={{ textAlign: "center", color: "var(--color-danger)", padding: "60px" }}>{error}</p>;
    }

    const totalLessonsCompleted = enrollments.reduce(
        (sum, e) => sum + e.completedLessons.length, 0
    );
    const avgScore = attempts.length === 0
        ? 0
        : Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length);

    const statCards = [
        { icon: "📚", label: "Courses Enrolled", value: enrollments.length, color: "#4f46e5" },
        { icon: "✅", label: "Lessons Completed", value: totalLessonsCompleted, color: "#059669" },
        { icon: "📝", label: "Quizzes Completed", value: attempts.length, color: "#d97706" },
        { icon: "🎯", label: "Average Quiz Score", value: `${avgScore}%`, color: "#db2777" },
    ];

    return (
        <div className="page-container">
            <h1 style={{ marginBottom: "4px" }}>Welcome back, {user?.name}</h1>
            <p className="text-muted" style={{ marginBottom: "28px" }}>
                Here's an overview of your learning journey.
            </p>

            {/* Stats row */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                marginBottom: "36px",
            }}>
                {statCards.map((s) => (
                    <div key={s.label} className="card" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "10px",
                            background: `${s.color}18`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                            flexShrink: 0,
                        }}>
                            {s.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: "22px", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                            <div className="text-muted" style={{ fontSize: "13px", marginTop: "4px" }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <h2 style={{ marginBottom: "16px" }}>Your Courses</h2>

            {enrollments.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "60px" }}>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎯</div>
                    <h3>No courses yet</h3>
                    <p className="text-muted" style={{ marginBottom: "16px" }}>Enroll in a course to start your learning journey.</p>
                    <Link to="/courses">
                        <button>Browse Courses</button>
                    </Link>
                </div>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "20px",
                }}>
                    {enrollments.map((enrollment) => {
                        const total = lessonCounts[enrollment.course._id] || 0;
                        const completed = enrollment.completedLessons.length;
                        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
                        const isComplete = total > 0 && completed === total;

                        return (
                            <div key={enrollment._id} className="card card-hover">
                                <span className="badge badge-primary" style={{ marginBottom: "10px" }}>
                                    {enrollment.course.category}
                                </span>

                                <h3 style={{ margin: "0 0 4px" }}>{enrollment.course.title}</h3>
                                <p className="text-faint" style={{ fontSize: "13px", marginBottom: "14px" }}>
                                    👤 {enrollment.course.instructor}
                                </p>

                                <div style={{ marginBottom: "16px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                                        <span style={{ fontWeight: 600, color: isComplete ? "var(--color-success)" : "var(--color-text-muted)" }}>
                                            {isComplete ? "🎉 Completed" : "In Progress"}
                                        </span>
                                        <span className="text-muted">{percent}%</span>
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                                    </div>
                                </div>

                                <Link to={`/learn/${enrollment.course._id}`}>
                                    <button style={{ width: "100%" }}>
                                        {isComplete ? "Review Course" : "Continue Learning"}
                                    </button>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MyCourses; 