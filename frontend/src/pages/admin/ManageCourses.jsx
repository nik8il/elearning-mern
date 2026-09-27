import { useState, useEffect } from "react";
import API from "../../api/axios";

function ManageCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [instructor, setInstructor] = useState("");
    const [editingId, setEditingId] = useState(null);

    const token = localStorage.getItem("token");

    const fetchCourses = async () => {
        try {
            const response = await API.get("/courses");
            setCourses(response.data);
        } catch (err) {
            alert("Failed to load courses.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setCategory("");
        setInstructor("");
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const courseData = { title, description, category, instructor };

        try {
            if (editingId) {
                await API.put(`/courses/${editingId}`, courseData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await API.post("/courses", courseData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            resetForm();
            fetchCourses();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to save course.");
        }
    };

    const handleEdit = (course) => {
        setEditingId(course._id);
        setTitle(course.title);
        setDescription(course.description);
        setCategory(course.category);
        setInstructor(course.instructor);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            await API.delete(`/courses/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchCourses();
        } catch (err) {
            alert("Failed to delete course.");
        }
    };

    if (loading) {
        return <p style={{ textAlign: "center", padding: "60px" }} className="text-muted">Loading courses...</p>;
    }

    return (
        <div className="page-container">
            <h1 style={{ marginBottom: "24px" }}>Manage Courses</h1>

            <div className="card" style={{ marginBottom: "30px", maxWidth: "450px" }}>
                <h3 style={{ marginTop: 0 }}>{editingId ? "Edit Course" : "Add New Course"}</h3>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text" placeholder="Title" value={title}
                        onChange={(e) => setTitle(e.target.value)} required
                        style={{ width: "100%", marginBottom: "10px" }}
                    />
                    <textarea
                        placeholder="Description" value={description}
                        onChange={(e) => setDescription(e.target.value)} required
                        style={{ width: "100%", marginBottom: "10px", minHeight: "80px" }}
                    />
                    <input
                        type="text" placeholder="Category" value={category}
                        onChange={(e) => setCategory(e.target.value)} required
                        style={{ width: "100%", marginBottom: "10px" }}
                    />
                    <input
                        type="text" placeholder="Instructor" value={instructor}
                        onChange={(e) => setInstructor(e.target.value)} required
                        style={{ width: "100%", marginBottom: "16px" }}
                    />

                    <div style={{ display: "flex", gap: "10px" }}>
                        <button type="submit">{editingId ? "Update Course" : "Add Course"}</button>
                        {editingId && (
                            <button type="button" onClick={resetForm} className="btn-outline">Cancel</button>
                        )}
                    </div>
                </form>
            </div>

            <h3 style={{ marginBottom: "14px" }}>All Courses</h3>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <table>
                    <thead>
                        <tr style={{ background: "var(--color-bg)", textAlign: "left" }}>
                            <th style={{ padding: "14px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Title</th>
                            <th style={{ padding: "14px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Category</th>
                            <th style={{ padding: "14px 20px", fontSize: "12px", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Instructor</th>
                            <th style={{ padding: "14px 20px" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course._id} style={{ borderTop: "1px solid var(--color-border)" }}>
                                <td style={{ padding: "14px 20px", fontWeight: 600 }}>{course.title}</td>
                                <td style={{ padding: "14px 20px" }}>
                                    <span className="badge badge-primary">{course.category}</span>
                                </td>
                                <td style={{ padding: "14px 20px" }} className="text-muted">{course.instructor}</td>
                                <td style={{ padding: "14px 20px" }}>
                                    <button onClick={() => handleEdit(course)} className="btn-outline" style={{ marginRight: "8px", padding: "6px 14px", fontSize: "13px" }}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(course._id)} className="btn-danger" style={{ padding: "6px 14px", fontSize: "13px" }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManageCourses; 