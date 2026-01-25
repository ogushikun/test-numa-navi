'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { QUESTIONS } from '@/lib/questions';
import { BackgroundGradient } from '@/components/layout/BackgroundGradient';
import { ProgressIndicator } from '@/components/quiz/ProgressIndicator';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { ConfirmationStep } from '@/components/quiz/ConfirmationStep';
import { DynamicLoading } from '@/components/quiz/DynamicLoading';
import { WorkCard } from '@/components/results/WorkCard';
import { RefineOptions } from '@/components/results/RefineOptions';
import { PersonaSelection } from '@/components/quiz/PersonaSelection';
import { Choice, ColorProfile, UserAnswers, MediaType, Work, PersonaId } from '@/types';
import { getRecommendations, getPivotRecommendations } from '@/utils/recommendation';
import { ResultShareCard } from '@/components/results/ResultShareCard';
import { BestMatchModal } from '@/components/results/BestMatchModal';

import { AdjustmentModal } from '@/components/results/AdjustmentModal';
import { toPng } from 'html-to-image';
import { RefreshCcw, Frown } from 'lucide-react';
import { generateAdjustmentOptionsAction } from '@/app/actions';
import { generateSemanticProfile } from '@/utils/semantic-profile';

export default function Home() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaId | null>(null);
  // Replaced AgeGate: Persona selection acts as the gate
  const [status, setStatus] = useState<'quiz' | 'confirmation' | 'results'>('quiz');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);

  const [numaType, setNumaType] = useState<string>('');

  // Modal States
  const [viewingWork, setViewingWork] = useState<Work | null>(null); // Detail Modal
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false); // "None of Above" Modal

  const [showExtra, setShowExtra] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter questions based on media choice and depth level
  const activeQuestions = useMemo(() => {
    const selectedMedia = answers['q0'] as MediaType;
    const baseQuestions = QUESTIONS.slice(0, 7).filter(q => {
      if (!q.mediaSpecific) return true;
      return q.mediaSpecific === selectedMedia;
    });

    if (!showExtra) return baseQuestions;
    const extraQuestions = QUESTIONS.slice(7);
    return [...baseQuestions, ...extraQuestions];
  }, [answers, showExtra]);

  const currentQuestion = activeQuestions[currentStepIndex];

  const [recommendations, setRecommendations] = useState<(Work & { score: number })[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [refinementHistory, setRefinementHistory] = useState<string[]>([]);
  const [refinementTimestamp, setRefinementTimestamp] = useState<number>(0);

  const handleReset = () => {
    setStatus('quiz');
    setCurrentStepIndex(0);
    setAnswers({});
    setRefinementHistory([]);
    setRecommendations([]);
    setNumaType('');
    setViewingWork(null);
    setIsAdjustmentModalOpen(false);
    setShowExtra(false);
    setSelectedPersona(null); // Return to TOP (Persona Selection)
  };

  const shareCardRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (!shareCardRef.current) return;
    try {
      const dataUrl = await toPng(shareCardRef.current, { cacheBust: true, width: 1200, height: 630 });
      const link = document.createElement('a');
      link.download = `numanavi-result-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    }
  };

  const handleShareOnX = () => {
    const text = `私の沼タイプは【${numaType}】でした！\nあなたにぴったりの「沼」をナビゲートする NumaNavi\n`;
    const url = 'https://numanavi.vercel.app';
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=NumaNavi,沼ナビ`;
    window.open(twitterUrl, '_blank');
  };

  // Calculate recommendation results
  useEffect(() => {
    if (status !== 'results') return;

    const fetchRecommendations = async () => {
      setIsLoading(true);
      const userAnswers: UserAnswers = { media: answers['q0'] as MediaType, answers };
      const { works, numaType: resultType } = await getRecommendations(userAnswers, refinementHistory, selectedPersona || 'butler');
      setRecommendations(works);
      setNumaType(resultType);
      setIsLoading(false);
    };

    fetchRecommendations();
  }, [answers, status, refinementTimestamp]);

  // Calculate current color profiles for background
  const activeProfiles = useMemo(() => {
    return activeQuestions
      .slice(0, currentStepIndex + 1)
      .map(q => {
        const choiceId = answers[q.id];
        return q.choices.find(c => c.id === choiceId)?.colorProfile;
      })
      .filter((p): p is ColorProfile => !!p);
  }, [activeQuestions, currentStepIndex, answers]);

  const handleStart = () => setStatus('quiz');

  const handleSelect = (choice: Choice) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: choice.id }));

    if (isEditing) {
      setIsEditing(false);
      setStatus('confirmation');
      return;
    }

    if (currentStepIndex < activeQuestions.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setStatus('confirmation');
    }
  };

  const handleEdit = (questionId: string) => {
    const index = activeQuestions.findIndex(q => q.id === questionId);
    if (index !== -1) {
      setCurrentStepIndex(index);
      setIsEditing(true);
      setStatus('quiz');
    }
  };

  const handleConfirm = () => setStatus('results');

  const handleDeepDive = () => {
    setShowExtra(true);
    setCurrentStepIndex(7);
    setStatus('quiz');
  };



  const handleRefinedIntentSubmit = (intent: string) => {
    setRefinementHistory(prev => [...prev, intent]);
    setRefinementTimestamp(Date.now());
    setIsAdjustmentModalOpen(false);
  };

  // --- New Handlers for Dive/Pivot/Details ---

  const handleDive = (work: Work) => {
    // Primary action: Open the work's link and trigger celebration
    if (work.links[0]) {
      window.open(work.links[0].url, '_blank');
    }
    // TODO: Add celebration animation/SNS share prompt
    // For now, just open the link
  };

  const handlePivot = async (work: Work) => {
    setIsLoading(true);
    // Optimistic UI update
    setNumaType(`「${work.title}」の深淵へ...`);

    // Use the optimized "Swamp Expansion" pipeline
    // Pass current recommendation IDs to avoid duplicates
    const currentIds = recommendations.map(r => r.id);
    const { works, numaType: newNumaType } = await getPivotRecommendations(work, currentIds, selectedPersona || 'butler');

    setRecommendations(works);
    setNumaType(newNumaType);
    setIsLoading(false);

    // Add to history (for internal logic if needed, though we bypassed standard flow)
    setRefinementHistory(prev => [...prev, `Pivot: ${work.title}`]);
  };

  const handleDetailsClick = (work: Work) => {
    setViewingWork(work);
  };

  const handleAdjustmentGenerate = async (work: Work) => {
    const userAnswers: UserAnswers = { media: answers['q0'] as MediaType, answers };
    const latestIntent = refinementHistory[refinementHistory.length - 1] || '';
    const profile = generateSemanticProfile(userAnswers, latestIntent);
    return await generateAdjustmentOptionsAction(work, profile);
  };

  const handleAdjustmentApply = (work: Work, adjustment: string) => {
    const intent = `「${work.title}」に近いけど、${adjustment} してほしい`;
    handleRefinedIntentSubmit(intent);
  };



  if (!isMounted) return null;

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center py-12 px-4 select-none">
      <BackgroundGradient profiles={activeProfiles} />

      <AnimatePresence mode="wait">
        {!selectedPersona && (
          <PersonaSelection key="persona-selection" onSelect={(id) => setSelectedPersona(id)} />
        )}

        {selectedPersona && status === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <ProgressIndicator current={currentStepIndex + 1} total={activeQuestions.length} />
            <QuestionCard
              question={currentQuestion}
              onSelect={handleSelect}
              selectedId={answers[currentQuestion.id]}
              isAgeVerified={true} // Persona selection implies entry
            />
          </motion.div>
        )}

        {status === 'confirmation' && (
          <ConfirmationStep
            key="confirmation"
            userAnswers={{ media: answers['q0'] as MediaType, answers }}
            onEdit={handleEdit}
            onConfirm={() => setStatus('results')}
          />
        )}

        {status === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl mx-auto"
          >
            <div className="text-center mb-12 relative">
              <button
                onClick={handleReset}
                className="absolute -top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white/80 transition-all"
              >
                <RefreshCcw className="w-3 h-3" />
                もう一度Numaる
              </button>

              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                あなたにお勧めの沼
              </h2>
              <p className="text-white/60 text-lg">あなたに深く刺さるであろう作品を厳選しました。</p>
            </div>

            {isLoading ? (
              <DynamicLoading />
            ) : (
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                  {recommendations.map((work, i) => (
                    <WorkCard
                      key={work.id}
                      work={work}
                      index={i}
                      onClickDive={handleDive}
                      onClickPivot={handlePivot}
                      onClickDetails={handleDetailsClick}
                    />
                  ))}
                  {recommendations.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                      <p className="text-white/40 text-lg italic">条件に合う作品が見つかりませんでした。</p>
                    </div>
                  )}
                </div>

                {recommendations.length > 0 && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setIsAdjustmentModalOpen(true)}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs font-bold hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <Frown className="w-4 h-4" />
                      どれも違う...
                    </button>
                  </div>
                )}
              </div>
            )}

            {!isLoading && (
              <>
                <RefineOptions
                  onDeepDive={handleDeepDive}
                  onDownload={handleDownloadImage}
                  onShareX={handleShareOnX}
                />

                <div className="mt-20 pb-12 text-center">
                  <p className="text-white/20 text-[10px] uppercase tracking-[0.2em]">
                    Data provided by <a href="https://anilist.co" target="_blank" rel="noopener noreferrer" className="hover:text-white/40 underline underline-offset-4 transition-colors">AniList</a>
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {viewingWork && (
          <BestMatchModal
            isOpen={!!viewingWork}
            work={viewingWork}
            onClose={() => setViewingWork(null)}
          />
        )}

        {isAdjustmentModalOpen && (
          <AdjustmentModal
            isOpen={isAdjustmentModalOpen}
            works={recommendations}
            onClose={() => setIsAdjustmentModalOpen(false)}
            onGenerateOptions={handleAdjustmentGenerate}
            onApplyAdjustment={handleAdjustmentApply}
          />
        )}
      </AnimatePresence>



      <ResultShareCard
        numaType={numaType}
        recommendations={recommendations}
        profiles={activeProfiles}
        cardRef={shareCardRef}
      />

      {/* Visual grain overlay for premium feel */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
    </main>
  );
}
