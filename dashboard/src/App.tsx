import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { FleetOverview } from './pages/FleetOverview';
import { RepoDetail } from './pages/RepoDetail';
import { ProcessList } from './pages/ProcessList';
import { ProcessDetail } from './pages/ProcessDetail';
import { PipelineMonitor } from './pages/PipelineMonitor';
import { GateFunnelView } from './pages/GateFunnelView';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
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
    </BrowserRouter>
  );
}
