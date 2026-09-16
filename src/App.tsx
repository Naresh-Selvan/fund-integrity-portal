import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import NewProject from "@/pages/NewProject";
import ProjectDetail from "@/pages/ProjectDetail";
import Investigations from "@/pages/Investigations";
import InvestigationDetail from "@/pages/InvestigationDetail";
import Contractors from "@/pages/Contractors";
import Funds from "@/pages/Funds";
import GISMap from "@/pages/GISMap";
import Alerts from "@/pages/Alerts";
import Reports from "@/pages/Reports";
import Complaints from "@/pages/Complaints";
import Settings from "@/pages/Settings";
import { CitizenLayout, CitizenHome, CitizenProject, CitizenComplaint } from "@/pages/Citizen";

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/new" element={<NewProject />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="investigations" element={<Investigations />} />
          <Route path="investigations/:id" element={<InvestigationDetail />} />
          <Route path="contractors" element={<Contractors />} />
          <Route path="funds" element={<Funds />} />
          <Route path="gis-map" element={<GISMap />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* Public Citizen Portal Routes */}
        <Route path="/citizen" element={<CitizenLayout />}>
          <Route index element={<CitizenHome />} />
          <Route path="project/:id" element={<CitizenProject />} />
          <Route path="complaint" element={<CitizenComplaint />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
