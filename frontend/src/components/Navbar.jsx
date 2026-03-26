import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Box, LogOut, Sparkles } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-white/90 dark:bg-dark-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none"
                : "bg-transparent text-gray-900 dark:text-white"
                }`}
        >
            <div className="section-padding">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary-500/25 transition-all duration-300">
                            <Box className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">
                            <span className="text-gray-900 dark:text-white">3D</span>
                            <span className="gradient-text">Forge</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className={`nav-link ${isActive("/") ? "text-primary-600 dark:text-white font-semibold" : ""}`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/pricing"
                            className={`nav-link ${isActive("/pricing") ? "text-primary-600 dark:text-white font-semibold" : ""}`}
                        >
                            Pricing
                        </Link>

                        <ThemeToggle />

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/dashboard"
                                    className="btn-primary flex items-center gap-2 py-2 px-5"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg text-gray-500 dark:text-dark-400 hover:text-red-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-200"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="btn-secondary py-2 px-5 text-gray-900 dark:text-white bg-white dark:bg-transparent border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5">
                                    Log in
                                </Link>
                                <Link to="/signup" className="btn-primary py-2 px-5">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button & Theme toggle */}
                    <div className="flex items-center gap-4 md:hidden">
                        <ThemeToggle />
                        <button
                            className="p-2 text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-dark-950 px-4 shadow-lg animate-slide-up">
                        <div className="flex flex-col gap-3">
                            <Link
                                to="/"
                                className="nav-link py-2"
                                onClick={() => setIsOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/pricing"
                                className="nav-link py-2"
                                onClick={() => setIsOpen(false)}
                            >
                                Pricing
                            </Link>
                            {user ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="btn-primary flex justify-center items-center gap-2 py-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                        className="btn-secondary text-center py-2 text-gray-900 dark:text-white bg-gray-100 border border-gray-200 dark:bg-transparent dark:border-white/10"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="btn-secondary text-center py-2 text-gray-900 dark:text-white bg-gray-100 border border-gray-200 dark:bg-transparent dark:border-white/10"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="btn-primary text-center py-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
