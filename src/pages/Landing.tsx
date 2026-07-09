import React, { useState } from 'react';
import { Compass, Shield, MapPin, Clock, Lock, CheckCircle2, Ticket } from 'lucide-react';
import { HUDCard } from '../components/HUDCard';
import { motion } from 'motion/react';
import heroBg from '../assets/images/quazar_hero_bg_1783629442422.jpg';

const ACTS = [
  {
    id: 'act-1',
    name: 'PROGRESSIVE MELODIC TECHNO',
    date: '27.06.2026',
    location: 'SANTA CRUZ, BOLIVIA',
    label: 'FIRST ACT'
  },
  {
    id: 'act-2',
    name: 'ACID BOUNCE',
    date: 'JULIO',
    location: 'SANTA CRUZ, BOLIVIA',
    label: 'SECOND ACT'
  }
];

export default function Landing() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', event: ACTS[0].id });
  const [loading, setLoading] = useState(false);
  const [ticketResult, setTicketResult] = useState<{ id: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setTicketResult(data);
      } else {
        alert(data.error || 'Error al procesar la solicitud');
      }
    } catch (err) {
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans tracking-widest bg-bg-dark text-white selection:bg-brand-500/30">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 bg-gradient-to-b from-bg-dark to-transparent">
        <div className="text-xl font-bold tracking-[0.3em] flex items-center gap-2">
          <Compass className="w-5 h-5 text-brand-500" />
          QUAZAR
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs text-gray-400">
          <a href="#acts" className="hover:text-white transition-colors">ACTS</a>
          <a href="#about" className="hover:text-white transition-colors">ABOUT</a>
          <a href="#location" className="hover:text-white transition-colors">LOCATION</a>
          <a href="#tickets" className="hover:text-brand-500 transition-colors">CONTACT</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-bg-dark" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 flex flex-col items-center text-center px-4"
        >
          <Compass className="w-16 h-16 md:w-24 md:h-24 text-brand-500 mb-6 opacity-80 animate-pulse" />
          <h1 className="text-5xl md:text-8xl font-bold tracking-[0.2em] mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-100 to-brand-500">
            QUAZAR
          </h1>
          <p className="text-sm md:text-base tracking-[0.4em] text-brand-500 mb-12">
            A JOURNEY THROUGH SOUND
          </p>
          <p className="text-xs md:text-sm tracking-[0.3em] text-gray-300 max-w-lg leading-loose">
            ELECTRONIC MUSIC EXPERIENCES <br className="hidden md:block" />
            OUT OF ORBIT.
          </p>
        </motion.div>
      </section>

      {/* Upcoming Acts */}
      <section id="acts" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm text-brand-500 tracking-[0.4em]">UPCOMING ACTS</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {ACTS.map((act, i) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <HUDCard className="flex flex-col items-center text-center py-16 hover:border-brand-500/50 transition-colors">
                <span className="text-[10px] text-brand-500 tracking-[0.3em] mb-6">{act.label}</span>
                <h3 className="text-2xl md:text-3xl font-light tracking-[0.2em] mb-6 leading-relaxed">
                  {act.name}
                </h3>
                <div className="text-xs text-gray-400 tracking-widest space-y-2">
                  <p>{act.date}</p>
                  <p>{act.location}</p>
                </div>
              </HUDCard>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="px-8 py-3 border border-brand-500/50 hover:bg-brand-500/10 text-xs tracking-[0.3em] transition-all">
            LEARN MORE
          </button>
        </div>
      </section>

      {/* Tickets / Checkout */}
      <section id="tickets" className="py-24 px-6 md:px-12 bg-bg-panel/50 border-y border-brand-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm text-brand-500 tracking-[0.4em] mb-4">TICKETS</h2>
            <h3 className="text-2xl md:text-4xl tracking-[0.2em]">SECURE YOUR ACCESS</h3>
          </div>

          {!ticketResult ? (
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <HUDCard>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-[10px] text-brand-500 tracking-[0.3em] mb-2">NOMBRE COMPLETO</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-transparent border-b border-gray-800 py-3 focus:outline-none focus:border-brand-500 text-sm tracking-widest transition-colors"
                        placeholder="INGRESA TU NOMBRE"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-brand-500 tracking-[0.3em] mb-2">NÚMERO DE CELULAR</label>
                      <input 
                        required
                        type="tel" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-transparent border-b border-gray-800 py-3 focus:outline-none focus:border-brand-500 text-sm tracking-widest transition-colors"
                        placeholder="+591 70000000"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-brand-500 tracking-[0.3em] mb-2">CORREO ELECTRÓNICO</label>
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-transparent border-b border-gray-800 py-3 focus:outline-none focus:border-brand-500 text-sm tracking-widest transition-colors"
                        placeholder="CORREO@EJEMPLO.COM"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-brand-500 tracking-[0.3em] mb-2">SELECCIONA EL ACTO</label>
                      <select 
                        required
                        value={formData.event}
                        onChange={e => setFormData({...formData, event: e.target.value})}
                        className="w-full bg-bg-dark border-b border-gray-800 py-3 focus:outline-none focus:border-brand-500 text-sm tracking-widest transition-colors appearance-none"
                      >
                        {ACTS.map(act => (
                          <option key={act.id} value={act.id}>{act.name} - {act.date}</option>
                        ))}
                      </select>
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-brand-500/20 border border-brand-500 hover:bg-brand-500/40 transition-all text-xs tracking-[0.3em] mt-8 disabled:opacity-50"
                    >
                      {loading ? 'PROCESANDO...' : 'COMPRAR ENTRADA'}
                    </button>
                  </form>
                </HUDCard>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 border border-brand-500/30 rounded-full"><Shield className="w-5 h-5 text-brand-500" /></div>
                  <div>
                    <h4 className="text-xs tracking-widest mb-1">ACCESO LIMITADO</h4>
                    <p className="text-[10px] text-gray-500 tracking-widest">AFORO REDUCIDO</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 border border-brand-500/30 rounded-full"><Lock className="w-5 h-5 text-brand-500" /></div>
                  <div>
                    <h4 className="text-xs tracking-widest mb-1">ENTRADAS 100% DIGITALES</h4>
                    <p className="text-[10px] text-gray-500 tracking-widest">NO HABRÁ VENTA FÍSICA</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 border border-brand-500/30 rounded-full"><Ticket className="w-5 h-5 text-brand-500" /></div>
                  <div>
                    <h4 className="text-xs tracking-widest mb-1">CÓDIGO QR ÚNICO</h4>
                    <p className="text-[10px] text-gray-500 tracking-widest">VÁLIDA PARA EL ACTO SELECCIONADO</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center"
            >
              <HUDCard className="py-12 px-6 flex flex-col items-center">
                <CheckCircle2 className="w-16 h-16 text-green-400 mb-6" />
                <h3 className="text-xl tracking-[0.2em] mb-4">¡REGISTRO EXITOSO!</h3>
                <p className="text-xs text-gray-400 tracking-widest leading-loose max-w-md mx-auto mb-8">
                  TU ENTRADA ESTÁ EN ESTADO <span className="text-brand-500">PENDIENTE DE PAGO</span>.<br/><br/>
                  PARA RECIBIR TU CÓDIGO QR DE ACCESO, REALIZA EL PAGO ESCANEANDO EL SIGUIENTE CÓDIGO Y ENVÍA EL COMPROBANTE AL NÚMERO DE WHATSAPP INDICADO.
                </p>
                
                {/* Simulated Payment QR - In production this is loaded from env or static assets */}
                <div className="w-48 h-48 bg-white p-2 flex items-center justify-center mb-8 border-2 border-brand-500">
                   <img src={"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAGO_MOCK_YAPE_QR"} alt="Payment QR" className="w-full h-full" />
                </div>
                
                <p className="text-[10px] text-brand-500 tracking-[0.3em] mb-2">ID DE ENTRADA:</p>
                <p className="text-xs tracking-widest mb-8 text-gray-300 font-mono">{ticketResult.id}</p>

                <a 
                  href={`https://wa.me/59170000000?text=Hola,%20adjunto%20mi%20comprobante%20de%20pago%20para%20la%20entrada:%20${ticketResult.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-green-500/20 text-green-400 border border-green-500 hover:bg-green-500/30 transition-all text-xs tracking-[0.2em] flex items-center gap-2"
                >
                  ENVIAR COMPROBANTE POR WHATSAPP
                </a>
              </HUDCard>
            </motion.div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section id="about" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <MapPin className="w-8 h-8 text-brand-500 mb-6" />
            <h4 className="text-sm tracking-[0.3em] mb-4">SECRET LOCATION</h4>
            <p className="text-xs text-gray-500 tracking-widest leading-loose">
              LA UBICACIÓN EXACTA SE COMPARTIRÁ A LOS ASISTENTES HORAS ANTES DEL EVENTO.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="w-8 h-8 text-brand-500 mb-6" />
            <h4 className="text-sm tracking-[0.3em] mb-4">ALL NIGHT LONG</h4>
            <p className="text-xs text-gray-500 tracking-widest leading-loose">
              MÚSICA, CONEXIÓN Y ENERGÍA HASTA EL AMANECER.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Compass className="w-8 h-8 text-brand-500 mb-6" />
            <h4 className="text-sm tracking-[0.3em] mb-4">DRESS CODE</h4>
            <p className="text-xs text-gray-500 tracking-widest leading-loose">
              EXPRESA TU ESENCIA. LA ACTITUD HACE PARTE DE LA EXPERIENCIA.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-brand-900/30 bg-bg-panel/30 text-center flex flex-col items-center">
        <Compass className="w-8 h-8 text-brand-500 mb-6 opacity-50" />
        <h4 className="text-sm tracking-[0.4em] mb-2">QUAZAR</h4>
        <p className="text-[10px] text-gray-500 tracking-widest mb-12">A JOURNEY THROUGH SOUND</p>
        
        <div className="flex gap-8 text-[10px] tracking-[0.3em] text-gray-400">
          <a href="#" className="hover:text-brand-500 transition-colors">INSTAGRAM</a>
          <a href="#" className="hover:text-brand-500 transition-colors">YOUTUBE</a>
          <a href="#" className="hover:text-brand-500 transition-colors">TIKTOK</a>
        </div>
      </footer>

    </div>
  );
}
