import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getEmployeeById } from "@/data/mockData";
import { Award, Plus, Trash2, FileText, Calendar, Building2 } from "lucide-react";

export default function Certifications() {
  const { user } = useAuth();
  const emp = getEmployeeById(user?.id || "");
  const [certs, setCerts] = useState(emp?.certifications || []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", issuer: "", date: "", expiry: "" });
  const [fileName, setFileName] = useState("");

  const handleAdd = () => {
    if (!form.name || !form.issuer || !form.date) return;
    setCerts([...certs, { id: `C${Date.now()}`, ...form, fileUrl: fileName ? "#" : undefined }]);
    setForm({ name: "", issuer: "", date: "", expiry: "" });
    setFileName("");
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setCerts(certs.filter((c) => c.id !== id));
  };

  const isExpiringSoon = (expiry: string) => {
    if (!expiry) return false;
    const diff = (new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff < 90;
  };

  const isExpired = (expiry: string) => {
    if (!expiry) return false;
    return new Date(expiry).getTime() < Date.now();
  };

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Certifications</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Manage your professional certifications and credentials</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "hsl(var(--primary))", boxShadow: "0 4px 12px hsl(217 91% 40% / 0.3)" }}>
          <Plus className="w-4 h-4" /> Upload Certificate
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", val: certs.length, color: "hsl(var(--primary))", bg: "hsl(217 80% 95%)" },
          { label: "Active", val: certs.filter((c) => !isExpired(c.expiry)).length, color: "hsl(var(--success))", bg: "hsl(160 50% 93%)" },
          { label: "Expiring Soon", val: certs.filter((c) => isExpiringSoon(c.expiry)).length, color: "hsl(var(--warning))", bg: "hsl(38 100% 94%)" },
        ].map((s) => (
          <div key={s.label} className="stat-card text-center">
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</div>
            <div className="text-xs font-medium mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Upload form */}
      {showForm && (
        <div className="stat-card mb-6 border-2" style={{ borderColor: "hsl(var(--primary))" }}>
          <h3 className="section-title mb-4">Add Certification</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Certification Name", key: "name", placeholder: "e.g. AWS Solutions Architect" },
              { label: "Issuing Organization", key: "issuer", placeholder: "e.g. Amazon Web Services" },
              { label: "Issue Date", key: "date", type: "date" },
              { label: "Expiry Date", key: "expiry", type: "date" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>{f.label}</label>
                <input type={f.type || "text"} value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ border: "1.5px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Upload Certificate File</label>
              <div className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors"
                style={{ borderColor: "hsl(var(--border))" }}
                onClick={() => document.getElementById("cert-upload")?.click()}>
                <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: "hsl(var(--muted-foreground))" }} />
                <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {fileName || "Click to upload PDF, JPG, PNG"}
                </p>
                <input id="cert-upload" type="file" className="hidden" accept=".pdf,.jpg,.png"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAdd} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "hsl(var(--primary))" }}>
              Add Certification
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm font-semibold border"
              style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Certifications grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {certs.map((cert) => {
          const expired = isExpired(cert.expiry);
          const expiringSoon = isExpiringSoon(cert.expiry);
          return (
            <div key={cert.id} className="stat-card relative">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {expired ? <span className="badge-danger">Expired</span>
                  : expiringSoon ? <span className="badge-warning">Expiring Soon</span>
                  : <span className="badge-success">Active</span>}
                <button onClick={() => handleDelete(cert.id)} className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "hsl(0 84% 95%)", color: "hsl(0 60% 50%)" }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-start gap-3 pr-20">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "hsl(217 80% 95%)" }}>
                  <Award className="w-5 h-5" style={{ color: "hsl(217 91% 40%)" }} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm leading-tight">{cert.name}</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Building2 className="w-3 h-3" style={{ color: "hsl(var(--muted-foreground))" }} />
                    <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{cert.issuer}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3" style={{ borderColor: "hsl(var(--border))" }}>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" style={{ color: "hsl(var(--muted-foreground))" }} />
                  <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Issued: {cert.date}</span>
                </div>
                {cert.expiry && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" style={{ color: "hsl(var(--muted-foreground))" }} />
                    <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Expires: {cert.expiry}</span>
                  </div>
                )}
              </div>
              {cert.fileUrl && (
                <a href={cert.fileUrl} target="_blank" rel="noreferrer"
                  className="mt-3 flex items-center gap-1.5 text-xs font-semibold"
                  style={{ color: "hsl(var(--primary))" }}>
                  <FileText className="w-3.5 h-3.5" /> View Certificate
                </a>
              )}
            </div>
          );
        })}
      </div>

      {certs.length === 0 && (
        <div className="text-center py-16">
          <Award className="w-12 h-12 mx-auto mb-3" style={{ color: "hsl(var(--muted-foreground))" }} />
          <h3 className="font-semibold mb-1">No certifications yet</h3>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Upload your first certification to get started.</p>
        </div>
      )}
    </div>
  );
}
