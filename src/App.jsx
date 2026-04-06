  import { useState, useEffect, useRef } from "react";

// ─── SISTEMA DE DISEÑO SCIAT ──────────────────────────────────────────────────
const DS = {
  bg:            "#f8f6f1",
  bgWarm:        "#f2ede4",
  bgDark:        "#0c1a16",
  surface:       "#ffffff",
  surfaceDark:   "#122b24",
  emerald:       "#0a6e5c",
  emeraldMid:    "#0d8f78",
  emeraldLight:  "#10b99a",
  emeraldSoft:   "#10b99a15",
  emeraldBorder: "#10b99a30",
  gold:          "#c9a84c",
  goldLight:     "#e2c074",
  goldSoft:      "#c9a84c15",
  goldBorder:    "#c9a84c35",
  ink:           "#0f1f1a",
  inkMid:        "#2d4a42",
  inkLight:      "#5a7a72",
  inkMuted:      "#8aaa9f",
  border:        "#e0ddd5",
  danger:        "#e05252",
  warn:          "#f59e0b",
};

// Colores por módulo
const MOD_COLORS = {
  A: { accent: "#10b99a", soft: "#10b99a15", border: "#10b99a30", label: "Regulación" },
  B: { accent: "#6366f1", soft: "#6366f115", border: "#6366f130", label: "Pensamiento" },
  C: { accent: "#c9a84c", soft: "#c9a84c15", border: "#c9a84c30", label: "Confianza" },
  D: { accent: "#0891b2", soft: "#0891b215", border: "#0891b230", label: "Foco" },
  E: { accent: "#7c3aed", soft: "#7c3aed12", border: "#7c3aed28", label: "Seguimiento" },
};

// ─── LOGO ────────────────────────────────────────────────────────────────────
function LogoSCIAT({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M24 3 L42 13.5 L42 34.5 L24 45 L6 34.5 L6 13.5 Z" stroke={DS.emerald} strokeWidth="1.5" fill="none" />
      <path d="M24 10 L36 17 L36 31 L24 38 L12 31 L12 17 Z" stroke={DS.gold} strokeWidth="1" fill={DS.goldSoft} />
      <circle cx="24" cy="24" r="3" fill={DS.emerald} />
      <circle cx="24" cy="13" r="1.5" fill={DS.gold} />
      <circle cx="33" cy="18.5" r="1.5" fill={DS.gold} />
      <circle cx="33" cy="29.5" r="1.5" fill={DS.gold} />
      <circle cx="24" cy="35" r="1.5" fill={DS.gold} />
      <circle cx="15" cy="29.5" r="1.5" fill={DS.gold} />
      <circle cx="15" cy="18.5" r="1.5" fill={DS.gold} />
      <line x1="24" y1="24" x2="24" y2="13" stroke={DS.emerald} strokeWidth="0.75" strokeDasharray="2 1.5" />
      <line x1="24" y1="24" x2="33" y2="29.5" stroke={DS.emerald} strokeWidth="0.75" strokeDasharray="2 1.5" />
      <line x1="24" y1="24" x2="15" y2="29.5" stroke={DS.emerald} strokeWidth="0.75" strokeDasharray="2 1.5" />
    </svg>
  );
}

// ─── HEADER GLOBAL ────────────────────────────────────────────────────────────
function Header({ pantalla, onHome }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      marginBottom: 28, paddingBottom: 16,
      borderBottom: `1px solid ${DS.border}`,
    }}>
      <div onClick={onHome} style={{ cursor: pantalla !== "inicio" ? "pointer" : "default", display: "flex", alignItems: "center", gap: 10 }}>
        <LogoSCIAT size={34} />
        <div>
          <div style={{
            fontSize: 18, fontWeight: 900, letterSpacing: 3,
            color: DS.emerald, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1,
          }}>SCIAT</div>
          <div style={{ fontSize: 8, color: DS.gold, letterSpacing: 3, fontFamily: "'DM Mono', monospace" }}>
            PEAK STATE
          </div>
        </div>
      </div>
      {pantalla !== "inicio" && (
        <button onClick={onHome} style={{
          marginLeft: "auto", background: "transparent",
          border: `1px solid ${DS.border}`, borderRadius: 8,
          padding: "6px 12px", color: DS.inkMuted,
          fontSize: 12, cursor: "pointer", fontFamily: "'DM Mono', monospace",
        }}>← Inicio</button>
      )}
    </div>
  );
}

