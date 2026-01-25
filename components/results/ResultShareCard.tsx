'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Work, ColorProfile } from '@/types';

interface ResultShareCardProps {
    numaType: string;
    recommendations: Work[];
    profiles: ColorProfile[];
    cardRef: React.RefObject<HTMLDivElement | null>;
}

export const ResultShareCard: React.FC<ResultShareCardProps> = ({ numaType, recommendations, profiles, cardRef }) => {
    // Use the last profile for the overall theme of the share card
    const mainProfile = profiles[profiles.length - 1] || { temp: 50, saturation: 50, brightness: 50, hueShift: 0, contrast: 50 };

    const bgColor = `hsl(${220 + mainProfile.hueShift}, ${mainProfile.saturation}%, ${mainProfile.brightness / 2}%)`;
    const accentColor = `hsl(${220 + mainProfile.hueShift}, ${mainProfile.saturation}%, 70%)`;

    return (
        <div className="fixed left-[-9999px] top-0 pointer-events-none">
            <div
                ref={cardRef}
                style={{
                    background: `linear-gradient(135deg, ${bgColor} 0%, #000 100%)`,
                    width: '1200px',
                    height: '630px',
                    padding: '60px',
                }}
                className="relative overflow-hidden flex flex-col items-center justify-between text-white font-sans border-4 border-white/10"
            >
                {/* Grain overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

                {/* Glow effects */}
                <div
                    className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-[100px] opacity-30"
                    style={{ backgroundColor: accentColor }}
                />

                <div className="w-full h-full relative z-10 flex flex-col justify-between">
                    {/* Header */}
                    <div className="text-center">
                        <p className="text-white/40 uppercase tracking-[0.4em] text-xl font-bold mb-4">あなたは...</p>
                        <h1 className="text-8xl font-black mb-6 tracking-tight leading-none italic" style={{ color: accentColor }}>
                            {numaType}
                        </h1>
                        <div className="h-2 w-48 bg-white/20 mx-auto rounded-full" />
                    </div>

                    {/* Recommendations Row */}
                    <div className="flex justify-center gap-12 items-end mb-12">
                        {recommendations.slice(0, 3).map((work, i) => (
                            <div key={work.id} className="w-[300px] flex flex-col items-center">
                                <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl mb-4 transform rotate-[1deg]" style={{ transform: `rotate(${(i - 1) * 2}deg)` }}>
                                    <img src={work.thumbnailUrl} alt={work.title} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-xl font-bold text-center line-clamp-1 opacity-80">{work.title}</h3>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-end border-t border-white/10 pt-8">
                        <div>
                            <span className="text-4xl font-black tracking-tighter opacity-90">Numa<span className="text-white/40">Navi</span></span>
                            <p className="text-white/30 text-lg mt-1 tracking-widest uppercase">沼をナビゲートする、感性の一撃。</p>
                        </div>
                        <div className="text-right">
                            <p className="text-white/40 text-sm font-mono">https://numanavi.vercel.app</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
