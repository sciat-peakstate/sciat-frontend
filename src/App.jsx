import { useState, useEffect } from "react";

const colors = {
  bg: "#0a0f1e",
  surface: "#111827",
  card: "#1a2235",
  accent: "#00d4aa",
  accentSoft: "#00d4aa22",
  warn: "#f59e0b",
  danger: "#ef4444",
  text: "#f0f4ff",
  muted: "#8899bb",
  border: "#1e2d45",
};

const stages = [
  { id: "sport", label: "Deportivo", icon: "⚡", desc: "Competencia, torneo, partido" },
  { id: "academic", label: "Académico", icon: "🎯", desc: "Examen, defensa, evaluación" },
  { id: "org", label: "Organizacional", icon: "🔷", desc: "Presentación, lanzamiento, cierre" },
];

const phases = [
  { id: "far", label: "Lejana", desc: "Semanas", color: "#00d4aa" },
  { id: "near", label: "Próxima", desc: "Días", color: "#f59e0b" },
  { id: "now", label: "Inmediata", desc: "Horas", color: "#ef4444" },
];

const csaiQuestions = [
  { id: "s1", dim: "somática", text: "Siento tensión muscular en mi cuerpo" },
  { id: "s2", dim: "somática", text: "Noto que mi corazón late más rápido" },
  { id: "s3", dim: "cognitiva", text: "Me preocupa no rendir como espero" },
  { id: "s4", dim: "cognitiva", text: "Tengo pensamientos negativos sobre esta etapa" },
  { id: "c1", dim: "confianza", text: "Me siento seguro/a de mis capacidades" },
  { id: "c2", dim: "confianza", text: "Estoy convencido/a de que puedo lograrlo" },
];

const modules = [
  {
    id: "A",
    title: "Regulación de activación",
    icon: "🫁",
    color: "#00d4aa",
    desc: "Controla tu energía física",
    exercises: ["Respiración diafragmática 4-7-8", "Relajación muscular progresiva", "Activación controlada"],
    forProfile: (p) => p.somatica === "alta",
  },
  {
    id: "B",
    title: "Control del pensamiento",
    icon: "🧠",
    color: "#818cf8",
    desc: "Silencia el ruido mental",
    exercises: ["Reestructuración cognitiva", "Técnica de detención", "Visualización de ejecución"],
    forProfile: (p) => p.cognitiva === "alta",
  },
  {
    id: "C",
    title: "Construcción de confianza",
    icon: "🔥",
    color: "#f59e0b",
    desc: "Activa tu historial de éxitos",
    exercises: ["Registro de logros previos", "Rutina de preparación", "Diálogo interno positivo"],
    forProfile: (p) => p.confianza === "baja",
  },
  {
    id: "D",
    title: "Foco y concentración",
    icon: "🎯",
    color: "#06b6d4",
    desc: "Ancla tu atención al presente",
    exercises: ["Atención selectiva", "Calentamiento mental", "Control del momento presente"],
    forProfile: () => true,
  },
];

function ScoreBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: colors.muted, fontFamily: "monospace", letterSpacing: 1 }}>{label.toUpperCase()}</span>
        <span style={{ fontSize: 12, color, fontWeight: 700 }}>{value === "alta" || value === "buena" ? "↑ ALTO" : value === "media" || value === "moderada" ? "→ MEDIO" : "↓ BAJO"}</span>
      </div>
      <div style={{ height: 4, background: colors.border, borderRadius: 2 }}>
        <div style={{
          height: "100%", borderRadius: 2, background: color,
          width: value === "alta" || value === "buena" ? "85%" : value === "media" || value === "moderada" ? "50%" : "20%",
          transition: "width 1s ease",
        }} />
      </div>
    </div>
  );
}

