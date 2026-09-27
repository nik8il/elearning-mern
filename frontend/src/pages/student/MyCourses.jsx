import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function MyCourses() {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [lessonCounts, setLessonCounts] = useState({}); // { courseId: totalLessons }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await API.get("/enrollments/my-courses", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEnrollments(response.data);

                // Fetch lesson counts for each enrolled course, to calculate progress
                const counts = {};
                for (const enrollment of response.data) {
                    const lessonsRes = await API.get(`/lessons/course/${enrollment.course._id}`);
                    counts[enrollment.course._id] = lessonsRes.data.length;
                }
                setLessonCounts(counts);
            } catch (err) {
                setError("Failed to load your courses.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyCourses();
    }, []);

    if (loading) {
        return <p style={{ textAlign: "center", padding: "40px" }}>Loading your courses...</p>;
    }

    if (error) {
        return <p style={{ textAlign: "center", color: "red", padding: "40px" }}>{error}</p>;
    }

    return (
        <div className="page-container">
            <h1>Welcome back, {user?.name} 👋</h1>
            <p style={{ color: "#6b7280", marginBottom: "30px" }}>
                Here's what you're learning right now.
            </p>

            {enrollments.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "40px" }}>
                    <p>You haven't enrolled in any courses yet.</p>
                    <Link to="/courses">
                        <button style={{ marginTop: "10px" }}>Browse Courses</button>
                    </Link>
                </div>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                    {enrollments.map((enrollment) => {
                        const total = lessonCounts[enrollment.course._id] || 0;
                        const completed = enrollment.completedLessons.length;
                        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
                        const isComplete = total > 0 && completed === total;

                        return (
                            <div key={enrollment._id} className="card" style={{ width: "280px" }}>
                                <div style={{
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    color: "#2563eb",
                                    backgroundColor: "#eff6ff",
                                    padding: "4px 10px",
                                    borderRadius: "12px",
                                    display: "inline-block",
                                    marginBottom: "10px",
                                }}>
                                    {enrollment.course.category}
                                </div>

                                <h3 style={{ margin: "0 0 4px" }}>{enrollment.course.title}</h3>
                                <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "12px" }}>
                                    👤 {enrollment.course.instructor}
                                </p>

                                <div style={{ marginBottom: "14px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                                        <span>{isComplete ? "🎉 Completed" : "In Progress"}</span>
                                        <span>{percent}%</span>
                                    </div>
                                    <div style={{ background: "#eee", borderRadius: "6px", height: "10px", width: "100%" }}>
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${percent}%`,
                                                background: isComplete ? "#22c55e" : "#4caf50",
                                                height: "100%",
                                                borderRadius: "6px",
                                            }}
                                        ></div>
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