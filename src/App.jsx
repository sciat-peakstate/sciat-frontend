import { useState, useEffect, useRef } from "react";

const DS = {
  bg:"#f8f6f1",bgDark:"#0c1a16",surface:"#ffffff",
  emerald:"#0a6e5c",emeraldMid:"#0d8f78",emeraldLight:"#10b99a",
  emeraldSoft:"#10b99a15",emeraldBorder:"#10b99a30",
  gold:"#c9a84c",goldLight:"#e2c074",goldSoft:"#c9a84c15",goldBorder:"#c9a84c35",
  ink:"#0f1f1a",inkMid:"#2d4a42",inkLight:"#5a7a72",inkMuted:"#8aaa9f",
  border:"#e0ddd5",danger:"#e05252",warn:"#f59e0b",
};

const MOD = {
  A:{accent:"#10b99a",soft:"#10b99a15",border:"#10b99a30",label:"Regulación"},
  B:{accent:"#6366f1",soft:"#6366f115",border:"#6366f130",label:"Pensamiento"},
  C:{accent:"#c9a84c",soft:"#c9a84c15",border:"#c9a84c30",label:"Confianza"},
  D:{accent:"#0891b2",soft:"#0891b215",border:"#0891b230",label:"Foco"},
  E:{accent:"#7c3aed",soft:"#7c3aed12",border:"#7c3aed28",label:"Seguimiento"},
};

const MODULOS = [
  {id:"A",icono:"🫁",titulo:"Regulación de Activación",desc:"Controla tu energía física"},
  {id:"B",icono:"🧠",titulo:"Control del Pensamiento",desc:"Silencia el ruido mental"},
  {id:"C",icono:"🔥",titulo:"Construcción de Confianza",desc:"Activa tu historial de éxitos"},
  {id:"D",icono:"🎯",titulo:"Foco y Concentración",desc:"Ancla tu atención al presente"},
  {id:"E",icono:"📊",titulo:"Seguimiento y Evolución",desc:"Después de tu etapa"},
];

