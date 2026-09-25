import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 20px",
            borderBottom: "1px solid #ddd",
        }}>
            <h2 style={{ margin: 0 }}>E-Learning Platform</h2>

            <div>
                <Link to="/" style={{ marginRight: "12px" }}>Home</Link>
                <Link to="/courses" style={{ marginRight: "12px" }}>Courses</Link>

                {user ? (
                    <>
                        <Link to="/my-courses" style={{ marginRight: "12px" }}>My Courses</Link>
                        <span style={{ marginRight: "12px" }}>
                            Hi, {user.name} ({user.role})
                        </span>
                        <button onClick={handleLogout} style={{ cursor: "pointer" }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ marginRight: "12px" }}>Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;