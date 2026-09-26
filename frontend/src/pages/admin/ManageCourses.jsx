import { useState, useEffect } from "react";
import API from "../../api/axios";

function ManageCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [instructor, setInstructor] = useState("");

    const [editingId, setEditingId] = useState(null); // null = adding new, else = editing this course

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
                // Update existing course
                await API.put(`/courses/${editingId}`, courseData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                // Create new course
                await API.post("/courses", courseData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            resetForm();
            fetchCourses(); // refresh the list
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
        return <p style={{ textAlign: "center" }}>Loading courses...</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Manage Courses</h1>

            <form onSubmit={handleSubmit} style={{ marginBottom: "30px", maxWidth: "400px" }}>
                <h3>{editingId ? "Edit Course" : "Add New Course"}</h3>

                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
                />
                <input
                    type="text"
                    placeholder="Instructor"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    required
                    style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
                />

                <button type="submit" style={{ padding: "8px 20px", cursor: "pointer" }}>
                    {editingId ? "Update Course" : "Add Course"}
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

            <h3>All Courses</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
                        <th style={{ padding: "8px" }}>Title</th>
                        <th style={{ padding: "8px" }}>Category</th>
                        <th style={{ padding: "8px" }}>Instructor</th>
                        <th style={{ padding: "8px" }}></th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course._id} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "8px" }}>{course.title}</td>
                            <td style={{ padding: "8px" }}>{course.category}</td>
                            <td style={{ padding: "8px" }}>{course.instructor}</td>
                            <td style={{ padding: "8px" }}>
                                <button onClick={() => handleEdit(course)} style={{ marginRight: "8px", cursor: "pointer" }}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(course._id)} style={{ cursor: "pointer" }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageCourses; 