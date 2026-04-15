import { useState, useEffect, useRef } from "react";

// ─── TEMA OSCURO SCIAT — FORZADO EN TODOS LOS DISPOSITIVOS ───────────────────
const DS = {
  bg:            "#0a0f1e",
  surface:       "#111827",
  card:          "#1a2235",
  cardDark:      "#0d1520",
  emerald:       "#00d4aa",
  emeraldSoft:   "#00d4aa18",
  emeraldBorder: "#00d4aa35",
  gold:          "#f59e0b",
  goldLight:     "#fbbf24",
  goldSoft:      "#f59e0b18",
  ink:           "#f0f4ff",
  inkMid:        "#c8d5e8",
  inkMuted:      "#8899bb",
  border:        "#1e2d45",
  danger:        "#ef4444",
  warn:          "#f59e0b",
};

const MOD = {
  A: { accent:"#00d4aa", soft:"#00d4aa18", border:"#00d4aa35", label:"Regulación" },
  B: { accent:"#818cf8", soft:"#818cf818", border:"#818cf835", label:"Pensamiento" },
  C: { accent:"#f59e0b", soft:"#f59e0b18", border:"#f59e0b35", label:"Confianza" },
  D: { accent:"#06b6d4", soft:"#06b6d418", border:"#06b6d435", label:"Foco" },
  E: { accent:"#a78bfa", soft:"#a78bfa18", border:"#a78bfa35", label:"Seguimiento" },
};

const MODULOS = [
  { id:"A", icono:"🫁", titulo:"Regulación de Activación", desc:"Controla tu energía física" },
  { id:"B", icono:"🧠", titulo:"Control del Pensamiento", desc:"Silencia el ruido mental" },
  { id:"C", icono:"🔥", titulo:"Construcción de Confianza", desc:"Activa tu historial de éxitos" },
  { id:"D", icono:"🎯", titulo:"Foco y Concentración", desc:"Ancla tu atención al presente" },
  { id:"E", icono:"📊", titulo:"Seguimiento y Evolución", desc:"Después de tu etapa" },
];

// ─── RUTAS DE AUDIO — nombres limpios en public/audio/es/modulo-A/ ───────────
const BASE = "/audio/es/modulo-A/";
const BASE_CHECK = "/audio/es/check/";
const AUDIO = {
  A1: {
    intro: BASE + "A1-intro-respiracion.m4a",
    introDur: 12,
    pasos: [
      BASE + "A1-p1-preparacion.m4a",
      BASE + "A1-p2-inhala.m4a",
      BASE + "A1-p3-reten.m4a",
      BASE + "A1-p4-exhala.m4a",
      BASE + "A1-p5-ciclo2.m4a",
      BASE + "A1-p6-ciclo3.m4a",
      BASE + "A1-p7-cierre.m4a",
    ]
  },
  A2: {
    intro: BASE + "A2-intro-relajacion.m4a",
    introDur: 12,
    pasos: [
      BASE + "A2-p1-preparacion.m4a",
      BASE + "A2-p2-manos-tension.m4a",
      BASE + "A2-p3-manos-relajacion.m4a",
      BASE + "A2-p4-hombros-tension.m4a",
      BASE + "A2-p5-hombros-relajacion.m4a",
      BASE + "A2-p6-rostro-tension.m4a",
      BASE + "A2-p7-rostro-relajacion.m4a",
      BASE + "A2-p8-cierre.m4a",
    ]
  },
  A3: {
    intro: BASE + "A3-intro-activacion.m4a",
    introDur: 8,
    pasos: [
      BASE + "A3-p1-activacion-inicial.m4a",
      BASE + "A3-p2-respiracion-activa.m4a",
      BASE + "A3-p3-anclaje-mental.m4a",
      BASE + "A3-p4-activacion-fisica.m4a",
      BASE + "A3-p5-cierre.m4a",
    ]
  },
};

// Audios del Check inicial — contexto
const AUDIO_CHECK = {
  deportivo:       BASE_CHECK + "check-deportivo.m4a",
  academico:       BASE_CHECK + "check-academico.m4a",
  organizacional:  BASE_CHECK + "check-organizacional.m4a",
};

