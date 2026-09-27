import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            {/* Hero section */}
            <div style={{
                position: "relative",
                background: "linear-gradient(135deg, #4338ca 0%, #4f46e5 50%, #7c3aed 100%)",
                color: "white",
                padding: "100px 20px 120px",
                textAlign: "center",
                overflow: "hidden",
            }}>
                {/* Decorative blurred circles */}
                <div style={{
                    position: "absolute",
                    top: "-60px",
                    right: "-60px",
                    width: "220px",
                    height: "220px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                }}></div>
                <div style={{
                    position: "absolute",
                    bottom: "-80px",
                    left: "-40px",
                    width: "260px",
                    height: "260px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.06)",
                }}></div>

                <div style={{ position: "relative", zIndex: 1 }}>
                    <div className="badge" style={{
                        backgroundColor: "rgba(255,255,255,0.15)",
                        color: "white",
                        marginBottom: "24px",
                    }}>
                        🎓 Learn at your own pace
                    </div>

                    <h1 style={{
                        fontSize: "52px",
                        fontWeight: 800,
                        margin: "0 0 20px",
                        color: "white",
                        letterSpacing: "-1px",
                        lineHeight: 1.15,
                    }}>
                        Master new skills,<br />one lesson at a time.
                    </h1>

                    <p style={{
                        fontSize: "18px",
                        maxWidth: "560px",
                        margin: "0 auto 36px",
                        opacity: 0.9,
                        lineHeight: 1.6,
                    }}>
                        Structured courses, hands-on quizzes, and clear progress tracking —
                        everything you need to actually finish what you start.
                    </p>

                    <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link to="/courses">
                            <button style={{
                                padding: "14px 30px",
                                fontSize: "15px",
                                backgroundColor: "white",
                                color: "var(--color-primary)",
                            }}>
                                Explore Courses →
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="btn-outline" style={{
                                padding: "14px 30px",
                                fontSize: "15px",
                                color: "white",
                                borderColor: "rgba(255,255,255,0.5)",
                            }}>
                                Create Free Account
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Feature cards - overlapping the hero slightly */}
            <div className="page-container" style={{ marginTop: "-60px", position: "relative", zIndex: 2 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
                    {[
                        { icon: "📚", title: "Structured Courses", text: "Lessons organized in the right order, so you always know what's next." },
                        { icon: "📊", title: "Track Your Progress", text: "See exactly how much of each course you've completed." },
                        { icon: "📝", title: "Test Your Knowledge", text: "Take quizzes and get instant, detailed results." },
                    ].map((f) => (
                        <div key={f.title} className="card card-hover" style={{ width: "300px", textAlign: "center" }}>
                            <div style={{
                                width: "52px",
                                height: "52px",
                                margin: "0 auto 16px",
                                borderRadius: "12px",
                                background: "var(--color-primary-light)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "24px",
                            }}>
                                {f.icon}
                            </div>
                            <h3 style={{ marginBottom: "8px" }}>{f.title}</h3>
                            <p className="text-muted" style={{ fontSize: "14px", margin: 0 }}>{f.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="page-container" style={{ textAlign: "center", padding: "60px 20px" }}>
                <h2 style={{ marginBottom: "10px" }}>Ready to start learning?</h2>
                <p className="text-muted" style={{ marginBottom: "24px" }}>
                    Create a free account and enroll in your first course today.
                </p>
                <Link to="/register">
                    <button style={{ padding: "14px 32px", fontSize: "15px" }}>
                        Get Started Free
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Home; 