import { Link, useNavigate, useRouteError, isRouteErrorResponse } from "react-router-dom";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const ErrorPage = () => {
  const navigate = useNavigate();
  const routeError = useRouteError();

  let title = "Something went wrong";
  let description = "An unexpected error occurred. Please try again.";
  let code: number | string | undefined;

  if (isRouteErrorResponse(routeError)) {
    code = routeError.status;
    title = routeError.statusText || title;
    const data = (routeError as any).data;
    if (typeof data === "string" && data.trim().length > 0) {
      description = data;
    }
  } else if (routeError instanceof Error) {
    description = routeError.message || description;
  } else if (typeof routeError === "string") {
    description = routeError;
  }

  return (
    <div className="relative flex flex-col min-h-screen text-gray-100">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_50%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(600px_400px_at_100%_20%,rgba(20,184,166,0.18),transparent),linear-gradient(180deg,#0b1220_0%,#0b1220_35%,#111827_100%)]" />
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-3xl"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-fuchsia-500/20 blur-2xl rounded-3xl" aria-hidden />

          <div className="relative rounded-3xl border border-cyan-500/20 bg-gray-900/80 shadow-2xl backdrop-blur-md p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <div>
                <div className="text-sm uppercase tracking-wide text-gray-400">{code ?? "Error"}</div>
                <h1 className="mt-1 text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300">
                  {title}
                </h1>
              </div>
            </div>

            <p className="mt-5 text-gray-300 leading-relaxed">{description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-800/70 px-4 py-2 text-gray-100 hover:bg-gray-700/70 hover:border-gray-500 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-gradient-to-r from-cyan-500/80 via-indigo-500/80 to-fuchsia-500/80 px-4 py-2 text-white hover:from-cyan-500 hover:via-indigo-500 hover:to-fuchsia-500 transition-all"
              >
                <Home className="h-4 w-4" /> Go Home
              </Link>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              If the problem persists, please try again later.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorPage;
