import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import TeamsPage from "../pages/TeamsPage";
import CreateChampionshipPage from "../pages/CreateChampionshipPage";
import SimulationPage from "../pages/SimulationPage.jsx";

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/teams" element={<TeamsPage />} />
                <Route path="/championship" element={<CreateChampionshipPage />} />
                <Route path="/simulate" element={<SimulationPage />} />
            </Routes>
        </Router>
    );
}