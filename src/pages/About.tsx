import React from 'react';
import { ShieldAlert, Mail, Phone, GraduationCap, User, Hash, MapPin, Scale, Info } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Project Info */}
      <section className="text-center space-y-8">
        <div className="w-28 h-28 bg-gov-navy rounded-[32px] mx-auto flex items-center justify-center shadow-2xl border-4 border-white">
          <ShieldAlert className="w-14 h-14 text-gov-blue" />
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-serif font-bold text-gov-navy tracking-tight max-w-3xl mx-auto leading-tight">
            Public Social Media Harm Monitoring & Decision Support System
          </h1>
          <p className="text-lg text-gov-blue font-serif font-bold tracking-widest uppercase">PSHM-DSS v1.0.0</p>
        </div>
        <p className="text-gov-text-muted leading-relaxed max-w-2xl mx-auto text-lg">
          A state-of-the-art decision support platform designed for government agencies and enterprise security teams to monitor, analyze, and respond to potentially harmful public social media content.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Purpose */}
        <div className="glass-card p-10 space-y-6">
          <h3 className="text-xl font-bold text-gov-navy flex items-center gap-3">
            <Info className="w-6 h-6 text-gov-blue" />
            System Purpose
          </h3>
          <p className="text-gov-text-dark text-sm leading-relaxed">
            The PSHM-DSS provides a unified interface for analyzing text, images, and links across multiple platforms. By combining advanced Gemini AI with robust offline ML engines, it ensures continuous monitoring capabilities even in restricted environments.
          </p>
          <ul className="space-y-3 text-sm text-gov-text-dark">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-gov-blue shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              Real-time Harmful Content Detection
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-gov-blue shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              Fake News & Misinformation Analysis
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-gov-blue shadow-[0_0_8_rgba(59,130,246,0.5)]" />
              OCR-based Visual Content Inspection
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-gov-blue shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              Automated Decision Support Reports
            </li>
          </ul>
        </div>

        {/* Legal Note */}
        <div className="glass-card p-10 space-y-6 border-l-4 border-l-gov-danger">
          <h3 className="text-xl font-bold text-gov-navy flex items-center gap-3">
            <Scale className="w-6 h-6 text-gov-danger" />
            Legal & Ethical Position
          </h3>
          <p className="text-gov-text-dark text-sm leading-relaxed">
            This system is intended as a decision-support tool for authorized personnel. It does not automate law enforcement actions. Features such as "File FIR" and "Send Notice" are implemented as demonstration workflows only.
          </p>
          <div className="p-5 rounded-2xl bg-rose-50 text-gov-danger text-xs font-bold border border-rose-100 uppercase tracking-wider">
            DEMO MODE ACTIVE: No real legal actions will be performed.
          </div>
        </div>
      </div>

      {/* Developer Details */}
      <section className="glass-card p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gov-navy/5 rounded-full -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gov-blue/5 rounded-full -ml-32 -mb-32" />
        
        <h3 className="text-2xl font-serif font-bold text-gov-navy mb-10 border-b border-gov-border pb-5">
          Developer Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16">
          <DetailItem icon={User} label="Name" value="SURAJ KUMAR" />
          <DetailItem icon={Hash} label="Enrollment No" value="A35414524043" />
          <DetailItem icon={GraduationCap} label="University" value="AMITY UNIVERSITY RANCHI" />
          <DetailItem icon={Mail} label="Email" value="ABC@GMAIL.COM" />
          <DetailItem icon={Phone} label="Contact" value="984571245" />
          <DetailItem icon={MapPin} label="Location" value="Ranchi, Jharkhand, India" />
        </div>
      </section>

      <footer className="text-center text-gov-text-muted text-[10px] font-bold uppercase tracking-[0.2em] pt-12">
        &copy; 2026 PSHM-DSS Project. All Rights Reserved. Designed for Academic Excellence.
      </footer>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-xl bg-slate-50 text-gov-blue border border-slate-100">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
