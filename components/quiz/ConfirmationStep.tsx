'use client';

import { motion } from 'framer-motion';
import { Question, UserAnswers } from '@/types';
import { QUESTIONS } from '@/lib/questions';
import { cn } from '@/lib/utils';
import { Check, Edit2 } from 'lucide-react';

interface ConfirmationStepProps {
    userAnswers: UserAnswers;
    onEdit: (questionId: string) => void;
    onConfirm: () => void;
}

export function ConfirmationStep({ userAnswers, onEdit, onConfirm }: ConfirmationStepProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl mx-auto p-6 flex flex-col gap-8 bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl"
        >
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">回答の確認</h2>
                <p className="text-white/60 text-sm">こちらの内容でレコメンドを生成します。</p>
            </div>

            <div className="grid gap-3">
                {QUESTIONS.filter(q => {
                    // Filter out media-specific questions that weren't asked
                    if (q.mediaSpecific && q.mediaSpecific !== userAnswers.media) return false;
                    // Filter out questions that have no answer in userAnswers
                    if (!userAnswers.answers[q.id]) return false;
                    return true;
                }).map((question, index) => {
                    const answerId = userAnswers.answers[question.id];
                    const choice = question.choices.find(c => c.id === answerId);

                    return (
                        <button
                            key={question.id}
                            onClick={() => onEdit(question.id)}
                            className="group relative flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-all text-left"
                        >
                            <div>
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">
                                    Q{index + 1}: {question.text}
                                </span>
                                <span className="text-lg font-medium text-white">
                                    {choice?.label || '未選択'}
                                </span>
                            </div>
                            <Edit2 className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
                        </button>
                    );
                })}
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                className="mt-4 w-full py-4 rounded-2xl bg-white text-black font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-shadow flex items-center justify-center gap-2"
            >
                <Check className="w-5 h-5" />
                結果を見る
            </motion.button>
        </motion.div>
    );
}
