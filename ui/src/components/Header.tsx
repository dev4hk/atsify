import {NavLink, Link} from "react-router-dom";

const Header = () => {
    return (
        <header className="w-full fixed top-0 z-50">
            <div className="bg-gray-900/70 backdrop-blur-md border-b border-cyan-500/20 shadow-lg">
                <div className="container mx-auto flex items-center justify-between py-4 px-6">
                    <Link to="/" className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400">
                        Atsify
                    </Link>
                    <nav className="flex gap-6 items-center">
                        <NavLink
                            to="/"
                            className={({isActive}) =>
                                `text-gray-300 hover:text-cyan-300 transition-colors ${isActive ? "text-cyan-300" : ""}`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/analyze"
                            className={({isActive}) =>
                                `text-gray-300 hover:text-indigo-300 transition-colors ${isActive ? "text-indigo-300" : ""}`
                            }
                        >
                            Analyze
                        </NavLink>
                        <NavLink
                            to="/contact"
                            className={({isActive}) =>
                                `text-gray-300 hover:text-fuchsia-300 transition-colors ${isActive ? "text-fuchsia-300" : ""}`
                            }
                        >
                            Contact
                        </NavLink>
                    </nav>
                </div>
            </div>
            <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500/40 via-indigo-500/40 to-fuchsia-500/40" />
        </header>
    );
};

export default Header;
