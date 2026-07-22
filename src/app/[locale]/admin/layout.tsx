'use client';

import { useState, useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Very simple local session for the PIN
    if (localStorage.getItem('hl_admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Use env variable or fallback to a default pin '6666'
    const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || '6666';
    
    if (pin === correctPin) {
      setIsAuthenticated(true);
      localStorage.setItem('hl_admin_auth', 'true');
      setError(false);
    } else {
      setError(true);
      setPin('');
    }
  };

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full p-8 border border-white/10 bg-white/5 rounded-lg text-center">
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] mb-8 text-gray-500">
            Restricted Area
          </p>
          <form onSubmit={handleLogin} className="flex flex-col items-center gap-6">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="ENTER PIN"
              className="w-full bg-transparent border-b border-white/20 text-center text-4xl font-discipline text-foreground focus:outline-none focus:border-primary transition-colors pb-2"
              autoFocus
            />
            {error && <p className="text-primary text-xs font-mono uppercase tracking-widest">Incorrect PIN</p>}
            <button 
              type="submit"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-widest transition-colors mt-4"
            >
              Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
