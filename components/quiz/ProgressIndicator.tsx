'use client';

import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
    current: number;
    total: number;
}

export function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
    const progress = (current / total) * 100;

    return (
        <div className="w-full max-w-md mx-auto mb-8 px-4">
            <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-semibold tracking-widest text-white/60 uppercase">
                    Step {current} of {total}
                </span>
                <span className="text-xs font-bold text-white/80">
                    {Math.round(progress)}%
                </span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-white/40 via-white/80 to-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                />
            </div>
        </div>
    );
}
