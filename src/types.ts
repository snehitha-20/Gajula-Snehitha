export interface UserProgress {
  username: string;
  totalScore: number;
  stars: number;
  completedTopics: string[]; // IDs of completed topics
  currentLevel: number;
  badges: string[];
}

export interface Topic {
  id: string;
  title: string;
  level: 'basic' | 'intermediate' | 'advanced';
  icon: string;
}

export const LEVELS: { id: number; name: string; topics: Topic[] }[] = [
  {
    id: 1,
    name: "Foundation",
    topics: [
      { id: 'prog-intro', title: "What is a Program?", level: 'basic', icon: 'Terminal' },
      { id: 'soft-intro', title: "What is Software?", level: 'basic', icon: 'Layers' },
      { id: 'java-intro', title: "What is Java?", level: 'basic', icon: 'Coffee' },
      { id: 'java-history', title: "Who developed Java?", level: 'basic', icon: 'History' },
      { id: 'java-why', title: "Why Java?", level: 'basic', icon: 'HelpCircle' },
      { id: 'java-usage', title: "Where is Java used?", level: 'basic', icon: 'Globe' },
      { id: 'java-purpose', title: "Purpose of Java", level: 'basic', icon: 'Target' },
      { id: 'java-structure', title: "Basic Structure", level: 'basic', icon: 'Layout' },
    ]
  },
  {
    id: 2,
    name: "Intermediate",
    topics: [
      { id: 'hello-world', title: "Hello World", level: 'intermediate', icon: 'MessageSquare' },
      { id: 'variables', title: "Variables", level: 'intermediate', icon: 'Box' },
      { id: 'syntax', title: "Basic Syntax", level: 'intermediate', icon: 'Code' },
      { id: 'io', title: "Input/Output", level: 'intermediate', icon: 'ArrowLeftRight' },
      { id: 'if-else', title: "If-Else", level: 'intermediate', icon: 'Split' },
      { id: 'loops', title: "Loops", level: 'intermediate', icon: 'Repeat' },
    ]
  },
  {
    id: 3,
    name: "Advanced",
    topics: [
      { id: 'coding-hello', title: "Hello World Practice", level: 'advanced', icon: 'Play' },
      { id: 'coding-numbers', title: "Print Numbers", level: 'advanced', icon: 'Hash' },
      { id: 'coding-conditions', title: "Basic Conditions", level: 'advanced', icon: 'CheckCircle' },
      { id: 'coding-loops', title: "Simple Loops", level: 'advanced', icon: 'RefreshCw' },
    ]
  }
];
