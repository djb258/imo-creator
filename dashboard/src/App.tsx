import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { FleetOverview } from './pages/FleetOverview';
import { RepoDetail } from './pages/RepoDetail';
import { ProcessList } from './pages/ProcessList';
import { ProcessDetail } from './pages/ProcessDetail';
import { PipelineMonitor } from './pages/PipelineMonitor';
import { GateFunnelView } from './pages/GateFunnelView';
import { Layer0View } from './pages/Layer0View';
import { useAPI } from './lib/useAPI';
import { getHealth, getL0Health } from './lib/api';
import { useState, useEffect } from 'react';

function HealthDot({ loading, online }: { loading: boolean; online: boolean }) {
  const color = loading ? 'var(--yellow)' : online ? 'var(--green)' : 'var(--red)';
  return <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />;
}

function StatusBar() {
  const health = useAPI<{ status: string }>(() => getHealth().catch((): { status: string } => ({ status: 'offline' })), []);
  const l0Health = useAPI<{ status: string }>(() => getL0Health().catch((): { status: string } => ({ status: 'offline' })), []);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      health.refresh();
      l0Health.refresh();
      setLastRefresh(new Date());
    }, 30_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apiOnline = !health.error && health.data?.status === 'ok';
  const l0Online = !l0Health.error && l0Health.data?.status === 'ok';

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
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)' }}>
        <HealthDot loading={health.loading} online={apiOnline} />
        <span style={{ color: health.loading ? 'var(--yellow)' : apiOnline ? 'var(--green)' : 'var(--red)' }}>
          API: {health.loading ? '...' : apiOnline ? 'OK' : 'OFF'}
        </span>
      </span>
      <span style={{ color: 'var(--border-default)' }}>|</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)' }}>
        <HealthDot loading={l0Health.loading} online={l0Online} />
        <span style={{ color: l0Health.loading ? 'var(--yellow)' : l0Online ? 'var(--green)' : 'var(--red)' }}>
          Layer 0: {l0Health.loading ? '...' : l0Online ? 'OK' : 'OFF'}
        </span>
      </span>
      <span style={{ color: 'var(--text-muted)' }}>
        {lastRefresh.toLocaleTimeString()}
      </span>
      <button
        onClick={() => { health.refresh(); l0Health.refresh(); setLastRefresh(new Date()); }}
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
              <Route path="/layer0" element={<Layer0View />} />
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
