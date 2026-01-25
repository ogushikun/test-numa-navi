'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Question, Choice } from '@/types';
import { ChoiceButton } from './ChoiceButton';

interface QuestionCardProps {
    question: Question;
    onSelect: (choice: Choice) => void;
    selectedId?: string;
    isAgeVerified: boolean;
}

export function QuestionCard({ question, onSelect, selectedId, isAgeVerified }: QuestionCardProps) {
    const filteredChoices = question.choices.filter(choice => {
        if (choice.id === 'aggressive' && !isAgeVerified) return false;
        return true;
    });

    return (
        <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-lg mx-auto p-6 flex flex-col gap-8"
        >
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center leading-tight drop-shadow-md">
                {question.text}
            </h2>

            <div className="flex flex-col gap-3">
                {filteredChoices.map((choice) => (
                    <ChoiceButton
                        key={choice.id}
                        choice={choice}
                        isSelected={selectedId === choice.id}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        </motion.div>
    );
}
