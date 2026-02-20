import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getEmployeeById } from "@/data/mockData";
import { FolderKanban, Clock, CheckCircle, Activity } from "lucide-react";

export default function Projects() {
  const { user } = useAuth();
  const emp = getEmployeeById(user?.id || "");
  const [filter, setFilter] = useState<"All" | "Completed" | "Ongoing">("All");

  const allProjects = emp?.projects || [];
  const filtered = filter === "All" ? allProjects : allProjects.filter((p) => p.status === filter);

  const tabs = [
    { label: "All", count: allProjects.length },
    { label: "Ongoing", count: allProjects.filter((p) => p.status === "Ongoing").length },
    { label: "Completed", count: allProjects.filter((p) => p.status === "Completed").length },
  ];

  return (
    <div>
      <div className="page-header mb-8">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>My Projects</h1>
        <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Track your project history and current assignments</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Projects", val: allProjects.length, icon: FolderKanban, color: "hsl(var(--primary))", bg: "hsl(217 80% 95%)" },
          { label: "Ongoing", val: allProjects.filter((p) => p.status === "Ongoing").length, icon: Activity, color: "hsl(38 92% 50%)", bg: "hsl(38 100% 94%)" },
          { label: "Completed", val: allProjects.filter((p) => p.status === "Completed").length, icon: CheckCircle, color: "hsl(var(--success))", bg: "hsl(160 50% 93%)" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: s.bg }}>
              <s.icon className="w-4.5 h-4.5" style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</div>
            <div className="text-xs font-medium mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {tabs.map((t) => (
          <button key={t.label}
            onClick={() => setFilter(t.label as any)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={filter === t.label
              ? { background: "hsl(var(--primary))", color: "white" }
              : { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
            {t.label}
            <span className="text-xs px-1.5 py-0.5 rounded-full" style={filter === t.label
              ? { background: "rgba(255,255,255,0.25)" }
              : { background: "rgba(0,0,0,0.08)" }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Project cards */}
      <div className="space-y-4">
        {filtered.map((project) => (
          <div key={project.id} className="stat-card">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold">{project.name}</h3>
                  {project.status === "Ongoing"
                    ? <span className="badge-warning">Ongoing</span>
                    : <span className="badge-success">Completed</span>}
                </div>
                <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Role: <span className="font-medium" style={{ color: "hsl(var(--foreground))" }}>{project.role}</span>
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {project.skillsUsed.map((s) => <span key={s} className="badge-info">{s}</span>)}
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-2">
                {project.rating && (
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-3 h-3 rounded-sm" style={{
                          background: i <= Math.round(project.rating!) ? "hsl(38 92% 50%)" : "hsl(220 18% 88%)"
                        }} />
                      ))}
                    </div>
                    <span className="font-bold text-sm">{project.rating.toFixed(1)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                  <Clock className="w-3 h-3" />
                  {project.startDate} → {project.endDate || "Present"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <FolderKanban className="w-12 h-12 mx-auto mb-3" style={{ color: "hsl(var(--muted-foreground))" }} />
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>No projects found.</p>
        </div>
      )}
    </div>
  );
}
