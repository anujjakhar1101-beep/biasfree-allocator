import { useState } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, BrainCircuit, Users, Shield } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("employee");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const ok = login(id.trim(), password, role);
      setLoading(false);
      if (ok) {
        navigate(role === "employee" ? "/employee/dashboard" : "/manager/dashboard");
      } else {
        setError("Invalid credentials. Please check your ID and password.");
      }
    }, 600);
  };

  const demoHint = role === "employee"
    ? "Demo: EMP001 – EMP005 / emp123"
    : "Demo: MGR001 – MGR002 / mgr123";

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, hsl(222 47% 11%), hsl(217 91% 20%))" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-14 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(217 91% 55%)" }}>
            <BrainCircuit className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>IRSMS</span>
        </div>

        <div>
          <h1 className="text-5xl font-extrabold leading-tight mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Intelligent<br/>Resource &<br/>Skill Mapping
          </h1>
          <p className="text-lg opacity-70 leading-relaxed max-w-md">
            AI-powered, bias-free project allocation system that matches the right talent to the right project — every time.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { label: "Bias Reduction", val: "100%", sub: "Anonymous matching" },
              { label: "Skill Coverage", val: "95%", sub: "Across all domains" },
              { label: "Time Saved", val: "60%", sub: "In project staffing" },
              { label: "Match Accuracy", val: "91%", sub: "Avg match score" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="text-3xl font-bold" style={{ color: "hsl(217 91% 70%)" }}>{s.val}</div>
                <div className="text-sm font-semibold mt-0.5">{s.label}</div>
                <div className="text-xs opacity-50 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs opacity-40">© 2026 IRSMS — Enterprise Edition</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="rounded-2xl p-8" style={{ background: "hsl(0 0% 100%)", boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}>
            {/* Logo mobile */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "hsl(217 91% 40%)" }}>
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "hsl(222 47% 11%)" }}>IRSMS</span>
            </div>

            <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "hsl(222 47% 11%)" }}>Welcome back</h2>
            <p className="text-sm mb-7" style={{ color: "hsl(220 14% 46%)" }}>Sign in to your account to continue</p>

            {/* Role toggle */}
            <div className="flex rounded-xl p-1 mb-6" style={{ background: "hsl(220 18% 93%)" }}>
              {(["employee", "manager"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setError(""); setId(""); setPassword(""); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200"
                  style={role === r
                    ? { background: "hsl(217 91% 40%)", color: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }
                    : { color: "hsl(220 14% 46%)" }
                  }
                >
                  {r === "employee" ? <Users className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "hsl(222 47% 11%)" }}>
                  {role === "employee" ? "Employee" : "Manager"} ID
                </label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder={role === "employee" ? "e.g. EMP001" : "e.g. MGR001"}
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all duration-150"
                  style={{
                    border: "1.5px solid hsl(220 18% 88%)",
                    color: "hsl(222 47% 11%)",
                    background: "hsl(220 20% 98%)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "hsl(217 91% 40%)")}
                  onBlur={(e) => (e.target.style.borderColor = "hsl(220 18% 88%)")}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "hsl(222 47% 11%)" }}>Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 pr-12 rounded-xl text-sm border outline-none transition-all duration-150"
                    style={{
                      border: "1.5px solid hsl(220 18% 88%)",
                      color: "hsl(222 47% 11%)",
                      background: "hsl(220 20% 98%)",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "hsl(217 91% 40%)")}
                    onBlur={(e) => (e.target.style.borderColor = "hsl(220 18% 88%)")}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(220 14% 60%)" }}>
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "hsl(0 84% 95%)", color: "hsl(0 60% 40%)" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 mt-2"
                style={{ background: loading ? "hsl(217 91% 60%)" : "hsl(217 91% 40%)", color: "white", boxShadow: "0 4px 14px rgba(36,100,200,0.35)" }}
              >
                {loading ? "Signing in..." : `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
              </button>
            </form>

            <div className="mt-5 rounded-xl px-4 py-3 text-xs" style={{ background: "hsl(217 80% 95%)", color: "hsl(217 70% 35%)" }}>
              <span className="font-semibold">Demo credentials:</span> {demoHint}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