// ─── PANTALLA: INICIO ─────────────────────────────────────────────────────────
function PantallaInicio({ onIniciar, historial }) {
  const ultimaEtapa = historial[historial.length - 1];
  const hora = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <div>
      {/* Saludo */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontSize: 28, fontWeight: 300, color: DS.ink,
          fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2, marginBottom: 4,
        }}>
          {saludo},<br />
          <span style={{ fontWeight: 700, color: DS.emerald, fontStyle: "italic" }}>
            ¿cómo estás hoy?
          </span>
        </h1>
        <div style={{ fontSize: 12, color: DS.inkMuted, fontFamily: "'DM Sans', sans-serif" }}>
          {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
        </div>
      </div>

      {/* CTA principal */}
      <div style={{
        background: DS.bgDark, borderRadius: 20, padding: 28, marginBottom: 20,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -30, right: -30, width: 140, height: 140,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${DS.emeraldSoft} 0%, transparent 70%)`,
        }} />
        <div style={{
          position: "absolute", bottom: -20, left: -20, width: 100, height: 100,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${DS.goldSoft} 0%, transparent 70%)`,
        }} />
        <div style={{ fontSize: 10, color: DS.goldLight, fontFamily: "'DM Mono', monospace", letterSpacing: 2, marginBottom: 10 }}>
          NUEVA SESIÓN
        </div>
        <h2 style={{
          fontSize: 20, fontWeight: 600, color: "#f0ede6",
          fontFamily: "'Cormorant Garamond', serif", marginBottom: 8, lineHeight: 1.3,
        }}>
          Comienza con el<br />
          <span style={{ color: DS.goldLight, fontStyle: "italic" }}>Check inicial</span>
        </h2>
        <p style={{ fontSize: 13, color: DS.inkMuted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, marginBottom: 20 }}>
          Evalúa tu estado actual y recibe un plan personalizado para tu etapa de presión.
        </p>
        <button onClick={onIniciar} style={{
          background: `linear-gradient(135deg, ${DS.emerald}, ${DS.emeraldMid})`,
          color: "#fff", border: "none", borderRadius: 10,
          padding: "12px 24px", fontSize: 13, fontWeight: 700,
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5,
        }}>
          Iniciar Check → 
        </button>
      </div>

      {/* Módulos directos */}
      <div style={{ fontSize: 11, color: DS.inkMuted, fontFamily: "'DM Mono', monospace", letterSpacing: 2, marginBottom: 14 }}>
        MÓDULOS
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {Object.entries(MOD_COLORS).map(([key, mod]) => (
          <div key={key} style={{
            background: DS.surface, border: `1px solid ${DS.border}`,
            borderRadius: 14, padding: 16, cursor: "pointer",
            transition: "border-color 0.2s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = mod.accent}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = DS.border}
          >
            <div style={{
              fontSize: 10, color: mod.accent, fontFamily: "'DM Mono', monospace",
              letterSpacing: 1, marginBottom: 4,
            }}>MOD {key}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: DS.ink, fontFamily: "'DM Sans', sans-serif" }}>
              {mod.label}
            </div>
            <div style={{
              width: "100%", height: 3, background: DS.border, borderRadius: 2, marginTop: 10,
            }}>
              <div style={{ width: "0%", height: "100%", background: mod.accent, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Historial reciente */}
      {ultimaEtapa && (
        <div style={{
          background: DS.surface, border: `1px solid ${DS.border}`,
          borderRadius: 14, padding: 18,
        }}>
          <div style={{ fontSize: 11, color: DS.inkMuted, fontFamily: "'DM Mono', monospace", letterSpacing: 2, marginBottom: 10 }}>
            ÚLTIMA SESIÓN
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: DS.ink, fontFamily: "'DM Sans', sans-serif" }}>
                {ultimaEtapa.contexto} · {ultimaEtapa.fase}
              </div>
              <div style={{ fontSize: 11, color: DS.inkMuted, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
                {ultimaEtapa.fecha}
              </div>
            </div>
            <div style={{
              fontSize: 22, fontWeight: 800, color: DS.emerald,
              fontFamily: "'DM Mono', monospace",
            }}>
              {ultimaEtapa.desempeno || "—"}
            </div>
          </div>
        </div>
      )}

      {/* Accesibilidad */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        marginTop: 20, padding: "10px 14px",
        background: DS.emeraldSoft, borderRadius: 10,
        border: `1px solid ${DS.emeraldBorder}`,
      }}>
        <span style={{ fontSize: 14 }}>♿</span>
        <span style={{ fontSize: 11, color: DS.emerald, fontFamily: "'DM Sans', sans-serif" }}>
          Subtítulos CC · Lector de pantalla · Audio con voz del autor
        </span>
      </div>
    </div>
  );
}

// ─── PANTALLA: CHECK INICIAL ──────────────────────────────────────────────────
const checkPreguntas = [
  { id: "s1", dim: "somatica", texto: "Siento tensión muscular en mi cuerpo" },
  { id: "s2", dim: "somatica", texto: "Noto que mi corazón late más rápido" },
  { id: "c1", dim: "cognitiva", texto: "Me preocupa no rendir como espero" },
  { id: "c2", dim: "cognitiva", texto: "Tengo pensamientos negativos sobre esta etapa" },
  { id: "f1", dim: "confianza", texto: "Me siento seguro/a de mis capacidades" },
  { id: "f2", dim: "confianza", texto: "Estoy convencido/a de que puedo lograrlo" },
];

const contextos = [
  { id: "deportivo", label: "Deportivo", icono: "⚡", desc: "Competencia, torneo, partido" },
  { id: "academico", label: "Académico", icono: "🎯", desc: "Examen, defensa, evaluación" },
  { id: "organizacional", label: "Organizacional", icono: "🔷", desc: "Presentación, lanzamiento, cierre" },
];

const fases = [
  { id: "lejana", label: "Lejana", desc: "Semanas antes", color: DS.emeraldLight },
  { id: "proxima", label: "Próxima", desc: "Días antes", color: DS.warn },
  { id: "inmediata", label: "Inmediata", desc: "Horas antes", color: DS.danger },
];

function PantallaCheck({ onCompletado }) {
  const [paso, setPaso] = useState(0); // 0=contexto 1=fase 2=preguntas
  const [contexto, setContexto] = useState(null);
  const [fase, setFase] = useState(null);
  const [respuestas, setRespuestas] = useState({});

  const calcularPerfil = () => {
    const avg = (ids) => ids.reduce((s, id) => s + (respuestas[id] || 2), 0) / ids.length;
    const som = avg(["s1", "s2"]);
    const cog = avg(["c1", "c2"]);
    const con = avg(["f1", "f2"]);
    const nivel = (v, inv = false) => {
      if (inv) return v >= 3.5 ? "buena" : v >= 2.5 ? "moderada" : "baja";
      return v >= 3.5 ? "alta" : v >= 2.5 ? "media" : "baja";
    };
    return {
      somatica: nivel(som),
      cognitiva: nivel(cog),
      confianza: nivel(con, true),
      contexto: contextos.find(c => c.id === contexto)?.label,
      fase: fases.find(f => f.id === fase)?.label,
      fecha: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short" }),
    };
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: DS.emerald, fontFamily: "'DM Mono', monospace", letterSpacing: 2, marginBottom: 4 }}>
          CHECK INICIAL · PASO {paso + 1} DE 3
        </div>
        <div style={{ height: 3, background: DS.border, borderRadius: 2 }}>
          <div style={{
            height: "100%", background: `linear-gradient(90deg, ${DS.emerald}, ${DS.emeraldLight})`,
            borderRadius: 2, width: `${((paso + 1) / 3) * 100}%`, transition: "width 0.4s ease",
          }} />
        </div>
      </div>

      {/* Paso 0: Contexto */}
      {paso === 0 && (
        <div>
          <h2 style={{
            fontSize: 22, fontWeight: 700, color: DS.ink, marginBottom: 6,
            fontFamily: "'Cormorant Garamond', serif",
          }}>¿En qué contexto estás?</h2>
          <p style={{ fontSize: 13, color: DS.inkMuted, marginBottom: 20, fontFamily: "'DM Sans', sans-serif" }}>
            Selecciona tu situación actual
          </p>
          {contextos.map((c) => (
            <div key={c.id} onClick={() => { setContexto(c.id); setTimeout(() => setPaso(1), 250); }}
              style={{
                background: contexto === c.id ? DS.emeraldSoft : DS.surface,
                border: `1px solid ${contexto === c.id ? DS.emerald : DS.border}`,
                borderRadius: 14, padding: "16px 20px", marginBottom: 10,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
                transition: "all 0.2s",
              }}>
              <div style={{ fontSize: 26 }}>{c.icono}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: DS.ink, fontFamily: "'DM Sans', sans-serif" }}>{c.label}</div>
                <div style={{ fontSize: 12, color: DS.inkMuted, fontFamily: "'DM Sans', sans-serif" }}>{c.desc}</div>
              </div>
              {contexto === c.id && <div style={{ marginLeft: "auto", color: DS.emerald, fontSize: 16 }}>✓</div>}
            </div>
          ))}
        </div>
      )}

      {/* Paso 1: Fase */}
      {paso === 1 && (
        <div>
          <h2 style={{
            fontSize: 22, fontWeight: 700, color: DS.ink, marginBottom: 6,
            fontFamily: "'Cormorant Garamond', serif",
          }}>¿Cuándo es tu etapa?</h2>
          <p style={{ fontSize: 13, color: DS.inkMuted, marginBottom: 20, fontFamily: "'DM Sans', sans-serif" }}>
            Define la intensidad de la intervención
          </p>
          {fases.map((f) => (
            <div key={f.id} onClick={() => { setFase(f.id); setTimeout(() => setPaso(2), 250); }}
              style={{
                background: fase === f.id ? `${f.color}12` : DS.surface,
                border: `1px solid ${fase === f.id ? f.color : DS.border}`,
                borderRadius: 14, padding: "16px 20px", marginBottom: 10,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
                transition: "all 0.2s",
              }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%", background: f.color, flexShrink: 0,
                boxShadow: fase === f.id ? `0 0 10px ${f.color}` : "none",
              }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: DS.ink, fontFamily: "'DM Sans', sans-serif" }}>{f.label}</div>
                <div style={{ fontSize: 12, color: DS.inkMuted, fontFamily: "'DM Sans', sans-serif" }}>{f.desc}</div>
              </div>
              {fase === f.id && <div style={{ marginLeft: "auto", color: f.color, fontSize: 16 }}>✓</div>}
            </div>
          ))}
        </div>
      )}

      {/* Paso 2: Preguntas */}
      {paso === 2 && (
        <div>
          <h2 style={{
            fontSize: 22, fontWeight: 700, color: DS.ink, marginBottom: 6,
            fontFamily: "'Cormorant Garamond', serif",
          }}>¿Cómo te sientes ahora?</h2>
          <p style={{ fontSize: 13, color: DS.inkMuted, marginBottom: 20, fontFamily: "'DM Sans', sans-serif" }}>
            Responde con honestidad — no hay respuestas incorrectas
          </p>
          {checkPreguntas.map((q) => (
            <div key={q.id} style={{
              background: DS.surface, border: `1px solid ${DS.border}`,
              borderRadius: 12, padding: 16, marginBottom: 12,
            }}>
              <div style={{ fontSize: 13, color: DS.ink, marginBottom: 12, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                {q.texto}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[{ v: 1, l: "Nada" }, { v: 2, l: "Algo" }, { v: 3, l: "Bastante" }, { v: 4, l: "Mucho" }].map((op) => (
                  <button key={op.v} onClick={() => setRespuestas(p => ({ ...p, [q.id]: op.v }))}
                    style={{
                      flex: 1, padding: "8px 4px", borderRadius: 8,
                      border: `1px solid ${respuestas[q.id] === op.v ? DS.emerald : DS.border}`,
                      background: respuestas[q.id] === op.v ? DS.emeraldSoft : "transparent",
                      color: respuestas[q.id] === op.v ? DS.emerald : DS.inkMuted,
                      fontSize: 11, cursor: "pointer", transition: "all 0.15s",
                      fontFamily: "'DM Mono', monospace",
                    }}>{op.l}</button>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={() => onCompletado(calcularPerfil())}
            disabled={Object.keys(respuestas).length < checkPreguntas.length}
            style={{
              width: "100%", padding: 14, borderRadius: 12, border: "none", marginTop: 4,
              background: Object.keys(respuestas).length >= checkPreguntas.length
                ? `linear-gradient(135deg, ${DS.emerald}, ${DS.emeraldMid})` : DS.border,
              color: Object.keys(respuestas).length >= checkPreguntas.length ? "#fff" : DS.inkMuted,
              fontSize: 14, fontWeight: 700,
              cursor: Object.keys(respuestas).length >= checkPreguntas.length ? "pointer" : "not-allowed",
              fontFamily: "'DM Sans', sans-serif",
            }}>VER MI PERFIL →</button>
        </div>
      )}
    </div>
  );
}

// ─── PANTALLA: PERFIL + PLAN ──────────────────────────────────────────────────
function BarraEstado({ label, valor, color }) {
  const ancho = valor === "alta" || valor === "buena" ? "85%" : valor === "media" || valor === "moderada" ? "50%" : "20%";
  const texto = valor === "alta" || valor === "buena" ? "↑ ALTO" : valor === "media" || valor === "moderada" ? "→ MEDIO" : "↓ BAJO";
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 11, color: DS.inkMuted, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>
          {label.toUpperCase()}
        </span>
        <span style={{ fontSize: 11, color, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{texto}</span>
      </div>
      <div style={{ height: 4, background: DS.border, borderRadius: 2 }}>
        <div style={{ height: "100%", background: color, borderRadius: 2, width: ancho, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

const modulosData = [
  { id: "A", icono: "🫁", titulo: "Regulación de Activación", desc: "Controla tu energía física", para: (p) => p.somatica === "alta" },
  { id: "B", icono: "🧠", titulo: "Control del Pensamiento", desc: "Silencia el ruido mental", para: (p) => p.cognitiva === "alta" },
  { id: "C", icono: "🔥", titulo: "Construcción de Confianza", desc: "Activa tu historial de éxitos", para: (p) => p.confianza === "baja" },
  { id: "D", icono: "🎯", titulo: "Foco y Concentración", desc: "Ancla tu atención al presente", para: () => true },
  { id: "E", icono: "📊", titulo: "Seguimiento y Evolución", desc: "Después de tu etapa", para: () => false },
];

function PantallaPerfilPlan({ perfil, onModulo }) {
  const recomendados = modulosData.filter(m => m.para(perfil));

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: DS.emerald, fontFamily: "'DM Mono', monospace", letterSpacing: 2, marginBottom: 4 }}>
          TU PERFIL · {perfil.contexto?.toUpperCase()} · {perfil.fase?.toUpperCase()}
        </div>
        <h2 style={{
          fontSize: 22, fontWeight: 700, color: DS.ink,
          fontFamily: "'Cormorant Garamond', serif",
        }}>Tu estado en este momento</h2>
      </div>

      {/* Barras de estado */}
      <div style={{
        background: DS.surface, border: `1px solid ${DS.border}`,
        borderRadius: 16, padding: 22, marginBottom: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}>
        <BarraEstado label="Ansiedad Somática" valor={perfil.somatica}
          color={perfil.somatica === "alta" ? DS.danger : perfil.somatica === "media" ? DS.warn : DS.emeraldLight} />
        <BarraEstado label="Ansiedad Cognitiva" valor={perfil.cognitiva}
          color={perfil.cognitiva === "alta" ? DS.danger : perfil.cognitiva === "media" ? DS.warn : DS.emeraldLight} />
        <BarraEstado label="Autoconfianza" valor={perfil.confianza}
          color={perfil.confianza === "buena" ? DS.emeraldLight : perfil.confianza === "moderada" ? DS.warn : DS.danger} />
      </div>

      {/* Análisis IA */}
      <div style={{
        background: DS.bgDark, borderRadius: 14, padding: 20, marginBottom: 20,
      }}>
        <div style={{ fontSize: 10, color: DS.goldLight, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 8 }}>
          ANÁLISIS IA · SCIAT
        </div>
        <p style={{ fontSize: 13, color: "#c8d5d0", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
          {recomendados.length >= 3
            ? "Detecto activación elevada con confianza en desarrollo. La prioridad es regular el cuerpo primero, luego el pensamiento."
            : recomendados.length === 2
            ? "Tu estado muestra áreas específicas de mejora. El plan está personalizado para tu etapa."
            : "Tu estado es sólido. El foco ahora es mantener y afinar tu concentración."}
        </p>
      </div>

      {/* Plan de módulos */}
      <div style={{ fontSize: 11, color: DS.inkMuted, fontFamily: "'DM Mono', monospace", letterSpacing: 2, marginBottom: 14 }}>
        TU PLAN — {recomendados.length} MÓDULOS ACTIVOS
      </div>

      {recomendados.map((mod) => {
        const mc = MOD_COLORS[mod.id];
        return (
          <div key={mod.id}
            onClick={() => onModulo(mod.id)}
            style={{
              background: DS.surface, border: `1px solid ${DS.border}`,
              borderRadius: 14, padding: 18, marginBottom: 10, cursor: "pointer",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = mc.accent}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = DS.border}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: mc.soft, border: `1px solid ${mc.border}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                flexShrink: 0,
              }}>{mod.icono}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: DS.ink, fontFamily: "'DM Sans', sans-serif" }}>
                    {mod.titulo}
                  </div>
                  <div style={{
                    fontSize: 9, color: mc.accent, background: mc.soft,
                    padding: "3px 7px", borderRadius: 5,
                    fontFamily: "'DM Mono', monospace", letterSpacing: 1,
                  }}>MOD {mod.id}</div>
                </div>
                <div style={{ fontSize: 12, color: DS.inkMuted, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{mod.desc}</div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Módulo E siempre al final */}
      <div style={{
        background: DS.bgWarm, border: `1px dashed ${DS.border}`,
        borderRadius: 14, padding: 16, marginTop: 4, display: "flex", alignItems: "center", gap: 12,
      }}>
        <span style={{ fontSize: 20 }}>📊</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: DS.inkMid, fontFamily: "'DM Sans', sans-serif" }}>
            Módulo E — Seguimiento
          </div>
          <div style={{ fontSize: 11, color: DS.inkMuted, fontFamily: "'DM Sans', sans-serif" }}>
            Disponible después de tu etapa de presión
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PANTALLA: MÓDULO ─────────────────────────────────────────────────────────
function PantallaModulo({ moduloId, onVolver }) {
  const mc = MOD_COLORS[moduloId];
  const mod = modulosData.find(m => m.id === moduloId);

  const ejerciciosPorModulo = {
    A: [
      { id: "A1", titulo: "Respiración 4-7-8", icono: "🫁", duracion: "4 min", desc: "Activa el sistema nervioso parasimpático en minutos." },
      { id: "A2", titulo: "Relajación Muscular Progresiva", icono: "💆", duracion: "6 min", desc: "Libera la tensión acumulada con la técnica de Jacobson." },
      { id: "A3", titulo: "Activación Controlada", icono: "⚡", duracion: "3 min", desc: "Actívate cuando tu energía está baja antes de la etapa." },
    ],
    B: [
      { id: "B1", titulo: "Reestructuración Cognitiva", icono: "🧠", duracion: "5 min", desc: "Transforma los pensamientos bloqueantes en impulsores." },
      { id: "B2", titulo: "Detención del Pensamiento", icono: "🛑", duracion: "3 min", desc: "Interrumpe el pensamiento negativo en el momento." },
      { id: "B3", titulo: "Visualización de Ejecución", icono: "🎬", duracion: "7 min", desc: "Ensaya el proceso, no el resultado." },
    ],
    C: [
      { id: "C1", titulo: "Registro de Logros Previos", icono: "🏆", duracion: "6 min", desc: "Tu historial de éxito es tu combustible más poderoso." },
      { id: "C2", titulo: "Rutina de Preparación", icono: "⚙️", duracion: "5 min", desc: "Activa tu estado óptimo con una secuencia repetible." },
      { id: "C3", titulo: "Diálogo Interno Positivo", icono: "💬", duracion: "4 min", desc: "Construye tu voz interna de alto rendimiento." },
    ],
    D: [
      { id: "D1", titulo: "Atención Selectiva", icono: "🎯", duracion: "4 min", desc: "Filtra el ruido y amplifica la señal que importa." },
      { id: "D2", titulo: "Calentamiento Mental", icono: "🔆", duracion: "5 min", desc: "Lleva tu mente a su punto óptimo antes de la etapa." },
      { id: "D3", titulo: "Control del Momento Presente", icono: "⏱️", duracion: "6 min", desc: "Ancla toda tu energía en el único momento donde puedes actuar." },
    ],
    E: [
      { id: "E1", titulo: "Análisis de Desempeño", icono: "📊", duracion: "8 min", desc: "Convierte la experiencia en aprendizaje estructurado." },
      { id: "E2", titulo: "Cierre Emocional", icono: "🌿", duracion: "5 min", desc: "Completa el ciclo emocional después de la presión." },
      { id: "E3", titulo: "Evolución Personal", icono: "📈", duracion: "6 min", desc: "Observa tu patrón de crecimiento con ayuda de la IA." },
    ],
  };

  const ejercicios = ejerciciosPorModulo[moduloId] || [];
  const [ejercicioActivo, setEjercicioActivo] = useState(null);
  const [paso, setPaso] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const [completado, setCompletado] = useState(false);
  const intervaloRef = useRef(null);

  const pasosPorEjercicio = {
    A1: [
      { texto: "Encuentra una postura cómoda. Cierra los ojos si puedes.", duracion: 5 },
      { texto: "Inhala por la nariz contando hasta 4. Lento, profundo.", duracion: 4 },
      { texto: "Retén el aire contando hasta 7. Mantén la calma.", duracion: 7 },
      { texto: "Exhala completamente por la boca contando hasta 8. Suelta la tensión.", duracion: 8 },
      { texto: "Repite el ciclo. Inhala 4, retén 7, exhala 8. Vas muy bien.", duracion: 19 },
      { texto: "Un ciclo más. Cada respiración te acerca a tu estado óptimo.", duracion: 19 },
      { texto: "Abre los ojos. Observa cómo se siente tu cuerpo. Eso es regulación.", duracion: 6 },
    ],
    A2: [
      { texto: "Siéntate cómodamente. Pies en el suelo. Dos respiraciones profundas.", duracion: 8 },
      { texto: "Aprieta los puños con fuerza. 5 segundos. Siente la tensión.", duracion: 5 },
      { texto: "Suelta. Observa la diferencia entre tensión y relajación.", duracion: 8 },
      { texto: "Hombros hacia las orejas. Fuerza máxima. 5 segundos.", duracion: 5 },
      { texto: "Suelta los hombros. Déjalos caer. Siente el peso que se va.", duracion: 8 },
      { texto: "Aprieta los ojos y frunce el ceño. 5 segundos.", duracion: 5 },
      { texto: "Suelta el rostro. Mandíbula floja. Frente suave.", duracion: 8 },
      { texto: "Escanea tu cuerpo. Está más ligero. Llevas esa calma a tu etapa.", duracion: 10 },
    ],
    A3: [
      { texto: "De pie. Sacude las manos con fuerza. 10 segundos. Despierta el cuerpo.", duracion: 10 },
      { texto: "Inhala rápido por la nariz, exhala fuerte por la boca. 5 veces.", duracion: 15 },
      { texto: "Di en voz alta: Estoy listo. Estoy preparado. Este momento es mío.", duracion: 8 },
      { texto: "Salta en el lugar 10 veces. Liviano, rítmico. Conecta mente y cuerpo.", duracion: 15 },
      { texto: "Para. Respira. Siente la energía circulando. Eso es activación óptima.", duracion: 8 },
    ],
    B1: [
      { texto: "Identifica el pensamiento que aparece antes de tu etapa. Solo obsérvalo.", duracion: 10 },
      { texto: "Escribe ese pensamiento. Sin filtro. Lo que realmente aparece.", duracion: 30 },
      { texto: "Pregúntate: ¿Es un hecho o una interpretación? ¿Qué evidencia real tienes?", duracion: 15 },
      { texto: "Escribe la evidencia real. Sé honesto. A menudo no hay evidencia.", duracion: 30 },
      { texto: "Reescribe el pensamiento. Que sea realista y que puedas creerlo.", duracion: 30 },
      { texto: "Ese pensamiento alternativo es tuyo. Léelo antes de tu etapa.", duracion: 10 },
    ],
    B2: [
      { texto: "Cuando aparezca un pensamiento negativo — di mentalmente STOP con fuerza.", duracion: 8 },
      { texto: "Toma una respiración lenta y profunda. Una sola.", duracion: 8 },
      { texto: "Lleva tu atención a algo concreto: tus pies, lo que ves, lo que tienes en la mano.", duracion: 10 },
      { texto: "Pregúntate: ¿Cuál es el siguiente paso concreto que necesito dar ahora?", duracion: 10 },
      { texto: "Practica esta secuencia hasta automatizarla. Es una habilidad entrenable.", duracion: 8 },
    ],
    B3: [
      { texto: "Cierra los ojos. Lleva tu mente al momento justo antes de tu etapa.", duracion: 20 },
      { texto: "¿Cómo se siente tu cuerpo? Tu postura, tu respiración. Sereno y activado.", duracion: 20 },
      { texto: "Ejecuta en tu mente. Tu primer movimiento, tu primera acción. Con precisión.", duracion: 25 },
      { texto: "Imagina que algo sale diferente. ¿Cómo respondes? Visualiza tu recuperación.", duracion: 20 },
      { texto: "El último paso del proceso hecho con todo lo que tienes. Eso es suficiente.", duracion: 20 },
      { texto: "Abre los ojos. Tu cerebro acaba de ensayar. Cada repetición lo hace más familiar.", duracion: 10 },
    ],
    C1: [
      { texto: "¿Cuál es una situación de presión que hayas superado recientemente?", duracion: 30 },
      { texto: "¿Cuál es el momento más difícil que atravesaste y del que saliste adelante?", duracion: 30 },
      { texto: "¿De qué logro te sientes más orgulloso? El que te hace sentir capaz de mucho.", duracion: 30 },
      { texto: "Observa el patrón. Hay una forma en que tú respondes bajo presión real.", duracion: 15 },
      { texto: "Estos son tu banco de confianza. Léelos antes de tu próxima etapa.", duracion: 10 },
    ],
    C2: [
      { texto: "Tres respiraciones lentas. Con cada exhale suelta lo que no necesitas llevar.", duracion: 20 },
      { texto: "Cierra los ojos. Visualiza el primer paso concreto de tu etapa.", duracion: 20 },
      { texto: "Di tu frase de activación: Estoy listo. He preparado esto. Es mi momento.", duracion: 10 },
      { texto: "Haz un gesto físico que marque el inicio. Ese gesto es tu señal de arranque.", duracion: 15 },
      { texto: "Practica esta secuencia antes de cada etapa. Con el tiempo se activa sola.", duracion: 10 },
    ],
    C3: [
      { texto: "¿Qué palabras aparecen en tu mente cuando estás bajo presión real?", duracion: 30 },
      { texto: "Transforma ese pensamiento. De 'no puedo' a 'puedes manejarlo'.", duracion: 12 },
      { texto: "Escribe una frase corta en segunda persona que puedas creer.", duracion: 30 },
      { texto: "Di tu frase ahora con toda la intensidad que puedas.", duracion: 8 },
      { texto: "Repite esta frase exacta en cada momento de presión. La repetición la convierte en reflejo.", duracion: 10 },
    ],
    D1: [
      { texto: "Imagina un círculo. Dentro solo lo que puedes controlar ahora.", duracion: 18 },
      { texto: "¿Cuál es la única cosa que necesitas ejecutar bien en este momento?", duracion: 12 },
      { texto: "Cuando aparezca una distracción: 3 cosas que ves, 2 sensaciones, 1 foco.", duracion: 18 },
      { texto: "Aplica el 3-2-1 ahora mismo. Tres cosas que ves. Dos en el cuerpo. Un foco.", duracion: 20 },
      { texto: "No importa cuántas veces te distraigas. Solo importa cuántas veces vuelves.", duracion: 12 },
    ],
    D2: [
      { texto: "Responde mentalmente: ¿Cuál es tu nombre? ¿Dónde estás? ¿Qué día es hoy?", duracion: 16 },
      { texto: "¿Qué vas a hacer? ¿Cuál es el objetivo concreto? ¿Qué has preparado?", duracion: 20 },
      { texto: "Imagina el primer minuto de tu etapa. Los primeros movimientos. Las primeras decisiones.", duracion: 20 },
      { texto: "Hoy voy a dar lo mejor que tengo en este momento. No lo de ayer — lo de ahora.", duracion: 10 },
      { texto: "Mente activada, contextualizada y enfocada. Llévalo a tu etapa.", duracion: 8 },
    ],
    D3: [
      { texto: "Cierra los ojos. Lleva tu atención a tu respiración. Solo obsérvala.", duracion: 25 },
      { texto: "¿Qué pensamiento te arrastra fuera del momento cuando estás bajo presión?", duracion: 20 },
      { texto: "Cuando aparezca di: 'Eso es el futuro. Ahora estoy aquí.' Y regresa.", duracion: 16 },
      { texto: "Deja que el pensamiento aparezca. Obsérvalo. Ahora regresa al presente.", duracion: 15 },
      { texto: "Cada vez que practicas este retorno, se vuelve más rápido y más automático.", duracion: 10 },
    ],
    E1: [
      { texto: "Sin juicio — con curiosidad. ¿Cómo evalúas tu rendimiento en esta etapa?", duracion: 20 },
      { texto: "¿Cómo estaba tu estado mental? ¿Enfocado o alterado?", duracion: 20 },
      { texto: "¿Qué hiciste bien? ¿Qué funcionó como lo planeaste o mejor?", duracion: 35 },
      { texto: "¿Qué cambiarías? No lo que salió mal — lo que harías diferente.", duracion: 35 },
      { texto: "Si te quedaras con una sola lección de esta etapa, ¿cuál sería?", duracion: 35 },
      { texto: "Eso es crecimiento estructurado. Cada etapa analizada te hace mejor.", duracion: 10 },
    ],
    E2: [
      { texto: "Sin juzgarlo — reconoce lo que sientes. Alivio, agotamiento, orgullo. Todo vale.", duracion: 18 },
      { texto: "Imagina que la etapa es un objeto que sostienes. Con cada exhale, relaja el agarre.", duracion: 20 },
      { texto: "Haz un gesto físico de cierre. Ese gesto le dice al cuerpo que puede soltar.", duracion: 12 },
      { texto: "Reconoce que te presentaste. Que diste lo que tenías. Eso siempre vale.", duracion: 14 },
      { texto: "El siguiente paso es descansar. No analizar. No planificar. Solo descansar.", duracion: 10 },
    ],
    E3: [
      { texto: "Cada etapa registrada forma un patrón que la IA aprende sobre ti.", duracion: 14 },
      { texto: "La IA identifica cuándo sueles tener ansiedad alta y qué técnicas te regulan mejor.", duracion: 16 },
      { texto: "Con el tiempo detecta tus fortalezas recurrentes en tus mejores etapas.", duracion: 14 },
      { texto: "No hay etapas buenas o malas. Hay etapas con información. Cuantas más registres, mejor.", duracion: 12 },
    ],
  };

  const pasosActuales = ejercicioActivo ? (pasosPorEjercicio[ejercicioActivo.id] || []) : [];

  useEffect(() => {
    if (ejercicioActivo?.iniciado && !completado) {
      const duracion = pasosActuales[paso]?.duracion || 10;
      setSegundos(duracion);
      setCorriendo(false);
    }
  }, [paso, ejercicioActivo]);

  useEffect(() => {
    if (corriendo) {
      intervaloRef.current = setInterval(() => {
        setSegundos(s => {
          if (s <= 1) {
            clearInterval(intervaloRef.current);
            if (paso < pasosActuales.length - 1) {
              setPaso(p => p + 1);
            } else {
              setCorriendo(false);
              setCompletado(true);
            }
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervaloRef.current);
  }, [corriendo, paso]);

  if (ejercicioActivo?.iniciado && !completado && pasosActuales.length > 0) {
    const pasoActual = pasosActuales[paso];
    const radio = 44;
    const circ = 2 * Math.PI * radio;
    const duracionPaso = pasoActual?.duracion || 10;
    const progreso = ((duracionPaso - segundos) / duracionPaso) * circ;
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => { setEjercicioActivo(null); setPaso(0); setCorriendo(false); setCompletado(false); }}
            style={{ background: "transparent", border: `1px solid ${DS.border}`, borderRadius: 8, padding: "6px 12px", color: DS.inkMuted, fontSize: 13, cursor: "pointer" }}>←</button>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: DS.ink, fontFamily: "'DM Sans', sans-serif" }}>{ejercicioActivo.titulo}</div>
            <div style={{ fontSize: 11, color: DS.inkMuted, fontFamily: "'DM Mono', monospace" }}>Paso {paso + 1} de {pasosActuales.length}</div>
          </div>
        </div>
        <div style={{ height: 3, background: DS.border, borderRadius: 2, marginBottom: 20 }}>
          <div style={{ height: "100%", background: mc.accent, borderRadius: 2, width: `${((paso + 1) / pasosActuales.length) * 100}%`, transition: "width 0.5s" }} />
        </div>
        <div style={{ background: DS.surface, border: `1px solid ${DS.border}`, borderRadius: 16, padding: 24, textAlign: "center", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "center", margin: "0 0 16px" }}>
            <div style={{ position: "relative", width: 104, height: 104 }}>
              <svg width={104} height={104} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={52} cy={52} r={radio} fill="none" stroke={DS.border} strokeWidth={5} />
                <circle cx={52} cy={52} r={radio} fill="none" stroke={mc.accent} strokeWidth={5}
                  strokeDasharray={circ} strokeDashoffset={circ - progreso}
                  strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }} />
              </svg>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: mc.accent, fontFamily: "'DM Mono', monospace" }}>{segundos}</div>
                <div style={{ fontSize: 9, color: DS.inkMuted, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>SEG</div>
              </div>
            </div>
          </div>
          <p role="status" aria-live="polite" style={{ fontSize: 15, color: DS.ink, lineHeight: 1.8, marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>
            {pasoActual?.texto}
          </p>
          {!corriendo ? (
            <button onClick={() => setCorriendo(true)} style={{
              width: "100%", padding: 14, borderRadius: 12, border: "none",
              background: `linear-gradient(135deg, ${mc.accent}, ${mc.accent}cc)`,
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>▶ {paso === 0 ? "INICIAR" : "CONTINUAR"}</button>
          ) : (
            <button onClick={() => setCorriendo(false)} style={{
              width: "100%", padding: 14, borderRadius: 12, border: `1px solid ${DS.border}`,
              background: "transparent", color: DS.ink, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>⏸ PAUSAR</button>
          )}
        </div>
        <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
          {pasosActuales.map((_, i) => (
            <div key={i} style={{ width: i === paso ? 18 : 6, height: 6, borderRadius: 3, background: i <= paso ? mc.accent : DS.border, transition: "all 0.3s" }} />
          ))}
        </div>
      </div>
    );
  }

  if (completado) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: DS.ink, marginBottom: 8, fontFamily: "'Cormorant Garamond', serif" }}>Ejercicio completado</h2>
        <p style={{ fontSize: 14, color: DS.inkMuted, lineHeight: 1.6, marginBottom: 28, fontFamily: "'DM Sans', sans-serif" }}>
          Has trabajado tu rendimiento. Llevas eso a tu etapa.
        </p>
        <button onClick={() => { setEjercicioActivo(null); setPaso(0); setCorriendo(false); setCompletado(false); }} style={{
          width: "100%", padding: 14, borderRadius: 12, border: "none",
          background: `linear-gradient(135deg, ${mc.accent}, ${mc.accent}cc)`,
          color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 12, fontFamily: "'DM Sans', sans-serif",
        }}>← Volver al módulo</button>
      </div>
    );
  }

  if (ejercicioActivo && !ejercicioActivo.iniciado) {
    return (
      <div>
        <div style={{
          background: mc.soft, border: `1px solid ${mc.border}`,
          borderRadius: 14, padding: 20, marginBottom: 20,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>{ejercicioActivo.icono}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: DS.ink, fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>
            {ejercicioActivo.titulo}
          </div>
          <div style={{ fontSize: 11, color: mc.accent, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 12 }}>
            {ejercicioActivo.duracion} · MÓDULO {moduloId}
          </div>
          <p style={{ fontSize: 13, color: DS.inkMuted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, marginBottom: 16 }}>
            {ejercicioActivo.desc}
          </p>
          <div style={{
            background: DS.bgDark, borderRadius: 10, padding: "10px 16px",
            display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
          }}>
            <span style={{ fontSize: 16 }}>🎙️</span>
            <span style={{ fontSize: 12, color: "#c8d5d0", fontFamily: "'DM Sans', sans-serif" }}>
              Audio con voz del autor disponible
            </span>
          </div>
          <div style={{
            background: DS.surface, border: `1px solid ${DS.border}`,
            borderRadius: 10, padding: 14, marginBottom: 16,
          }}>
            <div style={{ fontSize: 10, color: DS.inkMuted, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6 }}>
              ACCESIBILIDAD
            </div>
            <div style={{ fontSize: 12, color: DS.inkMid, fontFamily: "'DM Sans', sans-serif" }}>
              ♿ Subtítulos CC · Lector de pantalla
            </div>
          </div>
          <button onClick={() => setEjercicioActivo({ ...ejercicioActivo, iniciado: true })} style={{
            width: "100%", padding: 14, borderRadius: 12, border: "none",
            background: `linear-gradient(135deg, ${mc.accent}, ${mc.accent}cc)`,
            color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}>▶ INICIAR EJERCICIO</button>
          <button onClick={() => setEjercicioActivo(null)} style={{
            width: "100%", padding: 12, borderRadius: 12, marginTop: 10,
            border: `1px solid ${DS.border}`, background: "transparent",
            color: DS.inkMuted, fontSize: 13, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}>← Volver al módulo</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Cabecera módulo */}
      <div style={{
        background: DS.bgDark, borderRadius: 20, padding: 26, marginBottom: 20,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -30, right: -30, width: 130, height: 130,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${mc.soft} 0%, transparent 70%)`,
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: mc.soft, border: `1px solid ${mc.border}`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
          }}>{mod?.icono}</div>
          <div>
            <div style={{ fontSize: 10, color: mc.accent, fontFamily: "'DM Mono', monospace", letterSpacing: 2, marginBottom: 2 }}>
              MÓDULO {moduloId}
            </div>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: "#f0ede6", fontFamily: "'Cormorant Garamond', serif" }}>
              {mod?.titulo}
            </h2>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[mc.label, "Todos los contextos", "Con audio"].map((tag, i) => (
            <div key={i} style={{
              fontSize: 9, color: i === 0 ? mc.accent : DS.inkMuted,
              background: i === 0 ? mc.soft : DS.surfaceDark,
              padding: "3px 8px", borderRadius: 10,
              fontFamily: "'DM Mono', monospace", letterSpacing: 0.5,
              border: `1px solid ${i === 0 ? mc.border : DS.borderDark || "#1e3a31"}`,
            }}>{tag}</div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 11, color: DS.inkMuted, fontFamily: "'DM Mono', monospace", letterSpacing: 2, marginBottom: 14 }}>
        EJERCICIOS — {ejercicios.length} disponibles
      </div>

      {ejercicios.map((ej) => (
        <div key={ej.id}
          onClick={() => setEjercicioActivo(ej)}
          style={{
            background: DS.surface, border: `1px solid ${DS.border}`,
            borderRadius: 14, padding: 18, marginBottom: 10, cursor: "pointer",
            transition: "border-color 0.2s",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = mc.accent}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = DS.border}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: mc.soft, border: `1px solid ${mc.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, flexShrink: 0,
            }}>{ej.icono}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: DS.ink, fontFamily: "'DM Sans', sans-serif" }}>{ej.titulo}</div>
                <div style={{
                  fontSize: 9, color: mc.accent, background: mc.soft,
                  padding: "3px 7px", borderRadius: 5, fontFamily: "'DM Mono', monospace",
                  letterSpacing: 1, flexShrink: 0, marginLeft: 8,
                }}>{ej.duracion}</div>
              </div>
              <p style={{ fontSize: 12, color: DS.inkMuted, lineHeight: 1.5, margin: "4px 0 0", fontFamily: "'DM Sans', sans-serif" }}>
                {ej.desc}
              </p>
            </div>
          </div>
          <div style={{
            marginTop: 12, paddingTop: 12, borderTop: `1px solid ${DS.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{ fontSize: 11, color: DS.inkMuted, fontFamily: "'DM Sans', sans-serif" }}>
              🎙️ Audio incluido
            </div>
            <div style={{ fontSize: 12, color: mc.accent, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
              Comenzar →
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function SCIATPeakState() {
  const [pantalla, setPantalla] = useState("inicio");
  const [perfil, setPerfil] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [moduloActivo, setModuloActivo] = useState(null);
  const [animando, setAnimando] = useState(true);

  const navegar = (destino) => {
    setAnimando(false);
    setTimeout(() => { setPantalla(destino); setAnimando(true); }, 150);
  };

  const handleCheckCompletado = (nuevoPerfil) => {
    setPerfil(nuevoPerfil);
    setHistorial(prev => [...prev, nuevoPerfil]);
    navegar("plan");
  };

  const handleModulo = (id) => {
    setModuloActivo(id);
    navegar("modulo");
  };

  return (
    <div style={{
      minHeight: "100vh", background: DS.bg,
      fontFamily: "'DM Sans', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "24px 16px 40px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;0,900;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: 'DM Sans', sans-serif; }
        textarea::placeholder { color: #8aaa9f; }
      `}</style>

      <div style={{
        width: "100%", maxWidth: 420,
        opacity: animando ? 1 : 0,
        transform: animando ? "translateY(0)" : "translateY(12px)",
        transition: "all 0.25s ease",
      }}>
        <Header
          pantalla={pantalla}
          onHome={() => navegar("inicio")}
        />

        {pantalla === "inicio" && (
          <PantallaInicio
            onIniciar={() => navegar("check")}
            historial={historial}
          />
        )}
        {pantalla === "check" && (
          <PantallaCheck onCompletado={handleCheckCompletado} />
        )}
        {pantalla === "plan" && perfil && (
          <PantallaPerfilPlan perfil={perfil} onModulo={handleModulo} />
        )}
        {pantalla === "modulo" && moduloActivo && (
          <PantallaModulo
            moduloId={moduloActivo}
            onVolver={() => navegar("plan")}
          />
        )}
      </div>
    </div>
  );
}