"use client"

import { useEffect, useState } from 'react';

interface Status {
  status: string;
  timestamp: string;
  uptime: number;
  service: string;
}

export default function Home() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; speed: number; opacity: number }[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setParticles(pts);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/status`);
        if (!res.ok) throw new Error('Backend offline');
        setStatus(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Connection failed');
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isOnline = status?.status === 'ok' || status?.status === 'online';

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden selection:bg-violet-500/30">
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-violet-400"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animation: `float ${20 / p.speed}s infinite ease-in-out`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gradient orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Live clock */}
        <div className="absolute top-8 right-8 font-mono text-xs text-white/30 tracking-widest">
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </div>

        {/* Main content */}
        <div className="max-w-2xl w-full space-y-12 text-center">

          {/* Logo / Title */}
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-2xl shadow-violet-500/25 mx-auto">
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h1 className="text-6xl sm:text-7xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                NEXODE
              </span>
            </h1>
            <p className="text-lg text-white/40 font-light tracking-wide max-w-md mx-auto">
              Cloud infrastructure deployed and managed automatically.
            </p>
          </div>

          {/* Status card */}
          <div className="relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/50 via-cyan-500/50 to-violet-500/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
            <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-3xl p-8 space-y-6">

              {/* Status indicator */}
              <div className="flex items-center justify-center gap-3">
                <div className={`relative w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-400' : error ? 'bg-red-400' : 'bg-amber-400'}`}>
                  <div className={`absolute inset-0 rounded-full animate-ping ${isOnline ? 'bg-emerald-400' : error ? 'bg-red-400' : 'bg-amber-400'}`} style={{ animationDuration: '2s' }} />
                </div>
                <span className={`text-sm font-bold uppercase tracking-[0.3em] ${isOnline ? 'text-emerald-400' : error ? 'text-red-400' : 'text-amber-400'}`}>
                  {loading ? 'Connecting' : error ? 'Offline' : 'Systems Operational'}
                </span>
              </div>

              {/* Metrics grid */}
              {!loading && !error && status && (
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/20">Service</div>
                    <div className="text-lg font-mono font-bold text-white/80">{status.service}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/20">Uptime</div>
                    <div className="text-lg font-mono font-bold text-cyan-400">{formatUptime(status.uptime)}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/20">Region</div>
                    <div className="text-lg font-mono font-bold text-white/80">SA-EAST</div>
                  </div>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="pt-2 space-y-2">
                  <p className="text-red-400/60 text-sm font-mono">{error}</p>
                  <p className="text-white/20 text-xs font-mono">{API_URL}</p>
                </div>
              )}

              {/* Loading state */}
              {loading && (
                <div className="flex justify-center py-4">
                  <div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Bottom tag */}
          <div className="pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.05] bg-white/[0.02] text-white/20 text-xs font-mono tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              DEPLOYED VIA NEXODE CLOUD
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
        @keyframes gradient {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </main>
  );
}
