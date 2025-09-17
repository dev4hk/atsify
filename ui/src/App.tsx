import {Routes, Route} from "react-router-dom";
import Layout from "./components/Layout.tsx";
import HomePage from "./components/HomePage.tsx";
import AnalyzePage from "./components/AnalyzePage.tsx";
import ContactPage from "./components/ContactPage.tsx";
import ErrorPage from "./components/ErrorPage.tsx";
import ResultPage from "@/components/ResultPage.tsx";

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/analyze" element={<AnalyzePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/result" element={<ResultPage />} />
                <Route path="*" element={<ErrorPage />} />
            </Route>
        </Routes>
    );
}

export default App;
