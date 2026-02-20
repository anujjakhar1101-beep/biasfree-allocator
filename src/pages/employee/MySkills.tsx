import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getEmployeeById } from "@/data/mockData";
import { Plus, Edit2, Check, X, ChevronUp, ChevronDown } from "lucide-react";
import type { Skill, SkillLevel } from "@/data/mockData";

const SKILL_LEVELS: SkillLevel[] = ["Beginner", "Intermediate", "Advanced", "Expert"];
const levelColors: Record<SkillLevel, string> = {
  Beginner: "badge-muted",
  Intermediate: "badge-info",
  Advanced: "badge-warning",
  Expert: "badge-success",
};

export default function MySkills() {
  const { user } = useAuth();
  const emp = getEmployeeById(user?.id || "");
  const [skills, setSkills] = useState<Skill[]>(emp?.skills || []);
  const [adding, setAdding] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [newSkill, setNewSkill] = useState({ name: "", level: "Intermediate" as SkillLevel, proficiency: 50, yearsExp: 1 });
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = [...skills].sort((a, b) => sortDir === "desc" ? b.proficiency - a.proficiency : a.proficiency - b.proficiency);

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    setSkills([...skills, { ...newSkill }]);
    setAdding(false);
    setNewSkill({ name: "", level: "Intermediate", proficiency: 50, yearsExp: 1 });
  };

  const handleEditSkill = (idx: number, level: SkillLevel, proficiency: number) => {
    const updated = [...skills];
    updated[idx] = { ...updated[idx], level, proficiency };
    setSkills(updated);
    setEditingIdx(null);
  };

  const proficiencyLabel = (p: number) => p >= 85 ? "Expert" : p >= 65 ? "Advanced" : p >= 40 ? "Intermediate" : "Beginner";

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>My Skills</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Manage and track your skill proficiencies</p>
        </div>
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: "hsl(var(--primary))", boxShadow: "0 4px 12px hsl(217 91% 40% / 0.3)" }}>
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {SKILL_LEVELS.map((lvl) => {
          const count = skills.filter((s) => s.level === lvl).length;
          return (
            <div key={lvl} className="stat-card text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: "hsl(var(--primary))" }}>{count}</div>
              <span className={levelColors[lvl]}>{lvl}</span>
            </div>
          );
        })}
      </div>

      {/* Add form */}
      {adding && (
        <div className="stat-card mb-6 border-2" style={{ borderColor: "hsl(var(--primary))" }}>
          <h3 className="section-title mb-4">Add New Skill</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Skill Name</label>
              <input type="text" value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="e.g. React, Python, AWS"
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={{ border: "1.5px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Level</label>
              <select value={newSkill.level} onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as SkillLevel })}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={{ border: "1.5px solid hsl(var(--border))", background: "hsl(var(--card))" }}>
                {SKILL_LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Proficiency: {newSkill.proficiency}%</label>
              <input type="range" min={10} max={100} value={newSkill.proficiency} onChange={(e) => setNewSkill({ ...newSkill, proficiency: +e.target.value })} className="w-full" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Years of Experience</label>
              <input type="number" min={0} max={30} value={newSkill.yearsExp} onChange={(e) => setNewSkill({ ...newSkill, yearsExp: +e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={{ border: "1.5px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAddSkill} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "hsl(var(--primary))" }}>
              <Check className="w-4 h-4" /> Add Skill
            </button>
            <button onClick={() => setAdding(false)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border"
              style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}>
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Skills list */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">Skill Inventory</h3>
          <button onClick={() => setSortDir(sortDir === "desc" ? "asc" : "desc")}
            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg"
            style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
            Sort {sortDir === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
        </div>
        <div className="space-y-4">
          {sorted.map((skill, idx) => {
            const origIdx = skills.findIndex((s) => s.name === skill.name);
            const isEditing = editingIdx === origIdx;
            return (
              <div key={skill.name} className="p-4 rounded-xl border" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">{skill.name}</span>
                    <span className={levelColors[skill.level]}>{skill.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{skill.yearsExp} yr{skill.yearsExp !== 1 ? "s" : ""}</span>
                    <button onClick={() => setEditingIdx(isEditing ? null : origIdx)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                      style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 progress-bar">
                    <div className="progress-fill" style={{ width: `${skill.proficiency}%` }} />
                  </div>
                  <span className="text-sm font-bold w-10 text-right" style={{ color: "hsl(var(--primary))" }}>{skill.proficiency}%</span>
                </div>
                {isEditing && (
                  <EditSkillForm skill={skill} onSave={(l, p) => handleEditSkill(origIdx, l, p)} onCancel={() => setEditingIdx(null)} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EditSkillForm({ skill, onSave, onCancel }: { skill: Skill; onSave: (l: SkillLevel, p: number) => void; onCancel: () => void }) {
  const [level, setLevel] = useState<SkillLevel>(skill.level);
  const [proficiency, setProficiency] = useState(skill.proficiency);
  const SKILL_LEVELS: SkillLevel[] = ["Beginner", "Intermediate", "Advanced", "Expert"];
  return (
    <div className="mt-3 pt-3 border-t grid sm:grid-cols-2 gap-3" style={{ borderColor: "hsl(var(--border))" }}>
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>Level</label>
        <select value={level} onChange={(e) => setLevel(e.target.value as SkillLevel)}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ border: "1.5px solid hsl(var(--border))", background: "hsl(var(--card))" }}>
          {SKILL_LEVELS.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>Proficiency: {proficiency}%</label>
        <input type="range" min={10} max={100} value={proficiency} onChange={(e) => setProficiency(+e.target.value)} className="w-full" />
      </div>
      <div className="sm:col-span-2 flex gap-2">
        <button onClick={() => onSave(level, proficiency)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "hsl(var(--primary))" }}>
          <Check className="w-3 h-3" /> Save
        </button>
        <button onClick={onCancel} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border" style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}>
          <X className="w-3 h-3" /> Cancel
        </button>
      </div>
    </div>
  );
}
