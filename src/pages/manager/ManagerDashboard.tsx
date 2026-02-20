import { employees, projects } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Briefcase, CheckCircle, Clock, AlertCircle, Users } from "lucide-react";

const PIE_COLORS = ["hsl(160,60%,38%)", "hsl(217,91%,40%)", "hsl(38,92%,50%)"];

const statusBadge = (status: string) => {
  if (status === "Completed") return <span className="badge-success">{status}</span>;
  if (status === "Ongoing") return <span className="badge-warning">{status}</span>;
  return <span className="badge-info">{status}</span>;
};

const priorityBadge = (priority: string) => {
  if (priority === "Critical") return <span className="badge-danger">{priority}</span>;
  if (priority === "High") return <span className="badge-warning">{priority}</span>;
  if (priority === "Medium") return <span className="badge-info">{priority}</span>;
  return <span className="badge-muted">{priority}</span>;
};

export default function ManagerDashboard() {
  const completed = projects.filter((p) => p.status === "Completed");
  const ongoing = projects.filter((p) => p.status === "Ongoing");
  const upcoming = projects.filter((p) => p.status === "Upcoming");

  const pieData = [
    { name: "Completed", value: completed.length },
    { name: "Ongoing", value: ongoing.length },
    { name: "Upcoming", value: upcoming.length },
  ];

  const empAvailability = [
    { name: "Available", value: employees.filter((e) => e.availability === "Available").length },
    { name: "Busy", value: employees.filter((e) => e.availability === "Busy").length },
    { name: "On Leave", value: employees.filter((e) => e.availability === "On Leave").length },
  ];

  const avgRatingByEmp = employees.map((e) => ({
    id: e.id,
    rating: e.performanceRating,
  }));

  const statsCards = [
    { label: "Total Projects", value: projects.length, icon: Briefcase, color: "hsl(var(--primary))", bg: "hsl(217 80% 95%)" },
    { label: "Completed", value: completed.length, icon: CheckCircle, color: "hsl(var(--success))", bg: "hsl(160 50% 93%)" },
    { label: "Ongoing", value: ongoing.length, icon: Clock, color: "hsl(38 92% 50%)", bg: "hsl(38 100% 94%)" },
    { label: "Upcoming", value: upcoming.length, icon: AlertCircle, color: "hsl(270 60% 50%)", bg: "hsl(270 60% 95%)" },
    { label: "Total Employees", value: employees.length, icon: Users, color: "hsl(217 91% 40%)", bg: "hsl(217 80% 95%)" },
  ];

  return (
    <div>
      <div className="page-header mb-8">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Manager Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Project and team overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {statsCards.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: s.bg }}>
              <s.icon className="w-4.5 h-4.5" style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs font-medium mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="stat-card">
          <h3 className="section-title mb-4">Project Status</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="section-title mb-4">Employee Availability</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={empAvailability} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} paddingAngle={3}>
                {empAvailability.map((_, i) => <Cell key={i} fill={["hsl(160,60%,38%)", "hsl(38,92%,50%)", "hsl(0,70%,55%)"][i]} />)}
              </Pie>
              <Tooltip />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="section-title mb-4">Employee Ratings</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={avgRatingByEmp} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 18% 88%)" />
              <XAxis dataKey="id" tick={{ fontSize: 9, fill: "hsl(220 14% 46%)" }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 9, fill: "hsl(220 14% 46%)" }} />
              <Tooltip />
              <Bar dataKey="rating" fill="hsl(217 91% 40%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Projects table */}
      <div className="stat-card">
        <h3 className="section-title mb-4">All Projects</h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Category</th>
                <th>Deadline</th>
                <th>Employees</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{p.description.slice(0, 50)}…</div>
                  </td>
                  <td>{statusBadge(p.status)}</td>
                  <td>{priorityBadge(p.priority)}</td>
                  <td><span className="badge-muted">{p.category}</span></td>
                  <td className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{p.deadline}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {p.assignedEmployees.length > 0
                        ? p.assignedEmployees.map((id) => (
                          <span key={id} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "hsl(217 80% 92%)", color: "hsl(217 70% 30%)" }}>{id}</span>
                        ))
                        : <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Unassigned</span>
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
