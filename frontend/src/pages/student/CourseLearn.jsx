import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/axios";

function CourseLearn() {
    const { courseId } = useParams();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [marking, setMarking] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseResponse = await API.get(`/courses/${courseId}`);
                setCourse(courseResponse.data);

                const lessonsResponse = await API.get(`/lessons/course/${courseId}`);
                setLessons(lessonsResponse.data);

                if (lessonsResponse.data.length > 0) {
                    setSelectedLesson(lessonsResponse.data[0]); // show first lesson by default
                }

                // Get this student's own enrollment to know what's already completed
                const enrollmentsResponse = await API.get("/enrollments/my-courses", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const thisEnrollment = enrollmentsResponse.data.find(
                    (e) => e.course._id === courseId
                );
                if (thisEnrollment) {
                    setCompletedLessons(thisEnrollment.completedLessons);
                }
            } catch (err) {
                setError("Failed to load course content.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId]);

    const handleMarkComplete = async (lessonId) => {
        setMarking(true);
        try {
            const response = await API.put(
                "/enrollments/complete",
                { courseId, lessonId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCompletedLessons(response.data.completedLessons);
        } catch (err) {
            alert("Failed to mark lesson complete.");
        } finally {
            setMarking(false);
        }
    };

    if (loading) {
        return <p style={{ textAlign: "center" }}>Loading course content...</p>;
    }

    if (error) {
        return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
    }

    const progressPercent =
        lessons.length === 0
            ? 0
            : Math.round((completedLessons.length / lessons.length) * 100);

    const isLessonComplete = (lessonId) => completedLessons.includes(lessonId);

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <Link to="/my-courses">← Back to My Courses</Link>

            <h1>{course.title}</h1>

            <div style={{ marginBottom: "20px" }}>
                <p><strong>Progress: {progressPercent}%</strong></p>
                <div style={{ background: "#eee", borderRadius: "6px", height: "16px", width: "100%" }}>
                    <div
                        style={{
                            width: `${progressPercent}%`,
                            background: "#4caf50",
                            height: "100%",
                            borderRadius: "6px",
                        }}
                    ></div>
                </div>
            </div>

            {lessons.length === 0 ? (
                <p>No lessons have been added to this course yet.</p>
            ) : (
                <div style={{ display: "flex", gap: "20px" }}>
                    {/* Lesson list on the left */}
                    <div style={{ width: "220px" }}>
                        <h3>Lessons</h3>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {lessons.map((lesson) => (
                                <li key={lesson._id} style={{ marginBottom: "8px" }}>
                                    <button
                                        onClick={() => setSelectedLesson(lesson)}
                                        style={{
                                            width: "100%",
                                            textAlign: "left",
                                            padding: "8px",
                                            cursor: "pointer",
                                            background: selectedLesson?._id === lesson._id ? "#e0e0e0" : "transparent",
                                            border: "1px solid #ddd",
                                        }}
                                    >
                                        {isLessonComplete(lesson._id) ? "✅ " : "▫️ "}
                                        {lesson.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Selected lesson content on the right */}
                    <div style={{ flex: 1 }}>
                        {selectedLesson && (
                            <div>
                                <h2>{selectedLesson.title}</h2>
                                <p>{selectedLesson.content}</p>

                                {selectedLesson.videoUrl && (
                                    <p>
                                        <a href={selectedLesson.videoUrl} target="_blank" rel="noreferrer">
                                            Watch video
                                        </a>
                                    </p>
                                )}

                                {isLessonComplete(selectedLesson._id) ? (
                                    <p style={{ color: "green" }}>✅ Completed</p>
                                ) : (
                                    <button
                                        onClick={() => handleMarkComplete(selectedLesson._id)}
                                        disabled={marking}
                                        style={{ padding: "8px 16px", cursor: "pointer" }}
                                    >
                                        {marking ? "Marking..." : "Mark as Complete"}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CourseLearn;