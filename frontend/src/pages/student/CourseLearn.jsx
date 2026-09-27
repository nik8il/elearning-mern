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
        return <p style={{ textAlign: "center", padding: "60px" }} className="text-muted">Loading course content...</p>;
    }

    if (error) {
        return <p style={{ textAlign: "center", color: "var(--color-danger)", padding: "60px" }}>{error}</p>;
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
            <Link to="/my-courses" style={{ fontSize: "13px", fontWeight: 600 }}>← Back to My Courses</Link>

            <div style={{ margin: "16px 0 24px" }}>
                <h1 style={{ marginBottom: "10px" }}>{course.title}</h1>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                    <span style={{ fontWeight: 600 }}>Course Progress</span>
                    <span className="text-muted">{progressPercent}% · {completedLessons.length}/{lessons.length} lessons</span>
                </div>
                <div className="progress-track" style={{ height: "10px" }}>
                    <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
            </div>

            {lessons.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "50px" }}>
                    <p className="text-muted">No lessons have been added to this course yet.</p>
                </div>
            ) : (
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-start" }}>
                    <div className="card" style={{ width: "260px", padding: "14px" }}>
                        <h3 style={{ marginTop: 0, marginBottom: "12px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }} className="text-muted">
                            Lessons
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {lessons.map((lesson, idx) => {
                                const active = selectedLesson?._id === lesson._id;
                                const done = isLessonComplete(lesson._id);
                                return (
                                    <button
                                        key={lesson._id}
                                        onClick={() => setSelectedLesson(lesson)}
                                        style={{
                                            width: "100%",
                                            textAlign: "left",
                                            padding: "10px 12px",
                                            background: active ? "var(--color-primary-light)" : "transparent",
                                            color: active ? "var(--color-primary)" : "var(--color-text)",
                                            border: "none",
                                            fontWeight: active ? 700 : 500,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <span style={{
                                            width: "20px", height: "20px", borderRadius: "50%",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: "11px", flexShrink: 0,
                                            background: done ? "var(--color-success)" : "var(--color-border)",
                                            color: "white",
                                        }}>
                                            {done ? "✓" : idx + 1}
                                        </span>
                                        <span style={{ fontSize: "13px" }}>{lesson.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="card" style={{ flex: 1, minWidth: "300px" }}>
                        {selectedLesson && (
                            <div>
                                <h2 style={{ marginTop: 0 }}>{selectedLesson.title}</h2>

                                {selectedLesson.videoUrl && getYouTubeEmbedUrl(selectedLesson.videoUrl) && (
                                    <div style={{
                                        position: "relative",
                                        paddingBottom: "56.25%",
                                        height: 0,
                                        marginBottom: "18px",
                                        borderRadius: "var(--radius-md)",
                                        overflow: "hidden",
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
                                            }}
                                        ></iframe>
                                    </div>
                                )}

                                <p style={{ lineHeight: "1.7", color: "var(--color-text-muted)" }}>{selectedLesson.content}</p>

                                {isLessonComplete(selectedLesson._id) ? (
                                    <span className="badge badge-success">✓ Completed</span>
                                ) : (
                                    <button
                                        onClick={() => handleMarkComplete(selectedLesson._id)}
                                        disabled={marking}
                                    >
                                        {marking ? "Marking..." : "Mark as Complete"}
                                    </button>
                                )}

                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "24px",
                                    paddingTop: "18px",
                                    borderTop: "1px solid var(--color-border)",
                                }}>
                                    <button
                                        onClick={() => goToLesson(currentIndex - 1)}
                                        disabled={currentIndex <= 0}
                                        className="btn-outline"
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

            <h2 style={{ marginTop: "40px", marginBottom: "16px" }}>Quizzes</h2>
            {quizzes.length === 0 ? (
                <p className="text-muted">No quizzes available for this course yet.</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {quizzes.map((quiz) => (
                        <div
                            key={quiz._id}
                            className="card card-hover"
                            style={{
                                padding: "16px 22px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span style={{ fontWeight: 600 }}>📝 {quiz.title}</span>
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