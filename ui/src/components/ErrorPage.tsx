import { useLocation, Link } from "react-router-dom";

const ErrorPage = () => {
    const location = useLocation();
    const message = (location.state as any)?.message || "Something went wrong.";

    return (
        <div className="max-w-xl mx-auto text-center py-20">
            <h2 className="text-3xl font-bold mb-4 text-red-600">Error</h2>
            <p className="mb-6">{message}</p>
            <Link to="/" className="btn-primary">Go Home</Link>
        </div>
    );
};

export default ErrorPage;
