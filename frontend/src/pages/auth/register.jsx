import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // stops the page from reloading
        setError("");
        setLoading(true);

        try {
            const response = await API.post("/auth/register", {
                name,
                email,
                password,
            });

            // Registration succeeded, but we don't have a token yet from register.
            // So log the user in right after registering.
            const loginResponse = await API.post("/auth/login", {
                email,
                password,
            });

            login(loginResponse.data.user, loginResponse.data.token);
            navigate("/"); // send them to Home
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "40px auto", padding: "20px" }}>
            <h1>Register</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "12px" }}>
                    <label>Name:</label><br />
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

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
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <button type="submit" disabled={loading} style={{ padding: "10px 20px", cursor: "pointer" }}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>

            <p style={{ marginTop: "16px" }}>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
}

export default Register;