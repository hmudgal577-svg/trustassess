import React from 'react';
import { useDemo } from '../context/DemoContext';
import { BarChart2, FileText, Shield, Building2, Activity, Download, Eye, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { containerVariants, cardVariants } from '../components/PageWrapper';

const reports = [
  {
    id: 'reliability',
    title: 'Exam Reliability Report',
    desc: 'System uptime, sync rates and resilience metrics for the current session.',
    icon: Activity,
    iconBg: 'var(--primary-light)',
    iconColor: 'var(--primary)',
    lastGenerated: '10:00 AM',
  },
  {
    id: 'incident',
    title: 'Incident Report',
    desc: 'All incidents detected, classified and resolved during the examination.',
    icon: Shield,
    iconBg: 'var(--danger-light)',
    iconColor: 'var(--danger)',
    lastGenerated: '09:58 AM',
  },
  {
    id: 'recovery',
    title: 'Recovery Report',
    desc: 'Failover events, buffer utilization and reconciliation outcomes.',
    icon: RefreshCw,
    iconBg: 'var(--success-light)',
    iconColor: 'var(--success)',
    lastGenerated: '09:44 AM',
  },
  {
    id: 'audit',
    title: 'Audit Report',
    desc: 'Complete tamper-evident audit trail with hash-verified event chain.',
    icon: FileText,
    iconBg: 'var(--warning-light)',
    iconColor: 'var(--warning)',
    lastGenerated: '10:00 AM',
  },
  {
    id: 'centre',
    title: 'Centre Performance Report',
    desc: 'Per-centre latency, capacity, and health metrics across all locations.',
    icon: Building2,
    iconBg: 'var(--primary-light)',
    iconColor: 'var(--primary)',
    lastGenerated: '09:30 AM',
  },
];

function generateDemoReport(report, addToast) {
  addToast({ type: 'info', message: `Generating ${report.title}...`, icon: 'info' });
  setTimeout(() => {
    const content = `TrustAssess — ${report.title}\n${'='.repeat(50)}\nGenerated: ${new Date().toLocaleString()}\nExam: RGPV Semester Assessment — Session 01\nMode: DEMO — Synthetic Data\n\nSUMMARY\n-------\nCandidates: 11,842 / 12,480\nCentres: 38 / 38\nSystem Availability: 99.96%\nOpen Incidents: 3\nResponses Synced: 99.99%\n\n[Prototype demo report — No real examination data]\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TrustAssess_${report.id}_report_demo.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'success', message: `${report.title} exported`, icon: 'check' });
  }, 1200);
}

export default function Reports() {
  const { addToast } = useDemo();

  return (
    <motion.div
      className="page-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
    >
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">Generate and export examination reports and audit documents.</p>
      </motion.div>

      <motion.div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {reports.map((report, i) => {
          const Icon = report.icon;
          return (
            <motion.div
              key={report.id}
              className="report-card"
              variants={cardVariants}
              whileHover={{
                y: -5,
                boxShadow: '0 10px 32px rgba(15,23,42,0.12)',
                transition: { duration: 0.2 }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <motion.div
                  className="report-card-icon"
                  style={{ background: report.iconBg }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Icon size={20} style={{ color: report.iconColor }} />
                </motion.div>
                <div>
                  <div className="report-card-title">{report.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Last: {report.lastGenerated}</div>
                </div>
              </div>
              <div className="report-card-desc">{report.desc}</div>
              <div className="report-card-actions">
                <motion.button
                  className="btn btn-secondary btn-sm"
                  style={{ gap: 5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye size={12} /> View
                </motion.button>
                <motion.button
                  className="btn btn-secondary btn-sm"
                  style={{ gap: 5 }}
                  onClick={() => addToast({ type: 'success', message: `${report.title} regenerated`, icon: 'check' })}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw size={12} /> Generate
                </motion.button>
                <motion.button
                  className="btn btn-primary btn-sm"
                  style={{ gap: 5 }}
                  onClick={() => generateDemoReport(report, addToast)}
                  whileHover={{ scale: 1.05, boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={12} /> Export
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
