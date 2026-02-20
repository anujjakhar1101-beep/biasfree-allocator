import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { MatchResult } from "@/data/mockData";
import { Check, ArrowLeft, Users, ShieldCheck, Info } from "lucide-react";

interface LocationState {
  project: {
    name: string;
    description: string;
    deadline: string;
    priority: string;
    category: string;
    requiredSkills: { name: string; level: string }[];
  };
  results: MatchResult[];
}

const scoreBadge = (score: number) => {
  if (score >= 80) return <span className="badge-success">{score}%</span>;
  if (score >= 60) return <span className="badge-warning">{score}%</span>;
  return <span className="badge-danger">{score}%</span>;
};

export default function MatchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [assigned, setAssigned] = useState(false);

  if (!state) {
    return (
      <div className="text-center py-20">
        <p className="text-sm mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>No match data. Please create a project first.</p>
        <button onClick={() => navigate("/manager/add-project")} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "hsl(var(--primary))" }}>
          Create Project
        </button>
      </div>
    );
  }

  const { project, results } = state;

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const handleAssign = () => {
    if (selected.size === 0) return;
    setAssigned(true);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/manager/add-project")} className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg"
          style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Match Results</h1>
      </div>

      {/* Project summary */}
      <div className="rounded-2xl p-5 mb-6 border border-border" style={{ background: "linear-gradient(135deg, hsl(217 91% 40%), hsl(210 85% 52%))" }}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">{project.name}</h2>
            <p className="text-sm text-white/70 mt-0.5">{project.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
                {project.priority} Priority
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
                {project.category}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
                Deadline: {project.deadline}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{results.length}</div>
            <div className="text-white/60 text-xs">Candidates found</div>
          </div>
        </div>
      </div>

      {/* Bias-free notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl mb-6 border" style={{ background: "hsl(160 50% 95%)", borderColor: "hsl(160 50% 75%)" }}>
        <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "hsl(160 60% 38%)" }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: "hsl(160 60% 25%)" }}>Bias-Free Selection Mode Active</p>
          <p className="text-xs mt-0.5" style={{ color: "hsl(160 60% 35%)" }}>
            Personal details (name, gender, department) are hidden. Selection is based purely on skills, availability, and performance metrics.
          </p>
        </div>
      </div>

      {/* Required skills */}
      <div className="stat-card mb-6">
        <h3 className="section-title mb-3">Required Skills</h3>
        <div className="flex flex-wrap gap-2">
          {project.requiredSkills.map((s) => (
            <span key={s.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: "hsl(217 80% 92%)", color: "hsl(217 70% 30%)" }}>
              {s.name} <span className="opacity-60">·</span> {s.level}
            </span>
          ))}
        </div>
      </div>

      {/* Results table */}
      <div className="stat-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">Ranked Candidates</h3>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            <Info className="w-3.5 h-3.5" />
            Click row to select
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Employee ID</th>
                <th>Match Score</th>
                <th>Skill Match %</th>
                <th>Availability</th>
                <th>Workload</th>
                <th>Skill Utilization</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, idx) => {
                const isSelected = selected.has(r.employeeId);
                return (
                  <tr key={r.employeeId}
                    onClick={() => toggleSelect(r.employeeId)}
                    className="cursor-pointer"
                    style={isSelected ? { background: "hsl(217 80% 95%)" } : {}}>
                    <td>
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{
                        background: idx === 0 ? "hsl(38 92% 50%)" : idx === 1 ? "hsl(220 14% 65%)" : "hsl(220 14% 75%)"
                      }}>
                        {idx + 1}
                      </span>
                    </td>
                    <td><span className="font-bold font-mono">{r.employeeId}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        {scoreBadge(r.matchScore)}
                        <div className="w-16 progress-bar">
                          <div className="progress-fill" style={{ width: `${r.matchScore}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{r.skillMatchPct}%</span>
                        <div className="w-12 progress-bar">
                          <div className="progress-fill-success" style={{ width: `${r.skillMatchPct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      {r.availability === "Available"
                        ? <span className="badge-success">{r.availability}</span>
                        : r.availability === "Busy"
                        ? <span className="badge-warning">{r.availability}</span>
                        : <span className="badge-danger">{r.availability}</span>}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{r.workload}%</span>
                        <div className="w-12 progress-bar">
                          <div style={{
                            height: "100%", borderRadius: "9999px",
                            width: `${r.workload}%`,
                            background: r.workload > 70 ? "hsl(0 70% 55%)" : "hsl(38 92% 50%)"
                          }} />
                        </div>
                      </div>
                    </td>
                    <td><span className="text-sm font-semibold">{r.skillUtilization}%</span></td>
                    <td>
                      <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${isSelected ? "" : "border-border"}`}
                        style={isSelected ? { background: "hsl(var(--primary))", borderColor: "hsl(var(--primary))" } : {}}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected team */}
      {selected.size > 0 && (
        <div className="stat-card border-2 mb-4" style={{ borderColor: "hsl(var(--primary))" }}>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
            <h3 className="section-title">Selected Team ({selected.size} member{selected.size !== 1 ? "s" : ""})</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {[...selected].map((id) => {
              const r = results.find((x) => x.employeeId === id)!;
              return (
                <div key={id} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: "hsl(217 80% 95%)", color: "hsl(217 70% 30%)" }}>
                  <span className="font-bold text-sm">{id}</span>
                  <span className="text-xs opacity-70">Match: {r.matchScore}%</span>
                  <button onClick={(e) => { e.stopPropagation(); toggleSelect(id); }}
                    className="ml-1 text-xs font-bold opacity-60 hover:opacity-100">×</button>
                </div>
              );
            })}
          </div>

          {assigned ? (
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "hsl(142 71% 90%)", color: "hsl(142 71% 25%)" }}>
              <Check className="w-4 h-4" />
              <span className="text-sm font-semibold">
                Team assigned to "{project.name}"! {selected.size} employee{selected.size !== 1 ? "s have" : " has"} been notified.
              </span>
            </div>
          ) : (
            <button onClick={handleAssign}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: "hsl(var(--primary))", boxShadow: "0 4px 14px hsl(217 91% 40% / 0.35)" }}>
              <Check className="w-4 h-4" />
              Assign Selected Team to Project
            </button>
          )}
        </div>
      )}
    </div>
  );
}
