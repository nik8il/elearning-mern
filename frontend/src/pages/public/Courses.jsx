import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
        return <p style={{ textAlign: "center", padding: "40px" }}>Loading courses...</p>;
    }

    if (error) {
        return <p style={{ textAlign: "center", color: "red", padding: "40px" }}>{error}</p>;
    }

    return (
        <div className="page-container">
            <h1>Explore Courses</h1>
            <p style={{ color: "#6b7280", marginBottom: "30px" }}>
                Browse our available courses and start learning today.
            </p>

            {courses.length === 0 ? (
                <p>No courses available yet.</p>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                    {courses.map((course) => (
                        <div
                            key={course._id}
                            className="card"
                            style={{ width: "280px", display: "flex", flexDirection: "column" }}
                        >
                            <div style={{
                                fontSize: "12px",
                                fontWeight: "bold",
                                color: "#2563eb",
                                backgroundColor: "#eff6ff",
                                padding: "4px 10px",
                                borderRadius: "12px",
                                display: "inline-block",
                                marginBottom: "10px",
                                alignSelf: "flex-start",
                            }}>
                                {course.category}
                            </div>

                            <h3 style={{ margin: "0 0 8px" }}>{course.title}</h3>
                            <p style={{ color: "#6b7280", fontSize: "14px", flex: 1 }}>
                                {course.description.length > 90
                                    ? course.description.slice(0, 90) + "..."
                                    : course.description}
                            </p>
                            <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "16px" }}>
                                👤 {course.instructor}
                            </p>

                            <Link to={`/courses/${course._id}`}>
                                <button style={{ width: "100%" }}>View Details</button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Courses; 