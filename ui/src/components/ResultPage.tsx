import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const analysis = (location.state as any)?.analysis;

    if (!analysis) {
        navigate("/error", { state: { message: "You cannot access this page directly." } });
        return null;
    }

    const categories = Object.entries(analysis)
        .filter(([key]) => key !== "overallScore");

    const getBadgeClass = (type?: string) => {
        if (!type) return "bg-gray-700/60 text-gray-200";
        const t = type.toLowerCase();
        if (t === "good") return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
        if (t === "improve") return "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30";
        return "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30";
    };

    const handleBack = () => navigate("/analyze");
    const handleCopyTips = async () => {
        try {
            const allTips = categories.flatMap(([, value]: any) => (value?.tips ?? [])).slice(0, 20);
            const text = allTips
                .map((t: any, i: number) => `${i + 1}. [${t?.type ?? "tip"}] ${t?.tip}\n   - ${t?.explanation ?? ""}`)
                .join("\n\n");
            await navigator.clipboard.writeText(text || "No tips available");
            toast.success("Tips copied to clipboard");
        } catch {
            toast.error("Failed to copy tips");
        }
    };
    const handleDownloadJSON = () => {
        const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resume-analysis.json";
        a.click();
        URL.revokeObjectURL(url);
    };
    const handlePrint = () => window.print();
    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({ title: "Resume Analysis", text: "Check out my resume analysis.", url: window.location.href });
            } else {
                await handleCopyTips();
            }
        } catch {
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div className="max-w-6xl mx-auto px-4 mb-8" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="sticky top-20 z-10 mb-6">
                <div className="flex flex-wrap items-center gap-2 rounded-xl bg-gray-800/70 border border-cyan-500/20 p-3 backdrop-blur-sm shadow-lg">
                    <Button
                        variant="outline"
                        className="border-gray-600 bg-gray-700/60 text-gray-100 hover:bg-gray-600/80"
                        onClick={handleBack}
                    >
                        Back to Analyze
                    </Button>
                    <div className="ml-auto flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="border-gray-600 bg-gray-700/60 text-gray-100 hover:bg-gray-600/80"
                            onClick={handleCopyTips}
                        >
                            Copy Tips
                        </Button>
                        <Button
                            variant="outline"
                            className="border-gray-600 bg-gray-700/60 text-gray-100 hover:bg-gray-600/80"
                            onClick={handleDownloadJSON}
                        >
                            Download JSON
                        </Button>
                        <Button
                            variant="outline"
                            className="border-gray-600 bg-gray-700/60 text-gray-100 hover:bg-gray-600/80"
                            onClick={handlePrint}
                        >
                            Print
                        </Button>
                        <Button
                            className="text-white border border-cyan-500/30 bg-gradient-to-r from-cyan-500/80 via-indigo-500/80 to-fuchsia-500/80 hover:from-cyan-500 hover:via-indigo-500 hover:to-fuchsia-500"
                            onClick={handleShare}
                        >
                            Share
                        </Button>
                    </div>
                </div>
            </div>

            <motion.div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch" variants={containerVariants} initial="hidden" animate="show">
                <motion.div variants={itemVariants}>
                    <Card className="lg:col-span-1 bg-gray-800/70 border border-cyan-500/20 shadow-xl">
                        <CardContent className="p-6 flex items-center justify-center">
                            <div className="relative flex items-center justify-center h-40 w-40 rounded-full">
                                <div className="absolute inset-0 rounded-full bg-[conic-gradient(var(--tw-gradient-stops))] from-cyan-400 via-indigo-400 to-fuchsia-400 opacity-30" />
                                <div className="relative h-36 w-36 rounded-full bg-gray-900/80 border border-cyan-500/20 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-5xl font-extrabold text-indigo-300">{analysis.overallScore ?? "-"}</div>
                                        <div className="text-sm text-gray-300 mt-1">Overall Score</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className="bg-gray-800/70 border border-cyan-500/20 shadow-xl">
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-bold text-indigo-300 mb-2">Analysis Summary</h2>
                            <p className="text-gray-300">
                                We evaluated your resume across ATS compatibility, tone & style, content, structure, and skills.
                                Tips are color-coded: <span className="text-emerald-300">Good</span> and <span className="text-fuchsia-300">Improve</span>.
                            </p>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                {categories.map(([key, value]: any) => (
                                    <div key={key} className="flex items-center justify-between bg-gray-900/60 rounded-md px-3 py-2 border border-gray-700/60">
                                        <span className="capitalize text-gray-200">{key}</span>
                                        {typeof value?.score === "number" ? (
                                            <span className="text-indigo-300 font-semibold">{value.score}</span>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants} initial="hidden" animate="show">
                {categories.map(([key, value]: any) => (
                    <motion.div key={key} variants={itemVariants}>
                        <Card className="bg-gray-800/70 border border-cyan-500/20 shadow-xl">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold capitalize text-indigo-300">{key === "ats" ? "ATS" : key === "toneAndStyle" ? "tone and style" : key}</h3>
                                    {typeof value?.score === "number" && (
                                        <span className="text-sm text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-full">Score: {value.score}</span>
                                    )}
                                </div>

                                {Array.isArray(value?.tips) && value.tips.length > 0 ? (
                                    <ul className="space-y-3">
                                        {value.tips.slice(0, 4).map((tip: any, idx: number) => (
                                            <li key={idx} className="rounded-lg p-4 bg-gray-900/60 border border-gray-700/60">
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getBadgeClass(tip?.type)}`}>
                                                        {tip?.type ?? "tip"}
                                                    </span>
                                                    <span className="text-sm text-gray-400">#{idx + 1}</span>
                                                </div>
                                                <p className="mt-2 font-medium text-gray-100">{tip?.tip}</p>
                                                {tip?.explanation && (
                                                    <p className="mt-1 text-sm text-gray-300">{tip.explanation}</p>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-400">No tips available.</p>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default ResultPage;
