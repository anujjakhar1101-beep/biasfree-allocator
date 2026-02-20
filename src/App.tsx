import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

import EmployeeLayout from "./components/layouts/EmployeeLayout";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import MySkills from "./pages/employee/MySkills";
import Certifications from "./pages/employee/Certifications";
import Projects from "./pages/employee/Projects";
import Performance from "./pages/employee/Performance";

import ManagerLayout from "./components/layouts/ManagerLayout";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import EmployeeManagement from "./pages/manager/EmployeeManagement";
import AddProject from "./pages/manager/AddProject";
import MatchResults from "./pages/manager/MatchResults";

const queryClient = new QueryClient();

function EmployeeGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "employee") return <Navigate to="/manager/dashboard" replace />;
  return <EmployeeLayout>{children}</EmployeeLayout>;
}

function ManagerGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "manager") return <Navigate to="/employee/dashboard" replace />;
  return <ManagerLayout>{children}</ManagerLayout>;
}

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "manager"
    ? <Navigate to="/manager/dashboard" replace />
    : <Navigate to="/employee/dashboard" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />

            {/* Employee routes */}
            <Route path="/employee/dashboard" element={<EmployeeGuard><EmployeeDashboard /></EmployeeGuard>} />
            <Route path="/employee/skills" element={<EmployeeGuard><MySkills /></EmployeeGuard>} />
            <Route path="/employee/certifications" element={<EmployeeGuard><Certifications /></EmployeeGuard>} />
            <Route path="/employee/projects" element={<EmployeeGuard><Projects /></EmployeeGuard>} />
            <Route path="/employee/performance" element={<EmployeeGuard><Performance /></EmployeeGuard>} />

            {/* Manager routes */}
            <Route path="/manager/dashboard" element={<ManagerGuard><ManagerDashboard /></ManagerGuard>} />
            <Route path="/manager/employees" element={<ManagerGuard><EmployeeManagement /></ManagerGuard>} />
            <Route path="/manager/add-project" element={<ManagerGuard><AddProject /></ManagerGuard>} />
            <Route path="/manager/match-results" element={<ManagerGuard><MatchResults /></ManagerGuard>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
