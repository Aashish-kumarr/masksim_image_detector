import { Routes, Route } from "react-router-dom";
import AppShell from "./components/common/AppShell";
import HomePage from "./pages/HomePage";
import AnalyzePage from "./pages/AnalyzePage";
import AnalysisPage from "./pages/AnalysisPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import ModelPage from "./pages/ModelPage";
import DatasetPage from "./pages/DatasetPage";
import PerformancePage from "./pages/PerformancePage";
import HistoryPage from "./pages/HistoryPage";
import LimitationsPage from "./pages/LimitationsPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/analysis/:id" element={<AnalysisPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/model" element={<ModelPage />} />
        <Route path="/dataset" element={<DatasetPage />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/limitations" element={<LimitationsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}
