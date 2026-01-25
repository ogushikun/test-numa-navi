'use client';

import { motion } from 'framer-motion';
import { ColorProfile } from '@/types';
import { generateGradient } from '@/lib/color-engine';

interface BackgroundGradientProps {
    profiles: ColorProfile[];
}

export function BackgroundGradient({ profiles }: BackgroundGradientProps) {
    const gradientData = generateGradient(profiles);
    const texture = profiles[profiles.length - 1]?.texture;

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-[#050505]">
            {/* Base Dynamic Gradient */}
            <motion.div
                animate={{
                    background: gradientData.background,
                }}
                transition={{ duration: 2.0, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
            />

            {/* Surface Overlay / Grain Effect */}
            {texture === 'grain' && (
                <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
                    style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
            )}

            {/* Vignette Effect */}
            {texture === 'vignette' && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
            )}

            {/* Static Vignette for Depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />

            {/* Ambient Movement */}
            <motion.div
                animate={{
                    x: [0, 20, -20, 0],
                    y: [0, -20, 20, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute -inset-10 opacity-30 blur-3xl"
                style={{
                    background: gradientData.background, // Using same background for ambient movement for consistency
                }}
            />
        </div>
    );
}
