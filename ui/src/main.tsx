import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from "./components/Layout";
import HomePage from "./components/HomePage";
import AnalyzePage, { analyzeAction } from "./components/AnalyzePage";
import ContactPage, { contactAction } from "./components/ContactPage";
import ResultPage, { resultLoader } from "./components/ResultPage";
import ErrorPage from "./components/ErrorPage";

const routes = createRoutesFromElements(
  <Route element={<Layout />} errorElement={<ErrorPage />}>
    <Route index element={<HomePage />} />
    <Route path="/" element={<HomePage />} />
    <Route path="/analyze" element={<AnalyzePage />} action={analyzeAction} />
    <Route path="/contact" element={<ContactPage />} action={contactAction} />
    <Route path="/result" element={<ResultPage />} loader={resultLoader} />
  </Route>
);

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      draggable
      pauseOnHover
      theme={localStorage.getItem("theme") === "dark" ? "dark" : "light"}
      transition={Bounce}
    />
  </StrictMode>,
)
