import {type ChangeEvent, useEffect, useRef, useState} from "react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {motion} from "framer-motion";
import {Form, useActionData, useNavigate, useNavigation} from "react-router-dom";
import {api, getErrorMessage} from "@/lib/api";
import {toast} from "react-toastify";
import {FileText, Info, UploadCloud} from "lucide-react";

const AnalyzePage = () => {
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const formRef = useRef<HTMLFormElement | null>(null)
    const navigate = useNavigate();

    useEffect(() => {
        if (!actionData) return;
        
        if (actionData.success) {
            toast.success("Resume analysis complete!", { autoClose: 2500 });
            if (actionData.redirectTo) {
                navigate(actionData.redirectTo);
            }
        } else if (actionData.errors) {
            setErrors(actionData.errors);
            const firstError = Object.keys(actionData.errors)[0];
            if (firstError) {
                const element = document.getElementsByName(firstError)[0];
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else if (actionData.errorMessage) {
            toast.error(actionData.errorMessage, { autoClose: 5000 });
        }
    }, [actionData, navigate]);

    const handleInputFocus = (field: string) => {
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            const validMime = /^(application\/pdf|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|application\/msword)$/i.test(file.type);
            const validExt = /\.(pdf|docx?)$/i.test(file.name);
            if (!validMime && !validExt) {
                toast.error("Please upload a PDF or DOC/DOCX file.");
                e.currentTarget.value = "";
                setResumeFile(null);
                return;
            }
        }
        setResumeFile(file);
    }

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        const validMime = /^(application\/pdf|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|application\/msword)$/i.test(file.type);
        const validExt = /\.(pdf|docx?)$/i.test(file.name);

        if (!validMime && !validExt) {
            toast.error("Please upload a PDF or DOC/DOCX file.");
            return;
        }

        setResumeFile(file);

        const input = document.getElementById("resume-upload") as HTMLInputElement | null;
        if (input) {
            const dt = new DataTransfer();
            dt.items.add(file);
            input.files = dt.files;
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4">
            <motion.div
                className="w-full max-w-6xl text-center mb-8"
                initial={{opacity: 0, y: -12}}
                animate={{opacity: 1, y: 0}}
            >
                <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400">Analyze
                    Your Resume</h2>
                <p className="mt-2 text-gray-300 max-w-2xl mx-auto">Provide your job details and upload your resume.
                    We’ll evaluate ATS compatibility, tone & style, content, structure, and skills, then generate clear,
                    actionable tips.</p>
            </motion.div>

            <Form method="post" encType="multipart/form-data"
                  className="grid w-full max-w-6xl grid-cols-1 lg:grid-cols-2 gap-6" ref={formRef}>
                <Card className="p-6 bg-gray-800/80 backdrop-blur-md shadow-lg border border-cyan-500/20">
                    <div className="space-y-2">
                        <label className="block text-left text-sm text-gray-300">Job Title</label>
                        <div className="gradient-field">
                            <div className="relative">
                                <Input
                                    placeholder="e.g., Java Backend Engineer"
                                    name="role"
                                    required
                                    onFocus={() => handleInputFocus("role")}
                                    className="gradient-input w-full pr-10 text-gray-200"
                                />
                                <FileText className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                            </div>
                        </div>
                        {errors["role"] && (
                            <div className="text-xs text-red-400 mt-1">{errors["role"]}</div>
                        )}

                        <div className="pt-2 space-y-2">
                            <label className="block text-left text-sm text-gray-300">Job Description</label>
                            <div className="gradient-field">
                                <Textarea
                                    placeholder="Paste the job description here..."
                                    name="jobDescription"
                                    required
                                    onFocus={() => handleInputFocus("jobDescription")}
                                    rows={14}
                                    className="gradient-input native-scrollbar text-gray-200 h-[13rem] overflow-y-auto resize-none"
                                />
                            </div>
                            {errors["jobDescription"] && (
                                <div className="text-xs text-red-400 mt-1">{errors["jobDescription"]}</div>
                            )}
                            <div className="mt-2 text-xs text-gray-400 flex items-center gap-2">
                                <Info className="h-3.5 w-3.5"/>
                                Include responsibilities, required skills, and keywords.
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-gray-800/80 backdrop-blur-md shadow-lg border border-cyan-500/20">
                    <div className="space-y-2">
                        <label className="block text-left text-sm text-gray-300">Resume File</label>
                        <input
                            id="resume-upload"
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                            name="file"
                            onChange={(e) => handleFileChange(e)}
                            className="hidden"
                        />

                        <label
                            htmlFor="resume-upload"
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onDrop={(e) => handleDrop(e)}
                            className="cursor-pointer flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-600 bg-gray-900/60 px-6 py-12 hover:border-cyan-500/60 hover:bg-gray-900/70 transition"
                        >
                            <UploadCloud className="h-8 w-8 text-cyan-300"/>
                            <div className="text-gray-100 font-medium">Drag & drop your resume here</div>
                            <div className="text-sm text-gray-400">or click to upload (PDF/DOC/DOCX)</div>
                            {resumeFile && (
                                <div className="mt-2 text-xs text-gray-300">Selected: {resumeFile.name}</div>
                            )}
                        </label>
                        {errors["file"] && (
                            <div className="text-xs text-red-400 mt-1">{errors["file"]}</div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>Supported: PDF, DOC, DOCX</span>
                            <span>Max size: ~10MB</span>
                        </div>

                        <Button
                            className="w-full text-white border border-cyan-500/30 bg-gradient-to-r from-cyan-500/80 via-indigo-500/80 to-fuchsia-500/80 hover:from-cyan-500 hover:via-indigo-500 hover:to-fuchsia-500"
                            disabled={isSubmitting}
                            type="submit"
                        >
                            {isSubmitting ? "Analyzing..." : "Analyze Resume"}
                        </Button>

                        <div className="text-xs text-gray-400 flex items-start gap-2">
                            <Info className="h-3.5 w-3.5 mt-0.5"/>
                            Your file is processed securely and only used to generate your analysis.
                        </div>
                    </div>
                </Card>
            </Form>

            {isSubmitting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.3}}
                        className="w-full max-w-md rounded-2xl border border-cyan-500/20 bg-gray-900/80 p-8 shadow-2xl"
                    >
                        <div className="flex flex-col items-center text-center gap-5">
                            <motion.div
                                className="relative h-14 w-14"
                                initial={{rotate: 0}}
                                animate={{rotate: 360}}
                                transition={{repeat: Infinity, duration: 1.4, ease: "linear"}}
                            >
                                <svg viewBox="0 0 24 24" className="h-14 w-14 text-cyan-400">
                                    <circle cx="12" cy="12" r="10" className="opacity-20" stroke="currentColor"
                                            strokeWidth="3" fill="none"/>
                                    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3"
                                          strokeLinecap="round" fill="none"/>
                                </svg>
                            </motion.div>

                            <div>
                                <h3 className="text-xl font-semibold text-indigo-300">Analyzing your resume…</h3>
                                <p className="mt-1 text-sm text-gray-300">Extracting details, matching keywords, and
                                    generating insights.</p>
                            </div>

                            <div className="relative w-full h-2 overflow-hidden rounded-full bg-gray-700/70">
                                <motion.div
                                    className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400"
                                    initial={{x: "-100%"}}
                                    animate={{x: ["-100%", "120%"]}}
                                    transition={{repeat: Infinity, duration: 1.6, ease: "easeInOut"}}
                                />
                            </div>

                            <div className="mt-2 h-6 text-sm text-gray-400">
                                <motion.span
                                    key={isSubmitting ? "tip" : ""}
                                    initial={{opacity: 0, y: 4}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{duration: 0.3}}
                                >
                                    Pro tip: Clear, quantifiable achievements help ATS and recruiters.
                                </motion.span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AnalyzePage;

export async function analyzeAction({request}: { request: Request }) {
    const form = await request.formData();
    const role = String(form.get("role") || "").trim();
    const jobDescription = String(form.get("jobDescription") || "").trim();
    const file = form.get("file") as File | null;

    const errors: Record<string, string> = {};
    if (!role) errors["role"] = "Job title is required";
    if (!jobDescription) errors["jobDescription"] = "Job description is required";
    if (!file) errors["file"] = "Resume file is required";

    if (Object.keys(errors).length > 0) {
        return { success: false, errors };
    }

    const payload = new FormData();
    payload.append("file", file as Blob);
    payload.append("job", new Blob([JSON.stringify({role, jobDescription})], {type: "application/json"}));

    try {
        const {data} = await api.post("/api/resume/analyze", payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const key = (crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`);
        sessionStorage.setItem(`analysis:${key}`, JSON.stringify(data));

        return {
            success: true,
            redirectTo: `/result?key=${encodeURIComponent(key)}`
        };

    } catch (error: any) {
        console.error("Analysis error:", error);

        if (error.response?.status === 400 && error.response?.data) {
            if (typeof error.response.data === 'object' && !Array.isArray(error.response.data)) {
                return {
                    success: false,
                    errors: error.response.data
                };
            }
        }

        return {
            success: false,
            errorMessage: getErrorMessage(error) || "An error occurred while analyzing your resume. Please try again."
        };
    }
}