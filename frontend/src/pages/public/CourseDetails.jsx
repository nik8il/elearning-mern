import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/axios";

function CourseDetails() {
    const { id } = useParams(); // gets the :id from the URL
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

            <button style={{ padding: "10px 24px", fontSize: "16px", cursor: "pointer" }}>
                Enroll Now
            </button>
        </div>
    );
}

export default CourseDetails;