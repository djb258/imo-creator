import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { FleetOverview } from './pages/FleetOverview';
import { RepoDetail } from './pages/RepoDetail';
import { ProcessList } from './pages/ProcessList';
import { ProcessDetail } from './pages/ProcessDetail';
import { PipelineMonitor } from './pages/PipelineMonitor';
import { GateFunnelView } from './pages/GateFunnelView';
import { useAPI } from './lib/useAPI';
import { getHealth } from './lib/api';
import { useState, useEffect } from 'react';

function StatusBar() {
  const health = useAPI<{ status: string }>(() => getHealth().catch(() => ({ status: 'offline' })), []);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Auto-refresh health every 30s
  useEffect(() => {
    const id = setInterval(() => {
      health.refresh();
      setLastRefresh(new Date());
    }, 30_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isOnline = !health.error && health.data?.status === 'ok';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sp-3)',
        padding: 'var(--sp-2) var(--sp-4)',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: 'var(--text-xs)',
        fontFamily: 'var(--font-mono)',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sp-1)',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: health.loading ? 'var(--yellow)' : isOnline ? 'var(--green)' : 'var(--red)',
          }}
        />
        <span style={{ color: health.loading ? 'var(--yellow)' : isOnline ? 'var(--green)' : 'var(--red)' }}>
          {health.loading ? 'connecting...' : isOnline ? 'API connected' : 'API offline'}
        </span>
      </span>
      <span style={{ color: 'var(--text-muted)' }}>
        Last check: {lastRefresh.toLocaleTimeString()}
      </span>
      <button
        onClick={() => { health.refresh(); setLastRefresh(new Date()); }}
        style={{
          all: 'unset',
          cursor: 'pointer',
          color: 'var(--accent)',
          marginLeft: 'auto',
        }}
      >
        refresh
      </button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <StatusBar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />
          <main style={{ flex: 1, overflow: 'auto' }}>
            <Routes>
              <Route path="/" element={<FleetOverview />} />
              <Route path="/repo/:name" element={<RepoDetail />} />
              <Route path="/processes" element={<ProcessList />} />
              <Route path="/process/:id" element={<ProcessDetail />} />
              <Route path="/pipeline" element={<PipelineMonitor />} />
              <Route path="/gate-funnel" element={<GateFunnelView />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
