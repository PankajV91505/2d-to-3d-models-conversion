import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Check, Sparkles, Zap, Crown, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const plans = [
    {
        id: "free",
        name: "Free",
        price: "$0",
        period: "forever",
        credits: 5,
        icon: Sparkles,
        description: "Perfect for trying out 3D generation",
        features: [
            "5 Credits",
            "GLB/OBJ Export",
            "Basic Quality",
            "Email Support",
        ],
        gradient: "from-slate-500 to-slate-700",
        buttonClass: "btn-secondary",
        popular: false,
    },
    {
        id: "plus",
        name: "Plus",
        price: "$19",
        period: "one-time",
        credits: 100,
        icon: Zap,
        description: "Great for creators and small projects",
        features: [
            "100 Credits",
            "GLB/OBJ Export",
            "High Quality",
            "Priority Support",
            "Batch Processing",
        ],
        gradient: "from-primary-500 to-purple-500",
        buttonClass: "btn-primary",
        popular: true,
    },
    {
        id: "premium",
        name: "Premium",
        price: "$39",
        period: "one-time",
        credits: 200,
        icon: Crown,
        description: "For professionals and teams",
        features: [
            "200 Credits",
            "GLB/OBJ Export",
            "Ultra Quality",
            "24/7 Priority Support",
            "Batch Processing",
            "API Access",
        ],
        gradient: "from-amber-500 to-orange-500",
        buttonClass: "btn-primary",
        popular: false,
    },
];

export default function PricingPage() {
    const { user, userData, upgradePlan } = useAuth();
    const navigate = useNavigate();
    const [upgrading, setUpgrading] = useState(null);

    const handleUpgrade = async (planId) => {
        if (!user) {
            navigate("/signup");
            return;
        }

        if (planId === "free") {
            toast("You're already on the Free plan!", { icon: "ℹ️" });
            return;
        }

        setUpgrading(planId);
        try {
            // Mock payment process
            await new Promise((resolve) => setTimeout(resolve, 1500));
            await upgradePlan(planId);
            toast.success(
                `Upgraded to ${planId.charAt(0).toUpperCase() + planId.slice(1)}! Credits added.`
            );
            navigate("/dashboard");
        } catch (error) {
            toast.error("Upgrade failed. Please try again.");
        } finally {
            setUpgrading(null);
        }
    };

    return (
        <div className="page-container">
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient opacity-50" />
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px]" />

                <div className="section-padding relative z-10">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4 animate-slide-up text-gray-900 dark:text-white">
                            Simple, Transparent{" "}
                            <span className="gradient-text">Pricing</span>
                        </h1>
                        <p className="text-gray-600 dark:text-dark-400 max-w-xl mx-auto text-lg animate-slide-up" style={{ animationDelay: "0.1s" }}>
                            Pay once, create many. No subscriptions, no hidden fees.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {plans.map((plan, i) => (
                            <div
                                key={plan.id}
                                className={`relative glass-card bg-white dark:bg-dark-900/60 border-gray-200 dark:border-dark-700 p-8 flex flex-col animate-slide-up ${plan.popular ? "border-primary-500/50 shadow-lg dark:shadow-none scale-105 md:scale-110 z-10" : ""
                                    }`}
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                                            MOST POPULAR
                                        </span>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <div
                                        className={`w-12 h-12 bg-gradient-to-br ${plan.gradient} rounded-xl flex items-center justify-center mb-4`}
                                    >
                                        <plan.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                                    <p className="text-gray-500 dark:text-dark-400 text-sm mt-1">
                                        {plan.description}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                                    <span className="text-gray-500 dark:text-dark-400 ml-2">/ {plan.period}</span>
                                </div>

                                <ul className="space-y-3 mb-8 flex-1">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3">
                                            <div className="w-5 h-5 bg-primary-100 dark:bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                                            </div>
                                            <span className="text-sm text-gray-600 dark:text-dark-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleUpgrade(plan.id)}
                                    disabled={upgrading === plan.id}
                                    className={`${plan.buttonClass} w-full flex items-center justify-center gap-2`}
                                >
                                    {upgrading === plan.id ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {userData?.plan === plan.id ? "Current Plan" : "Get Started"}
                                            {userData?.plan !== plan.id && (
                                                <ArrowRight className="w-4 h-4" />
                                            )}
                                        </>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* FAQ-like info */}
                    <div className="mt-20 max-w-3xl mx-auto">
                        <div className="glass-card bg-white dark:bg-dark-900/60 border-gray-200 dark:border-dark-700 p-8">
                            <h3 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
                                💡 How Credits Work
                            </h3>
                            <div className="grid sm:grid-cols-3 gap-6 text-center">
                                <div>
                                    <p className="text-2xl font-bold gradient-text">1 Credit</p>
                                    <p className="text-gray-500 dark:text-dark-400 text-sm mt-1">= 1 3D model generation</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold gradient-text">Never Expire</p>
                                    <p className="text-gray-500 dark:text-dark-400 text-sm mt-1">Use at your own pace</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold gradient-text">Stackable</p>
                                    <p className="text-gray-500 dark:text-dark-400 text-sm mt-1">Buy more anytime</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
