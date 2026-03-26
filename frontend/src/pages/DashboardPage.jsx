import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ImageUpload from "../components/ImageUpload";
import ModelViewer from "../components/ModelViewer";
import {
    Sparkles,
    Wand2,
    CreditCard,
    Crown,
    Loader2,
    AlertCircle,
    CheckCircle,
    Layers,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const planBadgeColors = {
    free: "bg-slate-500/20 text-slate-300",
    plus: "bg-primary-500/20 text-primary-300",
    premium: "bg-amber-500/20 text-amber-300",
};

export default function DashboardPage() {
    const { userData, getToken, refreshUserData } = useAuth();
    const [file, setFile] = useState(null);
    const [modelUrl, setModelUrl] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState("");

    const handleGenerate = async () => {
        if (!file) {
            toast.error("Please upload an image first");
            return;
        }

        if (!userData || userData.credits <= 0) {
            toast.error("Not enough credits! Please upgrade your plan.");
            return;
        }

        setGenerating(true);
        setProgress("Preparing image...");
        setModelUrl(null);

        try {
            const token = await getToken();
            const formData = new FormData();
            formData.append("file", file);

            setProgress("Sending to AI model...");

            const response = await fetch("/api/convert", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || "Conversion failed");
            }

            setProgress("Processing 3D model...");

            const data = await response.json();

            if (data.model_url) {
                setModelUrl(data.model_url);
                toast.success("3D model generated successfully!");
                await refreshUserData();
            } else {
                throw new Error("No model returned from server");
            }
        } catch (error) {
            console.error("Generation error:", error);
            toast.error(error.message || "Failed to generate 3D model");
        } finally {
            setGenerating(false);
            setProgress("");
        }
    };

    return (
        <div className="page-container pb-12">
            <div className="section-padding">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">Dashboard</h1>
                        <p className="text-gray-500 dark:text-dark-400">
                            Upload an image and generate a 3D model
                        </p>
                    </div>

                    {/* Plan & Credits Badge */}
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${planBadgeColors[userData?.plan] || planBadgeColors.free
                                }`}
                        >
                            <Crown className="w-4 h-4" />
                            <span className="font-semibold text-sm capitalize">
                                {userData?.plan || "Free"} Plan
                            </span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 border border-gray-200 dark:bg-dark-900/60 dark:border-dark-700 text-gray-900 dark:text-white">
                            <Sparkles className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                            <span className="font-semibold text-sm">
                                {userData?.credits ?? 0} Credits
                            </span>
                        </div>
                    </div>
                </div>

                {/* Low Credit Warning */}
                {userData && userData.credits <= 2 && (
                    <div className="mb-6 glass-card p-4 border-amber-500/30 bg-amber-500/5 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm text-amber-200">
                                You're running low on credits ({userData.credits} remaining).
                            </p>
                        </div>
                        <Link
                            to="/pricing"
                            className="text-sm font-semibold text-amber-400 hover:text-amber-300 whitespace-nowrap"
                        >
                            Upgrade Plan →
                        </Link>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Upload & Generate */}
                    <div className="space-y-6">
                        <div className="glass-card bg-white dark:bg-dark-900/60 border-gray-200 dark:border-dark-700 p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                                <Layers className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                                Upload Image
                            </h2>
                            <ImageUpload
                                file={file}
                                setFile={setFile}
                                disabled={generating}
                            />
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={!file || generating || userData?.credits <= 0}
                            className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg"
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    {progress || "Generating..."}
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-6 h-6" />
                                    Generate 3D Model
                                    <span className="text-sm opacity-75">(1 credit)</span>
                                </>
                            )}
                        </button>

                        {/* Generation Status */}
                        {generating && (
                            <div className="glass-card bg-white dark:bg-dark-900/60 border-gray-200 dark:border-dark-700 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-gray-900 dark:text-white">{progress}</p>
                                        <p className="text-xs text-gray-500 dark:text-dark-400 mt-0.5">
                                            This may take 30-60 seconds
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {modelUrl && !generating && (
                            <div className="glass-card p-4 border-green-500/30 bg-green-50 dark:bg-green-500/5">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                                    <p className="text-sm text-green-700 dark:text-green-300">
                                        Model generated! View it in the 3D viewer →
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - 3D Viewer */}
                    <div className="glass-card bg-white dark:bg-dark-900/60 border-gray-200 dark:border-dark-700 p-6 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                                <Wand2 className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                                3D Viewer Preview
                            </h2>
                        </div>
                        <div className="w-full h-full min-h-[400px]">
                            <ModelViewer modelUrl={modelUrl} />
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        {
                            icon: CreditCard,
                            label: "Current Plan",
                            value: (userData?.plan || "Free").charAt(0).toUpperCase() + (userData?.plan || "free").slice(1),
                        },
                        {
                            icon: Sparkles,
                            label: "Credits Remaining",
                            value: userData?.credits ?? 0,
                        },
                        {
                            icon: Layers,
                            label: "Models Created",
                            value: "—",
                        },
                        {
                            icon: Crown,
                            label: "Member Since",
                            value: userData?.createdAt
                                ? new Date(userData.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                                : "—",
                        },
                    ].map((stat) => (
                        <div key={stat.label} className="glass-card bg-white dark:bg-dark-900/60 border-gray-200 dark:border-dark-700 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <stat.icon className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                                <span className="text-xs text-gray-500 dark:text-dark-400">{stat.label}</span>
                            </div>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
