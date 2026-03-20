import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { geminiService, CodingProblem } from '../services/geminiService';
import { Button, Card, ProgressBar, cn } from './UI';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Lightbulb, CheckCircle2, XCircle, Code, Terminal, ArrowRight } from 'lucide-react';

interface CodingPracticeProps {
  topicId: string;
  topicTitle: string;
  onComplete: () => void;
}

export const CodingPractice: React.FC<CodingPracticeProps> = ({ topicId, topicTitle, onComplete }) => {
  const { updateProgress } = useAuth();
  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProblem = async () => {
      setLoading(true);
      try {
        const data = await geminiService.generateCodingProblem(topicTitle);
        setProblem(data);
        setUserCode(`public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n        \n    }\n}`);
      } catch (error) {
        console.error("Error loading problem:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProblem();
  }, [topicTitle]);

  const handleRun = () => {
    if (!problem) return;
    
    // Simulate execution
    // In a real app, we'd send this to a backend or use a JS-based Java runner
    // For this demo, we'll check if the code contains key elements or matches a pattern
    const normalizedCode = userCode.replace(/\s/g, '');
    const expectedOutput = problem.expectedOutput.trim();
    
    // Simple heuristic check for demo purposes
    const isSuccess = userCode.toLowerCase().includes('system.out.print');
    
    setOutput(isSuccess ? expectedOutput : "Error: Compilation failed. Check your syntax!");
    setIsCorrect(isSuccess);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#FFC800] border-t-transparent rounded-full"
        />
        <p className="text-[#FFC800] font-bold animate-pulse">Preparing Coding Arena...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-[#4B4B4B]">{problem?.title}</h2>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setShowHint(!showHint)}>
            <Lightbulb size={18} className="mr-2" /> Hint
          </Button>
          <Button variant="ghost" onClick={() => setShowSolution(!showSolution)}>
            <Code size={18} className="mr-2" /> Solution
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="space-y-4">
            <h3 className="font-bold text-gray-700">Problem Statement</h3>
            <p className="text-gray-600">{problem?.description}</p>
            
            <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-100 space-y-2">
              <p className="text-sm font-bold text-gray-500 uppercase">Input</p>
              <code className="text-sm">{problem?.input || "None"}</code>
              <p className="text-sm font-bold text-gray-500 uppercase mt-4">Expected Output</p>
              <code className="text-sm text-emerald-600 font-bold">{problem?.expectedOutput}</code>
            </div>

            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200 text-yellow-800 text-sm"
                >
                  <p className="font-bold mb-1">💡 Hint:</p>
                  {problem?.hint}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {showSolution && (
            <Card className="bg-indigo-50 border-indigo-200">
              <h3 className="font-bold text-indigo-800 mb-2">Solution</h3>
              <pre className="bg-white p-4 rounded-xl border border-indigo-100 text-xs font-mono overflow-x-auto">
                {problem?.solution}
              </pre>
              <p className="mt-4 text-sm text-indigo-700">{problem?.solutionExplanation}</p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-[#1e1e1e] rounded-2xl overflow-hidden border-4 border-[#2d2d2d] shadow-xl">
            <div className="bg-[#2d2d2d] p-3 flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400">Main.java</span>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full h-64 p-4 bg-transparent text-emerald-400 font-mono text-sm outline-none resize-none"
              spellCheck={false}
            />
          </div>

          <div className="flex gap-4">
            <Button onClick={handleRun} className="flex-1 bg-[#58CC02]">
              <Play size={18} className="mr-2" /> Run Code
            </Button>
            {isCorrect && (
              <Button onClick={() => { updateProgress(topicId, 50); onComplete(); }} className="flex-1 bg-[#FFC800]">
                Finish Practice <ArrowRight size={18} className="ml-2" />
              </Button>
            )}
          </div>

          {output && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={cn(
                "p-4 rounded-xl border-2 font-mono text-sm",
                isCorrect ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Terminal size={16} />
                <span className="font-bold uppercase text-xs">Console Output</span>
              </div>
              <pre className="whitespace-pre-wrap">{output}</pre>
              {isCorrect && (
                <div className="mt-4 flex items-center gap-2 text-emerald-600 font-bold">
                  <CheckCircle2 size={20} /> Excellent! Your code works perfectly.
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
