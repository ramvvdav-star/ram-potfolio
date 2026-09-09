import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Plus,
  Sliders,
  Terminal,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DailyLog } from '../types';
import { soundFx } from '../utils/audio';

export const DailyLogSection: React.FC = () => {
  const { dailyLogs = [], currentUser, setIsAdminOpen } = useApp();
  const [selectedTag, setSelectedTag] = useState<string>('ALL');

  const safeLogs = Array.isArray(dailyLogs) ? dailyLogs : [];

  // Extract all unique tags
  const allTags = Array.from(
    new Set(safeLogs.flatMap((l) => l.tags || []))
  );

  const filteredLogs = safeLogs.filter((log) => {
    if (selectedTag === 'ALL') return true;
    return log.tags?.includes(selectedTag);
  });

  return (
    <section id="dailylog" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800/80">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-zinc-800">
        <div>
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Calendar className="w-3.5 h-3.5" /> LAB LOGBOOK // DAY-TO-DAY SECURITY DISCOVERY
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
            Daily Research Log
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-mono mt-1">
            Raw notes from the terminal: what broke, what worked, failures, and tomorrow&apos;s hypotheses.
          </p>
        </div>

        <button
          id="btn-add-log-admin"
          onClick={() => {
            soundFx.playKeyClick();
            setIsAdminOpen(true);
          }}
          className="mt-4 md:mt-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-950/30 text-amber-300 hover:bg-amber-950/60 text-xs font-mono transition-colors cursor-pointer"
          title="Open Admin Dashboard to add new research log"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span>ADD NEW LOG ENTRY</span>
        </button>
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2 mb-8 font-mono text-xs">
        <button
          onClick={() => {
            soundFx.playKeyClick();
            setSelectedTag('ALL');
          }}
          className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            selectedTag === 'ALL'
              ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.2)]'
              : 'border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          ALL LOGS ({safeLogs.length})
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              soundFx.playKeyClick();
              setSelectedTag(tag);
            }}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              selectedTag === tag
                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-semibold'
                : 'border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Timeline entries */}
      <div className="relative border-l border-zinc-800 ml-3 md:ml-6 pl-6 sm:pl-8 space-y-10">
        {filteredLogs.map((log) => (
          <div key={log.id} id={`log-entry-${log.id}`} className="relative group">
            {/* Timeline node icon on border */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-zinc-950 border-2 border-emerald-500 group-hover:border-emerald-400 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.6)] transition-all"></div>

            {/* Entry Card */}
            <div className="rounded-xl border border-zinc-800/80 bg-[#090d16]/80 backdrop-blur-sm p-6 space-y-4 hover:border-zinc-700 transition-all">
              {/* Card Header: Date & Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800/80 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-500/30">
                    {log.date}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold font-mono text-white">
                    &ldquo;{log.title}&rdquo;
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                  {(log.tags || []).map((t) => (
                    <span key={t} className="text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Four structured blocks: Worked on, Learned, What failed, What I will try next */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs leading-relaxed">
                {/* 1. What I worked on */}
                <div className="p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 space-y-1">
                  <div className="font-mono text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Worked on
                  </div>
                  <p className="text-zinc-300">{log.workedOn}</p>
                </div>

                {/* 2. What I learned */}
                <div className="p-3.5 rounded-lg bg-emerald-950/10 border border-emerald-500/20 space-y-1">
                  <div className="font-mono text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-emerald-400" /> Key Takeaway
                  </div>
                  <p className="text-zinc-300">{log.learned}</p>
                </div>

                {/* 3. What failed */}
                <div className="p-3.5 rounded-lg bg-rose-950/10 border border-rose-500/20 space-y-1">
                  <div className="font-mono text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> What Failed / Bottleneck
                  </div>
                  <p className="text-zinc-300">{log.failed}</p>
                </div>

                {/* 4. What I will try next */}
                <div className="p-3.5 rounded-lg bg-purple-950/10 border border-purple-500/20 space-y-1">
                  <div className="font-mono text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-purple-400" /> Next Action Item
                  </div>
                  <p className="text-zinc-300">{log.willTryNext}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
