import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'duo-button-primary',
    secondary: 'duo-button-secondary',
    ghost: 'duo-button-ghost',
  };

  return (
    <button className={cn(variants[variant], className)} {...props} />
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('duo-card', className)}>
    {children}
  </div>
);

export const ProgressBar: React.FC<{ progress: number; color?: string }> = ({ progress, color = '#58CC02' }) => (
  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-200">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      className="h-full"
      style={{ backgroundColor: color }}
    />
  </div>
);
