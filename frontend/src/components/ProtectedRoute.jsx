import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
    const { user, loading } = useAuth();

    // Wait until we've checked localStorage before deciding anything
    if (loading) {
        return <p style={{ textAlign: "center" }}>Loading...</p>;
    }

    // Not logged in at all
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Logged in, but this route needs an admin and user isn't one
    if (adminOnly && user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    // All checks passed, show the actual page
    return children;
}

export default ProtectedRoute;