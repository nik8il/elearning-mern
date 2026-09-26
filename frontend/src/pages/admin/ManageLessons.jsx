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
        <div style={{ padding: "20px" }}>
            <h1>Manage Lessons</h1>

            <div style={{ marginBottom: "20px" }}>
                <label><strong>Select Course:</strong></label><br />
                <select
                    value={selectedCourse}
                    onChange={(e) => { setSelectedCourse(e.target.value); resetForm(); }}
                    style={{ padding: "8px", marginTop: "6px", minWidth: "250px" }}
                >
                    <option value="">-- Choose a course --</option>
                    {courses.map((course) => (
                        <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                </select>
            </div>

            {selectedCourse && (
                <>
                    <form onSubmit={handleSubmit} style={{ marginBottom: "30px", maxWidth: "400px" }}>
                        <h3>{editingId ? "Edit Lesson" : "Add New Lesson"}</h3>

                        <input
                            type="text"
                            placeholder="Lesson Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
                        />
                        <textarea
                            placeholder="Content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
                        />
                        <input
                            type="text"
                            placeholder="Video URL (optional)"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
                        />
                        <input
                            type="number"
                            placeholder="Order"
                            value={order}
                            onChange={(e) => setOrder(Number(e.target.value))}
                            required
                            style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
                        />

                        <button type="submit" style={{ padding: "8px 20px", cursor: "pointer" }}>
                            {editingId ? "Update Lesson" : "Add Lesson"}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                style={{ padding: "8px 20px", cursor: "pointer", marginLeft: "10px" }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>

                    <h3>Lessons in this Course</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
                                <th style={{ padding: "8px" }}>Order</th>
                                <th style={{ padding: "8px" }}>Title</th>
                                <th style={{ padding: "8px" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {lessons.map((lesson) => (
                                <tr key={lesson._id} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={{ padding: "8px" }}>{lesson.order}</td>
                                    <td style={{ padding: "8px" }}>{lesson.title}</td>
                                    <td style={{ padding: "8px" }}>
                                        <button onClick={() => handleEdit(lesson)} style={{ marginRight: "8px", cursor: "pointer" }}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(lesson._id)} style={{ cursor: "pointer" }}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default ManageLessons; 