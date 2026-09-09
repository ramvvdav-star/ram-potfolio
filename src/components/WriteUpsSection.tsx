import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  Tag,
  Bookmark,
  BookmarkCheck,
  Share2,
  Check,
  Copy,
  X,
  Eye,
  ExternalLink,
  ChevronRight,
  Terminal,
  Shield,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WriteUp, WriteUpCategory, WriteUpDifficulty } from '../types';
import { soundFx } from '../utils/audio';

export const WriteUpsSection: React.FC = () => {
  const {
    writeUps = [],
    selectedWriteUp,
    setSelectedWriteUp,
    incrementWriteUpViews,
    currentUser,
    toggleSaveArticle,
  } = useApp();

  const safeArticles = Array.isArray(writeUps) ? writeUps : [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);

  const categories = [
    'ALL',
    'Web Security',
    'Linux',
    'Networking',
    'OSINT',
    'Defensive Security',
  ];

  const filteredArticles = safeArticles.filter((art) => {
    if (!art.published) return false;
    const matchesCat = selectedCategory === 'ALL' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const featuredArticle = safeArticles.find((w) => w.featured && w.published) || safeArticles[0];

  const getDifficultyBadge = (diff: WriteUpDifficulty) => {
    switch (diff) {
      case 'ELITE':
        return 'border-rose-500/50 text-rose-400 bg-rose-950/40';
      case 'ADVANCED':
        return 'border-amber-500/50 text-amber-400 bg-amber-950/40';
      case 'INTERMEDIATE':
        return 'border-cyan-500/50 text-cyan-400 bg-cyan-950/40';
      case 'BEGINNER':
        return 'border-emerald-500/50 text-emerald-400 bg-emerald-950/40';
    }
  };

  const openArticle = (article: WriteUp) => {
    soundFx.playKeyClick();
    incrementWriteUpViews(article.id);
    setSelectedWriteUp(article);
  };

  const copyCode = (codeText: string, id: string) => {
    soundFx.playKeyClick();
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Helper to render markdown-like content cleanly with code blocks and terminal styling
  const renderArticleBody = (content: string) => {
    const sections = content.split('\n\n');
    return sections.map((sec, idx) => {
      // Code block
      if (sec.startsWith('```')) {
        const lines = sec.split('\n');
        const lang = lines[0].replace('```', '') || 'bash';
        const codeContent = lines.slice(1, -1).join('\n');
        const blockId = `code-block-${idx}`;

        return (
          <div
            key={idx}
            className="my-4 rounded-xl border border-zinc-800 bg-[#06080d] overflow-hidden font-mono text-xs shadow-md"
          >
            <div className="px-4 py-2 bg-zinc-950 border-b border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="text-emerald-400 font-bold uppercase">{lang}</span>
              <button
                onClick={() => copyCode(codeContent, blockId)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                {copiedCodeId === blockId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 overflow-x-auto text-zinc-200 leading-relaxed font-mono">
              <pre>
                <code>{codeContent}</code>
              </pre>
            </div>
          </div>
        );
      }

      // Heading 3 (###)
      if (sec.startsWith('### ')) {
        return (
          <h3
            key={idx}
            className="text-lg font-bold font-mono text-white mt-6 mb-2 border-b border-zinc-800 pb-1"
          >
            {sec.replace('### ', '')}
          </h3>
        );
      }

      // Heading 4 (####)
      if (sec.startsWith('#### ')) {
        return (
          <h4
            key={idx}
            className="text-sm font-bold font-mono text-emerald-400 mt-4 mb-2"
          >
            {sec.replace('#### ', '')}
          </h4>
        );
      }

      // Horizontal rule (---)
      if (sec === '---') {
        return <hr key={idx} className="my-6 border-zinc-800" />;
      }

      // Standard paragraph
      return (
        <p key={idx} className="text-sm text-zinc-300 leading-relaxed font-sans my-2">
          {sec}
        </p>
      );
    });
  };

  return (
    <section id="writeups" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800/80">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-zinc-800">
        <div>
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <BookOpen className="w-3.5 h-3.5" /> RESEARCH ARCHIVE // OFFENSIVE & DEFENSIVE WRITE-UPS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
            Security Write-ups
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-mono mt-1">
            Vulnerability deconstructions, Linux kernel hardening guides & protocol research.
          </p>
        </div>

        {/* Search */}
        <div className="mt-4 md:mt-0 relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search write-ups or tags..."
            className="pl-8 pr-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/70 text-xs font-mono text-zinc-200 placeholder-zinc-500 outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Featured Article Banner */}
      {featuredArticle && !searchQuery && selectedCategory === 'ALL' && (
        <div className="mb-10 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-zinc-900/50 to-zinc-900/30 p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden group">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>FEATURED SECURITY RESEARCH</span>
            <span className="text-zinc-600">•</span>
            <span className={`px-2 py-0.2 rounded text-[10px] font-bold border ${getDifficultyBadge(featuredArticle.difficulty)}`}>
              {featuredArticle.difficulty}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-mono text-white mb-3 group-hover:text-emerald-300 transition-colors">
            {featuredArticle.title}
          </h3>

          <p className="text-sm text-zinc-300 max-w-3xl font-sans leading-relaxed mb-4">
            {featuredArticle.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs pt-2">
            <div className="flex items-center gap-4 text-zinc-400">
              <span>{featuredArticle.author}</span>
              <span>•</span>
              <span>{featuredArticle.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> {featuredArticle.readingTime}
              </span>
            </div>

            <button
              onClick={() => openArticle(featuredArticle)}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.25)]"
            >
              <span>READ WRITE-UP</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8 font-mono text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`filter-writeup-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            onClick={() => {
              soundFx.playKeyClick();
              setSelectedCategory(cat);
            }}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : 'border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => {
          const isSaved = currentUser?.savedArticles?.includes(article.id);
          return (
            <div
              key={article.id}
              id={`writeup-card-${article.id}`}
              className="rounded-xl border border-zinc-800/80 bg-[#090d16]/70 backdrop-blur-sm p-5 hover:border-zinc-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3 font-mono text-xs">
                  <span className="text-[11px] text-zinc-500 uppercase">{article.category}</span>
                  <span
                    className={`px-2 py-0.2 rounded text-[10px] font-bold border ${getDifficultyBadge(
                      article.difficulty
                    )}`}
                  >
                    {article.difficulty}
                  </span>
                </div>

                <h4
                  onClick={() => openArticle(article)}
                  className="font-mono text-base font-bold text-white group-hover:text-emerald-300 transition-colors mb-2 cursor-pointer leading-snug"
                >
                  {article.title}
                </h4>

                <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4 font-mono text-[10px]">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Bottom Meta */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-3 text-zinc-500 text-[11px]">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readingTime}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleSaveArticle(article.id)}
                    className={`p-1.5 rounded hover:bg-zinc-800 transition-colors ${
                      isSaved ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                    title={isSaved ? 'Saved in profile' : 'Bookmark article'}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openArticle(article)}
                    className="p-1.5 rounded hover:bg-zinc-800 text-emerald-400 transition-colors cursor-pointer"
                    title="Read full write-up"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Article Reader Modal */}
      {selectedWriteUp && (
        <div
          id="article-reader-modal-overlay"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedWriteUp(null)}
        >
          <div
            id="article-reader-modal"
            className="w-full max-w-4xl max-h-[90vh] bg-[#090d16] border border-zinc-700 rounded-xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getDifficultyBadge(
                    selectedWriteUp.difficulty
                  )}`}
                >
                  {selectedWriteUp.difficulty}
                </span>
                <span className="text-zinc-400">{selectedWriteUp.category}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-500 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {selectedWriteUp.views} views
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleSaveArticle(selectedWriteUp.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono transition-colors ${
                    currentUser?.savedArticles?.includes(selectedWriteUp.id)
                      ? 'border-emerald-500 text-emerald-300 bg-emerald-950/40'
                      : 'border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>SAVE</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setShareSuccess(true);
                    setTimeout(() => setShareSuccess(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{shareSuccess ? 'COPIED!' : 'SHARE'}</span>
                </button>
                <button
                  onClick={() => setSelectedWriteUp(null)}
                  className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Article Content Container */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-zinc-200">
              {/* Title & Metadata */}
              <div className="border-b border-zinc-800/80 pb-6 space-y-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight leading-snug">
                  {selectedWriteUp.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                  <span>Author: {selectedWriteUp.author}</span>
                  <span>•</span>
                  <span>Published: {selectedWriteUp.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> {selectedWriteUp.readingTime}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(selectedWriteUp.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Excerpt callout */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border-l-4 border-emerald-500 font-sans text-sm text-zinc-300 italic">
                {selectedWriteUp.excerpt}
              </div>

              {/* Formatted Article Body */}
              <div className="article-body font-sans text-sm text-zinc-200 leading-relaxed">
                {renderArticleBody(selectedWriteUp.content)}
              </div>

              {/* References */}
              {selectedWriteUp.references && selectedWriteUp.references.length > 0 && (
                <div className="mt-8 pt-6 border-t border-zinc-800 space-y-2 font-mono text-xs">
                  <h4 className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> ACADEMIC & STANDARDS REFERENCES
                  </h4>
                  <ul className="space-y-1.5 text-zinc-400">
                    {(selectedWriteUp.references || []).map((ref, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400">[{idx + 1}]</span>
                        <span>{ref}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Bottom Bar */}
            <div className="px-6 py-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>RAM.SEC // VULNERABILITY RESEARCH JOURNAL</span>
              <span>AUTHORIZED EDUCATIONAL DISCLOSURE</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
