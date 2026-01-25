'use client';

import { motion } from 'framer-motion';
import { RotateCcw, Zap, Heart, Share2, Download, Sparkles, Target } from 'lucide-react';

interface RefineOptionsProps {
    onDeepDive: () => void;
    onDownload: () => void;
    onShareX: () => void;
}

export function RefineOptions({ onDeepDive, onDownload, onShareX }: RefineOptionsProps) {

    return (
        <div className="flex flex-col gap-6 w-full max-w-lg mx-auto mt-12 mb-20 px-4">
            <div className="flex flex-col gap-3">
                <div className="text-center">
                    <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">さらに精度を高める</h4>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(168,85,247,0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onDeepDive}
                    className="w-full flex items-center justify-center gap-3 py-5 rounded-[2rem] bg-purple-500/5 border border-purple-500/20 text-purple-400 font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(168,85,247,0.1)] group"
                >
                    <Target className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    もう少しNumaる？ / ディープに調整する (+2問)
                </motion.button>
            </div>



            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onDownload}
                    className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/20 text-white font-bold text-sm"
                >
                    <Download className="w-5 h-5" />
                    画像を保存
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onShareX}
                    className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-white text-black font-black text-sm shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                    <Share2 className="w-5 h-5" />
                    X でシェア
                </motion.button>
            </div>
        </div>
    );
}
