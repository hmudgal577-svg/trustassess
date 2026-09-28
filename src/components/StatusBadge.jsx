import React from 'react';

export default function StatusBadge({ status, label }) {
  const labels = {
    healthy: 'Healthy',
    warning: 'Warning',
    critical: 'Critical',
    recovering: 'Recovering',
    resolved: 'Resolved',
    active: 'Active',
    'auto-recovered': 'Auto Recovered',
    'failover-active': 'Failover Active',
    synced: 'Synced',
    buffered: 'Buffered',
    pending: 'Pending',
    stable: 'Stable',
    unstable: 'Unstable',
    completed: 'Completed',
  };

  const text = label || labels[status] || status;

  return (
    <span className={`status-badge ${status}`}>
      <span className={`status-dot ${status}`} style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
      {text}
    </span>
  );
}
