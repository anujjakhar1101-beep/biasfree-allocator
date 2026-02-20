import { useAuth } from "@/context/AuthContext";
import { getEmployeeById } from "@/data/mockData";
import { Star, Briefcase, Award, Zap, Activity, Clock } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const emp = getEmployeeById(user?.id || "");

  if (!emp) return <div>Employee not found.</div>;

  const ongoing = emp.projects.filter((p) => p.status === "Ongoing");
  const completed = emp.projects.filter((p) => p.status === "Completed");

  const radarData = emp.skills.map((s) => ({ skill: s.name, value: s.proficiency }));

  const statsCards = [
    { label: "Performance Rating", value: emp.performanceRating.toFixed(1), sub: "out of 5.0", icon: Star, color: "hsl(38 92% 50%)", bg: "hsl(38 100% 94%)" },
    { label: "Total Projects", value: emp.totalProjects, sub: "completed & ongoing", icon: Briefcase, color: "hsl(217 91% 40%)", bg: "hsl(217 80% 95%)" },
    { label: "Certifications", value: emp.certifications.length, sub: "active certifications", icon: Award, color: "hsl(160 60% 38%)", bg: "hsl(160 50% 93%)" },
    { label: "Skill Utilization", value: `${emp.skillUtilization}%`, sub: "across projects", icon: Zap, color: "hsl(270 60% 50%)", bg: "hsl(270 60% 95%)" },
  ];

  const availabilityStyle: Record<string, { bg: string; color: string }> = {
    Available: { bg: "hsl(142 71% 90%)", color: "hsl(142 71% 25%)" },
    Busy: { bg: "hsl(38 100% 90%)", color: "hsl(38 80% 30%)" },
    "On Leave": { bg: "hsl(0 84% 92%)", color: "hsl(0 60% 35%)" },
  };

  const avStyle = availabilityStyle[emp.availability];

  return (
    <div>
      {/* Header */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Good morning, {emp.name.split(" ")[0]} 👋</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Here's your profile overview</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: avStyle.bg, color: avStyle.color }}>
            ● {emp.availability}
          </span>
          <span className="text-sm font-medium px-3 py-1.5 rounded-full" style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
            {emp.experience} yrs exp
          </span>
        </div>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl p-6 mb-6 border border-border" style={{ background: "linear-gradient(135deg, hsl(217 91% 40%), hsl(210 85% 52%))", boxShadow: "var(--shadow-lg)" }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
            {emp.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{emp.name}</h2>
            <p className="text-sm text-white/70 mt-0.5">{emp.id} · {emp.department}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {emp.skills.slice(0, 3).map((s) => (
                <span key={s.name} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{emp.performanceRating}</div>
            <div className="text-white/60 text-xs">Rating</div>
            <div className="flex gap-0.5 justify-end mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(emp.performanceRating) ? "fill-yellow-300 text-yellow-300" : "text-white/30"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
            </div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs font-semibold mt-0.5" style={{ color: "hsl(var(--foreground))" }}>{s.label}</div>
            <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Lower section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skill Radar */}
        <div className="stat-card">
          <h3 className="section-title mb-4">Skill Radar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(220 18% 88%)" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "hsl(220 14% 46%)" }} />
              <Radar name="Proficiency" dataKey="value" stroke="hsl(217 91% 40%)" fill="hsl(217 91% 40%)" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip formatter={(val) => [`${val}%`, "Proficiency"]} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Current workload */}
        <div className="stat-card">
          <h3 className="section-title mb-4">Current Workload</h3>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1.5">
              <span style={{ color: "hsl(var(--muted-foreground))" }}>Workload</span>
              <span className="font-semibold">{emp.workload}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${emp.workload}%` }} />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1.5">
              <span style={{ color: "hsl(var(--muted-foreground))" }}>Skill Utilization</span>
              <span className="font-semibold">{emp.skillUtilization}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill-success" style={{ width: `${emp.skillUtilization}%` }} />
            </div>
          </div>

          <h4 className="text-sm font-semibold mt-5 mb-3" style={{ color: "hsl(var(--foreground))" }}>Ongoing Projects</h4>
          {ongoing.length === 0 ? (
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>No ongoing projects</p>
          ) : (
            <div className="space-y-2">
              {ongoing.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "hsl(var(--muted))" }}>
                  <Activity className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(217 91% 40%)" }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{p.name}</div>
                    <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{p.role}</div>
                  </div>
                  <span className="badge-info">Ongoing</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="stat-card lg:col-span-2">
          <h3 className="section-title mb-4">Recent Completed Projects</h3>
          {completed.length === 0 ? (
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>No completed projects</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Role</th>
                    <th>Skills Used</th>
                    <th>Rating</th>
                    <th>Period</th>
                  </tr>
                </thead>
                <tbody>
                  {completed.map((p) => (
                    <tr key={p.id}>
                      <td className="font-medium">{p.name}</td>
                      <td style={{ color: "hsl(var(--muted-foreground))" }}>{p.role}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {p.skillsUsed.slice(0, 2).map((s) => <span key={s} className="badge-info">{s}</span>)}
                        </div>
                      </td>
                      <td>
                        {p.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-sm">{p.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                          <Clock className="w-3 h-3" />
                          {p.startDate} – {p.endDate || "Present"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
