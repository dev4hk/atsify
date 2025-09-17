import {Card} from "@/components/ui/card.tsx";
import {motion} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Info } from "lucide-react";

const ContactPage = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const name = encodeURIComponent(String(form.get("name") || ""));
        const email = encodeURIComponent(String(form.get("email") || ""));
        const message = encodeURIComponent(String(form.get("message") || ""));
        const body = `From: ${name} (${email})%0D%0A%0D%0A${message}`;
        window.location.href = `mailto:support@resumeinsight.com?subject=ResumeInsight%20Inquiry&body=${body}`;
    };

    return (
        <div className="px-4 text-white">
            <motion.section
                className="max-w-6xl mx-auto pt-10 pb-10"
                initial={{opacity: 0, y: 8}}
                animate={{opacity: 1, y: 0}}
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="bg-gray-800/70 border border-cyan-500/20 shadow-xl">
                        <div className="p-6">
                            <h1 className="text-3xl font-bold text-indigo-300 mb-4">Get in touch</h1>
                            <p className="text-gray-300 mb-6">We'd love to hear from you. Reach out for support, feedback, or partnerships.</p>
                            <ul className="space-y-4 text-gray-200">
                                <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-cyan-300"/> support@atsify.com</li>
                                <li className="flex items-center gap-3"><Phone className="h-5 w-5 text-emerald-300"/> +1 (111) 123-4567</li>
                                <li className="flex items-center gap-3"><MapPin className="h-5 w-5 text-fuchsia-300"/> New York, NY</li>
                            </ul>
                            <div className="mt-6 flex items-center gap-3">
                                <a className="text-gray-300 hover:text-white" href="#" aria-label="Github"><Github className="h-5 w-5"/></a>
                                <a className="text-gray-300 hover:text-white" href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5"/></a>
                                <a className="text-gray-300 hover:text-white" href="#" aria-label="Twitter"><Twitter className="h-5 w-5"/></a>
                            </div>
                        </div>
                    </Card>

                    <Card className="lg:col-span-2 bg-gray-800/70 border border-cyan-500/20 shadow-xl">
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold text-indigo-300">Send us a message</h2>
                            <p className="text-gray-300 text-sm mb-4">We'll get back within 1–2 business days.</p>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-1">
                                    <label className="text-sm text-gray-300" htmlFor="name">Name</label>
                                    <div className="gradient-field mt-1">
                                        <Input id="name" name="name" required className="gradient-input w-full text-gray-200"/>
                                    </div>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="text-sm text-gray-300" htmlFor="email">Email</label>
                                    <div className="gradient-field mt-1">
                                        <Input id="email" type="email" name="email" required className="gradient-input w-full text-gray-200"/>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm text-gray-300" htmlFor="message">Message</label>
                                    <div className="gradient-field mt-1">
                                        <Textarea id="message" name="message" required rows={8} className="gradient-input native-scrollbar w-full text-gray-200 h-[8rem] overflow-y-auto resize-none"/>
                                    </div>
                                </div>
                                <div className="md:col-span-2 flex justify-end">
                                    <Button type="submit" className="text-white border border-cyan-500/30 bg-gradient-to-r from-cyan-500/80 via-indigo-500/80 to-fuchsia-500/80 hover:from-cyan-500 hover:via-indigo-500 hover:to-fuchsia-500">
                                        Send Message
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            </motion.section>

            <motion.section
                className="max-w-6xl mx-auto pb-16"
                initial={{opacity: 0}}
                whileInView={{opacity: 1}}
                viewport={{once: true}}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[{
                        title: "Response time",
                        desc: "Most inquiries are answered within 1–2 business days.",
                    }, {
                        title: "Support hours",
                        desc: "Mon–Fri, 9am–6pm PT (excluding holidays).",
                    }, {
                        title: "Feedback",
                        desc: "Your input helps us improve the product—keep it coming!",
                    }].map((item, i) => (
                        <Card key={i} className="bg-gray-800/70 border border-cyan-500/20">
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-indigo-300"><Info className="h-5 w-5"/>{item.title}</div>
                                <p className="mt-2 text-sm text-gray-300">{item.desc}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </motion.section>
        </div>
    );
};

export default ContactPage;
