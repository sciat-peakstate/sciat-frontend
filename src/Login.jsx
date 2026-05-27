cat > src/Login.jsx << 'EOF'
import { useState } from 'react';
import { supabase } from './supabase';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = async () => {
    setCargando(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      setError('Email o contraseña incorrectos');
      setCargando(false);
    } else {
      onLogin(data.user);
    }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0a0a1a'}}>
      <div style={{background:'#1a1a2e',padding:'40px',borderRadius:'16px',width:'90%',maxWidth:'400px',textAlign:'center'}}>
        <h1 style={{color:'#00d4ff',marginBottom:'8px',fontSize:'24px'}}>SCIAT Peak State</h1>
        <p style={{color:'#888',marginBottom:'32px'}}>Ingresa tus credenciales</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{width:'100%',padding:'12px',marginBottom:'16px',borderRadius:'8px',border:'1px solid #333',background:'#0a0a1a',color:'white',boxSizing:'border-box'}}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{width:'100%',padding:'12px',marginBottom:'16px',borderRadius:'8px',border:'1px solid #333',background:'#0a0a1a',color:'white',boxSizing:'border-box'}}
        />
        {error && <p style={{color:'#ff4444',marginBottom:'16px'}}>{error}</p>}
        <button
          onClick={handleLogin}
          disabled={cargando}
          style={{width:'100%',padding:'14px',borderRadius:'8px',border:'none',background:'#00d4ff',color:'#0a0a1a',fontWeight:'bold',fontSize:'16px',cursor:'pointer'}}
        >
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </div>
    </div>
  );
}
EOF
