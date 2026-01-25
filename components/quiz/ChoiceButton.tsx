'use client';

import { motion } from 'framer-motion';
import { Choice } from '@/types';
import { cn } from '@/lib/utils';

interface ChoiceButtonProps {
    choice: Choice;
    onSelect: (choice: Choice) => void;
    isSelected?: boolean;
}

export function ChoiceButton({ choice, onSelect, isSelected }: ChoiceButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onSelect(choice)}
            className={cn(
                "w-full p-4 rounded-xl border transition-all duration-300 text-left",
                "bg-white/10 backdrop-blur-md border-white/20 text-white shadow-xl",
                "hover:border-white/40 group",
                isSelected && "border-white/60 bg-white/20 ring-2 ring-white/30"
            )}
        >
            <div className="flex items-center justify-between">
                <span className="text-lg font-medium">{choice.label}</span>
                <motion.div
                    animate={{ x: isSelected ? 5 : 0 }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    →
                </motion.div>
            </div>
        </motion.button>
    );
}
