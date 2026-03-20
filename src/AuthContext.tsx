import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProgress } from './types';

interface AuthContextType {
  user: UserProgress | null;
  login: (username: string) => void;
  logout: () => void;
  updateProgress: (topicId: string, score: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProgress | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('java_jungle_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string) => {
    const newUser: UserProgress = {
      username,
      totalScore: 0,
      stars: 0,
      completedTopics: [],
      currentLevel: 1,
      badges: []
    };
    setUser(newUser);
    localStorage.setItem('java_jungle_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('java_jungle_user');
  };

  const updateProgress = (topicId: string, score: number) => {
    if (!user) return;

    const newCompletedTopics = user.completedTopics.includes(topicId) 
      ? user.completedTopics 
      : [...user.completedTopics, topicId];
    
    const newUser = {
      ...user,
      totalScore: user.totalScore + score,
      stars: user.stars + Math.floor(score / 10),
      completedTopics: newCompletedTopics
    };

    setUser(newUser);
    localStorage.setItem('java_jungle_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProgress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