// ─── WEB SPEECH ───────────────────────────────────────────────────────────────
const hablar = (texto, rate = 0.88) => {
  if(!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = "es-ES";
  u.rate = rate;
  u.pitch = 1.05;
  // Las voces pueden no estar cargadas aún — esperamos si es necesario
  const voces = window.speechSynthesis.getVoices();
  if(voces.length > 0) {
    const vozEs = voces.find(v => v.lang.startsWith("es") && v.name.includes("Female"))
      || voces.find(v => v.lang.startsWith("es"))
      || voces[0];
    if(vozEs) u.voice = vozEs;
    window.speechSynthesis.speak(u);
  } else {
    // Esperar a que se carguen las voces
    window.speechSynthesis.onvoiceschanged = () => {
      const v2 = window.speechSynthesis.getVoices();
      const vozEs = v2.find(v => v.lang.startsWith("es")) || v2[0];
      if(vozEs) u.voice = vozEs;
      window.speechSynthesis.speak(u);
    };
  }
};
const detenerVoz = () => { if(window.speechSynthesis) window.speechSynthesis.cancel(); };

// ─── AUDIO BIENVENIDA (voz de autor) ─────────────────────────────────────────
// Archivo: public/audio/es/bienvenida.m4a
const audioBienvenidaRef = { current: null };
const reproducirBienvenida = () => {
  const a = new Audio("/audio/es/bienvenida.m4a");
  audioBienvenidaRef.current = a;
  a.play().catch(() => {
    hablar("Hola. Soy SCIAT Peak State. Te acompaño en esta etapa. Vamos, tú puedes.");
  });
};
const detenerBienvenida = () => {
  if(audioBienvenidaRef.current) {
    audioBienvenidaRef.current.pause();
    audioBienvenidaRef.current = null;
  }
  detenerVoz();
};

const EJERCICIOS = {
  A: [
    { id:"A1", icono:"🫁", titulo:"Respiración 4-7-8", dur:"4 min", desc:"Activa el sistema nervioso parasimpático en minutos.",
      pasos:[
        { t:"Encuentra una postura cómoda. Cierra los ojos si puedes.", s:11 },
        { t:"Inhala por la nariz contando hasta 4. Lento, profundo, sin forzar.", s:11 },
        { t:"Retén el aire contando hasta 7. Mantén la calma. Tu cuerpo sabe qué hacer.", s:17 },
        { t:"Exhala completamente por la boca contando hasta 8. Suelta toda la tensión.", s:18 },
        { t:"Repite el ciclo. Inhala 4, retén 7, exhala 8. Vas muy bien.", s:12 },
        { t:"Un ciclo más. Cada respiración te acerca a tu estado óptimo.", s:6 },
        { t:"Abre los ojos suavemente. Observa cómo se siente tu cuerpo. Eso es regulación.", s:9 },
      ]},
    { id:"A2", icono:"💆", titulo:"Relajación Muscular Progresiva", dur:"6 min", desc:"Libera la tensión acumulada con la técnica de Jacobson adaptada.",
      pasos:[
        { t:"Donde estés — de pie, sentado o en movimiento — lleva tu atención al cuerpo. Dos respiraciones profundas. Inhala... exhala. Una más. Inhala... exhala.", s:26 },
        { t:"Aprieta los puños con fuerza durante 5 segundos. Siente la tensión.", s:9 },
        { t:"Suelta. Observa la diferencia entre tensión y relajación.", s:10 },
        { t:"Hombros hacia las orejas con fuerza máxima. Mantén 5 segundos.", s:8 },
        { t:"Suelta los hombros completamente. Déjalos caer. Siente el peso que se va.", s:8 },
        { t:"Aprieta los ojos y frunce el ceño. Todo el rostro tenso. 5 segundos.", s:9 },
        { t:"Suelta todo el rostro. Mandíbula floja. Frente suave. Ojos sin esfuerzo.", s:11 },
        { t:"Escanea tu cuerpo de arriba abajo. Está más ligero. Llevas esa calma contigo.", s:13 },
      ]},
    { id:"A3", icono:"⚡", titulo:"Activación Controlada", dur:"3 min", desc:"Actívate cuando tu energía está baja antes de la etapa.",
      pasos:[
        { t:"De pie. Sacude las manos con fuerza 10 segundos. Despierta el cuerpo.", s:8 },
        { t:"Inhala rápido por la nariz, exhala fuerte por la boca. 5 veces seguidas.", s:8 },
        { t:"Di en voz alta: Estoy listo. Estoy preparado. Este momento es mío.", s:10 },
        { t:"Salta en el lugar 10 veces. Liviano, rítmico. Conecta mente y cuerpo.", s:7 },
        { t:"Para. Respira. Siente la energía circulando. Eso es activación óptima. Úsala.", s:8 },
      ]},
  ],
  B: [
    { id:"B1", icono:"🧠", titulo:"Reestructuración Cognitiva", dur:"5 min", desc:"Transforma los pensamientos bloqueantes en impulsores.",
      pasos:[
        { t:"Identifica el pensamiento que aparece antes de tu etapa. Solo obsérvalo.", s:10 },
        { t:"¿Ese pensamiento es un hecho o una interpretación? ¿Qué evidencia real tienes?", s:15 },
        { t:"Piensa en la evidencia real. Sé honesto contigo. A menudo no hay evidencia.", s:20 },
        { t:"Reescribe ese pensamiento. Que sea realista y que puedas creerlo.", s:25 },
        { t:"Ese pensamiento alternativo es tuyo. Léelo antes de tu etapa.", s:10 },
      ]},
    { id:"B2", icono:"🛑", titulo:"Detención del Pensamiento", dur:"3 min", desc:"Interrumpe el pensamiento negativo en el momento.",
      pasos:[
        { t:"Cuando aparezca un pensamiento negativo — di mentalmente STOP con fuerza.", s:8 },
        { t:"Toma una respiración lenta y profunda. Una sola. Ese espacio es tuyo.", s:8 },
        { t:"Lleva tu atención a algo concreto: tus pies, lo que ves ahora mismo.", s:10 },
        { t:"¿Cuál es el siguiente paso concreto que necesito dar ahora? Solo ese.", s:10 },
        { t:"Practica esta secuencia hasta automatizarla. Es una habilidad entrenable.", s:8 },
      ]},
    { id:"B3", icono:"🎬", titulo:"Visualización de Ejecución", dur:"7 min", desc:"Ensaya el proceso, no el resultado.",
      pasos:[
        { t:"Cierra los ojos. Lleva tu mente al momento justo antes de tu etapa.", s:20 },
        { t:"¿Cómo se siente tu cuerpo? Tu postura, tu respiración. Sereno y activado.", s:20 },
        { t:"Ejecuta en tu mente paso a paso. Tu primera acción. Con precisión y calma.", s:25 },
        { t:"Imagina que algo sale diferente. ¿Cómo respondes? Visualiza tu recuperación.", s:20 },
        { t:"El último paso del proceso hecho con todo lo que tienes. Eso es suficiente.", s:20 },
        { t:"Abre los ojos. Tu cerebro acaba de ensayar. Cada repetición lo hace más familiar.", s:10 },
      ]},
  ],
  C: [
    { id:"C1", icono:"🏆", titulo:"Registro de Logros Previos", dur:"6 min", desc:"Tu historial de éxito es tu combustible más poderoso.",
      pasos:[
        { t:"La confianza se construye con evidencia real. Tus logros son esa evidencia.", s:10 },
        { t:"¿Cuál es una situación de presión que hayas superado recientemente?", s:25 },
        { t:"¿Cuál es el momento más difícil que atravesaste y del que saliste adelante?", s:25 },
        { t:"¿De qué logro te sientes más orgulloso? El que te hace sentir capaz de mucho.", s:25 },
        { t:"Hay un patrón en lo que recordaste. Una forma en que tú respondes bajo presión.", s:15 },
        { t:"Estos son tu banco de confianza. Léelos antes de tu próxima etapa.", s:10 },
      ]},
    { id:"C2", icono:"⚙️", titulo:"Rutina de Preparación", dur:"5 min", desc:"Activa tu estado óptimo con una secuencia repetible.",
      pasos:[
        { t:"Tres respiraciones lentas. Con cada exhale suelta lo que no necesitas llevar.", s:20 },
        { t:"Cierra los ojos. Visualiza el primer paso concreto de tu etapa.", s:20 },
        { t:"Di tu frase de activación: Estoy listo. He preparado esto. Es mi momento.", s:10 },
        { t:"Haz un gesto físico que marque el inicio. Ese gesto es tu señal de arranque.", s:15 },
        { t:"Practica esta secuencia antes de cada etapa. Con el tiempo se activa sola.", s:10 },
      ]},
    { id:"C3", icono:"💬", titulo:"Diálogo Interno Positivo", dur:"4 min", desc:"Construye tu voz interna de alto rendimiento.",
      pasos:[
        { t:"Lo que te dices bajo presión determina tu rendimiento. Hoy lo cambiamos.", s:12 },
        { t:"¿Qué palabras aparecen en tu mente cuando estás bajo presión real?", s:20 },
        { t:"Transforma ese pensamiento. De 'no puedo' a 'puedes manejarlo'.", s:12 },
        { t:"Piensa en una frase corta en segunda persona que puedas creer bajo presión.", s:20 },
        { t:"Di tu frase ahora con toda la intensidad que puedas. Ese momento la graba.", s:8 },
        { t:"Repite esta frase en cada momento de presión. La repetición la convierte en reflejo.", s:10 },
      ]},
  ],
  D: [
    { id:"D1", icono:"🎯", titulo:"Atención Selectiva", dur:"4 min", desc:"Filtra el ruido y amplifica la señal que importa.",
      pasos:[
        { t:"Imagina un círculo. Dentro solo lo que puedes controlar ahora mismo.", s:18 },
        { t:"¿Cuál es la única cosa que necesitas ejecutar bien en este momento?", s:12 },
        { t:"Cuando aparezca una distracción: 3 cosas que ves, 2 sensaciones, 1 foco.", s:18 },
        { t:"Aplica el 3-2-1 ahora mismo. Tres cosas que ves. Dos en el cuerpo. Un foco.", s:20 },
        { t:"No importa cuántas veces te distraigas. Solo importa cuántas veces vuelves.", s:12 },
      ]},
    { id:"D2", icono:"🔆", titulo:"Calentamiento Mental", dur:"5 min", desc:"Lleva tu mente a su punto óptimo antes de la etapa.",
      pasos:[
        { t:"Responde mentalmente: ¿Cuál es tu nombre? ¿Dónde estás? ¿Qué día es hoy?", s:16 },
        { t:"¿Qué vas a hacer? ¿Cuál es el objetivo concreto? ¿Qué has preparado?", s:20 },
        { t:"Imagina el primer minuto de tu etapa. Los primeros movimientos y decisiones.", s:20 },
        { t:"Hoy voy a dar lo mejor que tengo en este momento. No lo de ayer — lo de ahora.", s:10 },
        { t:"Mente activada, contextualizada y enfocada. Llévalo a tu etapa.", s:8 },
      ]},
    { id:"D3", icono:"⏱️", titulo:"Control del Momento Presente", dur:"6 min", desc:"Ancla toda tu energía en el único momento donde puedes actuar.",
      pasos:[
        { t:"Cierra los ojos. Lleva tu atención a tu respiración. Solo obsérvala.", s:25 },
        { t:"¿Qué pensamiento te arrastra fuera del momento cuando estás bajo presión?", s:20 },
        { t:"Cuando aparezca di: 'Eso es el futuro. Ahora estoy aquí.' Y regresa.", s:16 },
        { t:"Deja que el pensamiento aparezca. Obsérvalo. Ahora regresa al presente.", s:15 },
        { t:"Cada vez que practicas este retorno, se vuelve más rápido y automático.", s:10 },
      ]},
  ],
  E: [
    { id:"E1", icono:"📊", titulo:"Análisis de Desempeño", dur:"8 min", desc:"Convierte la experiencia en aprendizaje estructurado.",
      pasos:[
        { t:"Sin juicio — con curiosidad. Convierte esta etapa en información útil.", s:12 },
        { t:"¿Cómo evalúas tu rendimiento general en esta etapa?", s:20 },
        { t:"¿Cómo estaba tu estado mental? ¿Enfocado o alterado?", s:20 },
        { t:"¿Qué hiciste bien? ¿Qué funcionó como lo planeaste o mejor?", s:30 },
        { t:"¿Qué cambiarías? No lo que salió mal — lo que harías diferente.", s:30 },
        { t:"Si te quedaras con una sola lección de esta etapa, ¿cuál sería?", s:30 },
        { t:"Eso es crecimiento estructurado. Cada etapa analizada te hace mejor.", s:10 },
      ]},
    { id:"E2", icono:"🌿", titulo:"Cierre Emocional", dur:"5 min", desc:"Completa el ciclo emocional después de la presión.",
      pasos:[
        { t:"Sin juzgarlo — reconoce lo que sientes. Todo eso es parte del proceso.", s:18 },
        { t:"Imagina que la etapa es algo que sostienes. Con cada exhale, relaja el agarre.", s:20 },
        { t:"Haz un gesto de cierre. Ese gesto le dice al cuerpo que puede soltar.", s:12 },
        { t:"Reconoce que te presentaste. Que diste lo que tenías. Eso siempre vale.", s:14 },
        { t:"El siguiente paso es descansar. No analizar. No planificar. Solo descansar.", s:10 },
      ]},
    { id:"E3", icono:"📈", titulo:"Evolución Personal", dur:"6 min", desc:"Observa tu patrón de crecimiento con ayuda de la IA.",
      pasos:[
        { t:"Cada etapa registrada forma un patrón que la IA aprende sobre ti.", s:14 },
        { t:"La IA identifica cuándo sueles tener ansiedad alta y qué técnicas te regulan mejor.", s:16 },
        { t:"Con el tiempo detecta tus fortalezas recurrentes en tus mejores etapas.", s:14 },
        { t:"No hay etapas buenas o malas. Hay etapas con información. Cuantas más registres, mejor.", s:12 },
      ]},
  ],
};

// ─── PANTALLA BIENVENIDA ──────────────────────────────────────────────────────
function PantallaBienvenida({ onEntrar }) {
  const [fase, setFase] = useState(0); // 0=animando 1=listo
  const textoVoz = "Hola. Soy SCIAT Peak State. Te acompaño en esta etapa. Vamos, tú puedes.";

  useEffect(() => {
    const t1 = setTimeout(() => setFase(1), 2800);
    const t2 = setTimeout(() => {
      reproducirBienvenida();
    }, 600);
    return () => { clearTimeout(t1); clearTimeout(t2); detenerBienvenida(); };
  }, []);

  return (
    <div style={{
      minHeight:"100vh", background:DS.bg,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:"40px 24px", textAlign:"center",
      position:"relative", overflow:"hidden",
    }}>
      {/* Fondo decorativo */}
      <div style={{position:"absolute",top:-80,right:-80,width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle, ${DS.emeraldSoft} 0%, transparent 70%)`}}/>
      <div style={{position:"absolute",bottom:-60,left:-60,width:240,height:240,borderRadius:"50%",background:`radial-gradient(circle, ${DS.goldSoft} 0%, transparent 70%)`}}/>

      {/* Logo animado */}
      <div style={{
        opacity: fase >= 0 ? 1 : 0,
        transform: fase >= 0 ? "scale(1)" : "scale(0.8)",
        transition: "all 0.8s ease",
        marginBottom: 32,
      }}>
        <svg width={80} height={80} viewBox="0 0 48 48" fill="none">
          <path d="M24 3 L42 13.5 L42 34.5 L24 45 L6 34.5 L6 13.5 Z" stroke={DS.emerald} strokeWidth="1.5" fill="none"/>
          <path d="M24 10 L36 17 L36 31 L24 38 L12 31 L12 17 Z" stroke={DS.gold} strokeWidth="1" fill={DS.goldSoft}/>
          <circle cx="24" cy="24" r="3" fill={DS.emerald}/>
          <circle cx="24" cy="13" r="1.5" fill={DS.gold}/>
          <circle cx="33" cy="18.5" r="1.5" fill={DS.gold}/>
          <circle cx="33" cy="29.5" r="1.5" fill={DS.gold}/>
          <circle cx="24" cy="35" r="1.5" fill={DS.gold}/>
          <circle cx="15" cy="29.5" r="1.5" fill={DS.gold}/>
          <circle cx="15" cy="18.5" r="1.5" fill={DS.gold}/>
          <line x1="24" y1="24" x2="24" y2="13" stroke={DS.emerald} strokeWidth="0.75" strokeDasharray="2 1.5"/>
          <line x1="24" y1="24" x2="33" y2="29.5" stroke={DS.emerald} strokeWidth="0.75" strokeDasharray="2 1.5"/>
          <line x1="24" y1="24" x2="15" y2="29.5" stroke={DS.emerald} strokeWidth="0.75" strokeDasharray="2 1.5"/>
        </svg>
      </div>

      {/* Nombre */}
      <div style={{
        opacity: fase >= 0 ? 1 : 0,
        transition: "opacity 1s ease 0.3s",
        marginBottom: 8,
      }}>
        <div style={{fontSize:42,fontWeight:900,letterSpacing:6,color:DS.emerald,fontFamily:"'Cormorant Garamond', serif",lineHeight:1}}>
          SCIAT
        </div>
        <div style={{fontSize:13,color:DS.gold,letterSpacing:4,fontFamily:"'DM Mono', monospace",marginTop:4}}>
          PEAK STATE
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        opacity: fase >= 1 ? 1 : 0,
        transform: fase >= 1 ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.8s ease 0.2s",
        marginTop: 24, marginBottom: 40,
      }}>
        <p style={{fontSize:16,color:DS.inkMid,fontFamily:"'Cormorant Garamond', serif",lineHeight:1.6,fontStyle:"italic",maxWidth:300}}>
          Tu acompañante de rendimiento.<br/>
          <span style={{color:DS.emerald}}>Deporte · Academia · Organización</span>
        </p>
      </div>

      {/* Botón entrar */}
      <div style={{
        opacity: fase >= 1 ? 1 : 0,
        transform: fase >= 1 ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.6s ease 0.5s",
        width: "100%", maxWidth: 320,
      }}>
        <button
          onClick={() => { detenerBienvenida(); onEntrar(); }}
          aria-label="Entrar a SCIAT Peak State"
          style={{
            width:"100%", padding:"18px 24px", borderRadius:14, border:"none",
            background:`linear-gradient(135deg, ${DS.emerald}, #0099aa)`,
            color:DS.bg, fontSize:16, fontWeight:700, cursor:"pointer",
            fontFamily:"'DM Sans', sans-serif", letterSpacing:0.5,
          }}>
          ENTRAR →
        </button>
        <div style={{marginTop:12,fontSize:11,color:DS.inkMuted,fontFamily:"'DM Mono', monospace",letterSpacing:1}}>
          Salud · Ciencia · IA · Tecnología
        </div>
      </div>

      {/* Indicador de voz */}
      <div style={{
        position:"absolute", bottom:30,
        display:"flex", alignItems:"center", gap:6,
        opacity: fase >= 1 ? 1 : 0, transition: "opacity 0.5s ease 1s",
      }}>
        <span style={{fontSize:12}}>🔊</span>
        <span style={{fontSize:10,color:DS.inkMuted,fontFamily:"'DM Mono', monospace",letterSpacing:1}}>
          AUDIO ACTIVADO
        </span>
      </div>
    </div>
  );
}
function Logo({ size=36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M24 3 L42 13.5 L42 34.5 L24 45 L6 34.5 L6 13.5 Z" stroke={DS.emerald} strokeWidth="1.5" fill="none"/>
      <path d="M24 10 L36 17 L36 31 L24 38 L12 31 L12 17 Z" stroke={DS.gold} strokeWidth="1" fill={DS.goldSoft}/>
      <circle cx="24" cy="24" r="3" fill={DS.emerald}/>
      <circle cx="24" cy="13" r="1.5" fill={DS.gold}/>
      <circle cx="33" cy="18.5" r="1.5" fill={DS.gold}/>
      <circle cx="33" cy="29.5" r="1.5" fill={DS.gold}/>
      <circle cx="24" cy="35" r="1.5" fill={DS.gold}/>
      <circle cx="15" cy="29.5" r="1.5" fill={DS.gold}/>
      <circle cx="15" cy="18.5" r="1.5" fill={DS.gold}/>
      <line x1="24" y1="24" x2="24" y2="13" stroke={DS.emerald} strokeWidth="0.75" strokeDasharray="2 1.5"/>
      <line x1="24" y1="24" x2="33" y2="29.5" stroke={DS.emerald} strokeWidth="0.75" strokeDasharray="2 1.5"/>
      <line x1="24" y1="24" x2="15" y2="29.5" stroke={DS.emerald} strokeWidth="0.75" strokeDasharray="2 1.5"/>
    </svg>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header({ pantalla, onHome }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28,paddingBottom:16,borderBottom:`1px solid ${DS.border}`}}>
      <div onClick={onHome} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
        <Logo/>
        <div>
          <div style={{fontSize:16,fontWeight:900,letterSpacing:3,color:DS.emerald,fontFamily:"'Cormorant Garamond', serif",lineHeight:1}}>SCIAT</div>
          <div style={{fontSize:8,color:DS.gold,letterSpacing:3,fontFamily:"'DM Mono', monospace"}}>PEAK STATE</div>
        </div>
      </div>
      {pantalla !== "inicio" && (
        <button onClick={() => { detenerVoz(); onHome(); }} style={{marginLeft:"auto",background:"transparent",border:`1px solid ${DS.border}`,borderRadius:8,padding:"6px 12px",color:DS.inkMuted,fontSize:12,cursor:"pointer",fontFamily:"'DM Mono', monospace"}}>← Inicio</button>
      )}
    </div>
  );
}

