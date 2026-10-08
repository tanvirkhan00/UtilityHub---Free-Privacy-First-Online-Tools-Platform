import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Gamepad2, 
  Flame, 
  Trophy, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Keyboard, 
  Clock, 
  Heart, 
  Sparkles, 
  Zap, 
  Share2, 
  Check, 
  Timer,
  Code2,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Word libraries
const COMMON_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he',
  'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about',
  'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
  'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two',
  'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give',
  'day', 'most', 'us', 'great', 'world', 'learn', 'speed', 'focus', 'power', 'dream', 'light', 'clean',
  'smart', 'swift', 'quick', 'ninja', 'rapid', 'turbo', 'spark', 'flame', 'quest', 'react', 'code', 'logic'
];

const CODE_WORDS = [
  'const', 'let', 'function', 'return', 'import', 'export', 'default', 'async', 'await', 'promise',
  'boolean', 'string', 'number', 'array', 'object', 'map', 'filter', 'reduce', 'foreach', 'useState',
  'useEffect', 'useCallback', 'useMemo', 'interface', 'class', 'constructor', 'extends', 'super',
  'try', 'catch', 'finally', 'throw', 'console.log', 'undefined', 'null', 'typeof', 'instanceof',
  'JSON.stringify', 'document.getElementById', 'addEventListener', 'localStorage', 'window.location'
];

const QUOTES = [
  'Practice does not make perfect. Only perfect practice makes perfect keyboard typing mastery.',
  'Speed comes from deliberate practice, smooth rhythm, and keeping your eyes glued to the screen.',
  'The keyboard is an extension of thought. Fast fingers free your mind to focus on high-level logic.',
  'Consistency builds muscle memory. Hit every key with intention and the velocity will follow.',
  'Great coders and writers do not just think fast, they translate ideas into characters with zero friction.'
];

type GameMode = 'arcade' | 'sprint' | 'code' | 'quote';
type TimeDuration = 15 | 30 | 60;

interface FallingWord {
  id: string;
  text: string;
  x: number;       // percentage 5% to 85%
  y: number;       // percentage 0% to 100%
  speed: number;   // fall speed
}

