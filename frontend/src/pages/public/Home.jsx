import { Link } from "react-router-dom";

function Home() {
    return (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <h1>Welcome to E-Learning Platform</h1>
            <p>Learn new skills with online courses and quizzes.</p>
            <Link to="/courses">
                <button style={{
                    marginTop: "20px",
                    padding: "10px 24px",
                    fontSize: "16px",
                    cursor: "pointer",
                }}>
                    Browse Courses
                </button>
            </Link>
        </div>
    );
}

export default Home;