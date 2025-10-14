import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Zap, Target } from 'lucide-react';

interface Stats {
  wpm: number;
  accuracy: number;
  progress: number;
}

const codeSnippets: string[] = [
  `const fibonacci = (n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};`,
  `const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};`,
  `const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  const clone = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    clone[key] = deepClone(obj[key]);
  }
  return clone;
};`,
  `const quickSort = (arr) => {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = arr.slice(1).filter(x => x < pivot);
  const right = arr.slice(1).filter(x => x >= pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
};`,
  `const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};`,
  `const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return { data, error: null, loading: false };
  } catch (error) {
    return { data: null, error: error.message, loading: false };
  }
};`,
  `const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};`
];

export default function TypingPractice(): JSX.Element {
  const [currentSnippet, setCurrentSnippet] = useState<string>(codeSnippets[0]);
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (userInput.length > 0 && !startTime) {
      setStartTime(Date.now());
    }

    if (userInput.length > 0) {
      const timeElapsed: number = (Date.now() - (startTime || Date.now())) / 1000 / 60;
      const wordsTyped: number = userInput.length / 5;
      const currentWpm: number = Math.round(wordsTyped / (timeElapsed || 0.01));
      setWpm(currentWpm);

      let correctChars: number = 0;
      for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === currentSnippet[i]) {
          correctChars++;
        }
      }
      const currentAccuracy: number = Math.round((correctChars / userInput.length) * 100);
      setAccuracy(currentAccuracy);

      if (userInput === currentSnippet) {
        setIsComplete(true);
      }
    }
  }, [userInput, startTime, currentSnippet]);

  const handleReset = (): void => {
    const randomSnippet: string = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    setCurrentSnippet(randomSnippet);
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsComplete(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const renderCode = (): JSX.Element[] => {
    return currentSnippet.split('').map((char: string, index: number) => {
      let className: string = 'text-gray-400';
      
      if (index < userInput.length) {
        className = userInput[index] === char ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10';
      } else if (index === userInput.length) {
        className = 'text-gray-300 border-l-2 border-blue-500 animate-pulse';
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  const progress: number = Math.round((userInput.length / currentSnippet.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            JS Code Typing
          </h1>
          <p className="text-gray-400">Master JavaScript while improving your typing speed</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="text-yellow-400" size={20} />
              <span className="text-gray-400 text-sm">Speed</span>
            </div>
            <div className="text-3xl font-bold text-white">{wpm}</div>
            <div className="text-xs text-gray-500">WPM</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-green-400" size={20} />
              <span className="text-gray-400 text-sm">Accuracy</span>
            </div>
            <div className="text-3xl font-bold text-white">{accuracy}%</div>
            <div className="text-xs text-gray-500">Correct</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400 text-sm">Progress</span>
            </div>
            <div className="text-3xl font-bold text-white">{progress}%</div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
        </div>

        {isComplete && (
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/50 rounded-xl p-6 mb-6 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <div className="text-xl font-bold text-white mb-1">Awesome Job!</div>
            <div className="text-gray-300">
              You completed the snippet at {wpm} WPM with {accuracy}% accuracy!
            </div>
          </div>
        )}

        <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 mb-4 shadow-2xl">
          <div className="font-mono text-lg leading-relaxed mb-6 whitespace-pre-wrap">
            {renderCode()}
          </div>
          
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUserInput(e.target.value)}
            className="w-full bg-gray-900/50 text-white font-mono text-lg p-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            rows={6}
            placeholder="Start typing the code above..."
            disabled={isComplete}
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            <RotateCcw size={20} />
            New Code Snippet
          </button>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Press the button to get a new JavaScript snippet</p>
        </div>
      </div>
    </div>
  );
}