import { useState, useEffect } from "react";
import API from "../../api/axios";

function ManageLessons() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [lessons, setLessons] = useState([]);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [order, setOrder] = useState(1);
    const [editingId, setEditingId] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        API.get("/courses").then((res) => setCourses(res.data));
    }, []);

    const fetchLessons = async (courseId) => {
        if (!courseId) {
            setLessons([]);
            return;
        }
        const response = await API.get(`/lessons/course/${courseId}`);
        setLessons(response.data);
    };

    useEffect(() => {
        fetchLessons(selectedCourse);
    }, [selectedCourse]);

    const resetForm = () => {
        setTitle("");
        setContent("");
        setVideoUrl("");
        setOrder(1);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCourse) {
            alert("Please select a course first.");
            return;
        }
        const lessonData = { title, content, videoUrl, order, course: selectedCourse };

        try {
            if (editingId) {
                await API.put(`/lessons/${editingId}`, lessonData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await API.post("/lessons", lessonData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            resetForm();
            fetchLessons(selectedCourse);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to save lesson.");
        }
    };

    const handleEdit = (lesson) => {
        setEditingId(lesson._id);
        setTitle(lesson.title);
        setContent(lesson.content);
        setVideoUrl(lesson.videoUrl);
        setOrder(lesson.order);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lesson?")) return;
        try {
            await API.delete(`/lessons/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchLessons(selectedCourse);
        } catch (err) {
            alert("Failed to delete lesson.");
        }
    };

    return (
        <div className="page-container">
            <h1 style={{ marginBottom: "24px" }}>Manage Lessons</h1>

            <div className="card" style={{ marginBottom: "24px", maxWidth: "400px" }}>
                <label style={{ fontWeight: 600, fontSize: "14px" }}>Select Course</label>
                <select
                    value={selectedCourse}
                    onChange={(e) => { setSelectedCourse(e.target.value); resetForm(); }}
                    style={{ width: "100%", marginTop: "8px" }}
                >
                    <option value="">-- Choose a course --</option>
                    {courses.map((course) => (
                        <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                </select>
            </div>

            {selectedCourse && (
                <>
                    <div className="card" style={{ marginBottom: "30px", maxWidth: "450px" }}>
                        <h3 style={{ marginTop: 0 }}>{editingId ? "Edit Lesson" : "Add New Lesson"}</h3>

                        <form onSubmit={handleSubmit}>
                            <input
                                type="text" placeholder="Lesson Title" value={title}
                                onChange={(e) => setTitle(e.target.value)} required
                                style={{ width: "100%", marginBottom: "10px" }}
                            />
                            <textarea
                                placeholder="Content" value={content}
                                onChange={(e) => setContent(e.target.value)} required
                                style={{ width: "100%", marginBottom: "10px", minHeight: "80px" }}
                            />
                            <input
                                type="text" placeholder="YouTube Video URL (optional)" value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                style={{ width: "100%", marginBottom: "10px" }}
                            />
                            <input
                                type="number" placeholder="Order" value={order}
                                onChange={(e) => setOrder(Number(e.target.value))} required
                                style={{ width: "100%", marginBottom: "16px" }}
                            />

                            <div style={{ display: "flex", gap: "10px" }}>
                                <button type="submit">{editingId ? "Update Lesson" : "Add Lesson"}</button>
                                {editingId && (
                                    <button type="button" onClick={resetForm} className="btn-outline">Cancel</button>
                                )}
                            </div>
                        </form>
                    </div>

                    <h3 style={{ marginBottom: "14px" }}>Lessons in this Course</h3>
                    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                        <table>
                            <thead>
                                <tr style={{ background: "var(--color-bg)", textAlign: "left" }}>
                                    <th style={{ padding: "14px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Order</th>
                                    <th style={{ padding: "14px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Title</th>
                                    <th style={{ padding: "14px 20px" }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {lessons.map((lesson) => (
                                    <tr key={lesson._id} style={{ borderTop: "1px solid var(--color-border)" }}>
                                        <td style={{ padding: "14px 20px" }}>{lesson.order}</td>
                                        <td style={{ padding: "14px 20px", fontWeight: 600 }}>{lesson.title}</td>
                                        <td style={{ padding: "14px 20px" }}>
                                            <button onClick={() => handleEdit(lesson)} className="btn-outline" style={{ marginRight: "8px", padding: "6px 14px", fontSize: "13px" }}>
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(lesson._id)} className="btn-danger" style={{ padding: "6px 14px", fontSize: "13px" }}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default ManageLessons; 