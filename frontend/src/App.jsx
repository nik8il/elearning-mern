import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/public/Home";
import Courses from "./pages/public/Courses";
import CourseDetails from "./pages/public/CourseDetails";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MyCourses from "./pages/student/MyCourses";
import CourseLearn from "./pages/student/CourseLearn";
import TakeQuiz from "./pages/student/TakeQuiz";
import QuizResult from "./pages/student/QuizResult";
import QuizHistory from "./pages/student/QuizHistory";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/my-courses"
            element={
              <ProtectedRoute>
                <MyCourses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/learn/:courseId"
            element={
              <ProtectedRoute>
                <CourseLearn />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz/:quizId"
            element={
              <ProtectedRoute>
                <TakeQuiz />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz-result/:attemptId"
            element={
              <ProtectedRoute>
                <QuizResult />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz-history"
            element={
              <ProtectedRoute>
                <QuizHistory />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App; 