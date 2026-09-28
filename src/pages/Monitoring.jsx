import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { Activity, Cpu, HardDrive, Wifi, Database, Shield } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const TABS = ['Overview', 'Network', 'Storage', 'Servers', 'Performance'];

const cpuData = [
  { t: '08:30', cpu: 42 }, { t: '08:45', cpu: 48 }, { t: '09:00', cpu: 55 },
  { t: '09:15', cpu: 61 }, { t: '09:30', cpu: 58 }, { t: '09:45', cpu: 63 }, { t: '10:00', cpu: 60 },
];

export default function Monitoring() {
  const { state } = useDemo();
  const [activeTab, setActiveTab] = useState('Overview');

  const netStatus = state.networkStatus;

  const overviewItems = [
    { label: 'Application', status: 'healthy', value: '99.96% uptime', icon: Activity },
    { label: 'Database', status: 'healthy', value: '12ms query time', icon: Database },
    { label: 'Network', status: netStatus, value: netStatus === 'critical' ? '999ms latency' : '18ms avg latency', icon: Wifi },
    { label: 'Storage', status: 'healthy', value: '68% capacity', icon: HardDrive },
    { label: 'Response Sync', status: 'healthy', value: '99.99% rate', icon: Activity },
    { label: 'Security', status: 'healthy', value: 'All checks passing', icon: Shield },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">System Monitoring</h1>
        <p className="page-subtitle">Real-time infrastructure health across all components.</p>
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <div key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t}
          </div>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {overviewItems.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                    background: item.status === 'healthy' ? 'var(--success-light)' : item.status === 'warning' ? 'var(--warning-light)' : 'var(--danger-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={18} style={{ color: item.status === 'healthy' ? 'var(--success)' : item.status === 'warning' ? 'var(--warning)' : 'var(--danger)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.value}</div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              );
            })}
          </div>

          <div className="card">
            <div className="card-title-lg" style={{ marginBottom: 14 }}>CPU Utilization</div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={cpuData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="t" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
                <Tooltip formatter={v => [`${v}%`, 'CPU']} />
                <Area type="monotone" dataKey="cpu" stroke="var(--primary)" fill="var(--primary-light)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'Network' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <div className="card-title-lg" style={{ marginBottom: 14 }}>Network Status by Centre</div>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Centre</th><th>Status</th><th>Latency</th><th>Packet Loss</th><th>Bandwidth</th></tr>
                </thead>
                <tbody>
                  {state.centres.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 500 }}>{c.name}</td>
                      <td><StatusBadge status={c.network} /></td>
                      <td style={{ fontFamily: 'monospace' }}>{c.latency}ms</td>
                      <td style={{ color: c.network === 'healthy' ? 'var(--success)' : 'var(--warning)' }}>
                        {c.network === 'healthy' ? '0.0%' : c.network === 'warning' ? '0.3%' : '2.1%'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 80, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ width: c.network === 'healthy' ? '85%' : '55%', height: '100%', background: c.network === 'healthy' ? 'var(--success)' : 'var(--warning)', borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.network === 'healthy' ? '850Mbps' : '420Mbps'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Storage' && (
        <div className="card">
          <div className="card-title-lg" style={{ marginBottom: 14 }}>Storage Utilization</div>
          {[
            { name: 'Response Store (Primary)', used: 68, total: '2 TB', status: 'healthy' },
            { name: 'Response Buffer (In-Memory)', used: 12, total: '256 GB', status: 'healthy' },
            { name: 'Backup Cold Storage', used: 34, total: '10 TB', status: 'healthy' },
            { name: 'Indore Centre 03 Queue', used: 89, total: '128 GB', status: 'warning' },
          ].map(s => (
            <div key={s.name} className="monitor-item">
              <div>
                <div className="monitor-label">{s.name}</div>
                <div className="monitor-value">{s.used}% used of {s.total}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 120, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${s.used}%`, height: '100%', background: s.status === 'healthy' ? 'var(--primary)' : 'var(--warning)', borderRadius: 3, transition: 'width 0.5s' }} />
                </div>
                <StatusBadge status={s.status} />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Servers' && (
        <div className="card">
          <div className="card-title-lg" style={{ marginBottom: 14 }}>Server Health</div>
          {[
            { name: 'Primary App Server (Bhopal DC-1)', status: 'healthy', cpu: '62%', mem: '71%', uptime: '99.98%' },
            { name: 'Secondary App Server (Indore DC-2)', status: 'healthy', cpu: '28%', mem: '41%', uptime: '100%' },
            { name: 'Database Master', status: 'healthy', cpu: '45%', mem: '58%', uptime: '100%' },
            { name: 'Database Replica', status: 'healthy', cpu: '38%', mem: '49%', uptime: '100%' },
            { name: 'CDN Edge Node', status: 'healthy', cpu: '21%', mem: '33%', uptime: '100%' },
          ].map(s => (
            <div key={s.name} className="monitor-item">
              <div>
                <div className="monitor-label">{s.name}</div>
                <div className="monitor-value">CPU {s.cpu} · Mem {s.mem} · Uptime {s.uptime}</div>
              </div>
              <StatusBadge status={s.status} />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Performance' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {[
            { label: 'Avg Response Time', value: '124 ms', status: 'healthy' },
            { label: 'Requests / second', value: '4,821', status: 'healthy' },
            { label: 'Error Rate', value: '0.004%', status: 'healthy' },
            { label: 'Cache Hit Rate', value: '94.2%', status: 'healthy' },
            { label: 'Active DB Connections', value: '284 / 500', status: 'healthy' },
            { label: 'Queue Depth', value: '47 msgs', status: 'healthy' },
          ].map(s => (
            <div key={s.label} className="card" style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</div>
              </div>
              <StatusBadge status={s.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
