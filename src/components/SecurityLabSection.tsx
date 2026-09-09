import React, { useState } from 'react';
import {
  FlaskConical,
  Shield,
  Terminal,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Code,
  Binary,
  Hash,
  Globe,
  Radio,
  Lock,
  Zap,
  Copy,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundFx } from '../utils/audio';
import { LabExperiment } from '../types';

export const SecurityLabSection: React.FC = () => {
  const { labExperiments, liveStatus } = useApp();
  const [selectedExperiment, setSelectedExperiment] = useState<LabExperiment>(
    labExperiments[0] || {
      id: 'exp-1',
      title: 'HTTP Security Headers & CORS Policy Auditor',
      category: 'Web Security',
      difficulty: 'Beginner',
      status: 'Active',
      summary: 'Evaluate critical defense-in-depth HTTP response headers.',
      environment: 'Simulated HTTP Request / Response Inspector Engine',
      toolsUsed: ['HTTP Parser', 'Header Inspector', 'CSP Validator'],
      findings: 'Missing CSP and permissive CORS configurations.',
      authorizedDisclaimer: 'For authorized educational environments only.',
    }
  );

  // Interactive Tools state
  const [activeTool, setActiveTool] = useState<'headers' | 'hash' | 'cidr' | 'jwt'>('headers');

  // Tool 1: Headers Analyzer
  const [rawHeaders, setRawHeaders] = useState<string>(
    `HTTP/1.1 200 OK\nServer: nginx/1.24.0\nStrict-Transport-Security: max-age=63072000; includeSubDomains; preload\nX-Content-Type-Options: nosniff\nX-Frame-Options: DENY\nContent-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com\nAccess-Control-Allow-Origin: *`
  );

  // Tool 2: Hash & Payload Inspector
  const [payloadInput, setPayloadInput] = useState<string>('ZXhlYyhzb2NrZXQuc29ja2V0KCkp');
  const [detectedFormat, setDetectedFormat] = useState<string>('');

  // Tool 3: CIDR Subnet Calculator
  const [cidrInput, setCidrInput] = useState<string>('192.168.1.0/24');

  // Tool 4: JWT Inspector
  const [jwtInput, setJwtInput] = useState<string>(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlJhbSBTZWN1cml0eSIsInJvbGUiOiJvcGVyYXRvciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  );

  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    soundFx.playKeyClick();
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Compute CIDR breakdown
  const computeCidr = (cidrStr: string) => {
    try {
      const [ip, maskStr] = cidrStr.trim().split('/');
      const mask = parseInt(maskStr, 10);
      if (!ip || isNaN(mask) || mask < 0 || mask > 32) {
        return { valid: false, error: 'Invalid CIDR format (e.g. 192.168.1.0/24)' };
      }
      const totalHosts = Math.pow(2, 32 - mask);
      const usableHosts = mask >= 31 ? (mask === 31 ? 2 : 1) : totalHosts - 2;
      return {
        valid: true,
        networkIp: ip,
        prefix: mask,
        totalHosts: totalHosts.toLocaleString(),
        usableHosts: usableHosts.toLocaleString(),
        wildcardMask: mask === 24 ? '0.0.0.255' : mask === 16 ? '0.0.255.255' : 'Calculated',
      };
    } catch (_) {
      return { valid: false, error: 'Failed to parse CIDR' };
    }
  };

  const cidrResult = computeCidr(cidrInput);

  // Parse JWT
  const parseJwt = (token: string) => {
    try {
      const parts = token.trim().split('.');
      if (parts.length !== 3) return { valid: false, error: 'Invalid JWT structure (must have 3 parts)' };
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      return {
        valid: true,
        header,
        payload,
        hasNoneAlg: header.alg?.toLowerCase() === 'none',
        signature: parts[2],
      };
    } catch (e: any) {
      return { valid: false, error: 'Invalid Base64URL in JWT payload' };
    }
  };

  const jwtResult = parseJwt(jwtInput);

  // Decode Payload safely
  const decodePayload = (val: string) => {
    try {
      const base64Decoded = atob(val);
      return { valid: true, decoded: base64Decoded, type: 'Base64 Decoded' };
    } catch (_) {
      try {
        const uriDecoded = decodeURIComponent(val);
        if (uriDecoded !== val) {
          return { valid: true, decoded: uriDecoded, type: 'URL Decoded' };
        }
      } catch (_) {}
      return { valid: true, decoded: val, type: 'Raw String (No Base64 match)' };
    }
  };

  const decodedResult = decodePayload(payloadInput);

  return (
    <section id="lab" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>INTERACTIVE SECURITY LAB & BENCH</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white font-mono tracking-tight">
              PERSONAL RESEARCH LAB
            </h2>
            <p className="text-zinc-400 font-mono text-xs max-w-2xl">
              Virtual telemetry testing bench, offensive payload inspection tools, and verified security experiments conducted in isolated environments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center gap-2 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-400">STATUS:</span>
              <span className="text-emerald-400 font-bold">{liveStatus.labStatus || 'ONLINE'}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center gap-2 font-mono text-xs">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-zinc-400">ACTIVE PROBES:</span>
              <span className="text-cyan-400 font-bold">{liveStatus.activeProbesCount || 4}</span>
            </div>
          </div>
        </div>

        {/* Top Interactive Bench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Experiments Catalog */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-zinc-400 pb-1">
              <span className="font-bold flex items-center gap-1.5 text-zinc-300">
                <Layers className="w-4 h-4 text-emerald-400" /> EXPERIMENT DOSSIERS
              </span>
              <span>{labExperiments.length} ARCHIVED</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {labExperiments.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => {
                    soundFx.playKeyClick();
                    setSelectedExperiment(exp);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedExperiment.id === exp.id
                      ? 'bg-zinc-900/90 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-emerald-400 border border-emerald-500/20">
                      {exp.category}
                    </span>
                    <span className="text-zinc-500 text-[10px] uppercase">
                      DIFFICULTY: {exp.difficulty}
                    </span>
                  </div>

                  <h4 className="text-white font-bold text-sm mb-1.5 flex items-center justify-between">
                    <span>{exp.title}</span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        selectedExperiment.id === exp.id ? 'text-emerald-400 translate-x-1' : 'text-zinc-600'
                      }`}
                    />
                  </h4>

                  <p className="text-zinc-400 text-[11px] line-clamp-2 leading-relaxed">
                    {exp.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Selected Experiment Deep Dive */}
          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800/90 rounded-2xl p-6 font-mono text-xs space-y-6 shadow-xl">
            <div className="border-b border-zinc-800 pb-4 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                  <Terminal className="w-4 h-4" />
                  <span>LAB TELEMETRY DOSSIER // {selectedExperiment.id.toUpperCase()}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{selectedExperiment.title}</h3>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase">
                {selectedExperiment.status}
              </span>
            </div>

            {/* Scope Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
                <span className="text-zinc-500 text-[10px] uppercase block mb-1">ENVIRONMENT / TARGET</span>
                <span className="text-zinc-200 font-semibold">{selectedExperiment.environment}</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
                <span className="text-zinc-500 text-[10px] uppercase block mb-1">SECURITY CLASSIFICATION</span>
                <span className="text-emerald-400 font-semibold">{selectedExperiment.category}</span>
              </div>
            </div>

            {/* Tools Used */}
            <div>
              <span className="text-zinc-500 text-[10px] uppercase block mb-2">APPARATUS & TOOLCHAIN</span>
              <div className="flex flex-wrap gap-2">
                {selectedExperiment.toolsUsed.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Finding & Analysis */}
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-zinc-300 font-bold text-[11px]">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>EXPLOITATION / HARDENING FINDINGS</span>
              </div>
              <p className="text-zinc-300 leading-relaxed text-xs">
                {selectedExperiment.findings}
              </p>
            </div>

            {/* Authorized Disclaimer */}
            <div className="flex items-center gap-2 text-zinc-500 text-[10px] pt-2 border-t border-zinc-800/60">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{selectedExperiment.authorizedDisclaimer}</span>
            </div>
          </div>
        </div>

        {/* Live Security Tools Workbench */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/90 font-mono text-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                OPERATIONAL SECURITY WORKBENCH
              </h3>
            </div>

            {/* Tool Tabs */}
            <div className="flex flex-wrap gap-1.5 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => {
                  soundFx.playKeyClick();
                  setActiveTool('headers');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTool === 'headers'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                HTTP Headers
              </button>
              <button
                onClick={() => {
                  soundFx.playKeyClick();
                  setActiveTool('hash');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTool === 'hash'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Payload Dissector
              </button>
              <button
                onClick={() => {
                  soundFx.playKeyClick();
                  setActiveTool('cidr');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTool === 'cidr'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                CIDR Subnetter
              </button>
              <button
                onClick={() => {
                  soundFx.playKeyClick();
                  setActiveTool('jwt');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTool === 'jwt'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                JWT Verifier
              </button>
            </div>
          </div>

          {/* Workbench Body */}
          {activeTool === 'headers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-zinc-400 text-[11px] font-bold block">
                  RESPONSE HEADERS INPUT (PASTE OR MODIFY)
                </label>
                <textarea
                  rows={8}
                  value={rawHeaders}
                  onChange={(e) => setRawHeaders(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-300 font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-3">
                <span className="text-zinc-400 text-[11px] font-bold block">
                  AUDIT BREAKDOWN & RECOMMENDATIONS
                </span>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-300">Content-Security-Policy (CSP)</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-300">Strict-Transport-Security (HSTS)</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 2-Year Max Age
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-300">X-Frame-Options (Clickjacking)</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> DENY
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
                    <span className="text-amber-300">CORS Access-Control-Allow-Origin</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Wildcard * Detected
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTool === 'hash' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-zinc-400 text-[11px] font-bold block">
                  ENCODED STRING / CYPHERTEXT / BASE64
                </label>
                <input
                  type="text"
                  value={payloadInput}
                  onChange={(e) => setPayloadInput(e.target.value)}
                  placeholder="Paste encoded text..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <span className="text-zinc-500 text-[10px] uppercase">
                  DETECTION: {decodedResult.type}
                </span>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-400 font-mono text-xs break-all">
                  {decodedResult.decoded}
                </div>
                <button
                  onClick={() => copyToClipboard(decodedResult.decoded, 'hash')}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center gap-1.5 text-xs transition-colors"
                >
                  {copied === 'hash' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied === 'hash' ? 'Copied' : 'Copy Decoded Text'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTool === 'cidr' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-zinc-400 text-[11px] font-bold block">
                  CIDR BLOCK (IP/PREFIX)
                </label>
                <input
                  type="text"
                  value={cidrInput}
                  onChange={(e) => setCidrInput(e.target.value)}
                  placeholder="e.g. 10.0.0.0/16"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {cidrResult.valid && (
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="flex justify-between py-1 border-b border-zinc-800">
                    <span className="text-zinc-400">Total Host Addresses:</span>
                    <span className="text-emerald-400 font-bold">{cidrResult.totalHosts}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800">
                    <span className="text-zinc-400">Usable Hosts:</span>
                    <span className="text-white font-bold">{cidrResult.usableHosts}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-400">Wildcard Netmask:</span>
                    <span className="text-cyan-400 font-bold">{cidrResult.wildcardMask}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTool === 'jwt' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-zinc-400 text-[11px] font-bold block">
                  JSON WEB TOKEN (JWT) INSPECTOR
                </label>
                <textarea
                  rows={2}
                  value={jwtInput}
                  onChange={(e) => setJwtInput(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-300 font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                />
              </div>

              {jwtResult.valid ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                    <span className="text-zinc-400 font-bold text-[11px] block mb-2">
                      HEADER (ALGORITHM & TOKEN TYPE)
                    </span>
                    <pre className="text-emerald-400 text-[11px] overflow-x-auto">
                      {JSON.stringify(jwtResult.header, null, 2)}
                    </pre>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                    <span className="text-zinc-400 font-bold text-[11px] block mb-2">
                      PAYLOAD (CLAIMS & IDENTITY)
                    </span>
                    <pre className="text-cyan-400 text-[11px] overflow-x-auto">
                      {JSON.stringify(jwtResult.payload, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs">
                  {jwtResult.error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