function ExerciseCard({ exercise, index }) {
  const [active, setActive] = useState(false);
  return (
    <div
      onClick={() => setActive(!active)}
      style={{
        background: active ? colors.accentSoft : colors.surface,
        border: `1px solid ${active ? colors.accent : colors.border}`,
        borderRadius: 10, padding: "12px 16px", cursor: "pointer",
        marginBottom: 8, transition: "all 0.2s",
        display: "flex", alignItems: "center", gap: 12,
      }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: active ? colors.accent : colors.border,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 800, color: active ? colors.bg : colors.muted,
        flexShrink: 0, fontFamily: "monospace",
      }}>{index + 1}</div>
      <span style={{ fontSize: 13, color: active ? colors.accent : colors.text }}>{exercise}</span>
      {active && <span style={{ marginLeft: "auto", fontSize: 11, color: colors.accent }}>▶ INICIAR</span>}
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0); // 0=welcome, 1=context, 2=phase, 3=csai, 4=results, 5=plan
  const [context, setContext] = useState(null);
  const [phase, setPhase] = useState(null);
  const [answers, setAnswers] = useState({});
  const [profile, setProfile] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(t);
  }, [step]);

  const handleAnswer = (id, val) => setAnswers((prev) => ({ ...prev, [id]: val }));

  const calcProfile = () => {
    const avg = (ids) => ids.reduce((s, id) => s + (answers[id] || 2), 0) / ids.length;
    const som = avg(["s1", "s2"]);
    const cog = avg(["s3", "s4"]);
    const conf = avg(["c1", "c2"]);
    const level = (v, inv = false) => {
      if (inv) return v >= 3.5 ? "buena" : v >= 2.5 ? "moderada" : "baja";
      return v >= 3.5 ? "alta" : v >= 2.5 ? "media" : "baja";
    };
    const p = { somatica: level(som), cognitiva: level(cog), confianza: level(conf, true) };
    setProfile(p);
    setRecommended(modules.filter((m) => m.forProfile(p)));
    setStep(4);
  };

  const fadeStyle = {
    opacity: animate ? 1 : 0,
    transform: animate ? "translateY(0)" : "translateY(16px)",
    transition: "all 0.4s ease",
  };

  return (
    <div style={{
      minHeight: "100vh", background: colors.bg, fontFamily: "'DM Sans', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "24px 16px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${colors.bg}; }
        ::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 2px; }
        button:hover { filter: brightness(1.1); }
      `}</style>

      {/* Header */}
      <div style={{ width: "100%", maxWidth: 420, marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${colors.accent}, #0099aa)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>⬡</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: colors.text, letterSpacing: 0.5 }}>PEAK STATE</div>
            <div style={{ fontSize: 10, color: colors.muted, fontFamily: "monospace", letterSpacing: 2 }}>RENDIMIENTO · BIENESTAR</div>
          </div>
          {step > 0 && (
            <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
              {[1,2,3,4,5].map(s => (
                <div key={s} style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: s <= step ? colors.accent : colors.border,
                  transition: "background 0.3s",
                }} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 420, ...fadeStyle }}>

        {/* STEP 0: Welcome */}
        {step === 0 && (
          <div>
            <div style={{
              background: `linear-gradient(135deg, ${colors.card}, #0d1a2e)`,
              border: `1px solid ${colors.border}`, borderRadius: 20,
              padding: 32, marginBottom: 20, textAlign: "center",
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: colors.text, marginBottom: 8, lineHeight: 1.2 }}>
                Rinde mejor<br />bajo presión
              </h1>
              <p style={{ fontSize: 14, color: colors.muted, lineHeight: 1.6 }}>
                Herramientas de alto rendimiento adaptadas a tu etapa. Deporte, academia u organización — el método es el mismo.
              </p>
            </div>
            <div style={{
              background: colors.card, border: `1px solid ${colors.border}`,
              borderRadius: 14, padding: 20, marginBottom: 20,
            }}>
              {["Evaluación por etapa de presión", "Check inicial de estado", "IA que aprende tu patrón"].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 2 ? 12 : 0 }}>
                  <div style={{ color: colors.accent, fontSize: 14 }}>✓</div>
                  <span style={{ fontSize: 13, color: colors.muted }}>{f}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(1)} style={{
              width: "100%", padding: "16px", borderRadius: 12, border: "none",
              background: `linear-gradient(135deg, ${colors.accent}, #0099aa)`,
              color: colors.bg, fontSize: 15, fontWeight: 700, cursor: "pointer",
              letterSpacing: 0.5,
            }}>
              COMENZAR EVALUACIÓN →
            </button>
          </div>
        )}

        {/* STEP 1: Context */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: colors.accent, fontFamily: "monospace", letterSpacing: 2, marginBottom: 6 }}>PASO 1 DE 3</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>¿En qué contexto estás?</h2>
              <p style={{ fontSize: 13, color: colors.muted, marginTop: 6 }}>Selecciona tu situación actual</p>
            </div>
            {stages.map((s) => (
              <div key={s.id} onClick={() => { setContext(s.id); setTimeout(() => setStep(2), 300); }}
                style={{
                  background: context === s.id ? colors.accentSoft : colors.card,
                  border: `1px solid ${context === s.id ? colors.accent : colors.border}`,
                  borderRadius: 14, padding: "18px 20px", marginBottom: 12, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s",
                }}>
                <div style={{ fontSize: 28 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>{s.desc}</div>
                </div>
                {context === s.id && <div style={{ marginLeft: "auto", color: colors.accent, fontSize: 18 }}>✓</div>}
              </div>
            ))}
          </div>
        )}

        {/* STEP 2: Phase */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: colors.accent, fontFamily: "monospace", letterSpacing: 2, marginBottom: 6 }}>PASO 2 DE 3</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>¿Cuándo es tu etapa?</h2>
              <p style={{ fontSize: 13, color: colors.muted, marginTop: 6 }}>Esto define la intensidad de la intervención</p>
            </div>
            {phases.map((p) => (
              <div key={p.id} onClick={() => { setPhase(p.id); setTimeout(() => setStep(3), 300); }}
                style={{
                  background: phase === p.id ? `${p.color}18` : colors.card,
                  border: `1px solid ${phase === p.id ? p.color : colors.border}`,
                  borderRadius: 14, padding: "18px 20px", marginBottom: 12, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s",
                }}>
                <div style={{
                  width: 12, height: 12, borderRadius: "50%", background: p.color, flexShrink: 0,
                  boxShadow: phase === p.id ? `0 0 12px ${p.color}` : "none",
                }} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{p.label}</div>
                  <div style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>{p.desc} antes</div>
                </div>
                {phase === p.id && <div style={{ marginLeft: "auto", color: p.color }}>✓</div>}
              </div>
            ))}
          </div>
        )}

        {/* STEP 3: CSAI */}
        {step === 3 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: colors.accent, fontFamily: "monospace", letterSpacing: 2, marginBottom: 6 }}>PASO 3 DE 3 · CHECK INICIAL</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>¿Cómo te sientes ahora?</h2>
              <p style={{ fontSize: 13, color: colors.muted, marginTop: 6 }}>Responde con honestidad — no hay respuestas incorrectas</p>
            </div>
            {csaiQuestions.map((q, i) => (
              <div key={q.id} style={{
                background: colors.card, border: `1px solid ${colors.border}`,
                borderRadius: 12, padding: 16, marginBottom: 12,
              }}>
                <div style={{ fontSize: 13, color: colors.text, marginBottom: 12, lineHeight: 1.5 }}>{q.text}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[
                    { val: 1, label: "Nada" },
                    { val: 2, label: "Algo" },
                    { val: 3, label: "Bastante" },
                    { val: 4, label: "Mucho" },
                  ].map((opt) => (
                    <button key={opt.val} onClick={() => handleAnswer(q.id, opt.val)}
                      style={{
                        flex: 1, padding: "8px 4px", borderRadius: 8, border: `1px solid`,
                        borderColor: answers[q.id] === opt.val ? colors.accent : colors.border,
                        background: answers[q.id] === opt.val ? colors.accentSoft : "transparent",
                        color: answers[q.id] === opt.val ? colors.accent : colors.muted,
                        fontSize: 11, cursor: "pointer", transition: "all 0.15s", fontWeight: 500,
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={calcProfile}
              disabled={Object.keys(answers).length < csaiQuestions.length}
              style={{
                width: "100%", padding: "16px", borderRadius: 12, border: "none",
                background: Object.keys(answers).length < csaiQuestions.length
                  ? colors.border : `linear-gradient(135deg, ${colors.accent}, #0099aa)`,
                color: Object.keys(answers).length < csaiQuestions.length ? colors.muted : colors.bg,
                fontSize: 15, fontWeight: 700, cursor: Object.keys(answers).length < csaiQuestions.length ? "not-allowed" : "pointer",
                marginTop: 8,
              }}>
              VER MI PERFIL →
            </button>
          </div>
        )}

        {/* STEP 4: Results */}
        {step === 4 && profile && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: colors.accent, fontFamily: "monospace", letterSpacing: 2, marginBottom: 6 }}>PERFIL ACTUAL</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>Tu estado en este momento</h2>
            </div>
            <div style={{
              background: colors.card, border: `1px solid ${colors.border}`,
              borderRadius: 16, padding: 24, marginBottom: 20,
            }}>
              <ScoreBar label="Ansiedad Somática" value={profile.somatica}
                color={profile.somatica === "alta" ? colors.danger : profile.somatica === "media" ? colors.warn : colors.accent} />
              <ScoreBar label="Ansiedad Cognitiva" value={profile.cognitiva}
                color={profile.cognitiva === "alta" ? colors.danger : profile.cognitiva === "media" ? colors.warn : colors.accent} />
              <ScoreBar label="Autoconfianza" value={profile.confianza}
                color={profile.confianza === "buena" ? colors.accent : profile.confianza === "moderada" ? colors.warn : colors.danger} />
            </div>
            <div style={{
              background: colors.accentSoft, border: `1px solid ${colors.accent}33`,
              borderRadius: 12, padding: 16, marginBottom: 20,
            }}>
              <div style={{ fontSize: 11, color: colors.accent, fontFamily: "monospace", letterSpacing: 1, marginBottom: 6 }}>ANÁLISIS IA</div>
              <p style={{ fontSize: 13, color: colors.text, lineHeight: 1.6 }}>
                {recommended.length >= 3
                  ? "Detecto activación elevada con confianza por desarrollar. La prioridad es regular primero el cuerpo, luego el pensamiento."
                  : recommended.length === 2
                  ? "Tu estado muestra áreas específicas de mejora. El plan está personalizado para optimizar tu rendimiento."
                  : "Tu estado es sólido. El foco ahora es mantener y afinar tu concentración para la etapa que se aproxima."}
              </p>
            </div>
            <button onClick={() => setStep(5)} style={{
              width: "100%", padding: "16px", borderRadius: 12, border: "none",
              background: `linear-gradient(135deg, ${colors.accent}, #0099aa)`,
              color: colors.bg, fontSize: 15, fontWeight: 700, cursor: "pointer",
            }}>
              VER MI PLAN PERSONALIZADO →
            </button>
          </div>
        )}

        {/* STEP 5: Plan */}
        {step === 5 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: colors.accent, fontFamily: "monospace", letterSpacing: 2, marginBottom: 6 }}>PLAN PERSONALIZADO</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>Tus módulos activos</h2>
              <p style={{ fontSize: 13, color: colors.muted, marginTop: 6 }}>Seleccionados según tu perfil. Toca un ejercicio para comenzar.</p>
            </div>
            {recommended.map((mod) => (
              <div key={mod.id} style={{
                background: colors.card, border: `1px solid ${colors.border}`,
                borderRadius: 16, padding: 20, marginBottom: 16,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: `${mod.color}22`, border: `1px solid ${mod.color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                  }}>{mod.icon}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{mod.title}</div>
                    <div style={{ fontSize: 11, color: colors.muted }}>{mod.desc}</div>
                  </div>
                  <div style={{
                    marginLeft: "auto", fontSize: 10, fontWeight: 700,
                    color: mod.color, background: `${mod.color}18`,
                    padding: "4px 8px", borderRadius: 6, fontFamily: "monospace", letterSpacing: 1,
                  }}>MOD {mod.id}</div>
                </div>
                {mod.exercises.map((ex, i) => <ExerciseCard key={i} exercise={ex} index={i} />)}
              </div>
            ))}
            <div style={{
              background: colors.card, border: `1px dashed ${colors.border}`,
              borderRadius: 14, padding: 16, textAlign: "center", marginBottom: 16,
            }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>📊</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 4 }}>Módulo E — Seguimiento</div>
              <div style={{ fontSize: 12, color: colors.muted }}>Disponible después de tu etapa de presión</div>
            </div>
            <button onClick={() => { setStep(0); setContext(null); setPhase(null); setAnswers({}); setProfile(null); }} style={{
              width: "100%", padding: "14px", borderRadius: 12,
              border: `1px solid ${colors.border}`, background: "transparent",
              color: colors.muted, fontSize: 13, cursor: "pointer",
            }}>
              ← Nueva evaluación
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