const EJERCICIOS = {
  A:[
    {id:"A1",icono:"🫁",titulo:"Respiración 4-7-8",dur:"4 min",desc:"Activa el sistema nervioso parasimpático en minutos.",
     pasos:[
       {t:"Encuentra una postura cómoda. Cierra los ojos si puedes.",s:5},
       {t:"Inhala por la nariz contando hasta 4. Lento, profundo, sin forzar.",s:4},
       {t:"Retén el aire contando hasta 7. Mantén la calma.",s:7},
       {t:"Exhala completamente por la boca contando hasta 8. Suelta la tensión.",s:8},
       {t:"Repite el ciclo. Inhala 4, retén 7, exhala 8. Vas muy bien.",s:19},
       {t:"Un ciclo más. Cada respiración te acerca a tu estado óptimo.",s:19},
       {t:"Abre los ojos. Observa cómo se siente tu cuerpo. Eso es regulación.",s:6},
     ]},
    {id:"A2",icono:"💆",titulo:"Relajación Muscular Progresiva",dur:"6 min",desc:"Libera la tensión con la técnica de Jacobson adaptada.",
     pasos:[
       {t:"Siéntate cómodamente. Pies en el suelo. Dos respiraciones profundas.",s:8},
       {t:"Aprieta los puños con fuerza durante 5 segundos. Siente la tensión.",s:5},
       {t:"Suelta. Observa la diferencia entre tensión y relajación.",s:8},
       {t:"Hombros hacia las orejas con fuerza. Mantén 5 segundos.",s:5},
       {t:"Suelta los hombros completamente. Siente el peso que se va.",s:8},
       {t:"Aprieta los ojos y frunce el ceño. 5 segundos.",s:5},
       {t:"Suelta todo el rostro. Mandíbula floja. Frente suave.",s:8},
       {t:"Escanea tu cuerpo. Está más ligero. Llevas esa calma contigo.",s:10},
     ]},
    {id:"A3",icono:"⚡",titulo:"Activación Controlada",dur:"3 min",desc:"Actívate cuando tu energía está baja antes de la etapa.",
     pasos:[
       {t:"De pie. Sacude las manos con fuerza 10 segundos. Despierta el cuerpo.",s:10},
       {t:"Inhala rápido por la nariz, exhala fuerte por la boca. 5 veces.",s:15},
       {t:"Di en voz alta: Estoy listo. Estoy preparado. Este momento es mío.",s:8},
       {t:"Salta en el lugar 10 veces. Liviano, rítmico. Conecta mente y cuerpo.",s:15},
       {t:"Para. Respira. Siente la energía circulando. Eso es activación óptima.",s:8},
     ]},
  ],
  B:[
    {id:"B1",icono:"🧠",titulo:"Reestructuración Cognitiva",dur:"5 min",desc:"Transforma los pensamientos bloqueantes en impulsores.",
     pasos:[
       {t:"Identifica el pensamiento que aparece antes de tu etapa. Solo obsérvalo.",s:10},
       {t:"¿Ese pensamiento es un hecho o una interpretación? ¿Qué evidencia real tienes?",s:15},
       {t:"Piensa en la evidencia real. A menudo... no hay evidencia real.",s:20},
       {t:"Reescribe ese pensamiento. Que sea realista y que puedas creerlo.",s:25},
       {t:"Ese pensamiento alternativo es tuyo. Léelo antes de tu etapa.",s:10},
     ]},
    {id:"B2",icono:"🛑",titulo:"Detención del Pensamiento",dur:"3 min",desc:"Interrumpe el pensamiento negativo en el momento.",
     pasos:[
       {t:"Cuando aparezca un pensamiento negativo — di mentalmente STOP con fuerza.",s:8},
       {t:"Toma una respiración lenta y profunda. Una sola. Ese espacio es tuyo.",s:8},
       {t:"Lleva tu atención a algo concreto: tus pies, lo que ves ahora mismo.",s:10},
       {t:"¿Cuál es el siguiente paso concreto que necesito dar ahora? Solo ese.",s:10},
       {t:"Practica esta secuencia hasta automatizarla. Es una habilidad entrenable.",s:8},
     ]},
    {id:"B3",icono:"🎬",titulo:"Visualización de Ejecución",dur:"7 min",desc:"Ensaya el proceso, no el resultado.",
     pasos:[
       {t:"Cierra los ojos. Lleva tu mente al momento justo antes de tu etapa.",s:20},
       {t:"¿Cómo se siente tu cuerpo? Tu postura, tu respiración. Sereno y activado.",s:20},
       {t:"Ejecuta en tu mente paso a paso. Tu primera acción. Con precisión.",s:25},
       {t:"Imagina que algo sale diferente. ¿Cómo respondes? Visualiza tu adaptación.",s:20},
       {t:"El último paso del proceso hecho con todo lo que tienes. Eso es suficiente.",s:20},
       {t:"Abre los ojos. Tu cerebro acaba de ensayar. Cada repetición lo hace más familiar.",s:10},
     ]},
  ],
  C:[
    {id:"C1",icono:"🏆",titulo:"Registro de Logros Previos",dur:"6 min",desc:"Tu historial de éxito es tu combustible más poderoso.",
     pasos:[
       {t:"La confianza se construye con evidencia real. Tus logros son esa evidencia.",s:10},
       {t:"¿Cuál es una situación de presión que hayas superado recientemente?",s:25},
       {t:"¿Cuál es el momento más difícil que atravesaste y del que saliste adelante?",s:25},
       {t:"¿De qué logro te sientes más orgulloso? El que te hace sentir capaz de mucho.",s:25},
       {t:"Hay un patrón en lo que escribiste. Una forma en que tú respondes bajo presión.",s:15},
       {t:"Estos son tu banco de confianza. Léelos antes de tu próxima etapa.",s:10},
     ]},
    {id:"C2",icono:"⚙️",titulo:"Rutina de Preparación",dur:"5 min",desc:"Activa tu estado óptimo con una secuencia repetible.",
     pasos:[
       {t:"Tres respiraciones lentas. Con cada exhale suelta lo que no necesitas llevar.",s:20},
       {t:"Cierra los ojos. Visualiza el primer paso concreto de tu etapa.",s:20},
       {t:"Di tu frase de activación: Estoy listo. He preparado esto. Es mi momento.",s:10},
       {t:"Haz un gesto físico que marque el inicio. Ese gesto es tu señal de arranque.",s:15},
       {t:"Practica esta secuencia antes de cada etapa. Con el tiempo se activa sola.",s:10},
     ]},
    {id:"C3",icono:"💬",titulo:"Diálogo Interno Positivo",dur:"4 min",desc:"Construye tu voz interna de alto rendimiento.",
     pasos:[
       {t:"Lo que te dices bajo presión determina tu rendimiento. Hoy cambiamos eso.",s:12},
       {t:"¿Qué palabras aparecen en tu mente cuando estás bajo presión real?",s:20},
       {t:"Transforma ese pensamiento. De 'no puedo' a 'puedes manejarlo'.",s:12},
       {t:"Escribe una frase corta en segunda persona que puedas creer bajo presión.",s:20},
       {t:"Di tu frase ahora con toda la intensidad que puedas. Ese momento la graba.",s:8},
       {t:"Repite esta frase en cada momento de presión. La repetición la convierte en reflejo.",s:10},
     ]},
  ],
  D:[
    {id:"D1",icono:"🎯",titulo:"Atención Selectiva",dur:"4 min",desc:"Filtra el ruido y amplifica la señal que importa.",
     pasos:[
       {t:"Imagina un círculo. Dentro solo lo que puedes controlar ahora mismo.",s:18},
       {t:"¿Cuál es la única cosa que necesitas ejecutar bien en este momento?",s:12},
       {t:"Cuando aparezca una distracción: 3 cosas que ves, 2 sensaciones, 1 foco.",s:18},
       {t:"Aplica el 3-2-1 ahora mismo. Tres cosas que ves. Dos en el cuerpo. Un foco.",s:20},
       {t:"No importa cuántas veces te distraigas. Solo importa cuántas veces vuelves.",s:12},
     ]},
    {id:"D2",icono:"🔆",titulo:"Calentamiento Mental",dur:"5 min",desc:"Lleva tu mente a su punto óptimo antes de la etapa.",
     pasos:[
       {t:"Responde mentalmente: ¿Cuál es tu nombre? ¿Dónde estás? ¿Qué día es hoy?",s:16},
       {t:"¿Qué vas a hacer? ¿Cuál es el objetivo concreto? ¿Qué has preparado?",s:20},
       {t:"Imagina el primer minuto de tu etapa. Los primeros movimientos y decisiones.",s:20},
       {t:"Hoy voy a dar lo mejor que tengo en este momento. No lo de ayer — lo de ahora.",s:10},
       {t:"Mente activada, contextualizada y enfocada. Llévalo a tu etapa.",s:8},
     ]},
    {id:"D3",icono:"⏱️",titulo:"Control del Momento Presente",dur:"6 min",desc:"Ancla toda tu energía en el único momento donde puedes actuar.",
     pasos:[
       {t:"Cierra los ojos. Lleva tu atención a tu respiración. Solo obsérvala.",s:25},
       {t:"¿Qué pensamiento te arrastra fuera del momento bajo presión?",s:20},
       {t:"Cuando aparezca di: 'Eso es el futuro. Ahora estoy aquí.' Y regresa.",s:16},
       {t:"Deja que el pensamiento aparezca. Obsérvalo. Ahora regresa al presente.",s:15},
       {t:"Cada vez que practicas este retorno, se vuelve más rápido y automático.",s:10},
     ]},
  ],
  E:[
    {id:"E1",icono:"📊",titulo:"Análisis de Desempeño",dur:"8 min",desc:"Convierte la experiencia en aprendizaje estructurado.",
     pasos:[
       {t:"Sin juicio — con curiosidad. Convierte esta etapa en información útil.",s:12},
       {t:"¿Cómo evalúas tu rendimiento general? Reflexiona honestamente.",s:20},
       {t:"¿Cómo estaba tu estado mental durante la etapa? ¿Enfocado o alterado?",s:20},
       {t:"¿Qué hiciste bien? ¿Qué funcionó como lo planeaste o mejor?",s:30},
       {t:"¿Qué cambiarías? No lo que salió mal — lo que harías diferente.",s:30},
       {t:"¿Si te quedaras con una sola lección de esta etapa, cuál sería?",s:30},
       {t:"Eso es crecimiento estructurado. Cada etapa analizada te hace mejor.",s:10},
     ]},
    {id:"E2",icono:"🌿",titulo:"Cierre Emocional",dur:"5 min",desc:"Completa el ciclo emocional después de la presión.",
     pasos:[
       {t:"Sin juzgarlo — reconoce lo que sientes. Todo eso es parte del proceso.",s:18},
       {t:"Imagina que la etapa es algo que sostienes. Con cada exhale, relaja el agarre.",s:20},
       {t:"Haz un gesto de cierre. Ese gesto le dice al cuerpo que puede soltar.",s:12},
       {t:"Reconoce que te presentaste. Que diste lo que tenías. Eso siempre vale.",s:14},
       {t:"El siguiente paso es descansar. No analizar. No planificar. Solo descansar.",s:10},
     ]},
    {id:"E3",icono:"📈",titulo:"Evolución Personal",dur:"6 min",desc:"Observa tu patrón de crecimiento con ayuda de la IA.",
     pasos:[
       {t:"Cada etapa registrada forma un patrón que la IA aprende sobre ti.",s:14},
       {t:"La IA identifica cuándo sueles tener ansiedad alta y qué técnicas te regulan mejor.",s:16},
       {t:"Con el tiempo detecta tus fortalezas recurrentes en tus mejores etapas.",s:14},
       {t:"No hay etapas buenas o malas. Hay etapas con información. Cuantas más registres, mejor.",s:12},
     ]},
  ],
};

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function Logo({ size=34 }) {
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
          <div style={{fontSize:18,fontWeight:900,letterSpacing:3,color:DS.emerald,fontFamily:"'Cormorant Garamond', serif",lineHeight:1}}>SCIAT</div>
          <div style={{fontSize:8,color:DS.gold,letterSpacing:3,fontFamily:"'DM Mono', monospace"}}>PEAK STATE</div>
        </div>
      </div>
      {pantalla !== "inicio" && (
        <button onClick={onHome} style={{marginLeft:"auto",background:"transparent",border:`1px solid ${DS.border}`,borderRadius:8,padding:"6px 12px",color:DS.inkMuted,fontSize:12,cursor:"pointer",fontFamily:"'DM Mono', monospace"}}>← Inicio</button>
      )}
    </div>
  );
}