export const TypingSpeedGame: React.FC = () => {
  const [mode, setMode] = useState<GameMode>('sprint');
  const [duration, setDuration] = useState<TimeDuration>(30);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showKeyboard, setShowKeyboard] = useState<boolean>(true);

  // Sprint / Quote / Code states
  const [targetText, setTargetText] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [currentWpm, setCurrentWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [activeKey, setActiveKey] = useState<string>('');

  // Arcade (Falling Words) mode states
  const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);
  const [arcadeScore, setArcadeScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [arcadeInput, setArcadeInput] = useState<string>('');
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('utilityhub_typing_highscore') || '0', 10);
  });
  const [bestWpm, setBestWpm] = useState<number>(() => {
    return parseInt(localStorage.getItem('utilityhub_typing_best_wpm') || '0', 10);
  });

  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<any>(null);
  const arcadeAnimationRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio Context for realistic zero-latency key clicks
  const playKeySound = (type: 'press' | 'error' | 'success') => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'press') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450 + Math.random() * 80, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {
      // Audio not permitted yet
    }
  };

  // Generate text for Sprint / Code / Quote
  const generateNewTest = useCallback(() => {
    setUserInput('');
    setStartTime(null);
    setIsGameOver(false);
    setCurrentWpm(0);
    setAccuracy(100);
    setStreak(0);
    setTotalErrors(0);
    setTimeLeft(duration);

    if (mode === 'sprint') {
      const shuffled = [...COMMON_WORDS].sort(() => 0.5 - Math.random());
      setTargetText(shuffled.slice(0, 50).join(' '));
    } else if (mode === 'code') {
      const shuffled = [...CODE_WORDS].sort(() => 0.5 - Math.random());
      setTargetText(shuffled.slice(0, 35).join(' '));
    } else if (mode === 'quote') {
      const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      setTargetText(q);
    } else if (mode === 'arcade') {
      setFallingWords([]);
      setArcadeScore(0);
      setLives(3);
      setArcadeInput('');
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [mode, duration]);

  useEffect(() => {
    generateNewTest();
  }, [generateNewTest]);

  // Sprint Timer Countdown
  useEffect(() => {
    if (startTime && !isGameOver && mode !== 'arcade') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [startTime, isGameOver, mode]);

  // Finish game calculation
  const finishGame = () => {
    setIsGameOver(true);
    playKeySound('success');
    confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });

    // Update best WPM
    if (currentWpm > bestWpm) {
      setBestWpm(currentWpm);
      localStorage.setItem('utilityhub_typing_best_wpm', currentWpm.toString());
    }
  };

  // Handle typing input for Sprint / Code / Quote
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isGameOver) return;
    const value = e.target.value;

    // Start timer on first keystroke
    if (!startTime) {
      setStartTime(Date.now());
    }

    // Play switch click
    playKeySound('press');

    // Check accuracy & errors
    const lastCharIndex = value.length - 1;
    if (lastCharIndex >= 0) {
      const typedChar = value[lastCharIndex];
      const targetChar = targetText[lastCharIndex];

      if (typedChar === targetChar) {
        setStreak((prev) => {
          const next = prev + 1;
          if (next > maxStreak) setMaxStreak(next);
          return next;
        });
      } else {
        setStreak(0);
        setTotalErrors((prev) => prev + 1);
        playKeySound('error');
      }
    }

    setUserInput(value);

    // Calculate real-time WPM
    const elapsedMinutes = startTime ? (Date.now() - startTime) / 60000 : 0.01;
    let correctChars = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === targetText[i]) correctChars++;
    }
    const calculatedWpm = Math.max(0, Math.round((correctChars / 5) / (elapsedMinutes || 0.01)));
    setCurrentWpm(calculatedWpm);

    const calculatedAcc = value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100;
    setAccuracy(calculatedAcc);

    // If user completed full target text
    if (value.length >= targetText.length) {
      finishGame();
    }
  };

  // Arcade Mode: Spawn & Animate falling words
  useEffect(() => {
    if (mode !== 'arcade' || isGameOver) return;

    // Spawner interval
    const spawnInterval = setInterval(() => {
      setFallingWords((prev) => {
        if (prev.length >= 7) return prev;
        const randomWord = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
        const newWord: FallingWord = {
          id: Math.random().toString(36).substring(2, 9),
          text: randomWord,
          x: Math.floor(Math.random() * 75) + 5,
          y: 0,
          speed: 0.35 + Math.random() * 0.3,
        };
        return [...prev, newWord];
      });
    }, 1800);

    // Animation frame loop
    let lastTime = performance.now();
    const updateFalling = (now: number) => {
      const dt = (now - lastTime) / 16;
      lastTime = now;

      setFallingWords((prev) => {
        const nextWords: FallingWord[] = [];
        let lostLife = false;

        for (const w of prev) {
          const nextY = w.y + w.speed * dt;
          if (nextY >= 92) {
            // Hit bottom!
            lostLife = true;
          } else {
            nextWords.push({ ...w, y: nextY });
          }
        }

        if (lostLife) {
          playKeySound('error');
          setLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setIsGameOver(true);
            }
            return Math.max(0, nextL);
          });
        }

        return nextWords;
      });

      if (!isGameOver) {
        arcadeAnimationRef.current = requestAnimationFrame(updateFalling);
      }
    };

    arcadeAnimationRef.current = requestAnimationFrame(updateFalling);

    return () => {
      clearInterval(spawnInterval);
      cancelAnimationFrame(arcadeAnimationRef.current);
    };
  }, [mode, isGameOver]);

  // Handle Arcade word matching
  const handleArcadeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGameOver || !arcadeInput.trim()) return;

    const trimmed = arcadeInput.trim().toLowerCase();
    const matchIndex = fallingWords.findIndex((w) => w.text.toLowerCase() === trimmed);

    if (matchIndex !== -1) {
      playKeySound('success');
      const earned = Math.round(trimmed.length * 10 * (1 + streak * 0.1));
      setArcadeScore((s) => {
        const updated = s + earned;
        if (updated > highScore) {
          setHighScore(updated);
          localStorage.setItem('utilityhub_typing_highscore', updated.toString());
        }
        return updated;
      });
      setStreak((st) => st + 1);

      // Remove exploded word
      setFallingWords((prev) => prev.filter((_, idx) => idx !== matchIndex));
      setArcadeInput('');
    } else {
      playKeySound('error');
      setStreak(0);
    }
  };

  // Keyboard visualizer keys
  const KEYBOARD_ROWS = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'Space']
  ];

  const getRankBadge = (wpm: number) => {
    if (wpm >= 110) return { title: 'Typing God', emoji: '👑', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (wpm >= 90) return { title: 'Lightning', emoji: '⚡', color: 'text-violet-400 bg-violet-500/10 border-violet-500/30' };
    if (wpm >= 70) return { title: 'Sonic Jet', emoji: '🚀', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' };
    if (wpm >= 50) return { title: 'Road Racer', emoji: '🏎️', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (wpm >= 30) return { title: 'Steady Runner', emoji: '🏃', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    return { title: 'Novice Turtle', emoji: '🐢', color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' };
  };

  const rank = getRankBadge(currentWpm);

  const nextTargetChar = targetText[userInput.length]?.toLowerCase() || '';

  const shareScore = () => {
    const text = `🎮 I just scored ${currentWpm} WPM with ${accuracy}% accuracy on UtilityHub Typing Speed Hero! Rank: ${rank.emoji} ${rank.title}. Can you beat me?`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Mode Controls */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white shadow-xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 font-black text-xl">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white">
                  TypeRush: Keyboard Speed Hero
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950 tracking-wider">
                  Interactive Game
                </span>
              </div>
              <p className="text-xs text-indigo-200/80">
                Play, level up your WPM, and train keyboard dexterity with real-time stats & arcade challenges
              </p>
            </div>
          </div>

          {/* Quick Settings */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-indigo-600/60 border-indigo-500/60 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="Toggle Mechanical Key Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Audio ON' : 'Muted'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowKeyboard(!showKeyboard)}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showKeyboard
                  ? 'bg-indigo-600/60 border-indigo-500/60 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="Toggle On-Screen Keyboard"
            >
              <Keyboard className="w-4 h-4 text-indigo-300" />
              <span className="hidden sm:inline">Keyboard</span>
            </button>
          </div>

        </div>

        {/* Mode Selector Tabs */}
        <div className="relative z-10 pt-5 flex flex-wrap items-center justify-between gap-3 border-t border-indigo-500/20 mt-4">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/80 border border-slate-800">
            {[
              { id: 'sprint', label: 'Speed Sprint', icon: Zap },
              { id: 'arcade', label: 'Arcade Fall', icon: Gamepad2 },
              { id: 'code', label: 'Code Ninja', icon: Code2 },
              { id: 'quote', label: 'Proverb Quotes', icon: BookOpen },
            ].map((m) => {
              const isSelected = mode === m.id;
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMode(m.id as GameMode);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Time Duration Selector (for sprint/code) */}
          {mode !== 'arcade' && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 mr-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Duration:
              </span>
              {[15, 30, 60].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setDuration(t as TimeDuration);
                    setTimeLeft(t);
                    generateNewTest();
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-colors cursor-pointer ${
                    duration === t
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {t}s
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Game Arena */}
      {mode === 'arcade' ? (
        /* Arcade Mode: Falling Words Defense */
        <div className="space-y-4">
          {/* Arcade Stats Header */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 uppercase font-bold">Health:</span>
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-5 h-5 transition-transform ${
                        i < lives ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 uppercase font-bold block">Score:</span>
                <span className="text-lg font-black font-mono text-indigo-600 dark:text-indigo-400">
                  {arcadeScore} pts
                </span>
              </div>

              {streak > 1 && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/30 text-xs font-bold animate-bounce">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{streak}x Combo!</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">High Score</span>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  🏆 {highScore} pts
                </span>
              </div>
              <button
                type="button"
                onClick={generateNewTest}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                title="Restart Arcade"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Fall Canvas Viewport */}
          <div className="relative w-full h-[400px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
            {/* Stars background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#4338ca_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>

            {/* Red Danger Laser Line */}
            <div className="absolute bottom-6 left-0 right-0 h-1 bg-gradient-to-r from-rose-500/10 via-rose-500 to-rose-500/10 shadow-[0_0_12px_rgba(244,63,94,0.8)] z-10">
              <span className="absolute -top-4 right-4 text-[10px] font-mono text-rose-400 uppercase tracking-wider">
                Laser Danger Zone
              </span>
            </div>

            {/* Falling Word Badges */}
            {fallingWords.map((word) => (
              <div
                key={word.id}
                className="absolute px-3 py-1.5 rounded-xl font-mono font-bold text-sm bg-gradient-to-b from-indigo-500 to-violet-700 text-white shadow-lg border border-indigo-400/40 transform -translate-x-1/2 transition-all"
                style={{
                  left: `${word.x}%`,
                  top: `${word.y}%`,
                }}
              >
                {word.text}
              </div>
            ))}

            {/* Game Over Screen Overlay */}
            {isGameOver && (
              <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center text-3xl">
                  💔
                </div>
                <h3 className="text-2xl font-black text-white">Arcade Round Complete!</h3>
                <p className="text-sm text-slate-300">
                  Final Score: <span className="font-bold text-amber-400">{arcadeScore} points</span>
                  {arcadeScore >= highScore && arcadeScore > 0 && ' (New Personal Best! 🎉)'}
                </p>
                <button
                  type="button"
                  onClick={generateNewTest}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-sm shadow-lg hover:scale-105 transition-transform cursor-pointer"
                >
                  Play Arcade Again
                </button>
              </div>
            )}
          </div>

          {/* Arcade Shooter Input */}
          <form onSubmit={handleArcadeSubmit} className="relative">
            <input
              type="text"
              autoFocus
              value={arcadeInput}
              onChange={(e) => {
                setArcadeInput(e.target.value);
                playKeySound('press');
              }}
              placeholder="Type matching falling word and press Enter / Space..."
              className="w-full px-5 py-4 text-base font-mono rounded-2xl border-2 border-indigo-500/50 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-lg focus:outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 cursor-pointer shadow-xs"
            >
              Zap Word
            </button>
          </form>
        </div>
      ) : (
        /* Sprint / Code / Quote Mode */
        <div className="space-y-6">
          
          {/* Real-time Dashboard Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs">
            
            {/* WPM */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Speed
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {currentWpm}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">WPM</span>
                </div>
              </div>
            </div>

            {/* Accuracy */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Accuracy
                </span>
                <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {accuracy}%
                </span>
              </div>
            </div>

            {/* Time Left */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Time Left
                </span>
                <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Streak Combo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Streak
                </span>
                <span className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
                  {streak}x
                </span>
              </div>
            </div>

          </div>

          {/* Interactive Words Display Box */}
          <div
            onClick={() => inputRef.current?.focus()}
            className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl cursor-text relative overflow-hidden select-none min-h-[160px] flex flex-col justify-center"
          >
            <div className="text-lg sm:text-2xl font-mono leading-relaxed tracking-wider">
              {targetText.split('').map((char, index) => {
                let colorClass = 'text-slate-500';
                let isCurrent = index === userInput.length;

                if (index < userInput.length) {
                  if (userInput[index] === char) {
                    colorClass = 'text-emerald-400';
                  } else {
                    colorClass = 'text-rose-400 bg-rose-950/50 rounded-xs underline decoration-rose-500 decoration-2';
                  }
                }

                return (
                  <span
                    key={index}
                    className={`relative transition-colors duration-75 ${colorClass} ${
                      isCurrent ? 'border-b-4 border-indigo-400 animate-pulse text-white font-bold' : ''
                    }`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Hidden Input field capturing keystrokes */}
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={(e) => setActiveKey(e.key.toLowerCase())}
              onKeyUp={() => setActiveKey('')}
              className="opacity-0 absolute inset-0 cursor-default"
              autoFocus
            />

            {!startTime && !isGameOver && (
              <div className="absolute bottom-3 right-5 text-xs text-indigo-300/80 font-mono flex items-center gap-1.5 animate-pulse">
                <span>Start typing to begin timer...</span>
              </div>
            )}
          </div>

          {/* Post-Game Completion Score Card */}
          {isGameOver && (
            <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-2 border-indigo-500/40 shadow-2xl text-white space-y-6 animate-in zoom-in-95 duration-200">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-6">
                <div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${rank.color} mb-2`}>
                    <span>{rank.emoji}</span>
                    <span>Tier: {rank.title}</span>
                  </div>
                  <h3 className="text-3xl font-black text-white">
                    Typing Sprint Completed!
                  </h3>
                  <p className="text-xs text-indigo-200">
                    Outstanding rhythm. Here is your verified typing metrics breakdown.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={shareScore}
                    className="px-4 py-2.5 rounded-xl border border-indigo-400/40 bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                    <span>{copiedShare ? 'Copied to Clipboard!' : 'Share Result'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={generateNewTest}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-transform"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Play Again</span>
                  </button>
                </div>
              </div>

              {/* Detailed Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] text-slate-400 uppercase block">Net Speed</span>
                  <span className="text-3xl font-black text-amber-400">{currentWpm}</span>
                  <span className="text-xs text-slate-400 block">WPM</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] text-slate-400 uppercase block">Accuracy</span>
                  <span className="text-3xl font-black text-emerald-400">{accuracy}%</span>
                  <span className="text-xs text-slate-400 block">Precision</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] text-slate-400 uppercase block">Max Combo</span>
                  <span className="text-3xl font-black text-rose-400">{maxStreak}</span>
                  <span className="text-xs text-slate-400 block">Consecutive</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] text-slate-400 uppercase block">Best Ever</span>
                  <span className="text-3xl font-black text-indigo-400">
                    {Math.max(currentWpm, bestWpm)}
                  </span>
                  <span className="text-xs text-slate-400 block">Record WPM</span>
                </div>
              </div>

            </div>
          )}

          {/* Virtual Mechanical Keyboard Visualizer */}
          {showKeyboard && !isGameOver && (
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-2 select-none">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-1">
                <span>Mechanical Keyboard Visualizer</span>
                <span className="text-indigo-400 font-bold">
                  Next Key: <span className="underline uppercase">{nextTargetChar === ' ' ? 'SPACEBAR' : nextTargetChar}</span>
                </span>
              </div>

              <div className="space-y-1.5 flex flex-col items-center">
                {KEYBOARD_ROWS.map((row, rIdx) => (
                  <div key={rIdx} className="flex gap-1.5 justify-center w-full">
                    {row.map((k) => {
                      const isNext = (k === 'Space' && nextTargetChar === ' ') || k === nextTargetChar;
                      const isPressed = (k === 'Space' && activeKey === ' ') || k === activeKey;

                      return (
                        <div
                          key={k}
                          className={`h-10 rounded-xl font-mono text-xs font-bold flex items-center justify-center transition-all ${
                            k === 'Space' ? 'w-48 sm:w-64' : 'w-8 sm:w-10'
                          } ${
                            isPressed
                              ? 'bg-amber-400 text-slate-950 scale-95 shadow-md shadow-amber-400/30'
                              : isNext
                              ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-md animate-pulse'
                              : 'bg-slate-800 text-slate-300 border border-slate-700/80'
                          }`}
                        >
                          {k.toUpperCase()}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
