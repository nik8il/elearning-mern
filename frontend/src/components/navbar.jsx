import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>E-Learning Platform</h2>

      <Link to="/">Home</Link>{" "}
      <Link to="/courses">Courses</Link>{" "}
      <Link to="/login">Login</Link>{" "}
      <Link to="/register">Register</Link>
    </nav>
  );
}

export default Navbar; 