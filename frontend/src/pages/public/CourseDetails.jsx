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
        return <p style={{ textAlign: "center", padding: "40px" }}>Loading course...</p>;
    }

    if (error) {
        return <p style={{ textAlign: "center", color: "red", padding: "40px" }}>{error}</p>;
    }

    return (
        <div className="page-container" style={{ maxWidth: "750px" }}>
            <Link to="/courses">← Back to Courses</Link>

            <div className="card" style={{ marginTop: "16px" }}>
                <div style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#2563eb",
                    backgroundColor: "#eff6ff",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    display: "inline-block",
                    marginBottom: "12px",
                }}>
                    {course.category}
                </div>

                <h1 style={{ margin: "0 0 12px" }}>{course.title}</h1>

                <div style={{ display: "flex", gap: "20px", color: "#6b7280", fontSize: "14px", marginBottom: "20px" }}>
                    <span>👤 {course.instructor}</span>
                    <span>📖 {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}</span>
                </div>

                <p style={{ lineHeight: "1.6", marginBottom: "24px" }}>{course.description}</p>

                {enrollMessage && (
                    <p style={{
                        padding: "10px",
                        backgroundColor: enrollMessage.includes("success") ? "#d1fae5" : "#fee2e2",
                        borderRadius: "6px",
                        color: enrollMessage.includes("success") ? "#065f46" : "#991b1b",
                    }}>
                        {enrollMessage}
                    </p>
                )}

                {isEnrolled ? (
                    <Link to={`/learn/${course._id}`}>
                        <button style={{ padding: "12px 28px", fontSize: "16px" }}>
                            Go to Course
                        </button>
                    </Link>
                ) : (
                    <button
                        onClick={handleEnroll}
                        disabled={enrolling}
                        style={{ padding: "12px 28px", fontSize: "16px" }}
                    >
                        {enrolling ? "Enrolling..." : "Enroll Now"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default CourseDetails; 