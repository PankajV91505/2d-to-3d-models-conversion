import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    Box,
    ArrowRight,
    Upload,
    Cpu,
    Download,
    Sparkles,
    Layers,
    Zap,
    Shield,
    Star,
} from "lucide-react";

export default function LandingPage() {
    const { user } = useAuth();

    return (
        <div className="page-container">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-radial-gradient" />
                <div className="absolute inset-0 bg-grid" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: "3s" }} />

                <div className="section-padding relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card bg-white dark:bg-dark-900/60 border border-gray-200 dark:border-dark-700 mb-8 animate-fade-in shadow-sm dark:shadow-none">
                            <Sparkles className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                            <span className="text-sm text-gray-600 dark:text-dark-300">
                                AI-Powered 3D Generation
                            </span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-slide-up text-gray-900 dark:text-white">
                            Transform 2D Images
                            <br />
                            <span className="gradient-text">Into Stunning 3D Models</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-600 dark:text-dark-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                            Upload any image and watch AI convert it into a high-quality 3D
                            model in seconds. No 3D expertise required.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                            <Link
                                to={user ? "/dashboard" : "/signup"}
                                className="btn-primary flex items-center gap-2 text-lg px-10 py-4"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/pricing"
                                className="btn-secondary flex items-center gap-2 text-lg px-10 py-4 text-gray-900 dark:text-white bg-white dark:bg-dark-900/50 border border-gray-300 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-800"
                            >
                                View Pricing
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-16 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
                            {[
                                { value: "10K+", label: "Models Created" },
                                { value: "< 30s", label: "Generation Time" },
                                { value: "99.5%", label: "Uptime" },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                                    <p className="text-xs text-gray-500 dark:text-dark-400 mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 relative bg-white dark:bg-dark-900">
                <div className="section-padding">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            How It <span className="gradient-text">Works</span>
                        </h2>
                        <p className="text-gray-600 dark:text-dark-400 max-w-xl mx-auto">
                            Three simple steps to transform any 2D image into a 3D model
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                icon: Upload,
                                step: "01",
                                title: "Upload Image",
                                desc: "Drag & drop or select any 2D image — photos, artwork, product shots, or concept art.",
                            },
                            {
                                icon: Cpu,
                                step: "02",
                                title: "AI Processing",
                                desc: "Our AI analyzes depth, geometry, and textures to construct an accurate 3D mesh.",
                            },
                            {
                                icon: Download,
                                step: "03",
                                title: "Download Model",
                                desc: "Preview your 3D model in the browser and download it as GLB or OBJ format.",
                            },
                        ].map((item, i) => (
                            <div
                                key={item.step}
                                className="glass-card-hover bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700 p-8 text-center group shadow-sm dark:shadow-none"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className="relative inline-block mb-6">
                                    <div className="w-16 h-16 bg-primary-50 dark:bg-dark-800 rounded-2xl flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-dark-700 transition-all duration-300">
                                        <item.icon className="w-7 h-7 text-primary-500 dark:text-primary-400" />
                                    </div>
                                    <span className="absolute -top-2 -right-2 text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-dark-800 border border-primary-200 dark:border-dark-700 px-2 py-0.5 rounded-full">
                                        {item.step}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{item.title}</h3>
                                <p className="text-gray-600 dark:text-dark-400 text-sm leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 relative bg-gray-50 dark:bg-dark-950">
                <div className="section-padding">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            Why Choose <span className="gradient-text">3DForge</span>?
                        </h2>
                        <p className="text-gray-600 dark:text-dark-400 max-w-xl mx-auto">
                            Built for creators, designers, and developers who need fast,
                            high-quality 3D assets.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {[
                            {
                                icon: Zap,
                                title: "Lightning Fast",
                                desc: "Generate 3D models in under 30 seconds with GPU-accelerated processing.",
                            },
                            {
                                icon: Layers,
                                title: "High Fidelity",
                                desc: "Preserve details, textures, and depth from your original 2D image.",
                            },
                            {
                                icon: Shield,
                                title: "Secure & Private",
                                desc: "Your images are processed securely and never stored permanently.",
                            },
                            {
                                icon: Star,
                                title: "Export Ready",
                                desc: "Download in GLB/OBJ formats compatible with all major 3D software.",
                            },
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="glass-card-hover bg-white dark:bg-dark-900 border-gray-200 dark:border-dark-700 p-6 group shadow-sm dark:shadow-none"
                            >
                                <div className="w-12 h-12 bg-primary-50 dark:bg-dark-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 dark:group-hover:bg-dark-700 transition-all duration-300">
                                    <feature.icon className="w-6 h-6 text-primary-500 dark:text-primary-400" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-dark-400 text-sm leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative bg-white dark:bg-dark-900">
                <div className="section-padding">
                    <div className="glass-card bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700 p-12 sm:p-16 text-center relative overflow-hidden shadow-xl dark:shadow-2xl">
                        <div className="absolute inset-0 bg-primary-50 dark:bg-gradient-to-br dark:from-primary-900/20 dark:to-purple-900/20" />
                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                                Ready to Create <span className="gradient-text">3D Magic</span>?
                            </h2>
                            <p className="text-gray-600 dark:text-dark-400 max-w-lg mx-auto mb-8">
                                Start with 5 free credits. No credit card required.
                            </p>
                            <Link
                                to={user ? "/dashboard" : "/signup"}
                                className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-4"
                            >
                                Start Creating Now
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-transparent">
                <div className="section-padding">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Box className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                            <span className="font-semibold">3DForge</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-dark-500">
                            © {new Date().getFullYear()} 3DForge. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
