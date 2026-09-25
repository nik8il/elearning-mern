import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/axios";

function CourseLearn() {
    const { courseId } = useParams();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get the course details
                const courseResponse = await API.get(`/courses/${courseId}`);
                setCourse(courseResponse.data);

                // Get the lessons for this course
                const lessonsResponse = await API.get(`/lessons/course/${courseId}`);
                setLessons(lessonsResponse.data);
            } catch (err) {
                setError("Failed to load course content.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId]);

    if (loading) {
        return <p style={{ textAlign: "center" }}>Loading course content...</p>;
    }

    if (error) {
        return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
    }

    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            <Link to="/my-courses">← Back to My Courses</Link>

            <h1>{course.title}</h1>
            <p>{course.description}</p>

            <h2>Lessons</h2>

            {lessons.length === 0 ? (
                <p>No lessons have been added to this course yet.</p>
            ) : (
                <ol>
                    {lessons.map((lesson) => (
                        <li key={lesson._id} style={{ marginBottom: "10px" }}>
                            <strong>{lesson.title}</strong>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}

export default CourseLearn;