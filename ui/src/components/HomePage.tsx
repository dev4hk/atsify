import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Gauge, Workflow, UploadCloud, FileText, SearchCheck, BarChart3 } from "lucide-react";

const HomePage = () => {
    return (
        <div className="px-4 text-white">
            <motion.section
                className="max-w-6xl mx-auto pt-10 pb-10"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <h1 className="text-5xl font-extrabold leading-tight">
                            Optimize your resume with
                            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400"> AI-powered insights</span>
                        </h1>
                        <p className="mt-4 text-lg text-gray-300">
                            Upload your resume and job description. We’ll analyze ATS fit, tone & style, content, structure and skills — then give clear, actionable tips.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Button className="cursor-pointer" asChild>
                                <a href="/analyze">Start Analysis</a>
                            </Button>
                            <Button className="cursor-pointer border-gray-600 bg-gray-700/60 text-gray-100 hover:bg-gray-600/80" variant="outline" asChild>
                                <a href="/contact">Talk to us</a>
                            </Button>
                        </div>
                        <div className="mt-6 flex items-center gap-4 text-sm text-gray-300">
                            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300"/> Secure</div>
                            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-fuchsia-300"/> Actionable Tips</div>
                            <div className="flex items-center gap-2"><Gauge className="h-4 w-4 text-cyan-300"/> Fast Analysis</div>
                        </div>
                    </div>
                    <Card className="bg-gray-800/70 border border-cyan-500/20 shadow-xl">
                        <div className="p-8 grid grid-cols-2 gap-6">
                            <div className="rounded-xl bg-gray-900/60 p-5 border border-gray-700/60">
                                <UploadCloud className="h-6 w-6 text-cyan-300"/>
                                <div className="mt-3 text-gray-200 font-semibold">Upload Resume</div>
                                <p className="text-sm text-gray-400">PDF or DOCX supported</p>
                            </div>
                            <div className="rounded-xl bg-gray-900/60 p-5 border border-gray-700/60">
                                <FileText className="h-6 w-6 text-indigo-300"/>
                                <div className="mt-3 text-gray-200 font-semibold">Paste Job Details</div>
                                <p className="text-sm text-gray-400">Role & description</p>
                            </div>
                            <div className="rounded-xl bg-gray-900/60 p-5 border border-gray-700/60">
                                <SearchCheck className="h-6 w-6 text-emerald-300"/>
                                <div className="mt-3 text-gray-200 font-semibold">AI Review</div>
                                <p className="text-sm text-gray-400">ATS, tone, content</p>
                            </div>
                            <div className="rounded-xl bg-gray-900/60 p-5 border border-gray-700/60">
                                <BarChart3 className="h-6 w-6 text-fuchsia-300"/>
                                <div className="mt-3 text-gray-200 font-semibold">Get Score & Tips</div>
                                <p className="text-sm text-gray-400">Clear next steps</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </motion.section>

            {/* Features */}
            <motion.section
                className="max-w-6xl mx-auto py-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <h2 className="text-2xl font-bold text-indigo-300 mb-4">Why Atsify?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[{
                        icon: <Workflow className="h-6 w-6"/>, title: "ATS-friendly", desc: "Improve parsing success with format and keyword guidance."
                    },{
                        icon: <Sparkles className="h-6 w-6"/>, title: "Actionable tips", desc: "Short, focused improvements with clear explanations."
                    },{
                        icon: <Gauge className="h-6 w-6"/>, title: "Fast & secure", desc: "Quick results with local dev-friendly setup."
                    }].map((f, i)=> (
                        <Card key={i} className="bg-gray-800/70 border border-cyan-500/20">
                            <div className="p-6">
                                <div className="text-cyan-300">{f.icon}</div>
                                <div className="mt-3 text-lg font-semibold text-gray-100">{f.title}</div>
                                <p className="text-sm text-gray-300">{f.desc}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </motion.section>

            {/* How it works */}
            <motion.section
                className="max-w-6xl mx-auto py-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <h2 className="text-2xl font-bold text-indigo-300 mb-4">How it works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {["Upload", "Describe", "Analyze"].map((step, idx) => (
                        <Card key={step} className="bg-gray-800/70 border border-cyan-500/20">
                            <div className="p-6">
                                <div className="text-sm text-cyan-300">Step {idx+1}</div>
                                <div className="mt-2 text-lg font-semibold text-gray-100">{step}</div>
                                <p className="text-sm text-gray-300">
                                    {idx===0 && "Upload your resume file (PDF/DOCX)."}
                                    {idx===1 && "Add job title & paste the job description."}
                                    {idx===2 && "Get your score and tailored improvements."}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            </motion.section>
        </div>
    );
};

export default HomePage;
