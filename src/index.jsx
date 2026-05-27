import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Login from './Login';
import { supabase } from './supabase';

function Root() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsuario(session?.user ?? null);
      setCargando(false);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null);
    });
  }, []);

  if (cargando) return <div style={{color:'white',textAlign:'center',marginTop:'50vh'}}>Cargando...</div>;
  if (!usuario) return <Login onLogin={setUsuario} />;
  return <App usuario={usuario} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);
