import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Button, Card } from './UI';
import { Coffee, Rocket } from 'lucide-react';
import { motion } from 'motion/react';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1CB0F6]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <Card className="text-center space-y-6 p-8 border-none shadow-2xl">
          <div className="flex justify-center">
            <div className="bg-[#58CC02] p-4 rounded-full shadow-lg">
              <Coffee size={48} className="text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-bold text-[#4B4B4B]">Java Jungle</h1>
            <p className="text-gray-500">Start your coding adventure!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter your explorer name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-[#1CB0F6] outline-none transition-all text-lg font-medium"
              required
            />
            <Button type="submit" className="w-full text-lg py-4">
              Let's Go! <Rocket className="inline ml-2" size={20} />
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};
