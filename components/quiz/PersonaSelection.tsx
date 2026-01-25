'use client';

import { motion } from 'framer-motion';
import { Persona, PersonaId } from '@/types';
import { Users, Library, Zap, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export const PERSONAS: Persona[] = [
    {
        id: 'butler',
        name: '博識な執事',
        description: '迷える主に、間違いのない選択を。',
        color: 'from-slate-700 to-slate-900'
    },
    {
        id: 'curator',
        name: '静寂の司書',
        description: '行間を読む悦び、ご存知ですか？',
        color: 'from-emerald-800 to-teal-900'
    },
    {
        id: 'buddy',
        name: '熱血な相棒',
        description: '細かいことはいい！魂が燃えるやつ行こうぜ！',
        color: 'from-orange-600 to-red-700'
    },
    {
        id: 'devotee',
        name: '至純の信奉者',
        description: 'ただひたすらに、その関係性の「尊さ」を...',
        color: 'from-fuchsia-700 to-purple-900'
    }
];

const ICONS = {
    butler: Users,
    curator: Library,
    buddy: Zap,
    devotee: Heart,
};

interface PersonaSelectionProps {
    onSelect: (personaId: PersonaId) => void;
}

export function PersonaSelection({ onSelect }: PersonaSelectionProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-xl overflow-y-auto"
        >
            <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">
                        Choose Your Guide
                    </h1>
                    <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto">
                        あなたの「沼」への案内人をお選びください。<br className="hidden md:block" />
                        選んだパートナーによって、出会える作品の傾向が変化します。
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-4">
                    {PERSONAS.map((persona, index) => {
                        const Icon = ICONS[persona.id as keyof typeof ICONS];
                        return (
                            <motion.button
                                key={persona.id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                whileHover={{ scale: 1.03, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onSelect(persona.id)}
                                className={cn(
                                    "relative h-full min-h-[300px] flex flex-col items-center justify-between p-6 rounded-[2rem] border border-white/10 overflow-hidden group text-left",
                                    "hover:border-white/30 transition-all duration-300",
                                    "bg-gradient-to-br",
                                    persona.color
                                )}
                            >
                                {/* Background Glow */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="z-10 w-full flex flex-col items-center text-center h-full justify-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-xl">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">{persona.name}</h3>
                                        <p className="text-white/80 text-xs leading-relaxed font-medium">
                                            {persona.description}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                        <span className="px-4 py-2 rounded-full bg-white/20 text-white text-[10px] font-bold tracking-widest uppercase">
                                            Select
                                        </span>
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}
