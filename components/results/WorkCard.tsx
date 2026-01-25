import { motion } from 'framer-motion';
import { Work } from '@/types';
import { Heart, Search, Sparkles } from 'lucide-react';

interface WorkCardProps {
    work: Work;
    index: number;
    onClickDive: (work: Work) => void;
    onClickPivot: (work: Work) => void;
    onClickDetails: (work: Work) => void;
}

export function WorkCard({ work, index, onClickDive, onClickPivot, onClickDetails }: WorkCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col transition-colors"
        >
            {/* Thumbnail Area - Click for DETAILS */}
            <div
                onClick={() => onClickDetails(work)}
                className="relative aspect-[16/9] w-full bg-white/5 overflow-hidden cursor-pointer"
            >
                <div className="absolute inset-0 flex items-center justify-center text-white/20 transition-all duration-700 group-hover:scale-105">
                    <img
                        src={work.thumbnailUrl}
                        alt={work.title}
                        className="w-full h-full object-cover opacity-50"
                    />
                </div>

                {/* Rating Badge */}
                <div className={index === 0 ? "absolute top-2 left-2 z-20 px-2 py-1 rounded bg-yellow-500/80 text-[10px] font-bold text-black" : "hidden"}>
                    ベストマッチ
                </div>
                <div className="absolute top-2 right-2 z-20 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white/80 border border-white/10">
                    {work.rating}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col gap-4 text-left pointer-events-none">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1 leading-tight">
                        {work.title}
                    </h3>
                    <p className="text-xs text-white/40 font-medium uppercase tracking-wider">
                        {work.media === 'anime' ? 'アニメ' : work.media === 'manga' ? '漫画' : 'ライトノベル'}
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-1.5 border-l-2 border-blue-500/50 pl-3">
                        <Sparkles className="w-3 h-3 text-blue-400 shrink-0" />
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">エージェントの推しポイント</span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed italic line-clamp-3 px-3">
                        &quot;{work.reason}&quot;
                    </p>
                </div>
            </div>

            {/* Footer Actions - Pointer Events On */}
            <div className="p-4 pt-0 mt-auto flex flex-col gap-2 pointer-events-auto">
                {/* Primary Action: Dive into this */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onClickDive(work)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-sm shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all"
                >
                    <Heart className="w-4 h-4 fill-white" />
                    これにNumaる
                </motion.button>

                {/* Secondary Action: Pivot */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onClickPivot(work)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white/80 text-xs font-bold hover:bg-white/20 hover:text-white transition-colors"
                >
                    <Search className="w-3 h-3" />
                    この方向性で他をNumaる
                </motion.button>
            </div>
        </motion.div>
    );
}
