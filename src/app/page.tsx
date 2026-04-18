"use client"

import { useEffect, useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/status`);
        if (!res.ok) throw new Error('Backend unreachable');
        setStatus(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed');
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
    const i = setInterval(fetchStatus, 8000);
    return () => clearInterval(i);
  }, []);

  const isOnline = status?.status === 'ok' || status?.status === 'online';

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      {/* Interactive gradient that follows mouse */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,100,50,0.07), rgba(120,50,255,0.04) 40%, transparent 70%)`,
        }}
      />

      {/* Noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Nav */}
        <nav className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-xs font-black">N</div>
            <span className="text-sm font-bold tracking-wider text-white/60">NEXODE</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : error ? 'bg-red-400' : 'bg-yellow-400'} shadow-lg ${isOnline ? 'shadow-green-400/50' : ''}`} />
            <span className="text-xs font-mono text-white/40">{loading ? 'CONNECTING' : error ? 'OFFLINE' : 'LIVE'}</span>
          </div>
        </nav>

        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 -mt-16">
          <div className="max-w-3xl w-full text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono tracking-widest text-white/30">
              <span className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
              POWERED BY NEXODE CLOUD v2.0
            </div>

            {/* Main headline */}
            <h1 className="text-7xl sm:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter">
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">SHIP</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-violet-500">FASTER</span>
            </h1>

            <p className="text-white/30 text-lg max-w-md mx-auto leading-relaxed">
              Zero-config deployments. Push to deploy. Your infrastructure, automated.
            </p>

            {/* Status cards */}
            {!loading && !error && status && (
              <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
                {[
                  { label: 'STATUS', value: status.status?.toUpperCase(), color: 'text-green-400' },
                  { label: 'SERVICE', value: status.service, color: 'text-white/70' },
                  { label: 'UPTIME', value: `${Math.floor(status.uptime / 60)}m ${Math.floor(status.uptime % 60)}s`, color: 'text-orange-400' },
                ].map((item, i) => (
                  <div key={i} className="group relative">
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-orange-500/20 to-violet-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
                    <div className="relative px-6 py-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl space-y-1 min-w-[140px]">
                      <div className="text-[9px] font-bold tracking-[0.3em] text-white/20">{item.label}</div>
                      <div className={`text-sm font-mono font-bold ${item.color}`}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-500/5 border border-red-500/10 rounded-2xl">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-sm text-red-400/80 font-mono">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <footer className="px-8 py-6 flex items-center justify-between text-[10px] font-mono text-white/15 tracking-wider">
          <span>© 2026 NEXODE TECHNOLOGIES</span>
          <span>SA-EAST-1 • TLS 1.3 • HTTP/3</span>
        </footer>
      </div>
    </main>
  );
}
