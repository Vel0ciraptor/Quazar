import React, { useState } from 'react';
import { Compass, Shield, MapPin, Clock, Lock, CheckCircle2, Ticket } from 'lucide-react';
import { HUDCard } from '../components/HUDCard';
import { motion } from 'motion/react';
import heroBg from '../assets/images/FIRST.png';
import backBg from '../assets/images/back.png';
import logofnd from '../assets/images/logofnd.png';
import logoPng from '../assets/images/LOGO.png';

const ACTS = [
  {
    id: 'act-1',
    name: 'PROGRESSIVE MELODIC TECHNO',
    date: '27.06.2026',
    bar: 'NOMAD',
    location: 'SANTA CRUZ, BOLIVIA',
    label: 'FIRST ACT',
    titleClass: 'text-[#00f0ff] font-bold text-[30px] sm:text-[35px] md:text-[50px] lg:text-[60px] leading-tight md:leading-[48.75px] font-[system-ui] break-words'
  },
  {
    id: 'act-2',
    name: 'ACID BOUNCE',
    date: '01.08.2026',
    bar: 'URANO',
    location: 'SANTA CRUZ, BOLIVIA',
    label: 'SECOND ACT',
    titleClass: 'text-[#ccff00] font-black text-[45px] sm:text-[60px] md:text-[80px] lg:text-[94px] leading-tight md:leading-[72.75px] break-words'
  },
  {
    id: 'act-3',
    name: 'SECRET ACT',
    date: '??.??.2026',
    bar: '????',
    location: 'SANTA CRUZ, BOLIVIA',
    label: 'THIRD ACT',
    titleClass: 'text-white font-bold text-[35px] sm:text-[45px] md:text-[60px] leading-tight text-opacity-30 break-words',
    comingSoon: true
  },
  {
    id: 'act-4',
    name: 'SECRET ACT',
    date: '??.??.2026',
    bar: '????',
    location: 'SANTA CRUZ, BOLIVIA',
    label: 'FOURTH ACT',
    titleClass: 'text-white font-bold text-[35px] sm:text-[45px] md:text-[60px] leading-tight text-opacity-30 break-words',
    comingSoon: true
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
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto flex items-center justify-between px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full w-full max-w-4xl shadow-2xl">
          <div className="text-xl font-bold tracking-[0.3em] flex items-center gap-2">
            QUAZAR
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs text-gray-400">
            <a href="#acts" className="hover:text-white transition-colors">ACTOS</a>
            <a href="#about" className="hover:text-white transition-colors">ENTRADAS</a>
            <a href="#location" className="hover:text-white transition-colors">LOCACIONES</a>
            <a href="#tickets" className="hover:text-brand-500 transition-colors">CONTACTO</a>
          </div>
        </nav>
      </div>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-end pb-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover"
          style={{ backgroundImage: `url(${heroBg})`, backgroundPosition: 'center 15vh' }}
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 flex flex-col sm:flex-row items-center gap-6 px-4"
        >
          <a 
            href="#tickets"
            className="px-8 py-4 rounded-full bg-brand-500/80 border border-brand-500 hover:bg-brand-500 transition-all text-xs tracking-[0.3em] backdrop-blur-md text-white font-medium shadow-lg"
          >
            COMPRAR TICKETS
          </a>
          <a 
            href="#acts"
            className="px-8 py-4 rounded-full bg-black/60 border border-white/30 hover:bg-black/80 hover:border-white/50 transition-all text-xs tracking-[0.3em] backdrop-blur-md text-white font-medium shadow-lg"
          >
            VER ACTOS
          </a>
        </motion.div>
      </section>

      {/* Upcoming Acts */}
      <section 
        id="acts" 
        className="py-24 px-6 md:px-12 max-w-7xl mx-auto bg-cover bg-center bg-no-repeat relative"
      >
        <div className="relative border border-brand-500/40 rounded-3xl pt-20 pb-20 px-6 md:px-12">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-6 py-2">
            <h2 className="text-[16px] md:text-[20px] text-brand-500 tracking-[0.4em] font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)] border border-brand-500/40 rounded-full px-6 py-3 whitespace-nowrap bg-black">
              UPCOMING ACTS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {ACTS.map((act, i) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="h-full"
              >
                <HUDCard className="h-full flex flex-col items-center justify-center text-center py-16 hover:border-brand-500/50 transition-colors relative overflow-hidden group px-4 sm:px-8">
                  <div className={`flex flex-col items-center justify-center h-full w-full ${act.comingSoon ? 'blur-md opacity-40 transition-all duration-500 group-hover:blur-sm select-none pointer-events-none' : ''}`}>
                    <span className="text-[12px] sm:text-[14px] text-brand-500 tracking-[0.3em] mb-6">{act.label}</span>
                    <h3 className={`tracking-[0.2em] mb-6 ${act.titleClass || 'text-2xl md:text-3xl font-light'}`}>
                      {act.name}
                    </h3>
                    <div className="tracking-widest space-y-2 mt-auto">
                      <p className="text-[#d901ef] text-[20px] sm:text-[25px] font-normal">{act.date}</p>
                      {act.bar && <p className="text-white text-base sm:text-lg md:text-[20px] font-medium tracking-[0.2em] uppercase">{act.bar}</p>}
                      <p className="text-[#99a1af] text-xs sm:text-sm md:text-[18px]">{act.location}</p>
                    </div>
                  </div>
                  {act.comingSoon && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/10 backdrop-blur-[2px]">
                      <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-[0.4em] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] text-center px-4 border-y border-white/20 py-4 bg-black/40 w-full">
                        PROXIMAMENTE
                      </span>
                    </div>
                  )}
                </HUDCard>
              </motion.div>
            ))}
          </div>
          
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-black px-4">
            <a 
              href="#tickets"
              className="inline-block px-8 md:px-10 py-4 bg-black border border-brand-500 rounded-full text-brand-500 hover:bg-brand-500 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] text-[10px] md:text-xs tracking-[0.3em] font-bold transition-all whitespace-nowrap"
            >
              COMPRAR ENTRADAS
            </a>
          </div>
        </div>
      </section>

      {/* Info Section / How to Buy */}
      <section 
        id="about" 
        className="py-24 px-6 md:px-12 flex flex-col items-center relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backBg})` }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[8px] z-0"></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-16">
            <h2 className="text-sm text-brand-500 tracking-[0.4em] mb-4">¿CÓMO COMPRAR?</h2>
            <h3 className="text-2xl md:text-4xl tracking-[0.2em]">PASO A PASO</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto">
            <div className="flex flex-col items-center relative">
              <div className="w-12 h-12 rounded-full border border-brand-500 flex items-center justify-center text-brand-500 mb-6 text-xl shadow-[0_0_10px_rgba(168,85,247,0.2)] bg-black/50">1</div>
              <h4 className="text-sm tracking-[0.3em] mb-4">COMPLETA TUS DATOS</h4>
              <p className="text-xs text-gray-300 tracking-widest leading-loose font-medium drop-shadow-md">
                LLENA EL FORMULARIO CON TU INFORMACIÓN Y SELECCIONA EL ACTO AL QUE DESEAS ASISTIR.
              </p>
            </div>
            <div className="flex flex-col items-center relative">
              <div className="w-12 h-12 rounded-full border border-brand-500 flex items-center justify-center text-brand-500 mb-6 text-xl shadow-[0_0_10px_rgba(168,85,247,0.2)] bg-black/50">2</div>
              <h4 className="text-sm tracking-[0.3em] mb-4">REALIZA EL PAGO</h4>
              <p className="text-xs text-gray-300 tracking-widest leading-loose font-medium drop-shadow-md">
                ESCANEA EL CÓDIGO QR QUE APARECERÁ EN PANTALLA Y REALIZA EL PAGO DE TU ENTRADA.
              </p>
            </div>
            <div className="flex flex-col items-center relative">
              <div className="w-12 h-12 rounded-full border border-brand-500 flex items-center justify-center text-brand-500 mb-6 text-xl shadow-[0_0_10px_rgba(168,85,247,0.2)] bg-black/50">3</div>
              <h4 className="text-sm tracking-[0.3em] mb-4">ENVÍA EL COMPROBANTE</h4>
              <p className="text-xs text-gray-300 tracking-widest leading-loose font-medium drop-shadow-md">
                MANDA TU COMPROBANTE POR WHATSAPP Y RECIBIRÁS TU CÓDIGO QR DE ACCESO.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tickets / Checkout */}
      <section 
        id="tickets" 
        className="py-24 px-6 md:px-12 border-y border-brand-900/30 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${backBg})` }}
      >
        <div className="max-w-4xl mx-auto relative z-10">
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

      {/* Footer */}
      <footer className="py-12 border-t border-brand-900/30 bg-bg-panel/30 text-center flex flex-col items-center">
        <img src={logoPng} alt="Quazar Logo" className="w-32 md:w-48 mb-8 opacity-80" />
        
        <div className="flex gap-8 text-[10px] tracking-[0.3em] text-gray-400">
          <a href="#" className="hover:text-brand-500 transition-colors">INSTAGRAM</a>
          <a href="#" className="hover:text-brand-500 transition-colors">YOUTUBE</a>
          <a href="#" className="hover:text-brand-500 transition-colors">TIKTOK</a>
        </div>
      </footer>

    </div>
  );
}
