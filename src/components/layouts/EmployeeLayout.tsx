import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Wrench, Award, FolderKanban, BarChart3, LogOut, BrainCircuit, ChevronLeft, ChevronRight, Menu
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/employee/dashboard" },
  { label: "My Skills", icon: Wrench, path: "/employee/skills" },
  { label: "Certifications", icon: Award, path: "/employee/certifications" },
  { label: "Projects", icon: FolderKanban, path: "/employee/projects" },
  { label: "Performance", icon: BarChart3, path: "/employee/performance" },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b ${collapsed ? "justify-center" : ""}`} style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "hsl(var(--primary))" }}>
          <BrainCircuit className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-sm font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>IRSMS</div>
            <div className="text-xs" style={{ color: "hsl(var(--sidebar-foreground))", opacity: 0.5 }}>Employee Portal</div>
          </div>
        )}
      </div>

      {/* User */}
      {!collapsed && (
        <div className="px-4 py-4 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: "hsl(160 60% 38%)" }}>
              {user?.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">{user?.name}</div>
              <div className="text-xs truncate" style={{ color: "hsl(var(--sidebar-foreground))", opacity: 0.55 }}>{user?.id}</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""} ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <button onClick={handleLogout} className={`nav-item w-full ${collapsed ? "justify-center" : ""}`} style={{ color: "hsl(0 70% 65%)" }}>
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "hsl(var(--background))" }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)} style={{ background: "rgba(0,0,0,0.5)" }} />
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 lg:hidden transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "hsl(var(--sidebar-background))" }}>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 relative ${collapsed ? "w-16" : "w-60"}`}
        style={{ background: "hsl(var(--sidebar-background))" }}>
        <SidebarContent />
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full border flex items-center justify-center z-10"
          style={{ background: "hsl(var(--sidebar-background))", borderColor: "hsl(var(--sidebar-border))", color: "hsl(var(--sidebar-foreground))" }}>
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b bg-card">
          <button onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" style={{ color: "hsl(var(--foreground))" }} />
          </button>
          <span className="font-bold text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>IRSMS</span>
        </div>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
