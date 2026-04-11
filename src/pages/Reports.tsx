import React, { useEffect, useState } from 'react';
import { History, Search, Filter, Download, FileText, Image as ImageIcon, Link as LinkIcon, ChevronRight, Loader2, Clock } from 'lucide-react';
import axios from 'axios';
import { formatDate, cn } from '../lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get('/api/reports');
        setReports(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.input.toLowerCase().includes(searchTerm.toLowerCase()) || r.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || r.type === filter;
    return matchesSearch && matchesFilter;
  });

  const downloadPDF = (result: any) => {
    const doc = new jsPDF();
    const timestamp = new Date(result.timestamp).toLocaleString();
    
    doc.setFontSize(22);
    doc.setTextColor(26, 54, 93);
    doc.text('PSHM-DSS Analysis Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${timestamp}`, 105, 28, { align: 'center' });
    
    doc.setDrawColor(192, 160, 128);
    doc.line(20, 35, 190, 35);

    const data = [
      ['Analysis Type', result.type],
      ['Analysis Mode', result.mode],
      ['Risk Category', result.category],
      ['Risk Score', `${result.riskScore}%`],
      ['Confidence', `${result.confidence}%`],
      ['Input Summary', result.input.substring(0, 100) + (result.input.length > 100 ? '...' : '')],
      ['Detected Issues', result.detectedIssues.join(', ') || 'None'],
      ['Recommendation', result.recommendation]
    ];

    autoTable(doc, {
      startY: 45,
      head: [['Field', 'Details']],
      body: data,
      theme: 'striped',
      headStyles: { fillColor: [26, 54, 93] },
    });

    doc.save(`Analysis_Report_${result.id}.pdf`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Analysis History</h1>
          <p className="text-slate-500">Access and manage all previous content monitoring reports.</p>
        </div>
      </div>

      <div className="glass-card p-10">
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gov-text-muted" />
            <input
              type="text"
              placeholder="Search by content or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-14"
            />
          </div>
          <div className="flex gap-3">
            {['All', 'Text', 'Image', 'Link'].map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  "px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border",
                  filter === t 
                    ? "bg-gov-navy text-white border-gov-navy shadow-lg shadow-gov-navy/20" 
                    : "bg-white text-gov-text-muted border-gov-border hover:bg-gov-bg hover:text-gov-navy"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-gov-border">
                <th className="pb-5 font-bold text-gov-text-muted text-[10px] uppercase tracking-[0.15em] px-6">Type</th>
                <th className="pb-5 font-bold text-gov-text-muted text-[10px] uppercase tracking-[0.15em] px-6">Content Preview</th>
                <th className="pb-5 font-bold text-gov-text-muted text-[10px] uppercase tracking-[0.15em] px-6">Mode</th>
                <th className="pb-5 font-bold text-gov-text-muted text-[10px] uppercase tracking-[0.15em] px-6">Risk Assessment</th>
                <th className="pb-5 font-bold text-gov-text-muted text-[10px] uppercase tracking-[0.15em] px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-border/50">
              {loading ? (
                <tr><td colSpan={5} className="py-24 text-center text-gov-text-muted">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-gov-blue" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">Loading Intelligence Reports...</span>
                  </div>
                </td></tr>
              ) : filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="group hover:bg-gov-bg transition-colors">
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-3 rounded-xl shadow-sm",
                          report.riskScore > 50 ? "bg-rose-50 text-gov-danger" : "bg-emerald-50 text-gov-success"
                        )}>
                          {report.type === 'Text' ? <FileText className="w-5 h-5" /> : report.type === 'Image' ? <ImageIcon className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                        </div>
                        <span className="font-bold text-gov-navy">{report.type}</span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="max-w-xs">
                        <p className="text-sm text-gov-text-dark font-medium truncate">{report.input}</p>
                        <p className="text-[10px] text-gov-text-muted font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> {formatDate(report.timestamp)}
                        </p>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <span className="text-[10px] font-bold text-gov-text-muted bg-gov-bg border border-gov-border px-2.5 py-1 rounded-lg uppercase tracking-widest">
                        {report.mode}
                      </span>
                    </td>
                    <td className="py-6 px-6">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm",
                        report.riskScore > 75 ? "bg-rose-50 text-gov-danger border-rose-100" : 
                        report.riskScore > 50 ? "bg-amber-50 text-gov-warning border-amber-100" :
                        "bg-emerald-50 text-gov-success border-emerald-100"
                      )}>
                        <div className={cn(
                          "w-2 h-2 rounded-full animate-pulse",
                          report.riskScore > 75 ? "bg-gov-danger" : report.riskScore > 50 ? "bg-gov-warning" : "bg-gov-success"
                        )} />
                        {report.category}
                      </div>
                    </td>
                    <td className="py-6 px-6 text-right">
                      <button 
                        onClick={() => downloadPDF(report)}
                        className="p-3 text-gov-text-muted hover:text-gov-blue hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-gov-border group-hover:scale-110"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="py-24 text-center text-gov-text-muted italic">No intelligence reports found matching your criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
