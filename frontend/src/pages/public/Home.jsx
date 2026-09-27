import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            {/* Hero section */}
            <div style={{
                background: "linear-gradient(135deg, #2563eb, #1e40af)",
                color: "white",
                padding: "80px 20px",
                textAlign: "center",
            }}>
                <h1 style={{ fontSize: "42px", margin: "0 0 16px", color: "white" }}>
                    Learn. Practice. Grow.
                </h1>
                <p style={{ fontSize: "18px", maxWidth: "600px", margin: "0 auto 30px", opacity: 0.9 }}>
                    A simple, focused e-learning platform to help you build real skills
                    through structured courses and hands-on quizzes.
                </p>
                <Link to="/courses">
                    <button style={{
                        padding: "14px 32px",
                        fontSize: "16px",
                        backgroundColor: "white",
                        color: "#2563eb",
                        fontWeight: "bold",
                    }}>
                        Explore Courses
                    </button>
                </Link>
            </div>

            {/* Why Learn With Us */}
            <div className="page-container">
                <h2 style={{ textAlign: "center", marginBottom: "40px" }}>Why Learn With Us</h2>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
                    <div className="card" style={{ width: "260px", textAlign: "center" }}>
                        <div style={{ fontSize: "32px", marginBottom: "10px" }}>📚</div>
                        <h3>Structured Courses</h3>
                        <p style={{ color: "#6b7280" }}>
                            Clear lessons organized in the right order, so you always know what's next.
                        </p>
                    </div>

                    <div className="card" style={{ width: "260px", textAlign: "center" }}>
                        <div style={{ fontSize: "32px", marginBottom: "10px" }}>📊</div>
                        <h3>Track Your Progress</h3>
                        <p style={{ color: "#6b7280" }}>
                            See exactly how much of each course you've completed, lesson by lesson.
                        </p>
                    </div>

                    <div className="card" style={{ width: "260px", textAlign: "center" }}>
                        <div style={{ fontSize: "32px", marginBottom: "10px" }}>📝</div>
                        <h3>Test Your Knowledge</h3>
                        <p style={{ color: "#6b7280" }}>
                            Take quizzes after each course and get instant, detailed results.
                        </p>
                    </div>
                </div>
            </div>

            {/* Call to action */}
            <div style={{
                textAlign: "center",
                padding: "50px 20px",
                backgroundColor: "#eff6ff",
            }}>
                <h2>Ready to start learning?</h2>
                <p style={{ color: "#6b7280", marginBottom: "20px" }}>
                    Create a free account and enroll in your first course today.
                </p>
                <Link to="/register">
                    <button style={{ padding: "12px 28px", fontSize: "16px" }}>
                        Get Started
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Home; 