import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { computeMatchResults } from "@/data/mockData";
import type { SkillLevel } from "@/data/mockData";
import { Plus, Trash2, Zap } from "lucide-react";

const SKILL_LEVELS: SkillLevel[] = ["Beginner", "Intermediate", "Advanced", "Expert"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const CATEGORIES = ["Web Application", "AI/ML", "Enterprise Software", "Infrastructure", "Mobile", "Data Analytics", "Security"];

interface RequiredSkill {
  name: string;
  level: SkillLevel;
}

export default function AddProject() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    deadline: "",
    priority: "Medium",
    category: "Web Application",
  });
  const [skills, setSkills] = useState<RequiredSkill[]>([{ name: "", level: "Intermediate" }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addSkillRow = () => setSkills([...skills, { name: "", level: "Intermediate" }]);
  const removeSkillRow = (i: number) => setSkills(skills.filter((_, idx) => idx !== i));
  const updateSkill = (i: number, field: keyof RequiredSkill, val: string) => {
    const updated = [...skills];
    updated[i] = { ...updated[i], [field]: val };
    setSkills(updated);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Project name is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.deadline) errs.deadline = "Deadline is required";
    const validSkills = skills.filter((s) => s.name.trim());
    if (validSkills.length === 0) errs.skills = "At least one required skill must be specified";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const validSkills = skills.filter((s) => s.name.trim());
    const results = computeMatchResults(validSkills);
    navigate("/manager/match-results", {
      state: { project: { ...form, requiredSkills: validSkills }, results },
    });
  };

  const priorityColors: Record<string, { bg: string; text: string }> = {
    Low: { bg: "hsl(220 18% 93%)", text: "hsl(220 14% 40%)" },
    Medium: { bg: "hsl(217 80% 92%)", text: "hsl(217 70% 30%)" },
    High: { bg: "hsl(38 100% 90%)", text: "hsl(38 80% 30%)" },
    Critical: { bg: "hsl(0 84% 92%)", text: "hsl(0 60% 35%)" },
  };

  return (
    <div>
      <div className="page-header mb-8">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create New Project</h1>
        <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Fill in project details — AI will match the best team automatically</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Basic info */}
        <div className="stat-card space-y-4">
          <h3 className="section-title">Project Details</h3>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Project Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Customer Portal Redesign"
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
              style={{ border: `1.5px solid ${errors.name ? "hsl(0 84% 60%)" : "hsl(var(--border))"}`, background: "hsl(var(--card))" }} />
            {errors.name && <p className="text-xs mt-1" style={{ color: "hsl(0 84% 60%)" }}>{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="Describe the project goals and requirements..."
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
              style={{ border: `1.5px solid ${errors.description ? "hsl(0 84% 60%)" : "hsl(var(--border))"}`, background: "hsl(var(--card))" }} />
            {errors.description && <p className="text-xs mt-1" style={{ color: "hsl(0 84% 60%)" }}>{errors.description}</p>}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Deadline *</label>
              <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ border: `1.5px solid ${errors.deadline ? "hsl(0 84% 60%)" : "hsl(var(--border))"}`, background: "hsl(var(--card))" }} />
              {errors.deadline && <p className="text-xs mt-1" style={{ color: "hsl(0 84% 60%)" }}>{errors.deadline}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ border: "1.5px solid hsl(var(--border))", background: "hsl(var(--card))" }}>
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ border: "1.5px solid hsl(var(--border))", background: "hsl(var(--card))" }}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Priority preview */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>Selected priority:</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: priorityColors[form.priority].bg, color: priorityColors[form.priority].text }}>
              {form.priority}
            </span>
          </div>
        </div>

        {/* Required skills */}
        <div className="stat-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="section-title">Required Skills</h3>
            <button type="button" onClick={addSkillRow}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: "hsl(217 80% 95%)", color: "hsl(217 70% 35%)" }}>
              <Plus className="w-3.5 h-3.5" /> Add Skill
            </button>
          </div>
          {errors.skills && <p className="text-xs" style={{ color: "hsl(0 84% 60%)" }}>{errors.skills}</p>}

          <div className="space-y-3">
            {skills.map((skill, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex-1">
                  <input type="text" value={skill.name} onChange={(e) => updateSkill(i, "name", e.target.value)}
                    placeholder="Skill name (e.g. React, Python)"
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ border: "1.5px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                </div>
                <div className="w-40">
                  <select value={skill.level} onChange={(e) => updateSkill(i, "level", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ border: "1.5px solid hsl(var(--border))", background: "hsl(var(--card))" }}>
                    {SKILL_LEVELS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
                {skills.length > 1 && (
                  <button type="button" onClick={() => removeSkillRow(i)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "hsl(0 84% 95%)", color: "hsl(0 60% 50%)" }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button type="submit"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all"
          style={{ background: "linear-gradient(135deg, hsl(217 91% 40%), hsl(210 85% 52%))", boxShadow: "0 6px 20px hsl(217 91% 40% / 0.4)" }}>
          <Zap className="w-4 h-4" />
          Run AI Matching & Find Best Team
        </button>
      </form>
    </div>
  );
}
