'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface AgeGateProps {
    onConfirm: (is18: boolean) => void;
}

export function AgeGate({ onConfirm }: AgeGateProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl"
        >
            <div className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-[2.5rem] flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-8">
                    <ShieldCheck className="w-10 h-10 text-yellow-500" />
                </div>

                <h1 className="text-3xl font-black text-white mb-4 tracking-tight">Age Verification</h1>

                <p className="text-white/60 mb-10 leading-relaxed text-sm">
                    本サービスには成人向け（R18）のコンテンツが含まれる場合があります。<br />
                    あなたは18歳以上ですか？
                </p>

                <div className="flex flex-col w-full gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,1)', color: '#000' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onConfirm(true)}
                        className="w-full py-5 rounded-full bg-white text-black font-bold text-lg transition-colors"
                    >
                        はい、18歳以上です
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onConfirm(false)}
                        className="w-full py-5 rounded-full bg-transparent border border-white/10 text-white/40 font-bold"
                    >
                        いいえ（18歳未満です）
                    </motion.button>
                </div>

                <div className="mt-8 flex items-start gap-2 text-left">
                    <AlertTriangle className="w-4 h-4 text-white/20 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-white/20 leading-tight">
                        ※このアプリはアフィリエイトリンクを含みます。正規の販売・配信サイトへのみ誘導しますが、ご利用は自己責任でお願いします。
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
