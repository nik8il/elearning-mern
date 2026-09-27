import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/axios";

function getYouTubeEmbedUrl(url) {
    if (!url) return null;

    const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }

    return null;
}

function CourseLearn() {
    const { courseId } = useParams();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
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
                    setSelectedLesson(lessonsResponse.data[0]);
                }

                const enrollmentsResponse = await API.get("/enrollments/my-courses", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const thisEnrollment = enrollmentsResponse.data.find(
                    (e) => e.course._id === courseId
                );
                if (thisEnrollment) {
                    setCompletedLessons(thisEnrollment.completedLessons);
                }

                const quizzesResponse = await API.get(`/quizzes/course/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setQuizzes(quizzesResponse.data);
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
        return <p style={{ textAlign: "center", padding: "40px" }}>Loading course content...</p>;
    }

    if (error) {
        return <p style={{ textAlign: "center", color: "red", padding: "40px" }}>{error}</p>;
    }

    const progressPercent =
        lessons.length === 0
            ? 0
            : Math.round((completedLessons.length / lessons.length) * 100);

    const isLessonComplete = (lessonId) => completedLessons.includes(lessonId);

    const currentIndex = lessons.findIndex((l) => l._id === selectedLesson?._id);
    const goToLesson = (index) => {
        if (index >= 0 && index < lessons.length) {
            setSelectedLesson(lessons[index]);
        }
    };

    return (
        <div className="page-container">
            <Link to="/my-courses">← Back to My Courses</Link>

            <h1 style={{ marginBottom: "6px" }}>{course.title}</h1>

            <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "4px" }}>
                    <strong>Course Progress</strong>
                    <span>{progressPercent}% · {completedLessons.length}/{lessons.length} lessons</span>
                </div>
                <div style={{ background: "#eee", borderRadius: "6px", height: "14px", width: "100%" }}>
                    <div
                        className="progress-fill"
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
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <div className="card" style={{ width: "240px", padding: "12px" }}>
                        <h3 style={{ marginTop: 0 }}>Lessons</h3>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {lessons.map((lesson) => (
                                <li key={lesson._id} style={{ marginBottom: "8px" }}>
                                    <button
                                        onClick={() => setSelectedLesson(lesson)}
                                        style={{
                                            width: "100%",
                                            textAlign: "left",
                                            padding: "10px",
                                            background: selectedLesson?._id === lesson._id ? "#eff6ff" : "white",
                                            color: selectedLesson?._id === lesson._id ? "#2563eb" : "#374151",
                                            border: selectedLesson?._id === lesson._id ? "1px solid #2563eb" : "1px solid #e5e7eb",
                                        }}
                                    >
                                        {isLessonComplete(lesson._id) ? "✅ " : "▫️ "}
                                        {lesson.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="card" style={{ flex: 1, minWidth: "280px" }}>
                        {selectedLesson && (
                            <div>
                                <h2 style={{ marginTop: 0 }}>{selectedLesson.title}</h2>

                                {selectedLesson.videoUrl && getYouTubeEmbedUrl(selectedLesson.videoUrl) && (
                                    <div style={{
                                        position: "relative",
                                        paddingBottom: "56.25%",
                                        height: 0,
                                        marginBottom: "16px",
                                    }}>
                                        <iframe
                                            src={getYouTubeEmbedUrl(selectedLesson.videoUrl)}
                                            title={selectedLesson.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                border: "none",
                                                borderRadius: "8px",
                                            }}
                                        ></iframe>
                                    </div>
                                )}

                                <p style={{ lineHeight: "1.6" }}>{selectedLesson.content}</p>

                                {isLessonComplete(selectedLesson._id) ? (
                                    <p style={{ color: "#16a34a", fontWeight: "bold" }}>✅ Completed</p>
                                ) : (
                                    <button
                                        onClick={() => handleMarkComplete(selectedLesson._id)}
                                        disabled={marking}
                                    >
                                        {marking ? "Marking..." : "Mark as Complete"}
                                    </button>
                                )}

                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "16px" }}>
                                    <button
                                        onClick={() => goToLesson(currentIndex - 1)}
                                        disabled={currentIndex <= 0}
                                        style={{ backgroundColor: currentIndex <= 0 ? "#9ca3af" : "#6b7280" }}
                                    >
                                        ← Previous
                                    </button>
                                    <button
                                        onClick={() => goToLesson(currentIndex + 1)}
                                        disabled={currentIndex >= lessons.length - 1}
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <h2 style={{ marginTop: "40px" }}>Quizzes</h2>
            {quizzes.length === 0 ? (
                <p>No quizzes available for this course yet.</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {quizzes.map((quiz) => (
                        <div
                            key={quiz._id}
                            className="card"
                            style={{
                                padding: "14px 20px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span>📝 {quiz.title}</span>
                            <Link to={`/quiz/${quiz._id}`}>
                                <button>Take Quiz</button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CourseLearn; 