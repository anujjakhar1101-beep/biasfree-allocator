import { useState } from "react";
import { employees, getEmployeeById } from "@/data/mockData";
import { Star, Search, ChevronDown, ChevronUp, Award, Briefcase } from "lucide-react";

export default function EmployeeManagement() {
  const [search, setSearch] = useState("");
  const [availFilter, setAvailFilter] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const filtered = employees.filter((e) => {
    const matchSearch = e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.skills.some((s) => s.name.toLowerCase().includes(search.toLowerCase()));
    const matchAvail = availFilter === "All" || e.availability === availFilter;
    return matchSearch && matchAvail;
  });

  const availStyle: Record<string, string> = {
    Available: "badge-success",
    Busy: "badge-warning",
    "On Leave": "badge-danger",
  };

  const levelColor: Record<string, string> = {
    Expert: "badge-success",
    Advanced: "badge-warning",
    Intermediate: "badge-info",
    Beginner: "badge-muted",
  };

  return (
    <div>
      <div className="page-header mb-8">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Employee Management</h1>
        <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>View profiles, skills, certifications and rate employees</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
          <input type="text" placeholder="Search by ID or skill..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
            style={{ border: "1.5px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
        </div>
        <div className="flex gap-2">
          {["All", "Available", "Busy", "On Leave"].map((a) => (
            <button key={a} onClick={() => setAvailFilter(a)}
              className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={availFilter === a
                ? { background: "hsl(var(--primary))", color: "white" }
                : { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Employee list */}
      <div className="space-y-3">
        {filtered.map((emp) => {
          const isExp = expanded === emp.id;
          return (
            <div key={emp.id} className="stat-card">
              {/* Header row */}
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(isExp ? null : emp.id)}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0" style={{ background: "hsl(var(--primary))" }}>
                  {emp.id.slice(-1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold">{emp.id}</span>
                    <span className={availStyle[emp.availability]}>{emp.availability}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{emp.experience} yrs exp</span>
                    <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Workload: {emp.workload}%</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold">{emp.performanceRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 max-w-48 hidden sm:flex">
                  {emp.skills.slice(0, 3).map((s) => <span key={s.name} className="badge-info">{s.name}</span>)}
                </div>
                {isExp ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(var(--muted-foreground))" }} />
                  : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(var(--muted-foreground))" }} />}
              </div>

              {/* Expanded details */}
              {isExp && (
                <div className="mt-5 pt-5 border-t grid lg:grid-cols-3 gap-6" style={{ borderColor: "hsl(var(--border))" }}>
                  {/* Skills */}
                  <div>
                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: "hsl(var(--foreground))" }}>
                      Skills
                    </h4>
                    <div className="space-y-2.5">
                      {emp.skills.map((s) => (
                        <div key={s.name}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium">{s.name}</span>
                            <div className="flex items-center gap-1.5">
                              <span className={levelColor[s.level]}>{s.level}</span>
                              <span className="font-bold" style={{ color: "hsl(var(--primary))" }}>{s.proficiency}%</span>
                            </div>
                          </div>
                          <div className="progress-bar" style={{ height: "6px" }}>
                            <div className="progress-fill" style={{ width: `${s.proficiency}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} /> Certifications
                    </h4>
                    <div className="space-y-2">
                      {emp.certifications.map((c) => (
                        <div key={c.id} className="p-2.5 rounded-lg" style={{ background: "hsl(var(--muted))" }}>
                          <div className="text-xs font-semibold">{c.name}</div>
                          <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{c.issuer} · Exp: {c.expiry}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance & Rating */}
                  <div>
                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} /> Performance & Rating
                    </h4>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span style={{ color: "hsl(var(--muted-foreground))" }}>Avg Rating</span>
                        <span className="font-bold">{emp.performanceRating.toFixed(1)} / 5.0</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span style={{ color: "hsl(var(--muted-foreground))" }}>Skill Utilization</span>
                        <span className="font-bold">{emp.skillUtilization}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span style={{ color: "hsl(var(--muted-foreground))" }}>Projects Completed</span>
                        <span className="font-bold">{emp.projects.filter((p) => p.status === "Completed").length}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-2">Rate this employee (after project):</label>
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} onClick={() => setRatings({ ...ratings, [emp.id]: star })}>
                            <Star className={`w-6 h-6 transition-colors ${star <= (ratings[emp.id] || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                          </button>
                        ))}
                      </div>
                      {ratings[emp.id] && (
                        <div className="text-xs p-2 rounded-lg" style={{ background: "hsl(142 71% 90%)", color: "hsl(142 71% 25%)" }}>
                          ✓ Rating {ratings[emp.id]}/5 submitted for {emp.id}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>No employees match your search.</p>
        </div>
      )}
    </div>
  );
}