// ─── PANTALLA INICIO ──────────────────────────────────────────────────────────
function PantallaInicio({ onIniciar, onModulo }) {
  const hora = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";
  return (
    <div>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:28,fontWeight:300,color:DS.ink,fontFamily:"'Cormorant Garamond', serif",lineHeight:1.2,marginBottom:4}}>
          {saludo},<br/>
          <span style={{fontWeight:700,color:DS.emerald,fontStyle:"italic"}}>¿cómo estás hoy?</span>
        </h1>
        <div style={{fontSize:12,color:DS.inkMuted,fontFamily:"'DM Sans', sans-serif"}}>
          {new Date().toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"})}
        </div>
      </div>

      <div style={{background:DS.bgDark,borderRadius:20,padding:28,marginBottom:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-30,width:140,height:140,borderRadius:"50%",background:`radial-gradient(circle, ${DS.emeraldSoft} 0%, transparent 70%)`}}/>
        <div style={{fontSize:10,color:DS.goldLight,fontFamily:"'DM Mono', monospace",letterSpacing:2,marginBottom:10}}>NUEVA SESIÓN</div>
        <h2 style={{fontSize:20,fontWeight:600,color:"#f0ede6",fontFamily:"'Cormorant Garamond', serif",marginBottom:8,lineHeight:1.3}}>
          Comienza con el<br/><span style={{color:DS.goldLight,fontStyle:"italic"}}>Check inicial</span>
        </h2>
        <p style={{fontSize:13,color:DS.inkMuted,fontFamily:"'DM Sans', sans-serif",lineHeight:1.6,marginBottom:20}}>
          Evalúa tu estado y recibe un plan personalizado para tu etapa de presión.
        </p>
        <button onClick={onIniciar} style={{background:`linear-gradient(135deg, ${DS.emerald}, ${DS.emeraldMid})`,color:"#fff",border:"none",borderRadius:10,padding:"12px 24px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans', sans-serif"}}>
          Iniciar Check →
        </button>
      </div>

      <div style={{fontSize:11,color:DS.inkMuted,fontFamily:"'DM Mono', monospace",letterSpacing:2,marginBottom:14}}>MÓDULOS</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
        {MODULOS.map(m => {
          const mc = MOD[m.id];
          return (
            <div key={m.id} onClick={() => onModulo(m.id)}
              style={{background:DS.surface,border:`1px solid ${DS.border}`,borderRadius:14,padding:16,cursor:"pointer",transition:"border-color 0.2s"}}
              onMouseEnter={e => e.currentTarget.style.borderColor=mc.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor=DS.border}>
              <div style={{fontSize:22,marginBottom:6}}>{m.icono}</div>
              <div style={{fontSize:10,color:mc.accent,fontFamily:"'DM Mono', monospace",letterSpacing:1,marginBottom:3}}>MOD {m.id}</div>
              <div style={{fontSize:13,fontWeight:700,color:DS.ink,fontFamily:"'DM Sans', sans-serif"}}>{mc.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:DS.emeraldSoft,borderRadius:10,border:`1px solid ${DS.emeraldBorder}`}}>
        <span style={{fontSize:14}}>♿</span>
        <span style={{fontSize:11,color:DS.emerald,fontFamily:"'DM Sans', sans-serif"}}>Subtítulos CC · Audio con voz del autor · Accesible</span>
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
  {id:"lejana",label:"Lejana",desc:"Semanas antes",color:DS.emeraldLight},
  {id:"proxima",label:"Próxima",desc:"Días antes",color:DS.warn},
  {id:"inmediata",label:"Inmediata",desc:"Horas antes",color:DS.danger},
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
    const som = avg(["s1","s2"]);
    const cog = avg(["c1","c2"]);
    const con = avg(["f1","f2"]);
    const niv = (v,inv=false) => {
      if(inv) return v>=3.5?"buena":v>=2.5?"moderada":"baja";
      return v>=3.5?"alta":v>=2.5?"media":"baja";
    };
    return {
      somatica:niv(som), cognitiva:niv(cog), confianza:niv(con,true),
      contexto:CONTEXTOS.find(c=>c.id===contexto)?.label,
      fase:FASES.find(f=>f.id===fase)?.label,
      fecha:new Date().toLocaleDateString("es-ES",{day:"numeric",month:"short"}),
    };
  };

  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,color:DS.emerald,fontFamily:"'DM Mono', monospace",letterSpacing:2,marginBottom:4}}>
          CHECK INICIAL · PASO {paso+1} DE 3
        </div>
        <div style={{height:3,background:DS.border,borderRadius:2}}>
          <div style={{height:"100%",background:`linear-gradient(90deg, ${DS.emerald}, ${DS.emeraldLight})`,borderRadius:2,width:`${((paso+1)/3)*100}%`,transition:"width 0.4s ease"}}/>
        </div>
      </div>

      {paso===0 && (
        <div>
          <h2 style={{fontSize:22,fontWeight:700,color:DS.ink,marginBottom:16,fontFamily:"'Cormorant Garamond', serif"}}>¿En qué contexto estás?</h2>
          {CONTEXTOS.map(c => (
            <div key={c.id} onClick={() => { setContexto(c.id); setTimeout(()=>setPaso(1),250); }}
              style={{background:contexto===c.id?DS.emeraldSoft:DS.surface,border:`1px solid ${contexto===c.id?DS.emerald:DS.border}`,borderRadius:14,padding:"16px 20px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"all 0.2s"}}>
              <div style={{fontSize:26}}>{c.icono}</div>
              <div>
                <div style={{fontSize:15,fontWeight:600,color:DS.ink,fontFamily:"'DM Sans', sans-serif"}}>{c.label}</div>
                <div style={{fontSize:12,color:DS.inkMuted,fontFamily:"'DM Sans', sans-serif"}}>{c.desc}</div>
              </div>
              {contexto===c.id && <div style={{marginLeft:"auto",color:DS.emerald}}>✓</div>}
            </div>
          ))}
        </div>
      )}

      {paso===1 && (
        <div>
          <h2 style={{fontSize:22,fontWeight:700,color:DS.ink,marginBottom:16,fontFamily:"'Cormorant Garamond', serif"}}>¿Cuándo es tu etapa?</h2>
          {FASES.map(f => (
            <div key={f.id} onClick={() => { setFase(f.id); setTimeout(()=>setPaso(2),250); }}
              style={{background:fase===f.id?`${f.color}12`:DS.surface,border:`1px solid ${fase===f.id?f.color:DS.border}`,borderRadius:14,padding:"16px 20px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"all 0.2s"}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:f.color,flexShrink:0}}/>
              <div>
                <div style={{fontSize:15,fontWeight:600,color:DS.ink,fontFamily:"'DM Sans', sans-serif"}}>{f.label}</div>
                <div style={{fontSize:12,color:DS.inkMuted,fontFamily:"'DM Sans', sans-serif"}}>{f.desc}</div>
              </div>
              {fase===f.id && <div style={{marginLeft:"auto",color:f.color}}>✓</div>}
            </div>
          ))}
        </div>
      )}

      {paso===2 && (
        <div>
          <h2 style={{fontSize:22,fontWeight:700,color:DS.ink,marginBottom:6,fontFamily:"'Cormorant Garamond', serif"}}>¿Cómo te sientes ahora?</h2>
          <p style={{fontSize:13,color:DS.inkMuted,marginBottom:20,fontFamily:"'DM Sans', sans-serif"}}>No hay respuestas incorrectas</p>
          {PREGUNTAS.map(q => (
            <div key={q.id} style={{background:DS.surface,border:`1px solid ${DS.border}`,borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{fontSize:13,color:DS.ink,marginBottom:12,lineHeight:1.5,fontFamily:"'DM Sans', sans-serif"}}>{q.texto}</div>
              <div style={{display:"flex",gap:6}}>
                {[{v:1,l:"Nada"},{v:2,l:"Algo"},{v:3,l:"Bastante"},{v:4,l:"Mucho"}].map(op => (
                  <button key={op.v} onClick={() => setResp(p=>({...p,[q.id]:op.v}))}
                    style={{flex:1,padding:"8px 4px",borderRadius:8,border:`1px solid ${resp[q.id]===op.v?DS.emerald:DS.border}`,background:resp[q.id]===op.v?DS.emeraldSoft:"transparent",color:resp[q.id]===op.v?DS.emerald:DS.inkMuted,fontSize:11,cursor:"pointer",fontFamily:"'DM Mono', monospace"}}>
                    {op.l}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={() => onCompletado(calcular())}
            disabled={Object.keys(resp).length < PREGUNTAS.length}
            style={{width:"100%",padding:14,borderRadius:12,border:"none",marginTop:4,background:Object.keys(resp).length>=PREGUNTAS.length?`linear-gradient(135deg, ${DS.emerald}, ${DS.emeraldMid})`:DS.border,color:Object.keys(resp).length>=PREGUNTAS.length?"#fff":DS.inkMuted,fontSize:14,fontWeight:700,cursor:Object.keys(resp).length>=PREGUNTAS.length?"pointer":"not-allowed",fontFamily:"'DM Sans', sans-serif"}}>
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

  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:10,color:DS.emerald,fontFamily:"'DM Mono', monospace",letterSpacing:2,marginBottom:4}}>
          TU PERFIL · {perfil.contexto?.toUpperCase()} · {perfil.fase?.toUpperCase()}
        </div>
        <h2 style={{fontSize:22,fontWeight:700,color:DS.ink,fontFamily:"'Cormorant Garamond', serif"}}>Tu estado en este momento</h2>
      </div>

      <div style={{background:DS.surface,border:`1px solid ${DS.border}`,borderRadius:16,padding:22,marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
        <Barra label="Ansiedad Somática" valor={perfil.somatica} color={perfil.somatica==="alta"?DS.danger:perfil.somatica==="media"?DS.warn:DS.emeraldLight}/>
        <Barra label="Ansiedad Cognitiva" valor={perfil.cognitiva} color={perfil.cognitiva==="alta"?DS.danger:perfil.cognitiva==="media"?DS.warn:DS.emeraldLight}/>
        <Barra label="Autoconfianza" valor={perfil.confianza} color={perfil.confianza==="buena"?DS.emeraldLight:perfil.confianza==="moderada"?DS.warn:DS.danger}/>
      </div>

      <div style={{background:DS.bgDark,borderRadius:14,padding:20,marginBottom:20}}>
        <div style={{fontSize:10,color:DS.goldLight,fontFamily:"'DM Mono', monospace",letterSpacing:1,marginBottom:8}}>ANÁLISIS IA · SCIAT</div>
        <p style={{fontSize:13,color:"#c8d5d0",lineHeight:1.7,fontFamily:"'DM Sans', sans-serif",margin:0}}>
          {recomendados.length>=3?"Detecto activación elevada. Regula primero el cuerpo, luego el pensamiento.":recomendados.length===2?"Tu estado muestra áreas específicas de mejora. El plan está personalizado para ti.":"Tu estado es sólido. El foco ahora es mantener y afinar tu concentración."}
        </p>
      </div>

      <div style={{fontSize:11,color:DS.inkMuted,fontFamily:"'DM Mono', monospace",letterSpacing:2,marginBottom:14}}>
        TU PLAN — {recomendados.length} MÓDULOS ACTIVOS
      </div>

      {recomendados.map(mod => {
        const mc = MOD[mod.id];
        return (
          <div key={mod.id} onClick={() => onModulo(mod.id)}
            style={{background:DS.surface,border:`1px solid ${DS.border}`,borderRadius:14,padding:18,marginBottom:10,cursor:"pointer",transition:"border-color 0.2s",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}
            onMouseEnter={e => e.currentTarget.style.borderColor=mc.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor=DS.border}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:44,height:44,borderRadius:12,background:mc.soft,border:`1px solid ${mc.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{mod.icono}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div style={{fontSize:14,fontWeight:700,color:DS.ink,fontFamily:"'DM Sans', sans-serif"}}>{mod.titulo}</div>
                  <div style={{fontSize:9,color:mc.accent,background:mc.soft,padding:"3px 7px",borderRadius:5,fontFamily:"'DM Mono', monospace",letterSpacing:1}}>MOD {mod.id}</div>
                </div>
                <div style={{fontSize:12,color:DS.inkMuted,fontFamily:"'DM Sans', sans-serif",marginTop:2}}>{mod.desc}</div>
              </div>
            </div>
          </div>
        );
      })}

      <div style={{background:"#f2ede4",border:`1px dashed ${DS.border}`,borderRadius:14,padding:16,marginTop:4,display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:20}}>📊</span>
        <div>
          <div style={{fontSize:13,fontWeight:600,color:DS.inkMid,fontFamily:"'DM Sans', sans-serif"}}>Módulo E — Seguimiento</div>
          <div style={{fontSize:11,color:DS.inkMuted,fontFamily:"'DM Sans', sans-serif"}}>Disponible después de tu etapa de presión</div>
        </div>
      </div>
    </div>
  );
}

// ─── EJERCICIO CON TEMPORIZADOR ───────────────────────────────────────────────
function EjercicioActivo({ ejercicio, moduloId, onVolver }) {
  const mc = MOD[moduloId];
  const [paso, setPaso] = useState(0);
  const [segundos, setSegundos] = useState(ejercicio.pasos[0].s);
  const [corriendo, setCorriendo] = useState(false);
  const [completado, setCompletado] = useState(false);
  const [subtCC, setSubtCC] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    return () => clearInterval(ref.current);
  }, []);

  const iniciar = () => {
    setCorriendo(true);
    ref.current = setInterval(() => {
      setSegundos(s => {
        if(s<=1) {
          clearInterval(ref.current);
          const sig = paso+1;
          if(sig < ejercicio.pasos.length) {
            setPaso(sig);
            setSegundos(ejercicio.pasos[sig].s);
            setCorriendo(false);
          } else {
            setCorriendo(false);
            setCompletado(true);
          }
          return 0;
        }
        return s-1;
      });
    },1000);
  };

  const pausar = () => { clearInterval(ref.current); setCorriendo(false); };

  const reiniciar = () => {
    clearInterval(ref.current);
    setPaso(0); setSegundos(ejercicio.pasos[0].s);
    setCorriendo(false); setCompletado(false);
  };

  if(completado) return (
    <div style={{textAlign:"center",padding:"40px 0"}}>
      <div style={{fontSize:56,marginBottom:16}}>✅</div>
      <h2 style={{fontSize:22,fontWeight:700,color:DS.ink,marginBottom:8,fontFamily:"'Cormorant Garamond', serif"}}>Ejercicio completado</h2>
      <p style={{fontSize:14,color:DS.inkMuted,lineHeight:1.6,marginBottom:28,fontFamily:"'DM Sans', sans-serif"}}>Has trabajado tu rendimiento. Llevas eso a tu etapa.</p>
      <button onClick={reiniciar} style={{width:"100%",padding:14,borderRadius:12,border:`1px solid ${DS.border}`,background:"transparent",color:DS.inkMuted,fontSize:13,cursor:"pointer",marginBottom:12,fontFamily:"'DM Sans', sans-serif"}}>Repetir ejercicio</button>
      <button onClick={onVolver} style={{width:"100%",padding:14,borderRadius:12,border:"none",background:`linear-gradient(135deg, ${mc.accent}, ${mc.accent}cc)`,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans', sans-serif"}}>← Volver al módulo</button>
    </div>
  );

  const radio=44, circ=2*Math.PI*radio;
  const durPaso = ejercicio.pasos[paso].s;
  const progreso = ((durPaso-segundos)/durPaso)*circ;

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <button onClick={onVolver} style={{background:"transparent",border:`1px solid ${DS.border}`,borderRadius:8,padding:"6px 12px",color:DS.inkMuted,fontSize:13,cursor:"pointer"}}>←</button>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:DS.ink,fontFamily:"'DM Sans', sans-serif"}}>{ejercicio.titulo}</div>
          <div style={{fontSize:11,color:DS.inkMuted,fontFamily:"'DM Mono', monospace"}}>Paso {paso+1} de {ejercicio.pasos.length}</div>
        </div>
        <button onClick={() => setSubtCC(!subtCC)}
          aria-pressed={subtCC}
          style={{marginLeft:"auto",background:subtCC?mc.soft:"transparent",border:`1px solid ${subtCC?mc.accent:DS.border}`,borderRadius:8,padding:"6px 10px",color:subtCC?mc.accent:DS.inkMuted,fontSize:11,cursor:"pointer",fontFamily:"'DM Mono', monospace",letterSpacing:1}}>CC</button>
      </div>

      <div style={{height:3,background:DS.border,borderRadius:2,marginBottom:20}}>
        <div style={{height:"100%",background:mc.accent,borderRadius:2,width:`${((paso+1)/ejercicio.pasos.length)*100}%`,transition:"width 0.5s"}}/>
      </div>

      <div style={{background:DS.surface,border:`1px solid ${DS.border}`,borderRadius:16,padding:24,textAlign:"center",marginBottom:12,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
        <div style={{display:"flex",justifyContent:"center",margin:"0 0 20px"}}>
          <div style={{position:"relative",width:104,height:104}}>
            <svg width={104} height={104} style={{transform:"rotate(-90deg)"}}>
              <circle cx={52} cy={52} r={radio} fill="none" stroke={DS.border} strokeWidth={5}/>
              <circle cx={52} cy={52} r={radio} fill="none" stroke={mc.accent} strokeWidth={5}
                strokeDasharray={circ} strokeDashoffset={circ-progreso}
                strokeLinecap="round" style={{transition:"stroke-dashoffset 1s linear"}}/>
            </svg>
            <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <div style={{fontSize:28,fontWeight:800,color:mc.accent,fontFamily:"'DM Mono', monospace"}}>{segundos}</div>
              <div style={{fontSize:9,color:DS.inkMuted,fontFamily:"'DM Mono', monospace",letterSpacing:1}}>SEG</div>
            </div>
          </div>
        </div>

        <p role="status" aria-live="polite" style={{fontSize:15,color:DS.ink,lineHeight:1.8,marginBottom:24,fontFamily:"'DM Sans', sans-serif"}}>
          {ejercicio.pasos[paso].t}
        </p>

        {!corriendo ? (
          <button onClick={iniciar} style={{width:"100%",padding:14,borderRadius:12,border:"none",background:`linear-gradient(135deg, ${mc.accent}, ${mc.accent}cc)`,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans', sans-serif"}}>
            ▶ {paso===0?"INICIAR":"CONTINUAR"}
          </button>
        ) : (
          <button onClick={pausar} style={{width:"100%",padding:14,borderRadius:12,border:`1px solid ${DS.border}`,background:"transparent",color:DS.ink,fontSize:14,cursor:"pointer",fontFamily:"'DM Sans', sans-serif"}}>
            ⏸ PAUSAR
          </button>
        )}
      </div>

      {subtCC && (
        <div role="status" aria-live="polite" style={{background:mc.soft,borderRadius:10,padding:"10px 16px",margin:"12px 0",border:`1px solid ${mc.border}`}}>
          <div style={{fontSize:10,color:mc.accent,fontFamily:"'DM Mono', monospace",letterSpacing:1,marginBottom:4}}>CC</div>
          <p style={{fontSize:14,color:DS.ink,lineHeight:1.6,margin:0,fontFamily:"'DM Sans', sans-serif"}}>{ejercicio.pasos[paso].t}</p>
        </div>
      )}

      <div style={{display:"flex",gap:5,justifyContent:"center",marginTop:16}}>
        {ejercicio.pasos.map((_,i) => (
          <div key={i} style={{width:i===paso?18:6,height:6,borderRadius:3,background:i<=paso?mc.accent:DS.border,transition:"all 0.3s"}}/>
        ))}
      </div>
    </div>
  );
}

// ─── PANTALLA MÓDULO ──────────────────────────────────────────────────────────
function PantallaModulo({ moduloId, onVolver }) {
  const mc = MOD[moduloId];
  const mod = MODULOS.find(m => m.id===moduloId);
  const ejercicios = EJERCICIOS[moduloId] || [];
  const [seleccionado, setSeleccionado] = useState(null);

  if(seleccionado) return (
    <EjercicioActivo
      ejercicio={seleccionado}
      moduloId={moduloId}
      onVolver={() => setSeleccionado(null)}
    />
  );

  return (
    <div>
      <div style={{background:DS.bgDark,borderRadius:20,padding:26,marginBottom:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-30,width:130,height:130,borderRadius:"50%",background:`radial-gradient(circle, ${mc.soft} 0%, transparent 70%)`}}/>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div style={{width:44,height:44,borderRadius:12,background:mc.soft,border:`1px solid ${mc.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{mod?.icono}</div>
          <div>
            <div style={{fontSize:10,color:mc.accent,fontFamily:"'DM Mono', monospace",letterSpacing:2,marginBottom:2}}>MÓDULO {moduloId}</div>
            <h2 style={{fontSize:19,fontWeight:700,color:"#f0ede6",fontFamily:"'Cormorant Garamond', serif"}}>{mod?.titulo}</h2>
          </div>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {[mc.label,"Todos los contextos","Con audio"].map((tag,i) => (
            <div key={i} style={{fontSize:9,color:i===0?mc.accent:DS.inkMuted,background:i===0?mc.soft:"#1e3a31",padding:"3px 8px",borderRadius:10,fontFamily:"'DM Mono', monospace",letterSpacing:0.5}}>{tag}</div>
          ))}
        </div>
      </div>

      <div style={{fontSize:11,color:DS.inkMuted,fontFamily:"'DM Mono', monospace",letterSpacing:2,marginBottom:14}}>
        EJERCICIOS — {ejercicios.length} disponibles
      </div>

      {ejercicios.map(ej => (
        <div key={ej.id}
          onClick={() => setSeleccionado(ej)}
          style={{background:DS.surface,border:`1px solid ${DS.border}`,borderRadius:14,padding:18,marginBottom:10,cursor:"pointer",transition:"border-color 0.2s",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}
          onMouseEnter={e => e.currentTarget.style.borderColor=mc.accent}
          onMouseLeave={e => e.currentTarget.style.borderColor=DS.border}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
            <div style={{width:44,height:44,borderRadius:12,background:mc.soft,border:`1px solid ${mc.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{ej.icono}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div style={{fontSize:14,fontWeight:700,color:DS.ink,fontFamily:"'DM Sans', sans-serif"}}>{ej.titulo}</div>
                <div style={{fontSize:9,color:mc.accent,background:mc.soft,padding:"3px 7px",borderRadius:5,fontFamily:"'DM Mono', monospace",letterSpacing:1,flexShrink:0,marginLeft:8}}>{ej.dur}</div>
              </div>
              <p style={{fontSize:12,color:DS.inkMuted,lineHeight:1.5,margin:"4px 0 0",fontFamily:"'DM Sans', sans-serif"}}>{ej.desc}</p>
            </div>
          </div>
          <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${DS.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:11,color:DS.inkMuted,fontFamily:"'DM Sans', sans-serif"}}>🎙️ Audio incluido</div>
            <div style={{fontSize:12,color:mc.accent,fontWeight:600,fontFamily:"'DM Sans', sans-serif"}}>Comenzar →</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  const [pantalla, setPantalla] = useState("inicio");
  const [perfil, setPerfil] = useState(null);
  const [moduloActivo, setModuloActivo] = useState(null);
  const [anim, setAnim] = useState(true);

  const ir = destino => {
    setAnim(false);
    setTimeout(() => { setPantalla(destino); setAnim(true); },150);
  };

  const handleCheck = p => { setPerfil(p); ir("plan"); };
  const handleModulo = id => { setModuloActivo(id); ir("modulo"); };

  return (
    <div style={{minHeight:"100vh",background:DS.bg,fontFamily:"'DM Sans', sans-serif",display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 16px 40px"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} button{font-family:'DM Sans',sans-serif;}`}</style>
      <div style={{width:"100%",maxWidth:420,opacity:anim?1:0,transform:anim?"translateY(0)":"translateY(12px)",transition:"all 0.25s ease"}}>
        <Header pantalla={pantalla} onHome={() => ir("inicio")}/>
        {pantalla==="inicio" && <PantallaInicio onIniciar={() => ir("check")} onModulo={handleModulo}/>}
        {pantalla==="check" && <PantallaCheck onCompletado={handleCheck}/>}
        {pantalla==="plan" && perfil && <PantallaPerfilPlan perfil={perfil} onModulo={handleModulo}/>}
        {pantalla==="modulo" && moduloActivo && <PantallaModulo moduloId={moduloActivo} onVolver={() => ir(perfil?"plan":"inicio")}/>}
      </div>
    </div>
  );
}