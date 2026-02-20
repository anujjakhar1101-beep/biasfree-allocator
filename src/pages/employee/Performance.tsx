import { useAuth } from "@/context/AuthContext";
import { getEmployeeById } from "@/data/mockData";
import { Star, TrendingUp, Zap, Target } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["hsl(217,91%,40%)", "hsl(160,60%,38%)", "hsl(38,92%,50%)", "hsl(270,60%,50%)", "hsl(0,70%,55%)"];

export default function Performance() {
  const { user } = useAuth();
  const emp = getEmployeeById(user?.id || "");
  if (!emp) return null;

  const completed = emp.projects.filter((p) => p.status === "Completed" && p.rating);

  const ratingHistory = completed.map((p) => ({ name: p.name.split(" ").slice(0, 2).join(" "), rating: p.rating! }));

  const skillDistData = emp.skills.map((s) => ({ name: s.name, value: s.proficiency }));

  const avgRating = completed.length
    ? (completed.reduce((sum, p) => sum + (p.rating || 0), 0) / completed.length).toFixed(2)
    : "N/A";

  const statsCards = [
    { label: "Avg Rating", value: avgRating, icon: Star, color: "hsl(38 92% 50%)", bg: "hsl(38 100% 94%)" },
    { label: "Projects Done", value: emp.totalProjects, icon: TrendingUp, color: "hsl(var(--primary))", bg: "hsl(217 80% 95%)" },
    { label: "Skill Utilization", value: `${emp.skillUtilization}%`, icon: Zap, color: "hsl(var(--success))", bg: "hsl(160 50% 93%)" },
    { label: "Current Workload", value: `${emp.workload}%`, icon: Target, color: "hsl(270 60% 50%)", bg: "hsl(270 60% 95%)" },
  ];

  return (
    <div>
      <div className="page-header mb-8">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Performance Overview</h1>
        <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Your career metrics and performance analytics</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: s.bg }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs font-medium mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Rating history */}
        <div className="stat-card">
          <h3 className="section-title mb-4">Project Ratings History</h3>
          {ratingHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ratingHistory} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 18% 88%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(220 14% 46%)" }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: "hsl(220 14% 46%)" }} />
                <Tooltip formatter={(v) => [`${v}`, "Rating"]} />
                <Bar dataKey="rating" fill="hsl(217 91% 40%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-center py-10" style={{ color: "hsl(var(--muted-foreground))" }}>No ratings yet</p>
          )}
        </div>

        {/* Skill distribution */}
        <div className="stat-card">
          <h3 className="section-title mb-4">Skill Proficiency Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={skillDistData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={40}
                label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
                {skillDistData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, "Proficiency"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skill proficiency bars */}
      <div className="stat-card">
        <h3 className="section-title mb-4">Skill Proficiency Breakdown</h3>
        <div className="space-y-4">
          {emp.skills.map((skill) => (
            <div key={skill.name}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium">{skill.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{skill.level}</span>
                  <span className="font-bold" style={{ color: "hsl(var(--primary))" }}>{skill.proficiency}%</span>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${skill.proficiency}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
