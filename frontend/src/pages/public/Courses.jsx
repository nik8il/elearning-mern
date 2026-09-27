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
        return <p style={{ textAlign: "center", padding: "60px" }} className="text-muted">Loading courses...</p>;
    }

    if (error) {
        return <p style={{ textAlign: "center", color: "var(--color-danger)", padding: "60px" }}>{error}</p>;
    }

    // A small set of colors to rotate through for course card accents
    const accentColors = ["#4f46e5", "#059669", "#d97706", "#db2777", "#0891b2"];

    return (
        <div className="page-container">
            <div style={{ marginBottom: "36px" }}>
                <h1 style={{ marginBottom: "8px" }}>Explore Courses</h1>
                <p className="text-muted">
                    {courses.length} course{courses.length !== 1 ? "s" : ""} available — browse and start learning today.
                </p>
            </div>

            {courses.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "60px" }}>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
                    <h3>No courses available yet</h3>
                    <p className="text-muted">Please check back soon.</p>
                </div>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "22px",
                }}>
                    {courses.map((course, index) => {
                        const accent = accentColors[index % accentColors.length];
                        return (
                            <div key={course._id} className="card card-hover" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                                <div style={{
                                    height: "8px",
                                    background: accent,
                                }}></div>

                                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                                    <span className="badge" style={{
                                        backgroundColor: `${accent}18`,
                                        color: accent,
                                        alignSelf: "flex-start",
                                        marginBottom: "12px",
                                    }}>
                                        {course.category}
                                    </span>

                                    <h3 style={{ margin: "0 0 8px" }}>{course.title}</h3>
                                    <p className="text-muted" style={{ fontSize: "14px", flex: 1, margin: "0 0 16px" }}>
                                        {course.description.length > 90
                                            ? course.description.slice(0, 90) + "..."
                                            : course.description}
                                    </p>

                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        fontSize: "13px",
                                        color: "var(--color-text-faint)",
                                        marginBottom: "16px",
                                        paddingTop: "12px",
                                        borderTop: "1px solid var(--color-border)",
                                    }}>
                                        <span style={{
                                            width: "22px", height: "22px", borderRadius: "50%",
                                            background: "var(--color-bg)", display: "flex",
                                            alignItems: "center", justifyContent: "center", fontSize: "11px",
                                        }}>👤</span>
                                        {course.instructor}
                                    </div>

                                    <Link to={`/courses/${course._id}`}>
                                        <button style={{ width: "100%" }}>View Details</button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Courses; 