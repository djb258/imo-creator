import { fleet } from '../data/fleet';
import { RepoCard } from '../components/RepoCard';

export function FleetOverview() {
  const garageRepos = fleet.filter((r) => r.tier === 'Garage');
  const carRepos = fleet.filter((r) => r.tier !== 'Garage');

  return (
    <div style={{ padding: 'var(--sp-8)' }}>
      <h1
        style={{
          margin: '0 0 var(--sp-2)',
          fontSize: 'var(--text-2xl)',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}
      >
        Fleet Overview
      </h1>
      <p
        style={{
          margin: '0 0 var(--sp-8)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
        }}
      >
        The Garage floor — all Cars visible at once
      </p>

      {/* Garage */}
      <div
        style={{
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 'var(--sp-3)',
        }}
      >
        Garage
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 'var(--sp-4)',
          marginBottom: 'var(--sp-8)',
        }}
      >
        {garageRepos.map((repo) => (
          <RepoCard key={repo.name} repo={repo} />
        ))}
      </div>

      {/* Cars */}
      <div
        style={{
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 'var(--sp-3)',
        }}
      >
        Cars ({carRepos.length})
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 'var(--sp-4)',
        }}
      >
        {carRepos.map((repo) => (
          <RepoCard key={repo.name} repo={repo} />
        ))}
      </div>
    </div>
  );
}
