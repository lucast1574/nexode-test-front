"use client"

import { useEffect, useState } from 'react';
import { Activity, Database, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface Status {
  status: string;
  timestamp: string;
  uptime: number;
  service: string;
}

interface MockData {
  id: number;
  name: string;
  description: string;
}

export default function Home() {
  const [status, setStatus] = useState<Status | null>(null);
  const [data, setData] = useState<MockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusRes, dataRes] = await Promise.all([
        fetch(`${API_URL}/status`),
        fetch(`${API_URL}/data`)
      ]);

      if (!statusRes.ok || !dataRes.ok) {
        throw new Error('Failed to fetch data from backend');
      }

      const statusData = await statusRes.json();
      const mockData = await dataRes.json();

      setStatus(statusData);
      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Nexode Deployment Test
          </h1>
          <p className="text-slate-400 text-lg">
            Verifying connectivity between frontend and backend environments.
          </p>
        </header>

        {/* Status Section */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="text-blue-400" /> Backend Status
            </h2>
            <button 
              onClick={fetchData}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-pulse text-slate-500">Connecting to mission control...</div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3 text-red-400">
              <AlertCircle /> 
              <div>
                <p className="font-bold">Connection Failed</p>
                <p className="text-sm opacity-80">{error}</p>
                <p className="text-xs mt-1 text-slate-500">Attempted URL: {API_URL}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <p className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-emerald-400 w-4 h-4" />
                  <span className="text-emerald-400 font-mono uppercase">{status?.status}</span>
                </div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <p className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-1">Service</p>
                <span className="font-mono">{status?.service}</span>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <p className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-1">Uptime</p>
                <span className="font-mono">{status?.uptime.toFixed(2)}s</span>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <p className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-1">Last Updated</p>
                <span className="font-mono text-sm">{new Date(status?.timestamp || '').toLocaleTimeString()}</span>
              </div>
            </div>
          )}
        </section>

        {/* Data Section */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <Database className="text-emerald-400" /> Mock Data
          </h2>
          
          <div className="space-y-4">
            {data.length > 0 ? (
              data.map((item) => (
                <div key={item.id} className="group bg-slate-800/30 hover:bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 transition-all">
                  <h3 className="text-blue-400 font-medium">{item.name}</h3>
                  <p className="text-slate-400 text-sm mt-1">{item.description}</p>
                </div>
              ))
            ) : !loading && !error ? (
              <p className="text-slate-500 italic text-center py-4">No data returned from server.</p>
            ) : null}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            System Ready for Deployment
          </div>
        </footer>
      </div>
    </main>
  );
}
