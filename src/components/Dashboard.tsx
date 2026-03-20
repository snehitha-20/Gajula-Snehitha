import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { LEVELS, Topic } from '../types';
import { Button, Card, ProgressBar, cn } from './UI';
import { Lesson } from './Lesson';
import { CodingPractice } from './CodingPractice';
import { motion } from 'motion/react';
import { 
  Star, 
  Trophy, 
  User, 
  LogOut, 
  ChevronRight, 
  Lock, 
  CheckCircle,
  Terminal,
  Layers,
  Coffee,
  History,
  HelpCircle,
  Globe,
  Target,
  Layout,
  MessageSquare,
  Box,
  Code,
  ArrowLeftRight,
  Split,
  Repeat,
  Play,
  Hash,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Terminal, Layers, Coffee, History, HelpCircle, Globe, Target, Layout,
  MessageSquare, Box, Code, ArrowLeftRight, Split, Repeat,
  Play, Hash, CheckCircle2, RefreshCw
};

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);

  if (!user) return null;

  const isTopicUnlocked = (topic: Topic, levelIndex: number) => {
    if (levelIndex === 0) {
      const topicIndex = LEVELS[0].topics.findIndex(t => t.id === topic.id);
      if (topicIndex === 0) return true;
      const prevTopic = LEVELS[0].topics[topicIndex - 1];
      return user.completedTopics.includes(prevTopic.id);
    }
    
    // For higher levels, check if previous level is fully completed
    const prevLevel = LEVELS[levelIndex - 1];
    const prevLevelCompleted = prevLevel.topics.every(t => user.completedTopics.includes(t.id));
    
    if (!prevLevelCompleted) return false;
    
    const topicIndex = LEVELS[levelIndex].topics.findIndex(t => t.id === topic.id);
    if (topicIndex === 0) return true;
    const prevTopic = LEVELS[levelIndex].topics[topicIndex - 1];
    return user.completedTopics.includes(prevTopic.id);
  };

  if (activeTopic) {
    const onComplete = () => setActiveTopic(null);
    
    return (
      <div className="min-h-screen bg-white">
        <nav className="border-b p-4 flex items-center justify-between sticky top-0 bg-white z-10">
          <Button variant="ghost" onClick={() => setActiveTopic(null)}>
            Back to Path
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-yellow-500 font-bold">
              <Star size={20} fill="currentColor" /> {user.stars}
            </div>
          </div>
        </nav>
        <div className="py-8">
          {activeTopic.level === 'advanced' ? (
            <CodingPractice 
              topicId={activeTopic.id} 
              topicTitle={activeTopic.title} 
              onComplete={onComplete} 
            />
          ) : (
            <Lesson 
              topicId={activeTopic.id} 
              topicTitle={activeTopic.title} 
              onComplete={onComplete} 
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#58CC02] p-2 rounded-lg">
              <Coffee className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-display font-bold text-[#4B4B4B] hidden sm:block">Java Jungle</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-yellow-500 font-bold bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
              <Star size={18} fill="currentColor" /> {user.stars}
            </div>
            <div className="flex items-center gap-1.5 text-emerald-500 font-bold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <Trophy size={18} /> {user.totalScore}
            </div>
            <div className="relative group">
              <button className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <User size={18} />
                </div>
                <span className="font-bold text-sm text-gray-600 hidden sm:block">{user.username}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all">
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-2 p-2 text-red-500 hover:bg-red-50 rounded-lg font-bold text-sm"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {LEVELS.map((level, lIdx) => (
          <div key={level.id} className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gray-200" />
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">
                Level {level.id}: {level.name}
              </h2>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="flex flex-col items-center gap-8">
              {level.topics.map((topic, tIdx) => {
                const unlocked = isTopicUnlocked(topic, lIdx);
                const completed = user.completedTopics.includes(topic.id);
                const Icon = ICON_MAP[topic.icon] || Coffee;
                
                // Duolingo-style zig-zag
                const offset = Math.sin(tIdx * 0.8) * 60;

                return (
                  <motion.div
                    key={topic.id}
                    style={{ x: offset }}
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <div className="relative group">
                      <button
                        disabled={!unlocked}
                        onClick={() => setActiveTopic(topic as Topic)}
                        className={cn(
                          "progress-path-node",
                          completed ? "completed" : unlocked ? "active" : "locked"
                        )}
                      >
                        {unlocked ? <Icon size={32} /> : <Lock size={24} />}
                        
                        {/* Tooltip */}
                        <div className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <div className="bg-white border-2 border-gray-200 p-3 rounded-xl shadow-lg whitespace-nowrap">
                            <p className="font-bold text-gray-700">{topic.title}</p>
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                              {completed ? "Completed!" : unlocked ? "Start Lesson" : "Locked"}
                            </p>
                          </div>
                        </div>
                      </button>
                      
                      {completed && (
                        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-100">
                          <CheckCircle className="text-[#58CC02]" size={20} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 sm:hidden flex justify-around">
        <button className="text-[#1CB0F6] flex flex-col items-center gap-1">
          <Coffee size={24} />
          <span className="text-[10px] font-bold uppercase">Learn</span>
        </button>
        <button className="text-gray-400 flex flex-col items-center gap-1">
          <Trophy size={24} />
          <span className="text-[10px] font-bold uppercase">Leaderboard</span>
        </button>
        <button className="text-gray-400 flex flex-col items-center gap-1">
          <User size={24} />
          <span className="text-[10px] font-bold uppercase">Profile</span>
        </button>
      </div>
    </div>
  );
};
