import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, ChevronDown, User, Settings, Zap, LogOut } from 'lucide-react';
import { useDemo } from '../context/DemoContext';

export default function Topbar({ onToggle, onDemoMode }) {
  const { state } = useDemo();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const statusLabel = {
    operational: 'All Systems Operational',
    degraded: 'System Degraded',
    critical: 'Critical Incident Active',
  };
  const statusClass = state.systemStatus;

  useEffect(() => {
    function handler(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openIncidents = state.incidents.filter(
    i => i.status !== 'resolved' && i.status !== 'auto-recovered'
  ).length;

  return (
    <header className="topbar">
      <button className="topbar-toggle" onClick={onToggle} title="Toggle sidebar">
        <Menu size={18} />
      </button>

      <div className="topbar-search">
        <Search size={14} className="search-icon" />
        <input placeholder="Search exams, centres, candidates, incidents..." />
      </div>

      <div className="topbar-right">
        <div className="demo-banner">
          <Zap size={11} />
          DEMO MODE · Synthetic Data
        </div>

        <div className={`status-pill ${statusClass}`}>
          <span className={`status-dot pulse ${statusClass}`} />
          {statusLabel[statusClass] || 'Operational'}
        </div>

        <button
          className="topbar-icon-btn"
          onClick={() => navigate('/incidents')}
          title="Incidents"
        >
          <Bell size={17} />
          {openIncidents > 0 && (
            <span className="badge">{openIncidents}</span>
          )}
        </button>

        <div ref={profileRef} style={{ position: 'relative' }}>
          <div className="profile-btn" onClick={() => setShowProfile(v => !v)}>
            <div className="profile-avatar">AD</div>
            <div className="profile-info">
              <span className="profile-name">Admin</span>
              <span className="profile-role">System Administrator</span>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)', marginLeft: 2 }} />
          </div>

          {showProfile && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-item" onClick={() => { setShowProfile(false); }}>
                <User size={14} /> Profile
              </div>
              <div className="profile-dropdown-item" onClick={() => { setShowProfile(false); navigate('/settings'); }}>
                <Settings size={14} /> Preferences
              </div>
              <div className="profile-dropdown-divider" />
              <div className="profile-dropdown-item" onClick={() => { setShowProfile(false); onDemoMode(); }}>
                <Zap size={14} /> Demo Mode
              </div>
              <div className="profile-dropdown-divider" />
              <div className="profile-dropdown-item danger">
                <LogOut size={14} /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
