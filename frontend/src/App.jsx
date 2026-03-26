import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PricingPage from "./pages/PricingPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-dark-950 dark:text-white transition-colors duration-300">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1e293b",
                color: "#f1f5f9",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                fontFamily: "Inter, system-ui, sans-serif",
              },
              success: {
                iconTheme: {
                  primary: "#6366f1",
                  secondary: "#f1f5f9",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#f1f5f9",
                },
              },
            }}
          />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
