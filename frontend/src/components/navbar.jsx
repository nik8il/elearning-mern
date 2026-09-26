import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const linkStyle = {
        marginRight: "18px",
        color: "#374151",
        fontWeight: "500",
    };

    return (
        <nav style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 30px",
            backgroundColor: "white",
            borderBottom: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}>
            <h2 style={{ margin: 0, color: "#2563eb" }}>📘 E-Learning Platform</h2>

            <div style={{ display: "flex", alignItems: "center" }}>
                <Link to="/" style={linkStyle}>Home</Link>
                <Link to="/courses" style={linkStyle}>Courses</Link>

                {user ? (
                    <>
                        {user.role === "admin" ? (
                            <Link to="/admin" style={linkStyle}>Admin Dashboard</Link>
                        ) : (
                            <>
                                <Link to="/my-courses" style={linkStyle}>My Courses</Link>
                                <Link to="/quiz-history" style={linkStyle}>Quiz History</Link>
                            </>
                        )}
                        <span style={{
                            marginRight: "14px",
                            padding: "4px 12px",
                            backgroundColor: "#eff6ff",
                            borderRadius: "20px",
                            fontSize: "14px",
                            color: "#1e40af",
                        }}>
                            {user.name} · {user.role}
                        </span>
                        <button onClick={handleLogout} style={{ padding: "8px 16px", cursor: "pointer" }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ ...linkStyle, marginRight: "10px" }}>Login</Link>
                        <Link to="/register">
                            <button style={{ padding: "8px 16px", cursor: "pointer" }}>Register</button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar; 