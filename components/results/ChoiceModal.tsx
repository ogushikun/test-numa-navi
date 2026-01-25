'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search } from 'lucide-react';
import { Work } from '@/types';

interface ChoiceModalProps {
    isOpen: boolean;
    work: Work | null;
    onClose: () => void;
    onConfirm: (work: Work) => void;
    onPivot: (work: Work) => void;
}

export function ChoiceModal({ isOpen, work, onClose, onConfirm, onPivot }: ChoiceModalProps) {
    if (!work) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-sm bg-zinc-900 border border-white/20 rounded-[2rem] overflow-hidden shadow-2xl z-10 p-6 flex flex-col gap-6"
                    >
                        <div className="text-center">
                            <h3 className="text-white font-bold text-xl mb-1">{work.title}</h3>
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">どうしますか？</p>
                        </div>

                        <button
                            onClick={() => onConfirm(work)}
                            className="group flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl text-white hover:scale-[1.02] transition-transform shadow-lg shadow-pink-500/20"
                        >
                            <span className="font-black text-lg">これにNumaる</span>
                            <Heart className="w-6 h-6 fill-white" />
                        </button>

                        <button
                            onClick={() => onPivot(work)}
                            className="group flex items-center justify-between px-6 py-4 bg-white/10 border border-white/10 rounded-2xl text-white hover:bg-white/20 transition-colors"
                        >
                            <div className="text-left">
                                <span className="block font-bold text-sm">この方向性で</span>
                                <span className="block font-bold text-sm text-white/60">他をNumaる</span>
                            </div>
                            <Search className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
