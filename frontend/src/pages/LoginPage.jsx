import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2, Box } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            toast.success("Welcome back!");
            navigate("/dashboard");
        } catch (error) {
            const errorMessages = {
                "auth/user-not-found": "No account found with this email",
                "auth/wrong-password": "Incorrect password",
                "auth/invalid-email": "Invalid email address",
                "auth/too-many-requests": "Too many attempts. Please try again later",
                "auth/invalid-credential": "Invalid email or password",
            };
            toast.error(errorMessages[error.code] || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="min-h-[85vh] flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-radial-gradient opacity-50" />

                <div className="w-full max-w-md relative z-10 animate-slide-up">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                                <Box className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold">
                                <span className="text-gray-900 dark:text-white">3D</span>
                                <span className="gradient-text">Forge</span>
                            </span>
                        </Link>
                        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Welcome back</h1>
                        <p className="text-gray-500 dark:text-dark-400">Sign in to continue creating 3D models</p>
                    </div>

                    {/* Form */}
                    <div className="glass-card bg-white dark:bg-dark-900/80 border-gray-200 dark:border-dark-700 p-8 shadow-xl dark:shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-dark-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="input-field pl-12 bg-gray-50 dark:bg-dark-800 border-gray-300 dark:border-dark-600 text-gray-900 dark:text-white focus:border-primary-500"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-dark-500" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="input-field pl-12 pr-12 bg-gray-50 dark:bg-dark-800 border-gray-300 dark:border-dark-600 text-gray-900 dark:text-white focus:border-primary-500"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-500 hover:text-gray-600 dark:hover:text-dark-300 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5" />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-gray-500 dark:text-dark-400 mt-6">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium transition-colors"
                        >
                            Sign up free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
