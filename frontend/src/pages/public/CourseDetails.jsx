import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function CourseDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [lessonCount, setLessonCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [enrollMessage, setEnrollMessage] = useState("");

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await API.get(`/courses/${id}`);
                setCourse(response.data);

                const lessonsResponse = await API.get(`/lessons/course/${id}`);
                setLessonCount(lessonsResponse.data.length);
            } catch (err) {
                setError("Course not found.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    useEffect(() => {
        const checkStatus = async () => {
            if (!user) return;

            try {
                const token = localStorage.getItem("token");
                const response = await API.get(`/enrollments/check/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsEnrolled(response.data.enrolled);
            } catch (err) {
                // ignore
            }
        };

        checkStatus();
    }, [id, user]);

    const handleEnroll = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        setEnrolling(true);
        setEnrollMessage("");

        try {
            const token = localStorage.getItem("token");
            await API.post(
                "/enrollments",
                { courseId: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsEnrolled(true);
            setEnrollMessage("Enrolled successfully!");
        } catch (err) {
            setEnrollMessage(err.response?.data?.message || "Enrollment failed.");
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return <p style={{ textAlign: "center", padding: "60px" }} className="text-muted">Loading course...</p>;
    }

    if (error) {
        return <p style={{ textAlign: "center", color: "var(--color-danger)", padding: "60px" }}>{error}</p>;
    }

    return (
        <div>
            {/* Header banner */}
            <div style={{
                background: "linear-gradient(135deg, #4338ca, #4f46e5)",
                padding: "50px 20px 90px",
                color: "white",
            }}>
                <div className="page-container" style={{ padding: 0 }}>
                    <Link to="/courses" style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px" }}>
                        ← Back to Courses
                    </Link>
                    <div className="badge" style={{
                        backgroundColor: "rgba(255,255,255,0.15)",
                        color: "white",
                        margin: "16px 0 12px",
                    }}>
                        {course.category}
                    </div>
                    <h1 style={{ color: "white", fontSize: "34px", margin: "0 0 8px" }}>{course.title}</h1>
                    <p style={{ opacity: 0.85, margin: 0 }}>By {course.instructor}</p>
                </div>
            </div>

            {/* Content card, overlapping the banner */}
            <div className="page-container" style={{ marginTop: "-60px", position: "relative" }}>
                <div className="card" style={{ maxWidth: "750px" }}>
                    <div style={{
                        display: "flex",
                        gap: "24px",
                        paddingBottom: "20px",
                        marginBottom: "20px",
                        borderBottom: "1px solid var(--color-border)",
                    }}>
                        <div>
                            <div className="text-faint" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Lessons</div>
                            <div style={{ fontSize: "20px", fontWeight: 700 }}>📖 {lessonCount}</div>
                        </div>
                        <div>
                            <div className="text-faint" style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Category</div>
                            <div style={{ fontSize: "20px", fontWeight: 700 }}>{course.category}</div>
                        </div>
                    </div>

                    <h3>About this course</h3>
                    <p style={{ lineHeight: "1.7", color: "var(--color-text-muted)" }}>{course.description}</p>

                    {enrollMessage && (
                        <div style={{
                            padding: "12px 16px",
                            borderRadius: "var(--radius-sm)",
                            marginBottom: "16px",
                            backgroundColor: enrollMessage.includes("success") ? "var(--color-success-bg)" : "var(--color-danger-bg)",
                            color: enrollMessage.includes("success") ? "var(--color-success)" : "var(--color-danger)",
                            fontWeight: 600,
                            fontSize: "14px",
                        }}>
                            {enrollMessage}
                        </div>
                    )}

                    {isEnrolled ? (
                        <Link to={`/learn/${course._id}`}>
                            <button style={{ padding: "14px 32px", fontSize: "15px" }}>
                                Go to Course →
                            </button>
                        </Link>
                    ) : (
                        <button
                            onClick={handleEnroll}
                            disabled={enrolling}
                            style={{ padding: "14px 32px", fontSize: "15px" }}
                        >
                            {enrolling ? "Enrolling..." : "Enroll Now — It's Free"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CourseDetails; 