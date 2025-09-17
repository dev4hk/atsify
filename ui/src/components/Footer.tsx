const Footer = () => {
    return (
        <footer className="w-full mt-auto">
            <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500/40 via-indigo-500/40 to-fuchsia-500/40" />
            <div className="bg-gray-900/70 backdrop-blur-md border-t border-cyan-500/20 py-6 text-center text-gray-400">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                        <p className="text-sm"> {new Date().getFullYear()} Atsify. All rights reserved.</p>
                        <p className="text-sm">
                            Built with <span className="text-cyan-300">React</span>, <span className="text-indigo-300">Tailwind</span>, <span className="text-fuchsia-300">ShadCN</span>, <span className="text-cyan-300">Framer Motion</span> & <span className="text-fuchsia-300">Spring Boot</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
