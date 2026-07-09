import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Scan, List, CheckCircle, Mail, LogOut } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { HUDCard } from '../components/HUDCard';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('quazar_admin_token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'ventas' | 'escaner'>('ventas');
  const [tickets, setTickets] = useState<any[]>([]);
  const [scanResult, setScanResult] = useState<{valid: boolean; message: string; ticket?: any} | null>(null);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('quazar_admin_token', data.token);
        setToken(data.token);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('quazar_admin_token');
    setToken(null);
  };

  const loadTickets = async () => {
    try {
      const res = await fetch('/api/admin/tickets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) return handleLogout();
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err) {
      console.error(err);
    }
  };

  const confirmPayment = async (id: string) => {
    if (!confirm('¿Confirmar pago y enviar entrada por email?')) return;
    try {
      const res = await fetch(`/api/admin/tickets/${id}/confirm`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) return handleLogout();
      const data = await res.json();
      if (data.success) {
        alert('Pago confirmado y entrada enviada con éxito');
        loadTickets();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  // Setup Scanner when tab changes
  useEffect(() => {
    if (activeTab === 'escaner' && token) {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
      
      let isProcessing = false;

      scanner.render(async (decodedText) => {
        if (isProcessing) return;
        isProcessing = true;
        scanner.pause(true);
        
        try {
          const res = await fetch('/api/admin/scan', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ token: decodedText })
          });
          
          if (res.status === 401) {
            handleLogout();
            return;
          }
          
          const data = await res.json();
          setScanResult(data);
          
          // Resume scanner after 3 seconds automatically
          setTimeout(() => {
            setScanResult(null);
            scanner.resume();
            isProcessing = false;
          }, 4000);

        } catch (err) {
          setScanResult({ valid: false, message: 'Error de red al escanear' });
          setTimeout(() => {
            setScanResult(null);
            scanner.resume();
            isProcessing = false;
          }, 3000);
        }
      }, (error) => {
        // Ignoring noisy errors from camera focus
      });

      return () => {
        scanner.clear().catch(console.error);
      };
    }
  }, [activeTab, token]);

  useEffect(() => {
    if (token && activeTab === 'ventas') {
      loadTickets();
    }
  }, [token, activeTab]);

  if (!token) {
    return (
      <div className="min-h-screen bg-bg-dark text-white flex items-center justify-center font-sans p-6">
        <HUDCard className="w-full max-w-md">
          <div className="text-center mb-8">
            <Compass className="w-12 h-12 text-brand-500 mx-auto mb-4" />
            <h1 className="text-xl tracking-[0.3em]">QUAZAR ADMIN</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && <p className="text-red-400 text-xs tracking-widest text-center">{error}</p>}
            <div>
              <label className="block text-[10px] text-brand-500 tracking-[0.3em] mb-2">EMAIL</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-gray-800 py-2 focus:outline-none focus:border-brand-500 text-sm tracking-widest"
              />
            </div>
            <div>
              <label className="block text-[10px] text-brand-500 tracking-[0.3em] mb-2">CONTRASEÑA</label>
              <input 
                required
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-gray-800 py-2 focus:outline-none focus:border-brand-500 text-sm tracking-widest"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-500/20 border border-brand-500 hover:bg-brand-500/40 transition-all text-xs tracking-[0.3em] mt-4"
            >
              {loading ? 'AUTENTICANDO...' : 'INGRESAR'}
            </button>
          </form>
        </HUDCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark text-white font-sans tracking-widest">
      <nav className="border-b border-brand-900/50 bg-bg-panel/50 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Compass className="w-6 h-6 text-brand-500" />
          <span className="text-sm tracking-[0.3em]">ADMIN</span>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={handleLogout} className="text-[10px] tracking-widest text-gray-400 hover:text-white flex items-center gap-1">
            <LogOut className="w-3 h-3" /> SALIR
          </button>
        </div>
      </nav>

      <div className="flex border-b border-brand-900/30">
        <button 
          onClick={() => setActiveTab('ventas')}
          className={`flex-1 py-4 text-xs tracking-[0.2em] flex items-center justify-center gap-2 transition-colors ${activeTab === 'ventas' ? 'bg-brand-500/10 text-brand-500 border-b-2 border-brand-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <List className="w-4 h-4" /> VENTAS
        </button>
        <button 
          onClick={() => setActiveTab('escaner')}
          className={`flex-1 py-4 text-xs tracking-[0.2em] flex items-center justify-center gap-2 transition-colors ${activeTab === 'escaner' ? 'bg-brand-500/10 text-brand-500 border-b-2 border-brand-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Scan className="w-4 h-4" /> ESCÁNER
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'ventas' && (
          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-[10px] text-brand-500 tracking-[0.3em]">
                  <th className="p-4">NOMBRE</th>
                  <th className="p-4">EVENTO</th>
                  <th className="p-4">CONTACTO</th>
                  <th className="p-4">ESTADO</th>
                  <th className="p-4">ACCIÓN</th>
                </tr>
              </thead>
              <tbody className="text-xs text-gray-300">
                {tickets.map(t => (
                  <tr key={t.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white">{t.name}</td>
                    <td className="p-4">{t.event}</td>
                    <td className="p-4">
                      {t.phone} <br/> <span className="text-gray-500 text-[10px]">{t.email}</span>
                    </td>
                    <td className="p-4">
                      {t.status === 'pendiente' ? (
                         <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 rounded text-[10px]">PENDIENTE</span>
                      ) : (
                         <span className="px-2 py-1 bg-green-500/20 text-green-500 border border-green-500/30 rounded text-[10px] flex items-center gap-1 w-max">
                           <CheckCircle className="w-3 h-3"/> PAGADO
                         </span>
                      )}
                      <div className="mt-2 flex gap-2">
                        {t.email_sent ? <Mail className="w-3 h-3 text-gray-500" title="Email enviado" /> : null}
                        {t.validated ? <Scan className="w-3 h-3 text-brand-500" title="Validado en puerta" /> : null}
                      </div>
                    </td>
                    <td className="p-4">
                      {t.status === 'pendiente' && (
                        <button 
                          onClick={() => confirmPayment(t.id)}
                          className="px-4 py-2 bg-brand-500/20 text-brand-500 border border-brand-500 hover:bg-brand-500/40 transition-colors text-[10px] tracking-widest whitespace-nowrap"
                        >
                          CONFIRMAR PAGO
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {tickets.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      NO HAY VENTAS REGISTRADAS
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'escaner' && (
          <div className="max-w-md mx-auto">
            <HUDCard className="overflow-hidden">
              <div className="text-center mb-6">
                <h3 className="text-sm tracking-[0.2em] text-brand-500 mb-2">CONTROL DE ACCESO</h3>
                <p className="text-xs text-gray-500">APUNTA LA CÁMARA AL CÓDIGO QR</p>
              </div>
              
              {/* html5-qrcode container */}
              <div id="reader" className="w-full bg-black min-h-[300px] mb-6 border border-gray-800" />
              
              {scanResult && (
                <div className={`p-4 text-center border ${scanResult.valid ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-red-500/10 border-red-500 text-red-400'}`}>
                  <h4 className="text-lg font-bold tracking-[0.2em] mb-2">{scanResult.message}</h4>
                  {scanResult.ticket && (
                    <div className="text-xs tracking-widest text-white mt-2">
                      <p>ASISTENTE: {scanResult.ticket.name}</p>
                      <p className="text-gray-400">EVENTO: {scanResult.ticket.event}</p>
                    </div>
                  )}
                </div>
              )}
            </HUDCard>
          </div>
        )}
      </div>
    </div>
  );
}
