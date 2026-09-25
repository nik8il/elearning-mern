import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Runs once when the page loads
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await API.get("/courses");
                setCourses(response.data);
            } catch (err) {
                setError("Failed to load courses. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return <p style={{ textAlign: "center" }}>Loading courses...</p>;
    }

    if (error) {
        return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Courses</h1>

            {courses.length === 0 ? (
                <p>No courses available yet.</p>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                    {courses.map((course) => (
                        <div
                            key={course._id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "16px",
                                width: "260px",
                            }}
                        >
                            <h3>{course.title}</h3>
                            <p><strong>Category:</strong> {course.category}</p>
                            <p><strong>Instructor:</strong> {course.instructor}</p>
                            <Link to={`/courses/${course._id}`}>
                                <button style={{ padding: "8px 16px", cursor: "pointer" }}>
                                    View Details
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Courses;