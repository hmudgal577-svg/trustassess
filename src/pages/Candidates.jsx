import React, { useState } from 'react';
import { candidates as allCandidates } from '../data/candidates';
import StatusBadge from '../components/StatusBadge';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Candidates() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = allCandidates.filter(c => {
    const matchQ = query === '' ||
      c.id.toLowerCase().includes(query.toLowerCase()) ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.centre.toLowerCase().includes(query.toLowerCase());
    const matchS = statusFilter === 'all' || c.status === statusFilter;
    return matchQ && matchS;
  });

  return (
    <motion.div
      className="page-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
    >
      <motion.div className="page-header" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h1 className="page-title">Candidates</h1>
        <p className="page-subtitle">Monitor candidate sessions, connection status and response sync.</p>
      </motion.div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <div className="search-input" style={{ flex: 1, maxWidth: 380 }}>
          <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            placeholder="Search candidate ID, name, centre..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="filter-bar" style={{ marginBottom: 0 }}>
          {['all', 'active', 'completed'].map(f => (
            <button key={f} className={`filter-chip ${statusFilter === f ? 'active' : ''}`}
              onClick={() => setStatusFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Candidate ID</th>
              <th>Name</th>
              <th>Centre</th>
              <th>Session</th>
              <th>Connection</th>
              <th>Response Sync</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td><span className="font-mono" style={{ fontSize: 12, fontWeight: 700 }}>{c.id}</span></td>
                <td style={{ fontWeight: 500 }}>{c.name}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{c.centre}</td>
                <td style={{ color: 'var(--text-muted)' }}>{c.session}</td>
                <td><StatusBadge status={c.connection === 'stable' ? 'healthy' : c.connection === 'unstable' ? 'warning' : c.connection} label={c.connection} /></td>
                <td><StatusBadge status={c.syncStatus === 'synced' ? 'healthy' : c.syncStatus === 'buffered' ? 'recovering' : 'warning'} label={c.syncStatus} /></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 80, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${(c.answeredQ / c.totalQ) * 100}%`, height: '100%', background: 'var(--primary)', borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.answeredQ}/{c.totalQ}</span>
                  </div>
                </td>
                <td><StatusBadge status={c.status} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                  No candidates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
