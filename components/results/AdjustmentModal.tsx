'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Work } from '@/types';
import { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface AdjustmentModalProps {
    isOpen: boolean;
    works: Work[];
    onClose: () => void;
    onGenerateOptions: (work: Work) => Promise<string[]>; // Call Server Action
    onApplyAdjustment: (work: Work, adjustment: string) => void;
}

export function AdjustmentModal({ isOpen, works, onClose, onGenerateOptions, onApplyAdjustment }: AdjustmentModalProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedWork, setSelectedWork] = useState<Work | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleWorkSelect = async (work: Work) => {
        setSelectedWork(work);
        setIsLoading(true);
        // Call AI to generate options
        const generated = await onGenerateOptions(work);
        setOptions(generated);
        setIsLoading(false);
        setStep(2);
    };

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
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-lg bg-zinc-900 border border-white/20 rounded-[2rem] overflow-hidden shadow-2xl z-10 flex flex-col max-h-[80vh]"
                    >
                        {step === 1 ? (
                            <div className="p-8">
                                <h3 className="text-white font-bold text-xl mb-6 text-center">一番「惜しい」のはどれ？</h3>
                                <div className="grid gap-3">
                                    {works.slice(0, 3).map(work => (
                                        <button
                                            key={work.id}
                                            onClick={() => handleWorkSelect(work)}
                                            disabled={isLoading}
                                            className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all text-left group"
                                        >
                                            <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden shrink-0">
                                                <img src={work.thumbnailUrl} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm">{work.title}</div>
                                                <div className="text-[10px] text-white/40">これに近いけど...</div>
                                            </div>
                                            <div className="ml-auto">
                                                {isLoading && selectedWork?.id === work.id ? (
                                                    <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                                                ) : (
                                                    <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-8">
                                <h3 className="text-white font-bold text-xl mb-2 text-center">どう修正しますか？</h3>
                                <p className="text-center text-xs text-white/40 mb-6">「{selectedWork?.title}」をベースに調整案を作成しました</p>

                                <div className="grid gap-3">
                                    {options.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => selectedWork && onApplyAdjustment(selectedWork, opt)}
                                            className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 font-bold text-sm hover:bg-purple-500/20 transition-colors text-left"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setStep(1)}
                                        className="mt-2 p-3 text-xs text-white/40 hover:text-white transition-colors"
                                    >
                                        作品を選び直す
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
