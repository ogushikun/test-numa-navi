'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ExternalLink } from 'lucide-react';
import { Work } from '@/types';

interface BestMatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    work: Work | null;
}

export function BestMatchModal({ isOpen, onClose, work }: BestMatchModalProps) {
    if (!work) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    {/* Backdrop with extreme blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 40 }}
                        className="relative w-full max-w-2xl bg-zinc-900 border border-white/20 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.1)] flex flex-col max-h-[85vh]"
                    >
                        {/* Featured Image Header - Fixed or Sticky? Let's make it part of scroll or fixed top? 
                            User wants scrollable content. Best to put everything in a scrollable div except maybe a close button. 
                            But existing design has image at top. Let's make the whole card scrollable if content overflows. 
                        */}
                        <div className="overflow-y-auto custom-scrollbar">
                            <div className="relative aspect-video w-full overflow-hidden shrink-0">
                                <img
                                    src={work.thumbnailUrl}
                                    alt={work.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />

                                <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-full font-black text-xs tracking-widest shadow-xl">
                                    <Sparkles className="w-3 h-3" />
                                    あなたに最高の沼を
                                </div>

                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-md rounded-full text-white/80 hover:bg-black/60 transition-colors border border-white/10 z-20"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-10 -mt-20 relative z-10">
                                <div className="mb-6">
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mb-2">
                                        {work.media === 'anime' ? 'アニメ' : work.media === 'manga' ? '漫画' : 'ライトノベル'}
                                    </p>
                                    <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter leading-tight mb-4 italic uppercase">
                                        {work.title}
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-purple-500" />
                                        <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                            <Sparkles className="w-3 h-3" />
                                            あなたへの選定理由
                                        </h4>
                                        <p className="text-white font-bold text-lg md:text-xl leading-relaxed italic pr-4 drop-shadow-sm">
                                            &quot;{work.reason}&quot;
                                        </p>

                                        {/* Component Matching Highlights */}
                                        <div className="mt-8">
                                            <p className="text-white/20 text-[9px] font-bold uppercase tracking-[0.2em] mb-3 px-1">沼の構成要素 (Matching Keywords)</p>
                                            <div className="flex flex-wrap gap-2">
                                                {work.genres?.slice(0, 8).map((genre, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[10px] font-bold text-blue-300 uppercase tracking-wider"
                                                    >
                                                        {genre}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">作品背景 / あらすじ</h4>
                                            <p className="text-white/70 leading-relaxed text-sm">
                                                {work.description}
                                            </p>
                                        </div>
                                        <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl flex flex-col justify-center">
                                            <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-center">選定の重み付け</h4>
                                            <div className="space-y-4">
                                                {[
                                                    { label: '感性の合致度', value: `${Math.min(99, Math.round((work.aiScore || 100) * 0.9 + 10))}%` },
                                                    { label: '今の気分との整合性', value: `${Math.min(100, 80 + (work.tags.depth * 10))}%` },
                                                    { label: '没入ポテンシャル', value: work.tags.depth >= 2 ? 'Deep Abyss' : work.tags.depth >= 1 ? 'High' : 'Moderate' }
                                                ].map((stat, i) => (
                                                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                                                        <span className="text-xs text-white/60">{stat.label}</span>
                                                        <span className="text-xs font-bold text-blue-400">{stat.value}</span>
                                                    </div>
                                                ))}
                                                <p className="text-[10px] text-white/30 text-center italic mt-2">
                                                    ※あなたの{work.media === 'anime' ? 'アニメ' : work.media === 'manga' ? '漫画' : 'ライトノベル'}へのこだわりを考慮
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                                        {work.links.map((link, i) => (
                                            <a
                                                key={i}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-black text-xs hover:scale-105 transition-transform"
                                            >
                                                {link.label}
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Visual accent */}
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-20" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
