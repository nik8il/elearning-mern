import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    const navLinkStyle = (path) => ({
        marginRight: "26px",
        fontSize: "14px",
        fontWeight: 600,
        color: isActive(path) ? "var(--color-primary)" : "var(--color-text-muted)",
        borderBottom: isActive(path) ? "2px solid var(--color-primary)" : "2px solid transparent",
        paddingBottom: "22px",
        transition: "color 0.15s ease",
    });

    return (
        <nav style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 32px",
            backgroundColor: "white",
            borderBottom: "1px solid var(--color-border)",
            position: "sticky",
            top: 0,
            zIndex: 100,
        }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "16px 0" }}>
                <div style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, var(--color-primary), #7c3aed)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "16px",
                }}>
                    E
                </div>
                <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--color-text)" }}>
                    EduLearn
                </span>
            </Link>

            <div style={{ display: "flex", alignItems: "center" }}>
                <Link to="/" style={navLinkStyle("/")}>Home</Link>
                <Link to="/courses" style={navLinkStyle("/courses")}>Courses</Link>

                {user ? (
                    <>
                        {user.role === "admin" ? (
                            <Link to="/admin" style={navLinkStyle("/admin")}>Dashboard</Link>
                        ) : (
                            <>
                                <Link to="/my-courses" style={navLinkStyle("/my-courses")}>My Courses</Link>
                                <Link to="/quiz-history" style={navLinkStyle("/quiz-history")}>Quiz History</Link>
                            </>
                        )}
                    </>
                ) : null}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                {user ? (
                    <>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "6px 14px 6px 6px",
                            backgroundColor: "var(--color-bg)",
                            borderRadius: "20px",
                        }}>
                            <div style={{
                                width: "26px",
                                height: "26px",
                                borderRadius: "50%",
                                background: "var(--color-primary)",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: "bold",
                            }}>
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontSize: "13px", fontWeight: 600 }}>{user.name}</span>
                        </div>
                        <button onClick={handleLogout} className="btn-outline">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ fontWeight: 600, fontSize: "14px" }}>Login</Link>
                        <Link to="/register">
                            <button>Sign Up Free</button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar; 