import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { geminiService, TopicContent, MCQ } from '../services/geminiService';
import { Button, Card, ProgressBar, cn } from './UI';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Star, ArrowRight, Lightbulb } from 'lucide-react';

interface LessonProps {
  topicId: string;
  topicTitle: string;
  onComplete: () => void;
}

export const Lesson: React.FC<LessonProps> = ({ topicId, topicTitle, onComplete }) => {
  const { updateProgress } = useAuth();
  const [step, setStep] = useState<'explanation' | 'quiz'>('explanation');
  const [content, setContent] = useState<TopicContent | null>(null);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const [topicData, quizData] = await Promise.all([
          geminiService.generateTopicContent(topicTitle),
          geminiService.generateMCQs(topicTitle)
        ]);
        setContent(topicData);
        setMcqs(quizData);
      } catch (error) {
        console.error("Error loading lesson:", error);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [topicTitle]);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === mcqs[currentQuestion].correctAnswer) {
      setScore(s => s + 10);
    }
  };

  const nextStep = () => {
    if (step === 'explanation') {
      setStep('quiz');
    } else {
      if (currentQuestion < mcqs.length - 1) {
        setCurrentQuestion(q => q + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        updateProgress(topicId, score);
        onComplete();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#1CB0F6] border-t-transparent rounded-full"
        />
        <p className="text-[#1CB0F6] font-bold animate-pulse">Summoning Java Magic...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center space-y-2 flex-col">
        <ProgressBar progress={((step === 'explanation' ? 0 : currentQuestion + 1) / (mcqs.length + 1)) * 100} />
        <div className="flex justify-between w-full text-xs font-bold text-gray-400 uppercase tracking-widest">
          <span>{topicTitle}</span>
          <span>Score: {score} <Star className="inline text-yellow-400" size={14} /></span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'explanation' && content && (
          <motion.div
            key="explanation"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-6"
          >
            <Card className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-[#1CB0F6]">{content.title}</h2>
              
              <div className="space-y-4">
                <section>
                  <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <Lightbulb className="text-yellow-500" size={20} /> What is it?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{content.what}</p>
                </section>

                <section>
                  <h3 className="font-bold text-gray-700">Why do we need it?</h3>
                  <p className="text-gray-600 leading-relaxed">{content.why}</p>
                </section>

                <section>
                  <h3 className="font-bold text-gray-700">Where is it used?</h3>
                  <p className="text-gray-600 leading-relaxed">{content.where}</p>
                </section>

                <div className="bg-emerald-50 p-4 rounded-xl border-2 border-emerald-100">
                  <h3 className="font-bold text-emerald-700 mb-2">Example:</h3>
                  <p className="text-emerald-600 italic">"{content.example}"</p>
                </div>
              </div>

              <Button onClick={nextStep} className="w-full">
                I Understand! Let's Quiz <ArrowRight className="inline ml-2" size={20} />
              </Button>
            </Card>
          </motion.div>
        )}

        {step === 'quiz' && mcqs.length > 0 && (
          <motion.div
            key={`quiz-${currentQuestion}`}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-6"
          >
            <Card className="space-y-6">
              <h3 className="text-xl font-bold text-gray-700">
                Question {currentQuestion + 1} of {mcqs.length}
              </h3>
              <p className="text-lg text-gray-800 font-medium">
                {mcqs[currentQuestion].question}
              </p>

              <div className="grid gap-3">
                {mcqs[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered}
                    className={cn(
                      "p-4 text-left rounded-xl border-2 border-b-4 transition-all font-medium",
                      !isAnswered && "border-gray-200 hover:bg-gray-50 active:translate-y-1 active:border-b-0",
                      isAnswered && idx === mcqs[currentQuestion].correctAnswer && "bg-emerald-100 border-emerald-500 text-emerald-700",
                      isAnswered && selectedOption === idx && idx !== mcqs[currentQuestion].correctAnswer && "bg-red-100 border-red-500 text-red-700",
                      isAnswered && idx !== mcqs[currentQuestion].correctAnswer && selectedOption !== idx && "border-gray-100 text-gray-300"
                    )}
                  >
                    <span className="mr-3 text-gray-400">{String.fromCharCode(65 + idx)}.</span>
                    {option}
                  </button>
                ))}
              </div>

              {isAnswered && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={cn(
                    "p-4 rounded-xl flex items-start gap-3",
                    selectedOption === mcqs[currentQuestion].correctAnswer ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                  )}
                >
                  {selectedOption === mcqs[currentQuestion].correctAnswer ? (
                    <CheckCircle2 className="shrink-0" />
                  ) : (
                    <XCircle className="shrink-0" />
                  )}
                  <div>
                    <p className="font-bold">{selectedOption === mcqs[currentQuestion].correctAnswer ? "Correct!" : "Oops!"}</p>
                    <p className="text-sm opacity-90">{mcqs[currentQuestion].explanation}</p>
                  </div>
                </motion.div>
              )}

              {isAnswered && (
                <Button onClick={nextStep} className="w-full">
                  {currentQuestion < mcqs.length - 1 ? "Next Question" : "Finish Lesson"}
                </Button>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
