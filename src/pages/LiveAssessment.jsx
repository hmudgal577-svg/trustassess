import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import ActivityChart from '../components/ActivityChart';
import StatusBadge from '../components/StatusBadge';
import { exam } from '../data/exams';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const latencyData = [
  { time: '08:30', latency: 16 }, { time: '08:45', latency: 18 },
  { time: '09:00', latency: 22 }, { time: '09:15', latency: 19 },
  { time: '09:30', latency: 21 }, { time: '09:45', latency: 18 },
  { time: '10:00', latency: 17 },
];

const TABS = ['Overview', 'Candidates', 'Centres', 'Performance'];

export default function LiveAssessment() {
  const { state } = useDemo();
  const [activeTab, setActiveTab] = useState('Overview');

  // timer: calculate time remaining from 11:30
  const [timeLeft] = React.useState('01:24:32');

  return (
    <motion.div
      className="page-content"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
    >
      <div className="page-header">
        <h1 className="page-title">Live Assessment</h1>
        <p className="page-subtitle">Real-time monitoring of the ongoing examination session.</p>
      </div>

      {/* Exam Summary Bar */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Examination</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{exam.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{exam.session}</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 20 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Candidates</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>11,842</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>of 12,480</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 20 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Centres</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>38 / 38</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>All active</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 20 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Time Remaining</div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>{timeLeft}</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 20 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>System</div>
            <StatusBadge status={state.systemStatus} label={state.systemStatus === 'operational' ? 'Operational' : 'Degraded'} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {TABS.map(t => (
          <div key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t}
          </div>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div className="card-title-lg" style={{ marginBottom: 16 }}>Candidate Sessions</div>
            <ActivityChart height={220} />
          </div>
          <div className="card">
            <div className="card-title-lg" style={{ marginBottom: 16 }}>Network Latency (avg)</div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={latencyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} unit="ms" />
                <Tooltip />
                <Area type="monotone" dataKey="latency" stroke="var(--primary)" fill="var(--primary-light)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-title-lg" style={{ marginBottom: 14 }}>Session Statistics</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {[
                { label: 'Questions Answered', value: '589,234', sub: 'Total across all candidates' },
                { label: 'Responses Synced', value: '589,188', sub: '99.99% sync rate' },
                { label: 'Avg Time per Q', value: '1m 42s', sub: 'Session average' },
                { label: 'Completion Rate', value: '3.9%', sub: '487 fully completed' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--background)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Candidates' && (
        <div className="card">
          <div className="card-title-lg" style={{ marginBottom: 14 }}>Active Candidate Sessions</div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Centre</th><th>Connection</th><th>Sync</th><th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'C-0001', name: 'Aarav Sharma', centre: 'Bhopal', conn: 'stable', sync: 'synced', prog: 56 },
                  { id: 'C-0003', name: 'Rohit Patel', centre: 'Indore', conn: 'unstable', sync: 'buffered', prog: 44 },
                  { id: 'C-0005', name: 'Amit Tiwari', centre: 'Gwalior', conn: 'stable', sync: 'synced', prog: 70 },
                  { id: 'C-0007', name: 'Vikas Yadav', centre: 'Ujjain', conn: 'stable', sync: 'synced', prog: 84 },
                  { id: 'C-0009', name: 'Anuj Kumar', centre: 'Rewa', conn: 'recovering', sync: 'buffered', prog: 36 },
                ].map(c => (
                  <tr key={c.id}>
                    <td className="font-mono" style={{ fontSize: 12, fontWeight: 700 }}>{c.id}</td>
                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.centre}</td>
                    <td><StatusBadge status={c.conn === 'stable' ? 'healthy' : c.conn === 'unstable' ? 'warning' : 'recovering'} label={c.conn} /></td>
                    <td><StatusBadge status={c.sync === 'synced' ? 'healthy' : 'recovering'} label={c.sync} /></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 100, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${c.prog}%`, height: '100%', background: 'var(--primary)', borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.prog}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Centres' && (
        <div className="card">
          <div className="card-title-lg" style={{ marginBottom: 14 }}>Centre Status</div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Centre</th><th>Candidates</th><th>Latency</th><th>Network</th><th>Server</th><th>Storage</th><th>Health</th>
                </tr>
              </thead>
              <tbody>
                {state.centres.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td>{c.candidates.toLocaleString()}</td>
                    <td style={{ fontFamily: 'monospace' }}>{c.latency}ms</td>
                    <td><StatusBadge status={c.network} /></td>
                    <td><StatusBadge status={c.server} /></td>
                    <td><StatusBadge status={c.storage} /></td>
                    <td><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Performance' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { title: 'Response Sync Rate', value: '99.99%', desc: '589,188 of 589,234 synced' },
            { title: 'Avg Network Latency', value: '18 ms', desc: 'Across all active centres' },
            { title: 'Buffer Utilization', value: '2.1%', desc: '47 responses queued' },
            { title: 'Recovery RTO', value: '< 3 min', desc: 'Recovery time objective met' },
          ].map(s => (
            <div key={s.title} className="card">
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
