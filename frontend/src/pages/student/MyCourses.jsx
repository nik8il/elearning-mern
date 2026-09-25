import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

function MyCourses() {
    const [enrollments, setEnrollments] = useState([]);
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
            } catch (err) {
                setError("Failed to load your courses.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyCourses();
    }, []);

    if (loading) {
        return <p style={{ textAlign: "center" }}>Loading your courses...</p>;
    }

    if (error) {
        return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>My Courses</h1>

            {enrollments.length === 0 ? (
                <p>
                    You haven't enrolled in any courses yet. <Link to="/courses">Browse courses</Link>
                </p>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                    {enrollments.map((enrollment) => (
                        <div
                            key={enrollment._id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "16px",
                                width: "260px",
                            }}
                        >
                            <h3>{enrollment.course.title}</h3>
                            <p><strong>Category:</strong> {enrollment.course.category}</p>
                            <p><strong>Instructor:</strong> {enrollment.course.instructor}</p>
                            <Link to={`/learn/${enrollment.course._id}`}>
                                <button style={{ padding: "8px 16px", cursor: "pointer" }}>
                                    Continue Learning
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyCourses;