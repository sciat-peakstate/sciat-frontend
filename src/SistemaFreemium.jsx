// ─── SISTEMA FREEMIUM SCIAT PEAK STATE ───────────────────────────────────────
// Integración: Firebase Auth + Stripe
// Modelo: Gratis (Módulo A + Check) | Premium ($9.99/mes o $79/año)
//
// INSTRUCCIONES DE INSTALACIÓN:
// 1. npm install firebase @stripe/stripe-js
// 2. Crear proyecto en Firebase Console → habilitar Authentication (Email/Password)
// 3. Crear cuenta Stripe → obtener claves API
// 4. Reemplazar las variables FIREBASE_CONFIG y STRIPE_KEY con tus claves reales
// 5. En Firebase Console → Firestore → crear colección "usuarios"
// 6. En Stripe → crear 2 productos: mensual ($9.99) y anual ($79)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { loadStripe } from "@stripe/stripe-js";

// ─── CONFIGURACIÓN FIREBASE ───────────────────────────────────────────────────
// ⚠️ Reemplaza con tus credenciales reales de Firebase Console
const FIREBASE_CONFIG = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID",
};

// ─── CONFIGURACIÓN STRIPE ─────────────────────────────────────────────────────
// ⚠️ Reemplaza con tu clave pública de Stripe Dashboard
const STRIPE_KEY = "pk_live_TU_CLAVE_PUBLICA_STRIPE";

// ⚠️ Reemplaza con los Price IDs de tus productos en Stripe Dashboard
const STRIPE_PRICES = {
  mensual: "price_TU_ID_MENSUAL",   // $9.99/mes
  anual:   "price_TU_ID_ANUAL",     // $79/año
};

// ─── INICIALIZACIÓN ───────────────────────────────────────────────────────────
const firebaseApp = initializeApp(FIREBASE_CONFIG);
const auth        = getAuth(firebaseApp);
const db          = getFirestore(firebaseApp);
const stripePromise = loadStripe(STRIPE_KEY);

// ─── TEMA OSCURO SCIAT ────────────────────────────────────────────────────────
const DS = {
  bg:"#0a0f1e", surface:"#111827", card:"#1a2235", cardDark:"#0d1520",
  emerald:"#00d4aa", emeraldSoft:"#00d4aa18", emeraldBorder:"#00d4aa35",
  gold:"#f59e0b", goldLight:"#fbbf24", goldSoft:"#f59e0b18",
  ink:"#f0f4ff", inkMid:"#c8d5e8", inkMuted:"#8899bb",
  border:"#1e2d45", danger:"#ef4444", warn:"#f59e0b",
};

// ─── MÓDULOS PREMIUM (B, C, D, E) ────────────────────────────────────────────
const MODULOS_PREMIUM = ["B", "C", "D", "E"];
const esPremium = (moduloId) => MODULOS_PREMIUM.includes(moduloId);

// ─── HOOK: ESTADO DE AUTENTICACIÓN Y SUSCRIPCIÓN ─────────────────────────────
export function useAuth() {
  const [usuario, setUsuario]           = useState(null);
  const [tienePremium, setTienePremium] = useState(false);
  const [cargando, setCargando]         = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuario(user);
        // Verificar suscripción en Firestore
        const docRef  = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Premium activo si fecha de expiración es futura
          const expira = data.premiumExpira?.toDate?.() || null;
          setTienePremium(expira ? expira > new Date() : false);
        } else {
          // Crear perfil de usuario nuevo
          await setDoc(docRef, {
            email:         user.email,
            creadoEn:      new Date(),
            premiumExpira: null,
            plan:          "gratis",
          });
          setTienePremium(false);
        }
      } else {
        setUsuario(null);
        setTienePremium(false);
      }
      setCargando(false);
    });
    return unsub;
  }, []);

  return { usuario, tienePremium, cargando };
}

// ─── FUNCIÓN: INICIAR PAGO CON STRIPE ────────────────────────────────────────
export async function iniciarPago(plan, usuarioId) {
  try {
    const stripe = await stripePromise;

    // En producción esto debe ir a tu backend/Firebase Function
    // Por ahora usa Stripe Checkout directo (modo cliente)
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: STRIPE_PRICES[plan], quantity: 1 }],
      mode: plan === "mensual" ? "subscription" : "subscription",
      successUrl: `${window.location.origin}/?pago=exitoso&uid=${usuarioId}`,
      cancelUrl:  `${window.location.origin}/?pago=cancelado`,
      clientReferenceId: usuarioId,
    });

    if (error) console.error("Error Stripe:", error);
  } catch (e) {
    console.error("Error al iniciar pago:", e);
  }
}

// ─── PANTALLA: REGISTRO / LOGIN ───────────────────────────────────────────────
export function PantallaAuth({ onCompletado }) {
  const [modo, setModo]         = useState("login"); // "login" | "registro"
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [cargando, setCargando] = useState(false);

  const traducirError = (code) => {
    const errores = {
      "auth/email-already-in-use":  "Ya existe una cuenta con ese email.",
      "auth/invalid-email":         "Email inválido.",
      "auth/weak-password":         "La contraseña debe tener al menos 6 caracteres.",
      "auth/user-not-found":        "No encontramos esa cuenta.",
      "auth/wrong-password":        "Contraseña incorrecta.",
      "auth/too-many-requests":     "Demasiados intentos. Espera unos minutos.",
    };
    return errores[code] || "Ocurrió un error. Intenta de nuevo.";
  };

  const handleSubmit = async () => {
    if (!email || !password) { setError("Completa todos los campos."); return; }
    setCargando(true);
    setError("");
    try {
      if (modo === "registro") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onCompletado();
    } catch (e) {
      setError(traducirError(e.code));
    }
    setCargando(false);
  };

  return (
    <div style={{
      position:"fixed", inset:0, background:DS.bg,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:"24px", zIndex:1000,
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;700&family=DM+Sans:wght@400;700&family=DM+Mono:wght@400&display=swap');`}</style>

      {/* Logo */}
      <div style={{marginBottom:32, textAlign:"center"}}>
        <div style={{fontSize:32, fontWeight:900, letterSpacing:8,
          color:DS.emerald, fontFamily:"'Cormorant Garamond',serif"}}>SCIAT</div>
        <div style={{fontSize:11, color:DS.gold, letterSpacing:5,
          fontFamily:"'DM Mono',monospace"}}>PEAK STATE</div>
      </div>

      <div style={{width:"100%", maxWidth:360,
        background:DS.card, borderRadius:20,
        border:`1px solid ${DS.border}`, padding:28}}>

        {/* Tabs */}
        <div style={{display:"flex", marginBottom:24,
          background:DS.surface, borderRadius:10, padding:4}}>
          {["login","registro"].map(m => (
            <button key={m} onClick={() => { setModo(m); setError(""); }}
              style={{flex:1, padding:"8px", borderRadius:8, border:"none",
                background:modo===m ? DS.emerald : "transparent",
                color:modo===m ? DS.bg : DS.inkMuted,
                fontSize:13, fontWeight:700, cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif",
                transition:"all 0.2s"}}>
              {m === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </button>
          ))}
        </div>

        {/* Campos */}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:11, color:DS.inkMuted,
            fontFamily:"'DM Mono',monospace", letterSpacing:1, marginBottom:6}}>EMAIL</div>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com"
            style={{width:"100%", background:DS.surface,
              border:`1px solid ${DS.border}`, borderRadius:10,
              padding:"12px 14px", color:DS.ink, fontSize:14,
              outline:"none", fontFamily:"'DM Sans',sans-serif",
              boxSizing:"border-box"}}
          />
        </div>

        <div style={{marginBottom:20}}>
          <div style={{fontSize:11, color:DS.inkMuted,
            fontFamily:"'DM Mono',monospace", letterSpacing:1, marginBottom:6}}>CONTRASEÑA</div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={{width:"100%", background:DS.surface,
              border:`1px solid ${DS.border}`, borderRadius:10,
              padding:"12px 14px", color:DS.ink, fontSize:14,
              outline:"none", fontFamily:"'DM Sans',sans-serif",
              boxSizing:"border-box"}}
          />
        </div>

        {error && (
          <div style={{background:"#ef444418", border:"1px solid #ef444435",
            borderRadius:8, padding:"10px 14px", marginBottom:16,
            fontSize:13, color:"#ef4444", fontFamily:"'DM Sans',sans-serif"}}>
            {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={cargando}
          style={{width:"100%", padding:14, borderRadius:12, border:"none",
            background:cargando ? DS.border : `linear-gradient(135deg, ${DS.emerald}, #0099aa)`,
            color:DS.bg, fontSize:15, fontWeight:700, cursor:cargando?"not-allowed":"pointer",
            fontFamily:"'DM Sans',sans-serif"}}>
          {cargando ? "Cargando..." : modo === "login" ? "Entrar →" : "Crear cuenta →"}
        </button>
      </div>

      <p style={{marginTop:20, fontSize:11, color:DS.inkMuted,
        fontFamily:"'DM Mono',monospace", letterSpacing:1, textAlign:"center"}}>
        Salud · Ciencia · IA · Tecnología
      </p>
    </div>
  );
}

// ─── PANTALLA: PAYWALL (aparece al tocar ejercicio premium) ──────────────────
export function PantallaPaywall({ moduloId, ejercicioTitulo, usuario, onCerrar }) {
  const [planSeleccionado, setPlanSeleccionado] = useState("anual");
  const [cargando, setCargando]                 = useState(false);

  const planes = {
    mensual: { precio:"$9.99", periodo:"/ mes", ahorro:null,        label:"Mensual" },
    anual:   { precio:"$79",   periodo:"/ año", ahorro:"Ahorra 34%", label:"Anual"  },
  };

  const handlePago = async () => {
    setCargando(true);
    await iniciarPago(planSeleccionado, usuario.uid);
    setCargando(false);
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:2000,
      background:"rgba(10,15,30,0.95)",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:24,
    }}>
      <div style={{width:"100%", maxWidth:360}}>

        {/* Icono candado */}
        <div style={{textAlign:"center", marginBottom:20}}>
          <div style={{fontSize:48, marginBottom:8}}>🔒</div>
          <div style={{fontSize:11, color:DS.emerald,
            fontFamily:"'DM Mono',monospace", letterSpacing:2, marginBottom:6}}>
            CONTENIDO PREMIUM
          </div>
          <h2 style={{fontSize:22, fontWeight:700, color:DS.ink,
            fontFamily:"'Cormorant Garamond',serif", marginBottom:8}}>
            {ejercicioTitulo}
          </h2>
          <p style={{fontSize:13, color:DS.inkMuted,
            fontFamily:"'DM Sans',sans-serif", lineHeight:1.6}}>
            Desbloquea todos los módulos y lleva tu rendimiento al siguiente nivel.
          </p>
        </div>

        {/* Beneficios */}
        <div style={{background:DS.card, borderRadius:14,
          border:`1px solid ${DS.border}`, padding:18, marginBottom:20}}>
          {[
            "✅ Módulos B · C · D · E completos",
            "✅ 15 ejercicios con audio del autor",
            "✅ Chat IA post-actividad",
            "✅ Historial y evolución personal",
            "✅ Acceso desde cualquier dispositivo",
          ].map((b, i) => (
            <div key={i} style={{fontSize:13, color:DS.inkMid,
              fontFamily:"'DM Sans',sans-serif", marginBottom:i<4?10:0}}>
              {b}
            </div>
          ))}
        </div>

        {/* Selector de plan */}
        <div style={{display:"flex", gap:10, marginBottom:20}}>
          {Object.entries(planes).map(([key, plan]) => (
            <div key={key} onClick={() => setPlanSeleccionado(key)}
              style={{flex:1, padding:16, borderRadius:14, cursor:"pointer",
                border:`2px solid ${planSeleccionado===key ? DS.emerald : DS.border}`,
                background:planSeleccionado===key ? DS.emeraldSoft : DS.card,
                textAlign:"center", transition:"all 0.2s", position:"relative"}}>
              {plan.ahorro && (
                <div style={{position:"absolute", top:-10, left:"50%",
                  transform:"translateX(-50%)",
                  background:DS.gold, color:DS.bg,
                  fontSize:9, fontWeight:700, padding:"2px 8px",
                  borderRadius:10, fontFamily:"'DM Mono',monospace",
                  whiteSpace:"nowrap"}}>
                  {plan.ahorro}
                </div>
              )}
              <div style={{fontSize:11, color:DS.inkMuted,
                fontFamily:"'DM Mono',monospace", letterSpacing:1, marginBottom:4}}>
                {plan.label.toUpperCase()}
              </div>
              <div style={{fontSize:22, fontWeight:900, color:DS.ink,
                fontFamily:"'Cormorant Garamond',serif"}}>
                {plan.precio}
              </div>
              <div style={{fontSize:11, color:DS.inkMuted,
                fontFamily:"'DM Mono',monospace"}}>
                {plan.periodo}
              </div>
            </div>
          ))}
        </div>

        {/* Botón pago */}
        <button onClick={handlePago} disabled={cargando}
          style={{width:"100%", padding:16, borderRadius:14, border:"none",
            background:cargando ? DS.border : `linear-gradient(135deg, ${DS.emerald}, #0099aa)`,
            color:DS.bg, fontSize:15, fontWeight:700,
            cursor:cargando ? "not-allowed" : "pointer",
            fontFamily:"'DM Sans',sans-serif", marginBottom:12}}>
          {cargando ? "Redirigiendo a pago..." : `Suscribirse ${planes[planSeleccionado].precio} ${planes[planSeleccionado].periodo} →`}
        </button>

        <button onClick={onCerrar}
          style={{width:"100%", padding:12, borderRadius:12,
            border:`1px solid ${DS.border}`, background:"transparent",
            color:DS.inkMuted, fontSize:13, cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif"}}>
          ← Volver
        </button>

        <p style={{textAlign:"center", marginTop:14, fontSize:10,
          color:DS.inkMuted, fontFamily:"'DM Mono',monospace", letterSpacing:1}}>
          Pago seguro · Stripe · Cancela cuando quieras
        </p>
      </div>
    </div>
  );
}

// ─── COMPONENTE: BADGE PREMIUM en módulos bloqueados ─────────────────────────
export function BadgePremium() {
  return (
    <div style={{display:"inline-flex", alignItems:"center", gap:4,
      background:DS.goldSoft, border:`1px solid ${DS.gold}40`,
      borderRadius:8, padding:"3px 8px"}}>
      <span style={{fontSize:10}}>⭐</span>
      <span style={{fontSize:9, color:DS.gold,
        fontFamily:"'DM Mono',monospace", letterSpacing:1}}>PREMIUM</span>
    </div>
  );
}

// ─── HOOK: VERIFICAR PAGO EXITOSO (al volver de Stripe) ──────────────────────
export function useVerificarPago(usuario) {
  useEffect(() => {
    if (!usuario) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("pago") === "exitoso") {
      // Aquí normalmente un webhook de Stripe actualiza Firestore automáticamente
      // Esta es la verificación manual de respaldo
      const uid = params.get("uid");
      if (uid === usuario.uid) {
        // Limpiar URL
        window.history.replaceState({}, "", window.location.pathname);
        // Mostrar confirmación
        alert("¡Bienvenido a SCIAT Premium! Tu acceso está activo.");
      }
    }
  }, [usuario]);
}

// ─── PANTALLA: PERFIL DE USUARIO ──────────────────────────────────────────────
export function PantallaPerfilUsuario({ usuario, tienePremium, onCerrar }) {
  const [cargandoLogout, setCargandoLogout] = useState(false);

  const handleLogout = async () => {
    setCargandoLogout(true);
    await signOut(auth);
    setCargandoLogout(false);
    onCerrar();
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:1500,
      background:DS.bg, padding:24,
      display:"flex", flexDirection:"column",
    }}>
      <button onClick={onCerrar}
        style={{alignSelf:"flex-start", background:"transparent",
          border:`1px solid ${DS.border}`, borderRadius:8,
          padding:"6px 12px", color:DS.inkMuted, fontSize:13,
          cursor:"pointer", marginBottom:24,
          fontFamily:"'DM Mono',monospace"}}>
        ← Volver
      </button>

      <div style={{background:DS.card, borderRadius:20,
        border:`1px solid ${DS.border}`, padding:24, marginBottom:16}}>
        <div style={{fontSize:10, color:DS.emerald,
          fontFamily:"'DM Mono',monospace", letterSpacing:2, marginBottom:4}}>
          MI CUENTA
        </div>
        <div style={{fontSize:16, fontWeight:700, color:DS.ink,
          fontFamily:"'DM Sans',sans-serif", marginBottom:4}}>
          {usuario.email}
        </div>
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          {tienePremium ? (
            <div style={{display:"inline-flex", alignItems:"center", gap:4,
              background:DS.emeraldSoft, border:`1px solid ${DS.emeraldBorder}`,
              borderRadius:8, padding:"4px 10px"}}>
              <span style={{fontSize:12}}>⭐</span>
              <span style={{fontSize:11, color:DS.emerald,
                fontFamily:"'DM Mono',monospace"}}>PREMIUM ACTIVO</span>
            </div>
          ) : (
            <div style={{fontSize:12, color:DS.inkMuted,
              fontFamily:"'DM Sans',sans-serif"}}>Plan gratuito</div>
          )}
        </div>
      </div>

      {!tienePremium && (
        <div style={{background:DS.goldSoft, border:`1px solid ${DS.gold}40`,
          borderRadius:14, padding:20, marginBottom:16}}>
          <div style={{fontSize:13, fontWeight:700, color:DS.gold,
            fontFamily:"'DM Sans',sans-serif", marginBottom:4}}>
            ⭐ Actualizar a Premium
          </div>
          <p style={{fontSize:12, color:DS.inkMid,
            fontFamily:"'DM Sans',sans-serif", lineHeight:1.5, marginBottom:12}}>
            Desbloquea todos los módulos y lleva tu rendimiento al máximo.
          </p>
          <button onClick={() => iniciarPago("anual", usuario.uid)}
            style={{width:"100%", padding:12, borderRadius:10, border:"none",
              background:`linear-gradient(135deg, ${DS.gold}, #d97706)`,
              color:"#000", fontSize:13, fontWeight:700, cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif"}}>
            Ver planes →
          </button>
        </div>
      )}

      <button onClick={handleLogout} disabled={cargandoLogout}
        style={{width:"100%", padding:14, borderRadius:12,
          border:`1px solid ${DS.border}`, background:"transparent",
          color:DS.inkMuted, fontSize:13, cursor:"pointer",
          fontFamily:"'DM Sans',sans-serif", marginTop:"auto"}}>
        {cargandoLogout ? "Cerrando..." : "Cerrar sesión"}
      </button>
    </div>
  );
}

// ─── EJEMPLO DE INTEGRACIÓN EN App.jsx ───────────────────────────────────────
//
// 1. Importa al inicio de App.jsx:
//    import { useAuth, PantallaAuth, PantallaPaywall, BadgePremium,
//             useVerificarPago, PantallaPerfilUsuario, esPremium }
//    from "./SistemaFreemium";
//
// 2. En el componente App() agrega:
//    const { usuario, tienePremium, cargando } = useAuth();
//    useVerificarPago(usuario);
//
// 3. Antes del return de App(), agrega:
//    if (cargando) return <div style={{background:"#0a0f1e", height:"100vh"}}/>;
//    if (!usuario) return <PantallaAuth onCompletado={() => {}} />;
//
// 4. En PantallaModulo, cuando el usuario toca un ejercicio:
//    if (esPremium(moduloId) && !tienePremium) {
//      setMostrarPaywall(true);  // muestra PantallaPaywall
//      return;
//    }
//    setSeleccionado(ej);  // acceso normal
//
// 5. En la lista de módulos (PantallaPerfilPlan), agrega BadgePremium:
//    {esPremium(mod.id) && !tienePremium && <BadgePremium />}
//
// ─────────────────────────────────────────────────────────────────────────────
// WEBHOOK STRIPE (backend requerido para producción):
// Cuando Stripe confirma el pago, tu backend debe actualizar Firestore:
//
// await updateDoc(doc(db, "usuarios", uid), {
//   plan: "premium",
//   premiumExpira: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
// });
// ─────────────────────────────────────────────────────────────────────────────

export default function SistemaFreemium() {
  return (
    <div style={{background:DS.bg, minHeight:"100vh", display:"flex",
      alignItems:"center", justifyContent:"center", padding:24}}>
      <div style={{color:DS.emerald, fontFamily:"'DM Mono',monospace",
        fontSize:13, textAlign:"center", lineHeight:2}}>
        <div style={{fontSize:32, marginBottom:16}}>⚙️</div>
        <div>Sistema Freemium SCIAT cargado.</div>
        <div style={{color:DS.inkMuted, fontSize:11, marginTop:8}}>
          Integra los componentes en App.jsx según las instrucciones del archivo.
        </div>
      </div>
    </div>
  );
}