// ─── PANTALLA INICIO ──────────────────────────────────────────────────────────
function PantallaInicio({ onIniciar }) {
  return (
    <div>
      {/* Hero principal — diseño oscuro original */}
      <div style={{
        background:`linear-gradient(135deg, #0d1520, #0a0f1e)`,
        border:`1px solid ${DS.emeraldBorder}`,
        borderRadius:20, padding:28, marginBottom:16,
        position:"relative", overflow:"hidden",
      }}>
        <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle, ${DS.emeraldSoft} 0%, transparent 70%)`}}/>
        <div style={{position:"absolute",bottom:-30,left:-30,width:150,height:150,borderRadius:"50%",background:`radial-gradient(circle, ${DS.goldSoft} 0%, transparent 70%)`}}/>

        {/* Título principal */}
        <h1 style={{
          fontSize:34, fontWeight:700, color:DS.ink,
          fontFamily:"'Cormorant Garamond', serif",
          lineHeight:1.15, marginBottom:16, position:"relative",
        }}>
          Rinde mejor<br/>
          <span style={{color:DS.emerald, fontStyle:"italic"}}>bajo presión</span>
          <span style={{marginLeft:10, fontSize:28}}>⚡</span>
        </h1>

        {/* Descripción */}
        <p style={{
          fontSize:14, color:DS.inkMuted,
          fontFamily:"'DM Sans', sans-serif",
          lineHeight:1.65, marginBottom:20, position:"relative",
        }}>
          Herramientas de alto rendimiento adaptadas a tu etapa.
          Deporte, academia u organización — el método es el mismo.
        </p>

        {/* Checks */}
        <div style={{marginBottom:24, position:"relative"}}>
          {[
            "Evaluación por etapa de presión",
            "Check inicial de estado",
            "Acompañamiento post actividad",
          ].map((f,i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{
                width:20, height:20, borderRadius:6, flexShrink:0,
                background:DS.emeraldSoft, border:`1px solid ${DS.emeraldBorder}`,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <span style={{fontSize:11, color:DS.emerald}}>✓</span>
              </div>
              <span style={{fontSize:13, color:DS.inkMid, fontFamily:"'DM Sans', sans-serif"}}>{f}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => { detenerVoz(); onIniciar(); }}
          style={{
            width:"100%", padding:"16px 24px", borderRadius:12, border:"none",
            background:`linear-gradient(135deg, ${DS.emerald}, #0099aa)`,
            color:DS.bg, fontSize:15, fontWeight:700, cursor:"pointer",
            fontFamily:"'DM Sans', sans-serif", letterSpacing:0.5,
            position:"relative",
          }}>
          COMENZAR EVALUACIÓN →
        </button>
      </div>

      {/* Accesibilidad */}
      <div style={{
        display:"flex", alignItems:"center", gap:8,
        padding:"10px 14px", background:DS.emeraldSoft,
        borderRadius:10, border:`1px solid ${DS.emeraldBorder}`,
      }}>
        <span style={{fontSize:14}}>♿</span>
        <span style={{fontSize:11,color:DS.emerald,fontFamily:"'DM Sans', sans-serif"}}>
          Subtítulos CC · Audio con voz del autor · Accesible
        </span>
      </div>
    </div>
  );
}

