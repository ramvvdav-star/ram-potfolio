import React, { useState } from 'react';
import {
  Activity,
  Shield,
  Radio,
  Clock,
  Crosshair,
  Wifi,
  Sliders,
  AlertTriangle,
  Layers,
  Cpu,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundFx } from '../utils/audio';

export const LiveStatusPanel: React.FC = () => {
  const { liveStatus, currentUser, setIsAdminOpen } = useApp();
  const [latency] = useState('14ms');

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'LOW':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
      case 'GUARDED':
        return 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30';
      case 'ELEVATED':
        return 'text-amber-400 border-amber-500/40 bg-amber-950/30';
      case 'HIGH':
        return 'text-orange-400 border-orange-500/40 bg-orange-950/30';
      case 'CRITICAL':
        return 'text-rose-400 border-rose-500/40 bg-rose-950/30';
      default:
        return 'text-zinc-400 border-zinc-700 bg-zinc-900';
    }
  };

  return (
    <section id="status-panel" className="relative py-8 px-4 sm:px-6 lg:px-8 border-y border-zinc-800/80 bg-[#06080d]">
      <div className="max-w-7xl mx-auto">
        {/* SOC Panel Container */}
        <div className="rounded-xl border border-zinc-800 bg-[#090d16]/80 p-5 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-zinc-800/80 gap-3">
            <div className="flex items-center gap-2.5 font-mono text-xs text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-bold text-white tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                PERSONAL SOC TELEMETRY CONSOLE
              </span>
              <span className="text-zinc-600 hidden sm:inline">•</span>
              <span className="text-zinc-400 hidden sm:inline">EDGE INGRESS: OPERATIONAL</span>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>LATENCY:</span>
                <span className="text-emerald-400 font-semibold">{latency}</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>UPTIME:</span>
                <span className="text-zinc-200">{liveStatus.uptime}</span>
              </div>
              <button
                id="btn-edit-soc-status"
                onClick={() => {
                  soundFx.playKeyClick();
                  setIsAdminOpen(true);
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded border border-amber-500/40 bg-amber-950/30 text-amber-300 text-[11px] hover:bg-amber-950/60 transition-colors cursor-pointer"
                title="Configure SOC metrics & live telemetry in Admin Dashboard"
              >
                <Sliders className="w-3 h-3 text-amber-400" />
                <span>EDIT SOC STATUS</span>
              </button>
            </div>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono">
            {/* 1. System Status */}
            <div className="p-3.5 rounded-lg border border-zinc-800/80 bg-zinc-950/60 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" /> System Status
              </span>
              <div className="text-sm sm:text-base font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {liveStatus.systemStatus}
              </div>
              <span className="text-[10px] text-zinc-400 mt-1">Core services nominal</span>
            </div>

            {/* 2. Threat Level */}
            <div className="p-3.5 rounded-lg border border-zinc-800/80 bg-zinc-950/60 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" /> Threat Level
              </span>
              <div className="mt-2">
                <span
                  className={`inline-block px-2.5 py-1 rounded text-xs font-bold border tracking-wider ${getThreatColor(
                    liveStatus.threatLevel
                  )}`}
                >
                  {liveStatus.threatLevel}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 mt-1">Active posture baseline</span>
            </div>

            {/* 3. Lab Status */}
            <div className="p-3.5 rounded-lg border border-zinc-800/80 bg-zinc-950/60 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                <Radio className="w-3 h-3 text-cyan-400" /> Lab Status
              </span>
              <div className="text-sm sm:text-base font-bold text-cyan-400 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                {liveStatus.labStatus}
              </div>
              <span className="text-[10px] text-zinc-400 mt-1">Isolated testbed ready</span>
            </div>

            {/* 4. Last Update */}
            <div className="p-3.5 rounded-lg border border-zinc-800/80 bg-zinc-950/60 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-400" /> Last Heartbeat
              </span>
              <div className="text-xs sm:text-sm font-semibold text-zinc-200 mt-2 truncate">
                {liveStatus.lastUpdate}
              </div>
              <span className="text-[10px] text-zinc-400 mt-1">Telemetry tick active</span>
            </div>

            {/* 5. Current Focus */}
            <div className="col-span-2 md:col-span-1 p-3.5 rounded-lg border border-zinc-800/80 bg-zinc-950/60 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                <Crosshair className="w-3 h-3 text-emerald-400" /> Current Focus
              </span>
              <div className="text-xs font-semibold text-emerald-300 mt-2 line-clamp-2 leading-tight">
                {liveStatus.currentFocus}
              </div>
              <span className="text-[10px] text-zinc-400 mt-1">Research sprint</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
