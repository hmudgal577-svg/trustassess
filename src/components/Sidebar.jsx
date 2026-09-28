import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, MonitorPlay, Users, Building2,
  AlertTriangle, RefreshCw, Activity, ClipboardList,
  BarChart2, Settings, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

const navSections = [
  {
    label: 'Overview',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Examination',
    items: [
      { to: '/live-assessment', label: 'Live Assessment', icon: MonitorPlay },
      { to: '/candidates', label: 'Candidates', icon: Users },
      { to: '/centres', label: 'Centres', icon: Building2 },
    ],
  },
  {
    label: 'Reliability',
    items: [
      { to: '/incidents', label: 'Incidents', icon: AlertTriangle },
      { to: '/recovery', label: 'Recovery', icon: RefreshCw },
      { to: '/monitoring', label: 'System Monitoring', icon: Activity },
    ],
  },
  {
    label: 'Trust',
    items: [
      { to: '/audit', label: 'Audit & Evidence', icon: ClipboardList },
      { to: '/reports', label: 'Reports', icon: BarChart2 },
    ],
  },
  {
    label: 'Administration',
    items: [
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export default function Sidebar({ collapsed }) {
  return (
    <motion.aside
      className={`sidebar${collapsed ? ' collapsed' : ''}`}
      animate={{ width: collapsed ? 64 : 230 }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      style={{ overflow: 'hidden', minWidth: 0 }}
    >
      {/* Logo */}
      <div className="sidebar-logo">
        <motion.div
          className="logo-icon"
          whileHover={{ scale: 1.08, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <Shield size={18} />
        </motion.div>
        <motion.div
          className="logo-text"
          animate={{ opacity: collapsed ? 0 : 1, x: collapsed ? -10 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
        >
          Trust<span>Assess</span>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navSections.map((section, si) => (
          <div className="nav-section" key={section.label}>
            <motion.div
              className="nav-section-label"
              animate={{ opacity: collapsed ? 0 : 1 }}
              transition={{ duration: 0.15 }}
            >
              {section.label}
            </motion.div>
            {section.items.map((item, ii) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                style={{ position: 'relative' }}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        style={{
                          position: 'absolute',
                          left: 0, top: 6, bottom: 6,
                          width: 3,
                          background: 'var(--primary)',
                          borderRadius: '0 3px 3px 0',
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <motion.span
                      className="nav-icon"
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.15 }}
                    >
                      <item.icon size={16} />
                    </motion.span>
                    <motion.span
                      className="nav-label"
                      animate={{ opacity: collapsed ? 0 : 1, x: collapsed ? -8 : 0 }}
                      transition={{ duration: 0.18 }}
                      style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                    >
                      {item.label}
                    </motion.span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </motion.aside>
  );
}
