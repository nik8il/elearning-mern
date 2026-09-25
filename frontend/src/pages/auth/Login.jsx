import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await API.post("/auth/login", {
                email,
                password,
            });

            login(response.data.user, response.data.token);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "40px auto", padding: "20px" }}>
            <h1>Login</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "12px" }}>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label>Password:</label><br />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <button type="submit" disabled={loading} style={{ padding: "10px 20px", cursor: "pointer" }}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p style={{ marginTop: "16px" }}>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}

export default Login;