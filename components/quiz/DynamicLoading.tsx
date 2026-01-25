'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
    "成分分析中...",
    "あなたの性癖を解読しています...",
    "DBから候補800作品をスキャン中...",
    "深淵から「大穴」を探し出しています...",
    "AIソムリエが推薦文を執筆中...",
    "最適な「沼」が見つかりました..."
];

export function DynamicLoading() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 2000); // Change message every 2 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-white/5 border-t-white/80 rounded-full mb-8 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            />

            <div className="h-8 relative w-full text-center overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-white/60 font-medium text-lg tracking-wider absolute w-full"
                    >
                        {MESSAGES[index]}
                    </motion.p>
                </AnimatePresence>
            </div>

            <p className="mt-8 text-white/20 text-xs uppercase tracking-widest animate-pulse">
                Processing 20 Candidates
            </p>
        </div>
    );
}
