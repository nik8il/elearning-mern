import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function CourseDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [enrollMessage, setEnrollMessage] = useState("");

    // Fetch the course details
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await API.get(`/courses/${id}`);
                setCourse(response.data);
            } catch (err) {
                setError("Course not found.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    // If the user is logged in, check whether they're already enrolled
    useEffect(() => {
        const checkStatus = async () => {
            if (!user) return; // skip if not logged in

            try {
                const token = localStorage.getItem("token");
                const response = await API.get(`/enrollments/check/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsEnrolled(response.data.enrolled);
            } catch (err) {
                // silently ignore, just leave isEnrolled as false
            }
        };

        checkStatus();
    }, [id, user]);

    const handleEnroll = async () => {
        // Not logged in — send them to login first
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
        return <p style={{ textAlign: "center" }}>Loading course...</p>;
    }

    if (error) {
        return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
    }

    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <Link to="/courses">← Back to Courses</Link>

            <h1>{course.title}</h1>
            <p><strong>Category:</strong> {course.category}</p>
            <p><strong>Instructor:</strong> {course.instructor}</p>
            <p>{course.description}</p>

            {enrollMessage && <p>{enrollMessage}</p>}

            {isEnrolled ? (
                <Link to={`/learn/${course._id}`}>
                    <button style={{ padding: "10px 24px", fontSize: "16px", cursor: "pointer" }}>
                        Go to Course
                    </button>
                </Link>
            ) : (
                <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    style={{ padding: "10px 24px", fontSize: "16px", cursor: "pointer" }}
                >
                    {enrolling ? "Enrolling..." : "Enroll Now"}
                </button>
            )}
        </div>
    );
}

export default CourseDetails;