// ─── CHECK INICIAL ────────────────────────────────────────────────────────────
const CONTEXTOS = [
  {id:"deportivo",label:"Deportivo",icono:"⚡",desc:"Competencia, torneo, partido"},
  {id:"academico",label:"Académico",icono:"🎯",desc:"Examen, defensa, evaluación"},
  {id:"organizacional",label:"Organizacional",icono:"🔷",desc:"Presentación, lanzamiento, cierre"},
];
const FASES = [
  {id:"lejana",label:"Lejana",desc:"Semanas antes",color:DS.emerald},
  {id:"proxima",label:"Próxima",desc:"Días antes",color:DS.warn},
  {id:"inmediata",label:"Inmediata",desc:"Horas antes",color:"#ef4444"},
];
const PREGUNTAS = [
  {id:"s1",texto:"Siento tensión muscular en mi cuerpo"},
  {id:"s2",texto:"Noto que mi corazón late más rápido"},
  {id:"c1",texto:"Me preocupa no rendir como espero"},
  {id:"c2",texto:"Tengo pensamientos negativos sobre esta etapa"},
  {id:"f1",texto:"Me siento seguro/a de mis capacidades"},
  {id:"f2",texto:"Estoy convencido/a de que puedo lograrlo"},
];

function PantallaCheck({ onCompletado }) {
  const [paso, setPaso] = useState(0);
  const [contexto, setContexto] = useState(null);
  const [fase, setFase] = useState(null);
  const [resp, setResp] = useState({});

  const calcular = () => {
    const avg = ids => ids.reduce((s,id) => s+(resp[id]||2),0)/ids.length;
    const niv = (v,inv=false) => {
      if(inv) return v>=3.5?"buena":v>=2.5?"moderada":"baja";
      return v>=3.5?"alta":v>=2.5?"media":"baja";
    };
    return {
      somatica:niv(avg(["s1","s2"])),
      cognitiva:niv(avg(["c1","c2"])),
      confianza:niv(avg(["f1","f2"]),true),
      contexto:CONTEXTOS.find(c=>c.id===contexto)?.label,
      fase:FASES.find(f=>f.id===fase)?.label,
    };
  };

  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,color:DS.emerald,fontFamily:"'DM Mono', monospace",letterSpacing:2,marginBottom:6}}>
          PASO {paso+1} DE 3 · CHECK INICIAL
        </div>
        <div style={{height:3,background:DS.border,borderRadius:2}}>
          <div style={{height:"100%",background:`linear-gradient(90deg, ${DS.emerald}, #0099aa)`,borderRadius:2,width:`${((paso+1)/3)*100}%`,transition:"width 0.4s ease"}}/>
        </div>
      </div>

      {paso===0 && (
        <div>
          <h2 style={{fontSize:22,fontWeight:700,color:DS.ink,marginBottom:6,fontFamily:"'Cormorant Garamond', serif"}}>¿En qué contexto estás?</h2>
          <p style={{fontSize:13,color:DS.inkMuted,marginBottom:20,fontFamily:"'DM Sans', sans-serif"}}>Selecciona tu situación actual</p>
          {CONTEXTOS.map(c => (
            <div key={c.id} onClick={() => {
              setContexto(c.id);
              detenerVoz();
              // Reproducir audio de autor si existe, si no usa Web Speech
              const audioCtx = new Audio(AUDIO_CHECK[c.id]);
              audioCtx.play().catch(() => hablar(`${c.label}. ${c.desc}`));
              setTimeout(()=>setPaso(1),300);
            }}
              style={{background:contexto===c.id?DS.emeraldSoft:DS.card,border:`1px solid ${contexto===c.id?DS.emerald:DS.border}`,borderRadius:14,padding:"16px 20px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"all 0.2s"}}>
              <div style={{fontSize:26}}>{c.icono}</div>
              <div>
                <div style={{fontSize:15,fontWeight:600,color:DS.ink,fontFamily:"'DM Sans', sans-serif"}}>{c.label}</div>
                <div style={{fontSize:12,color:DS.inkMuted,fontFamily:"'DM Sans', sans-serif"}}>{c.desc}</div>
              </div>
              {contexto===c.id && <div style={{marginLeft:"auto",color:DS.emerald,fontSize:18}}>✓</div>}
            </div>
          ))}
        </div>
      )}

      {paso===1 && (
        <div>
          <h2 style={{fontSize:22,fontWeight:700,color:DS.ink,marginBottom:6,fontFamily:"'Cormorant Garamond', serif"}}>¿Cuándo es tu etapa?</h2>
          <p style={{fontSize:13,color:DS.inkMuted,marginBottom:20,fontFamily:"'DM Sans', sans-serif"}}>Esto define la intensidad de la intervención</p>
          {FASES.map(f => (
            <div key={f.id} onClick={() => { setFase(f.id); setTimeout(()=>setPaso(2),250); }}
              style={{background:fase===f.id?`${f.color}15`:DS.card,border:`1px solid ${fase===f.id?f.color:DS.border}`,borderRadius:14,padding:"16px 20px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"all 0.2s"}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:f.color,flexShrink:0,boxShadow:fase===f.id?`0 0 10px ${f.color}`:"none"}}/>
              <div>
                <div style={{fontSize:15,fontWeight:600,color:DS.ink,fontFamily:"'DM Sans', sans-serif"}}>{f.label}</div>
                <div style={{fontSize:12,color:DS.inkMuted,fontFamily:"'DM Sans', sans-serif"}}>{f.desc}</div>
              </div>
              {fase===f.id && <div style={{marginLeft:"auto",color:f.color,fontSize:18}}>✓</div>}
            </div>
          ))}
        </div>
      )}

      {paso===2 && (
        <div>
          <h2 style={{fontSize:22,fontWeight:700,color:DS.ink,marginBottom:6,fontFamily:"'Cormorant Garamond', serif"}}>¿Cómo te sientes ahora?</h2>
          <p style={{fontSize:13,color:DS.inkMuted,marginBottom:20,fontFamily:"'DM Sans', sans-serif"}}>No hay respuestas incorrectas — solo obsérvate</p>
          {PREGUNTAS.map(q => (
            <div key={q.id} style={{background:DS.card,border:`1px solid ${DS.border}`,borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{fontSize:13,color:DS.ink,marginBottom:12,lineHeight:1.5,fontFamily:"'DM Sans', sans-serif"}}>{q.texto}</div>
              <div style={{display:"flex",gap:6}}>
                {[{v:1,l:"Nada"},{v:2,l:"Algo"},{v:3,l:"Bastante"},{v:4,l:"Mucho"}].map(op => (
                  <button key={op.v} onClick={() => setResp(p=>({...p,[q.id]:op.v}))}
                    style={{flex:1,padding:"8px 4px",borderRadius:8,border:`1px solid ${resp[q.id]===op.v?DS.emerald:DS.border}`,background:resp[q.id]===op.v?DS.emeraldSoft:"transparent",color:resp[q.id]===op.v?DS.emerald:DS.inkMuted,fontSize:11,cursor:"pointer",transition:"all 0.15s",fontFamily:"'DM Mono', monospace"}}>
                    {op.l}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={() => onCompletado(calcular())}
            disabled={Object.keys(resp).length < PREGUNTAS.length}
            style={{width:"100%",padding:14,borderRadius:12,border:"none",marginTop:4,
              background:Object.keys(resp).length>=PREGUNTAS.length?`linear-gradient(135deg, ${DS.emerald}, #0099aa)`:DS.border,
              color:Object.keys(resp).length>=PREGUNTAS.length?DS.bg:DS.inkMuted,
              fontSize:15,fontWeight:700,cursor:Object.keys(resp).length>=PREGUNTAS.length?"pointer":"not-allowed",
              fontFamily:"'DM Sans', sans-serif"}}>
            VER MI PERFIL →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── PERFIL + PLAN ────────────────────────────────────────────────────────────
function Barra({ label, valor, color }) {
  const ancho = valor==="alta"||valor==="buena"?"85%":valor==="media"||valor==="moderada"?"50%":"20%";
  const txt = valor==="alta"||valor==="buena"?"↑ ALTO":valor==="media"||valor==="moderada"?"→ MEDIO":"↓ BAJO";
  return (
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span style={{fontSize:11,color:DS.inkMuted,fontFamily:"'DM Mono', monospace",letterSpacing:1}}>{label.toUpperCase()}</span>
        <span style={{fontSize:11,color,fontWeight:700,fontFamily:"'DM Mono', monospace"}}>{txt}</span>
      </div>
      <div style={{height:4,background:DS.border,borderRadius:2}}>
        <div style={{height:"100%",background:color,borderRadius:2,width:ancho,transition:"width 1s ease"}}/>
      </div>
    </div>
  );
}

function PantallaPerfilPlan({ perfil, onModulo }) {
  const recomendados = MODULOS.filter(m => {
    if(m.id==="E") return false;
    if(m.id==="D") return true;
    if(m.id==="A") return perfil.somatica==="alta"||perfil.somatica==="media";
    if(m.id==="B") return perfil.cognitiva==="alta"||perfil.cognitiva==="media";
    if(m.id==="C") return perfil.confianza==="baja"||perfil.confianza==="moderada";
    return true;
  });

  const textoAnalisis = recomendados.length>=3
    ? "Detecto activación elevada con confianza en desarrollo. Regula primero el cuerpo, luego el pensamiento."
    : recomendados.length===2
    ? "Tu estado muestra áreas específicas de mejora. El plan está personalizado para ti."
    : "Tu estado es sólido. El foco ahora es mantener y afinar tu concentración.";

  const textoPlan = `Tu plan tiene ${recomendados.length} módulos activos. ${recomendados.map(m => m.titulo).join(", ")}.`;

  useEffect(() => {
    const t = setTimeout(() => {
      hablar(`Check inicial completado. Contexto ${perfil.contexto}, etapa ${perfil.fase}. ${textoAnalisis} ${textoPlan}`);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,color:DS.emerald,fontFamily:"'DM Mono', monospace",letterSpacing:2,marginBottom:4}}>
          PERFIL · {perfil.contexto?.toUpperCase()} · {perfil.fase?.toUpperCase()}
        </div>
        <h2 style={{fontSize:22,fontWeight:700,color:DS.ink,fontFamily:"'Cormorant Garamond', serif"}}>Tu estado en este momento</h2>
      </div>

      <div style={{background:DS.card,border:`1px solid ${DS.border}`,borderRadius:16,padding:22,marginBottom:16}}>
        <Barra label="Ansiedad Somática" valor={perfil.somatica} color={perfil.somatica==="alta"?"#ef4444":perfil.somatica==="media"?DS.warn:DS.emerald}/>
        <Barra label="Ansiedad Cognitiva" valor={perfil.cognitiva} color={perfil.cognitiva==="alta"?"#ef4444":perfil.cognitiva==="media"?DS.warn:DS.emerald}/>
        <Barra label="Autoconfianza" valor={perfil.confianza} color={perfil.confianza==="buena"?DS.emerald:perfil.confianza==="moderada"?DS.warn:"#ef4444"}/>
      </div>

      <div style={{background:DS.emeraldSoft,border:`1px solid ${DS.emeraldBorder}`,borderRadius:12,padding:16,marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{fontSize:11,color:DS.emerald,fontFamily:"'DM Mono', monospace",letterSpacing:1}}>ANÁLISIS IA</div>
          <button onClick={() => hablar(recomendados.length>=3?"Detecto activación elevada con confianza en desarrollo. Regula primero el cuerpo, luego el pensamiento.":recomendados.length===2?"Tu estado muestra áreas específicas de mejora. El plan está personalizado para ti.":"Tu estado es sólido. El foco ahora es mantener y afinar tu concentración.")}
            style={{background:DS.emeraldSoft,border:`1px solid ${DS.emeraldBorder}`,borderRadius:6,padding:"3px 8px",color:DS.emerald,fontSize:12,cursor:"pointer"}}>
            🔊
          </button>
        </div>
        <p style={{fontSize:13,color:DS.inkMid,lineHeight:1.7,fontFamily:"'DM Sans', sans-serif",margin:0}}>
          {recomendados.length>=3?"Detecto activación elevada con confianza en desarrollo. Regula primero el cuerpo, luego el pensamiento.":recomendados.length===2?"Tu estado muestra áreas específicas de mejora. El plan está personalizado para ti.":"Tu estado es sólido. El foco ahora es mantener y afinar tu concentración."}
        </p>
      </div>

      <div style={{fontSize:11,color:DS.inkMuted,fontFamily:"'DM Mono', monospace",letterSpacing:2,marginBottom:14}}>
        TU PLAN — {recomendados.length} MÓDULOS ACTIVOS
      </div>

      {recomendados.map(mod => {
        const mc = MOD[mod.id];
        return (
          <div key={mod.id} onClick={() => onModulo(mod.id)}
            style={{background:DS.card,border:`1px solid ${DS.border}`,borderRadius:14,padding:18,marginBottom:10,cursor:"pointer",transition:"border-color 0.2s"}}
            onMouseEnter={e => e.currentTarget.style.borderColor=mc.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor=DS.border}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:44,height:44,borderRadius:12,background:mc.soft,border:`1px solid ${mc.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{mod.icono}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{fontSize:14,fontWeight:700,color:DS.ink,fontFamily:"'DM Sans', sans-serif"}}>{mod.titulo}</div>
                  <div style={{fontSize:9,color:mc.accent,background:mc.soft,padding:"3px 7px",borderRadius:5,fontFamily:"'DM Mono', monospace",letterSpacing:1,flexShrink:0,marginLeft:8}}>MOD {mod.id}</div>
                </div>
                <div style={{fontSize:12,color:DS.inkMuted,fontFamily:"'DM Sans', sans-serif",marginTop:2}}>{mod.desc}</div>
              </div>
            </div>
          </div>
        );
      })}

      <div style={{background:DS.surface,border:`1px dashed ${DS.border}`,borderRadius:14,padding:16,marginTop:4,display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:20}}>📊</span>
        <div>
          <div style={{fontSize:13,fontWeight:600,color:DS.inkMuted,fontFamily:"'DM Sans', sans-serif"}}>Módulo E — Seguimiento</div>
          <div style={{fontSize:11,color:DS.inkMuted,fontFamily:"'DM Sans', sans-serif"}}>Disponible después de tu etapa de presión</div>
        </div>
      </div>
    </div>
  );
}

// ─── PANTALLA COMPLETADO + CONVERSACIÓN IA DE ALTO RENDIMIENTO ───────────────
function PantallaCompletado({ ejercicio, moduloId, mc, onReiniciar, onVolver }) {
  const [fase, setFase] = useState("completado");
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const [vozIA, setVozIA] = useState(true);
  const [escuchando, setEscuchando] = useState(false);
  const chatRef = useRef(null);
  const reconRef = useRef(null);

  // Sistema de debriefing basado en psicología deportiva y neurociencia
  const SYSTEM_PROMPT = `Eres el acompañante de rendimiento de SCIAT Peak State.
El usuario acaba de completar "${ejercicio.titulo}" del Módulo ${moduloId}.

Tu metodología es la del debriefing post-rendimiento de psicología deportiva de alto rendimiento, combinada con principios de neurociencia aplicada.

Sigue este flujo conversacional de forma NATURAL — nunca mecánica:
1. OBSERVACIÓN: Ayuda al usuario a observar su estado físico y mental real ahora mismo.
2. ANCLAJE: Conecta la experiencia con lo que sintió durante el ejercicio.
3. APRENDIZAJE: Extrae el patrón que puede usar en su próxima etapa de presión real.
4. PROYECCIÓN: Conecta el aprendizaje con su situación de presión específica.

REGLAS ESTRICTAS:
- Máximo 2 frases por respuesta. Nunca más.
- Nunca repitas la misma pregunta ni una similar.
- Cada respuesta debe avanzar el proceso — nunca volver atrás.
- Hablas de tú. Eres cálido, preciso, directo.
- No uses frases genéricas como "gracias por compartir" o "qué bueno".
- Cuando el usuario comparte algo concreto, refleja ESO específico, no algo genérico.
- Después de 4-5 intercambios, ofrece un cierre con el aprendizaje clave.
- Tu voz suena como la de un entrenador de alto rendimiento que conoce a esta persona.`;

  const mensajeInicial = (() => {
    const aperturas = {
      A: "Respira. ¿Notas alguna diferencia en tu cuerpo respecto a hace unos minutos?",
      B: "Observa tu mente ahora mismo. ¿Está más quieta o sigue activa?",
      C: "¿Qué logro de los que recordaste te generó más energía?",
      D: "¿Lograste anclar el foco en algún momento del ejercicio?",
      E: "¿Qué te sorprendió de lo que acabas de analizar?",
    };
    return aperturas[moduloId] || "¿Qué cambió en ti durante estos minutos?";
  })();

  const iniciarChat = () => {
    setFase("chat");
    const msg = { rol: "ia", texto: mensajeInicial };
    setMensajes([msg]);
    if(vozIA) hablar(mensajeInicial);
  };

  // Reconocimiento de voz para personas ciegas
  const iniciarEscucha = () => {
    if(!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "es-ES";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart = () => setEscuchando(true);
    rec.onresult = (e) => {
      const texto = e.results[0][0].transcript;
      setInput(texto);
      setEscuchando(false);
    };
    rec.onerror = () => setEscuchando(false);
    rec.onend = () => setEscuchando(false);
    reconRef.current = rec;
    rec.start();
  };

  const detenerEscucha = () => {
    if(reconRef.current) reconRef.current.stop();
    setEscuchando(false);
  };

  const enviar = async () => {
    if(!input.trim() || cargando) return;
    const userMsg = input.trim();
    setInput("");
    const nuevosMensajes = [...mensajes, { rol: "usuario", texto: userMsg }];
    setMensajes(nuevosMensajes);
    setCargando(true);
    detenerVoz();

    // Sistema de debriefing inteligente basado en psicología deportiva
    // Sigue el flujo: observación → anclaje → aprendizaje → proyección
    const turno = nuevosMensajes.filter(m => m.rol === "usuario").length;
    const respuestaUsuario = userMsg.toLowerCase();

    let respuesta = "";

    // Detectar contenido emocional y físico en la respuesta
    const positivo = /bien|mejor|relajad|calm|tranquil|claro|enfocad|aliviad|liger|ener/i.test(respuestaUsuario);
    const negativo = /diffícil|cost|tenso|ansiedad|nervio|duro|mal|pesad|frustrad/i.test(respuestaUsuario);
    const corporal = /cuerpo|músculo|respir|físic|tensi|relajación|latido|corazón/i.test(respuestaUsuario);
    const mental = /mente|pens|foco|concentr|atenci|claridad|ruido|calm/i.test(respuestaUsuario);
    const situacion = /reunión|examen|competen|presentaci|partido|negociaci|prueba/i.test(respuestaUsuario);

    if(turno === 1) {
      // Anclaje — conectar con lo específico que mencionó
      if(positivo && situacion) {
        respuesta = "Esa combinación — cuerpo relajado, mente clara — es exactamente el estado óptimo antes de una etapa de presión. ¿Qué parte del ejercicio fue la que más lo generó?";
      } else if(positivo) {
        respuesta = "Bien notado. ¿Esa diferencia la sientes más en el cuerpo, en la mente, o en los dos?";
      } else if(negativo) {
        respuesta = "Eso tiene valor — notar la tensión es el primer paso para regularla. ¿En qué parte del cuerpo la sentiste más?";
      } else if(corporal) {
        respuesta = "El cuerpo registra la presión antes que la mente. ¿Qué cambió en tu cuerpo durante el ejercicio?";
      } else if(mental) {
        respuesta = "La claridad mental después del ejercicio es una señal de regulación real. ¿Cuánto tiempo crees que se mantiene ese estado?";
      } else {
        respuesta = "¿Esa sensación es nueva para ti, o la reconoces de otras veces que te preparaste bien?";
      }
    } else if(turno === 2) {
      // Aprendizaje — extraer el patrón
      if(corporal || /respiración|inhala|exhala|relajación muscular/i.test(respuestaUsuario)) {
        respuesta = "La respiración es tu regulador más rápido. Puedes activarlo en cualquier momento, incluso en medio de la situación de presión. ¿Lo usarás hoy?";
      } else if(mental || /foco|atenci/i.test(respuestaUsuario)) {
        respuesta = "Ese foco que sentiste — ¿qué lo generó específicamente? Identificarlo te permite recrearlo antes de tu próxima etapa.";
      } else if(positivo) {
        respuesta = "Ese es tu patrón de regulación funcionando. ¿Qué necesitarías hacer diferente si la próxima vez el tiempo es más corto?";
      } else {
        respuesta = "¿Qué aprendiste sobre tu propio cuerpo o mente en estos minutos que no sabías antes?";
      }
    } else if(turno === 3) {
      // Proyección — conectar con la etapa real
      if(situacion) {
        respuesta = "Llevas ese estado contigo. La diferencia entre ahora y antes del ejercicio — eso es rendimiento real. Ve a tu etapa.";
      } else {
        respuesta = "Ese aprendizaje que acabas de identificar — ¿cómo lo vas a usar en tu próxima etapa de presión?";
      }
    } else if(turno === 4) {
      // Cierre
      respuesta = "Tienes lo que necesitas. El trabajo de estos minutos ya está en tu sistema nervioso. Confía en lo que entrenaste.";
    } else {
      // Cierre final
      respuesta = "Ve. Estás listo/a.";
    }

    // Simular latencia natural de la IA
    setTimeout(() => {
      setMensajes(prev => [...prev, { rol: "ia", texto: respuesta }]);
      if(vozIA) hablar(respuesta);
      setCargando(false);
    }, 800);
  };

  useEffect(() => {
    if(chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [mensajes]);

  if(fase === "chat") return (
    <div style={{display:"flex",flexDirection:"column"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <button onClick={() => { detenerVoz(); detenerEscucha(); setFase("completado"); }}
          aria-label="Volver"
          style={{background:"transparent",border:`1px solid ${DS.border}`,borderRadius:8,padding:"6px 12px",color:DS.inkMuted,fontSize:13,cursor:"pointer"}}>←</button>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:700,color:DS.ink,fontFamily:"'DM Sans', sans-serif"}}>
            Reflexión post-actividad
          </div>
          <div style={{fontSize:10,color:mc.accent,fontFamily:"'DM Mono', monospace",letterSpacing:1}}>
            SCIAT IA · {ejercicio.titulo}
          </div>
        </div>
        <button onClick={() => { setVozIA(!vozIA); if(vozIA) detenerVoz(); }}
          aria-label={vozIA ? "Desactivar voz IA" : "Activar voz IA"}
          aria-pressed={vozIA}
          style={{background:vozIA?mc.soft:"transparent",border:`1px solid ${vozIA?mc.accent:DS.border}`,borderRadius:8,padding:"6px 10px",color:vozIA?mc.accent:DS.inkMuted,fontSize:14,cursor:"pointer"}}>
          {vozIA?"🔊":"🔇"}
        </button>
      </div>

      {/* Mensajes */}
      <div ref={chatRef} role="log" aria-live="polite" aria-label="Conversación con SCIAT IA"
        style={{overflowY:"auto",marginBottom:12,maxHeight:360}}>
        {mensajes.map((m, i) => (
          <div key={i} style={{display:"flex",justifyContent:m.rol==="usuario"?"flex-end":"flex-start",marginBottom:12}}>
            {m.rol==="ia" && (
              <div aria-hidden="true" style={{width:28,height:28,borderRadius:"50%",background:mc.soft,border:`1px solid ${mc.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,marginRight:8,marginTop:2}}>⬡</div>
            )}
            <div style={{
              maxWidth:"78%",padding:"10px 14px",
              borderRadius:m.rol==="usuario"?"14px 14px 4px 14px":"14px 14px 14px 4px",
              background:m.rol==="usuario"?mc.soft:DS.card,
              border:`1px solid ${m.rol==="usuario"?mc.border:DS.border}`,
            }}>
              <p style={{fontSize:13,color:DS.ink,lineHeight:1.6,margin:0,fontFamily:"'DM Sans', sans-serif"}}>
                {m.texto}
              </p>
            </div>
          </div>
        ))}
        {cargando && (
          <div style={{display:"flex",gap:5,padding:"8px 14px"}} aria-label="SCIAT IA está escribiendo">
            {[0,1,2].map(i => (
              <div key={i} style={{width:7,height:7,borderRadius:"50%",background:mc.accent,opacity:0.7}}/>
            ))}
          </div>
        )}
      </div>

      {/* Input con voz */}
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        {/* Botón micrófono para personas ciegas */}
        <button
          onClick={escuchando ? detenerEscucha : iniciarEscucha}
          aria-label={escuchando ? "Detener escucha de voz" : "Hablar — activar reconocimiento de voz"}
          aria-pressed={escuchando}
          style={{
            width:44,height:44,borderRadius:10,border:`1px solid ${escuchando?mc.accent:DS.border}`,
            background:escuchando?mc.soft:"transparent",
            color:escuchando?mc.accent:DS.inkMuted,
            fontSize:18,cursor:"pointer",flexShrink:0,
            animation:escuchando?"pulse 1s infinite":"none",
          }}>
          {escuchando?"⏹":"🎤"}
        </button>

        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==="Enter" && enviar()}
          placeholder={escuchando ? "Escuchando..." : "Escribe o habla tu respuesta..."}
          aria-label="Escribe o habla tu respuesta"
          style={{
            flex:1,background:DS.card,border:`1px solid ${DS.border}`,borderRadius:10,
            padding:"10px 14px",color:DS.ink,fontSize:13,outline:"none",
            fontFamily:"'DM Sans', sans-serif",
          }}
          onFocus={e => e.target.style.borderColor=mc.accent}
          onBlur={e => e.target.style.borderColor=DS.border}
        />
        <button onClick={enviar} disabled={!input.trim()||cargando}
          aria-label="Enviar mensaje"
          style={{
            width:44,height:44,borderRadius:10,border:"none",flexShrink:0,
            background:input.trim()&&!cargando?mc.accent:DS.border,
            color:DS.bg,fontSize:18,
            cursor:input.trim()&&!cargando?"pointer":"not-allowed",
            transition:"background 0.2s",
          }}>→</button>
      </div>

      {/* Indicador de escucha activa */}
      {escuchando && (
        <div role="status" aria-live="assertive"
          style={{marginTop:8,padding:"6px 12px",background:mc.soft,borderRadius:8,border:`1px solid ${mc.border}`,textAlign:"center"}}>
          <span style={{fontSize:11,color:mc.accent,fontFamily:"'DM Mono', monospace",letterSpacing:1}}>
            🎤 ESCUCHANDO... toca ⏹ para detener
          </span>
        </div>
      )}
    </div>
  );

  // Pantalla completado inicial
  return (
    <div style={{textAlign:"center",padding:"32px 0"}}>
      <div style={{fontSize:56,marginBottom:16}}>✅</div>
      <h2 style={{fontSize:22,fontWeight:700,color:DS.ink,marginBottom:8,fontFamily:"'Cormorant Garamond', serif"}}>
        Actividad completada
      </h2>
      <p style={{fontSize:14,color:DS.inkMuted,lineHeight:1.6,marginBottom:28,fontFamily:"'DM Sans', sans-serif"}}>
        Has trabajado tu rendimiento. Llevas eso a tu etapa.
      </p>

      {/* CTA conversación IA */}
      <div style={{background:DS.emeraldSoft,border:`1px solid ${DS.emeraldBorder}`,borderRadius:14,padding:20,marginBottom:16,textAlign:"left"}}>
        <div style={{fontSize:10,color:DS.emerald,fontFamily:"'DM Mono', monospace",letterSpacing:1,marginBottom:6}}>
          SCIAT IA · DEBRIEFING POST-ACTIVIDAD
        </div>
        <div style={{fontSize:14,fontWeight:600,color:DS.ink,fontFamily:"'DM Sans', sans-serif",marginBottom:4}}>
          Conecta tu experiencia con tu próxima etapa
        </div>
        <p style={{fontSize:12,color:DS.inkMuted,fontFamily:"'DM Sans', sans-serif",lineHeight:1.5,marginBottom:14}}>
          Basado en psicología deportiva de alto rendimiento y neurociencia. Texto o voz — accesible para todos.
        </p>
        <div style={{display:"flex",gap:8}}>
          <button onClick={iniciarChat} style={{
            flex:1,padding:12,borderRadius:10,border:"none",
            background:`linear-gradient(135deg, ${DS.emerald}, #0099aa)`,
            color:DS.bg,fontSize:13,fontWeight:700,cursor:"pointer",
            fontFamily:"'DM Sans', sans-serif",
          }}>
            💬 Reflexionar con IA
          </button>
          <button onClick={() => { iniciarChat(); setTimeout(iniciarEscucha, 800); }}
            aria-label="Reflexionar con IA usando voz"
            style={{
              padding:"12px 14px",borderRadius:10,border:`1px solid ${DS.emeraldBorder}`,
              background:DS.emeraldSoft,color:DS.emerald,fontSize:18,cursor:"pointer",
            }}>
            🎤
          </button>
        </div>
      </div>

      <button onClick={onReiniciar} style={{width:"100%",padding:14,borderRadius:12,border:`1px solid ${DS.border}`,background:"transparent",color:DS.inkMuted,fontSize:13,cursor:"pointer",marginBottom:10,fontFamily:"'DM Sans', sans-serif"}}>
        ↺ Repetir actividad
      </button>
      <button onClick={onVolver} style={{width:"100%",padding:14,borderRadius:12,border:"none",background:`linear-gradient(135deg, ${mc.accent}, ${mc.accent}cc)`,color:DS.bg,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans', sans-serif"}}>
        ← Volver al módulo
      </button>
    </div>
  );
}

// ─── EJERCICIO CON AUDIO + TEMPORIZADOR ───────────────────────────────────────
function EjercicioActivo({ ejercicio, moduloId, onVolver }) {
  const mc = MOD[moduloId];
  const [paso, setPaso] = useState(-1); // -1 = intro
  const [segundos, setSegundos] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const [completado, setCompletado] = useState(false);
  const [subtCC, setSubtCC] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const audioData = AUDIO[ejercicio.id];
  const tieneAudio = !!audioData;

  const reproducirAudio = (src) => {
    if(!audioOn || !src) return;
    if(audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    const a = new Audio(src);
    audioRef.current = a;
    a.play().catch(() => {});
  };

  const detenerAudio = () => {
    if(audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
  };

  useEffect(() => {
    // Al montar — reproducir intro automáticamente si existe
    if(paso === -1 && tieneAudio && audioOn) {
      // Pequeño delay para que el navegador móvil permita el audio tras interacción previa
      const t = setTimeout(() => reproducirAudio(audioData.intro), 300);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    return () => { clearInterval(timerRef.current); detenerAudio(); };
  }, []);

  // Auto-inicia el ejercicio completo al tocar INICIAR — sin necesidad de pausar/continuar
  const iniciarPaso = (numPaso) => {
    const duracion = ejercicio.pasos[numPaso].s + 2; // +2s buffer para que el audio termine bien
    setSegundos(duracion);
    setCorriendo(true);

    // Reproducir audio del paso — cuando termina, avanza automáticamente
    if(tieneAudio && audioData.pasos[numPaso]) {
      const a = new Audio(audioData.pasos[numPaso]);
      audioRef.current = a;
      a.play().catch(() => {});
      // Avance automático al terminar el audio
      a.onended = () => {
        clearInterval(timerRef.current);
        const sig = numPaso + 1;
        if(sig < ejercicio.pasos.length) {
          setPaso(sig);
          iniciarPaso(sig);
        } else {
          setCorriendo(false);
          setCompletado(true);
        }
      };
    }

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSegundos(s => {
        if(s <= 1) {
          clearInterval(timerRef.current);
          // Si no hay audio, avanza por tiempo
          if(!tieneAudio || !audioData.pasos[numPaso]) {
            const sig = numPaso + 1;
            if(sig < ejercicio.pasos.length) {
              setPaso(sig);
              iniciarPaso(sig);
            } else {
              setCorriendo(false);
              setCompletado(true);
            }
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const handleIniciar = () => {
    detenerAudio();
    setPaso(0);
    iniciarPaso(0);
  };

  const pausar = () => { clearInterval(timerRef.current); setCorriendo(false); detenerAudio(); };

  const continuar = () => {
    iniciarPaso(paso);
  };

  const reiniciar = () => {
    clearInterval(timerRef.current); detenerAudio(); detenerVoz();
    setPaso(-1); setSegundos(0); setCorriendo(false); setCompletado(false);
    if(tieneAudio && audioOn) reproducirAudio(audioData.intro);
  };

  if(completado) return (
    <PantallaCompletado
      ejercicio={ejercicio}
      moduloId={moduloId}
      mc={mc}
      onReiniciar={reiniciar}
      onVolver={onVolver}
    />
  );

  const radio=44, circ=2*Math.PI*radio;
  const durPaso = paso >= 0 ? ejercicio.pasos[paso].s : 1;
  const progreso = paso >= 0 ? ((durPaso - segundos) / durPaso) * circ : 0;
  const textoActual = paso >= 0 ? ejercicio.pasos[paso].t : "Escucha la introducción y pulsa INICIAR cuando estés listo.";
  const durIntro = audioData?.introDur || 10;
  const segundosIntro = paso === -1 ? durIntro : 0;

  return (
    <div>
      {/* Header ejercicio */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <button onClick={onVolver} style={{background:"transparent",border:`1px solid ${DS.border}`,borderRadius:8,padding:"6px 12px",color:DS.inkMuted,fontSize:13,cursor:"pointer"}}>←</button>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:DS.ink,fontFamily:"'DM Sans', sans-serif"}}>{ejercicio.titulo}</div>
          <div style={{fontSize:11,color:DS.inkMuted,fontFamily:"'DM Mono', monospace"}}>
            {paso === -1 ? "Introducción" : `Paso ${paso+1} de ${ejercicio.pasos.length}`}
          </div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:6}}>
          {tieneAudio && (
            <button onClick={() => { setAudioOn(!audioOn); if(audioOn) detenerAudio(); }}
              style={{background:audioOn?mc.soft:"transparent",border:`1px solid ${audioOn?mc.accent:DS.border}`,borderRadius:8,padding:"6px 10px",color:audioOn?mc.accent:DS.inkMuted,fontSize:14,cursor:"pointer"}}>
              {audioOn?"🔊":"🔇"}
            </button>
          )}
          <button onClick={() => setSubtCC(!subtCC)} aria-pressed={subtCC}
            style={{background:subtCC?mc.soft:"transparent",border:`1px solid ${subtCC?mc.accent:DS.border}`,borderRadius:8,padding:"6px 10px",color:subtCC?mc.accent:DS.inkMuted,fontSize:11,cursor:"pointer",fontFamily:"'DM Mono', monospace",letterSpacing:1}}>CC</button>
        </div>
      </div>

      {/* Barra de progreso */}
      <div style={{height:3,background:DS.border,borderRadius:2,marginBottom:20}}>
        <div style={{height:"100%",background:mc.accent,borderRadius:2,
          width:paso>=0?`${((paso+1)/ejercicio.pasos.length)*100}%`:"0%",transition:"width 0.5s"}}/>
      </div>

      {/* Contenido paso */}
      <div style={{background:DS.card,border:`1px solid ${DS.border}`,borderRadius:16,padding:24,textAlign:"center",marginBottom:12}}>
        <div style={{fontSize:11,color:mc.accent,fontFamily:"'DM Mono', monospace",letterSpacing:2,marginBottom:16}}>
          {paso === -1 ? "INTRODUCCIÓN" : `PASO ${paso+1} · ${ejercicio.titulo.toUpperCase()}`}
        </div>

        {/* Temporizador — solo visible durante pasos */}
        {paso >= 0 && (
          <div style={{display:"flex",justifyContent:"center",margin:"0 0 20px"}}>
            <div style={{position:"relative",width:104,height:104}}>
              <svg width={104} height={104} style={{transform:"rotate(-90deg)"}}>
                <circle cx={52} cy={52} r={radio} fill="none" stroke={DS.border} strokeWidth={5}/>
                <circle cx={52} cy={52} r={radio} fill="none" stroke={mc.accent} strokeWidth={5}
                  strokeDasharray={circ} strokeDashoffset={circ - progreso}
                  strokeLinecap="round" style={{transition:"stroke-dashoffset 1s linear"}}/>
              </svg>
              <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <div style={{fontSize:28,fontWeight:800,color:mc.accent,fontFamily:"'DM Mono', monospace"}}>{segundos}</div>
                <div style={{fontSize:9,color:DS.inkMuted,fontFamily:"'DM Mono', monospace",letterSpacing:1}}>SEG</div>
              </div>
            </div>
          </div>
        )}

        {/* Texto del paso */}
        <p role="status" aria-live="polite"
          style={{fontSize:15,color:DS.ink,lineHeight:1.8,marginBottom:24,fontFamily:"'DM Sans', sans-serif"}}>
          {textoActual}
        </p>

        {/* Botones de control */}
        {paso === -1 && (
          <button onClick={handleIniciar}
            style={{width:"100%",padding:14,borderRadius:12,border:"none",background:`linear-gradient(135deg, ${mc.accent}, ${mc.accent}cc)`,color:DS.bg,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans', sans-serif"}}>
            ▶ INICIAR EJERCICIO
          </button>
        )}

        {paso >= 0 && !corriendo && (
          <button onClick={continuar}
            style={{width:"100%",padding:14,borderRadius:12,border:"none",background:`linear-gradient(135deg, ${mc.accent}, ${mc.accent}cc)`,color:DS.bg,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans', sans-serif"}}>
            ▶ CONTINUAR
          </button>
        )}

        {paso >= 0 && corriendo && (
          <button onClick={pausar}
            style={{width:"100%",padding:14,borderRadius:12,border:`1px solid ${DS.border}`,background:"transparent",color:DS.ink,fontSize:14,cursor:"pointer",fontFamily:"'DM Sans', sans-serif"}}>
            ⏸ PAUSAR
          </button>
        )}
      </div>

      {/* Subtítulos CC */}
      {subtCC && (
        <div role="status" aria-live="polite"
          style={{background:mc.soft,borderRadius:10,padding:"10px 16px",margin:"12px 0",border:`1px solid ${mc.border}`}}>
          <div style={{fontSize:10,color:mc.accent,fontFamily:"'DM Mono', monospace",letterSpacing:1,marginBottom:4}}>CC</div>
          <p style={{fontSize:14,color:DS.ink,lineHeight:1.6,margin:0,fontFamily:"'DM Sans', sans-serif"}}>{textoActual}</p>
        </div>
      )}

      {/* Indicador de pasos */}
      {paso >= 0 && (
        <div style={{display:"flex",gap:5,justifyContent:"center",marginTop:16}}>
          {ejercicio.pasos.map((_,i) => (
            <div key={i} style={{width:i===paso?18:6,height:6,borderRadius:3,background:i<=paso?mc.accent:DS.border,transition:"all 0.3s"}}/>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PANTALLA MÓDULO ──────────────────────────────────────────────────────────
function PantallaModulo({ moduloId, onVolver }) {
  const mc = MOD[moduloId];
  const mod = MODULOS.find(m => m.id===moduloId);
  const ejercicios = EJERCICIOS[moduloId] || [];
  const [seleccionado, setSeleccionado] = useState(null);
  const tieneAudio = moduloId === "A";

  useEffect(() => {
    const textos = {
      A: "Módulo A. Regulación de Activación. Tienes tres ejercicios disponibles con audio de voz del autor.",
      B: "Módulo B. Control del Pensamiento. Tres ejercicios para silenciar el ruido mental.",
      C: "Módulo C. Construcción de Confianza. Activa tu historial de éxitos.",
      D: "Módulo D. Foco y Concentración. Ancla tu atención al presente.",
      E: "Módulo E. Seguimiento y Evolución. Para después de tu etapa.",
    };
    const t = setTimeout(() => hablar(textos[moduloId] || ""), 400);
    return () => clearTimeout(t);
  }, [moduloId]);

  if(seleccionado) return (
    <EjercicioActivo ejercicio={seleccionado} moduloId={moduloId} onVolver={() => { detenerVoz(); setSeleccionado(null); }}/>
  );

  return (
    <div>
      <div style={{background:`linear-gradient(135deg, ${DS.card}, #0d1520)`,border:`1px solid ${DS.border}`,borderRadius:20,padding:26,marginBottom:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-30,width:130,height:130,borderRadius:"50%",background:`radial-gradient(circle, ${mc.soft} 0%, transparent 70%)`}}/>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <div style={{width:44,height:44,borderRadius:12,background:mc.soft,border:`1px solid ${mc.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{mod?.icono}</div>
          <div>
            <div style={{fontSize:10,color:mc.accent,fontFamily:"'DM Mono', monospace",letterSpacing:2,marginBottom:2}}>MÓDULO {moduloId}</div>
            <h2 style={{fontSize:20,fontWeight:700,color:DS.ink,fontFamily:"'Cormorant Garamond', serif"}}>{mod?.titulo}</h2>
          </div>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {[mc.label, "Todos los contextos", tieneAudio?"🎙️ Audio del autor":"Sin audio aún"].map((tag,i) => (
            <div key={i} style={{fontSize:9,color:i===2&&tieneAudio?DS.gold:i===0?mc.accent:DS.inkMuted,background:i===2&&tieneAudio?DS.goldSoft:i===0?mc.soft:DS.surface,padding:"4px 8px",borderRadius:10,fontFamily:"'DM Mono', monospace",letterSpacing:0.5,border:`1px solid ${i===2&&tieneAudio?DS.goldSoft:i===0?mc.border:DS.border}`}}>{tag}</div>
          ))}
        </div>
      </div>

      <div style={{fontSize:11,color:DS.inkMuted,fontFamily:"'DM Mono', monospace",letterSpacing:2,marginBottom:14}}>
        EJERCICIOS — {ejercicios.length} disponibles
      </div>

      {ejercicios.map(ej => {
        const ejTieneAudio = !!(AUDIO[ej.id]);
        return (
          <div key={ej.id} onClick={() => setSeleccionado(ej)}
            style={{background:DS.card,border:`1px solid ${DS.border}`,borderRadius:14,padding:18,marginBottom:10,cursor:"pointer",transition:"border-color 0.2s"}}
            onMouseEnter={e => e.currentTarget.style.borderColor=mc.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor=DS.border}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{width:44,height:44,borderRadius:12,background:mc.soft,border:`1px solid ${mc.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{ej.icono}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{fontSize:14,fontWeight:700,color:DS.ink,fontFamily:"'DM Sans', sans-serif"}}>{ej.titulo}</div>
                  <div style={{fontSize:9,color:mc.accent,background:mc.soft,padding:"3px 7px",borderRadius:5,fontFamily:"'DM Mono', monospace",letterSpacing:1,flexShrink:0,marginLeft:8}}>{ej.dur}</div>
                </div>
                <p style={{fontSize:12,color:DS.inkMuted,lineHeight:1.5,margin:"4px 0 0",fontFamily:"'DM Sans', sans-serif"}}>{ej.desc}</p>
              </div>
            </div>
            <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${DS.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:11,color:ejTieneAudio?DS.gold:DS.inkMuted,fontFamily:"'DM Sans', sans-serif"}}>
                {ejTieneAudio?"🎙️ Audio del autor":"♿ CC disponible"}
              </div>
              <div style={{fontSize:12,color:mc.accent,fontWeight:600,fontFamily:"'DM Sans', sans-serif"}}>Comenzar →</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  const [pantalla, setPantalla] = useState("bienvenida");
  const [perfil, setPerfil] = useState(null);
  const [moduloActivo, setModuloActivo] = useState(null);
  const [anim, setAnim] = useState(true);

  const ir = destino => {
    // Solo detener voz si navegamos HACIA una pantalla funcional, no desde bienvenida
    if(destino !== "inicio") detenerVoz();
    setAnim(false);
    setTimeout(() => { setPantalla(destino); setAnim(true); }, 150);
  };

  return (
    <div style={{
      minHeight:"100vh",
      background:DS.bg,
      colorScheme:"dark",
      fontFamily:"'DM Sans', sans-serif",
      display:"flex",flexDirection:"column",alignItems:"center",
      padding: pantalla === "bienvenida" ? "0" : "24px 16px 40px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; color-scheme: dark; }
        html, body { background: #0a0f1e !important; color-scheme: dark; }
        button { font-family: 'DM Sans', sans-serif; }
        input, textarea, select { color-scheme: dark; }
      `}</style>

      {/* Pantalla bienvenida sin wrapper */}
      {pantalla === "bienvenida" && (
        <PantallaBienvenida onEntrar={() => ir("inicio")}/>
      )}

      {/* Resto de pantallas con wrapper animado */}
      {pantalla !== "bienvenida" && (
        <div style={{width:"100%",maxWidth:420,opacity:anim?1:0,transform:anim?"translateY(0)":"translateY(12px)",transition:"all 0.25s ease"}}>
          <Header pantalla={pantalla} onHome={() => ir("inicio")}/>
          {pantalla==="inicio" && (
            <PantallaInicio onIniciar={() => ir("check")}/>
          )}
          {pantalla==="check" && (
            <PantallaCheck onCompletado={p => { setPerfil(p); ir("plan"); }}/>
          )}
          {pantalla==="plan" && perfil && (
            <PantallaPerfilPlan perfil={perfil} onModulo={id => { setModuloActivo(id); ir("modulo"); }}/>
          )}
          {pantalla==="modulo" && moduloActivo && (
            <PantallaModulo moduloId={moduloActivo} onVolver={() => ir(perfil?"plan":"inicio")}/>
          )}
        </div>
      )}
    </div>
  );
}