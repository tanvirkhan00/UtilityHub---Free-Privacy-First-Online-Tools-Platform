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
  Sparkles, 
  Zap, 
  Share2, 
  Check, 
  Timer, 
  Code2, 
  BookOpen, 
  ArrowRight, 
  Flag, 
  Gauge, 
  Rocket, 
  Shield, 
  Crosshair, 
  Award, 
  ChevronRight,
  Plane,
  Compass,
  Wind,
  ArrowUp,
  AlertTriangle,
  Cloud,
  Sun,
  Feather,
  Star,
  Activity
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

const SKY_WORDS = [
  'cloud', 'sky', 'float', 'glide', 'soar', 'breeze', 'altitude', 'pilot', 'horizon', 'wings', 
  'flight', 'wind', 'thermal', 'lift', 'updraft', 'air', 'feather', 'eagle', 'falcon', 'climb', 
  'strato', 'space', 'zenith', 'aero', 'drifter', 'beacon', 'current', 'stream', 'rocket', 'balloon',
  'voyage', 'sailor', 'gravity', 'thrust', 'glider', 'soaring', 'azure', 'celestial', 'beacon', 'orbit'
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

const SPACE_INVADERS_WORDS = [
  'star', 'laser', 'orbit', 'galaxy', 'rocket', 'blaster', 'comet', 'warp',
  'shield', 'planet', 'cosmic', 'plasma', 'pulsar', 'meteor', 'vortex', 'solar',
  'thrust', 'hyper', 'nebula', 'sensor', 'photon', 'lunar', 'radar', 'space'
];

type GameMode = 'racer' | 'sky' | 'space' | 'sprint' | 'code' | 'quote';
type TimeDuration = 15 | 30 | 60;
type RaceDifficulty = 'rookie' | 'pro' | 'legend';
type SkyGravity = 'gentle' | 'normal' | 'storm';
type SkyFlyer = 'glider' | 'balloon' | 'rocket' | 'falcon' | 'ufo';

interface Racer {
  id: string;
  name: string;
  car: string;
  color: string;
  wpm: number;
  progress: number; // 0 to 100
  isPlayer: boolean;
}

interface SpaceTarget {
  id: string;
  word: string;
  x: number; // percentage across lane (e.g., 15, 38, 62, 85)
  progress: number; // 0 (top/deep space) to 100 (danger zone)
  destroyed: boolean;
  type: 'drone' | 'asteroid' | 'cruiser';
}

interface SkyFlyerOption {
  id: SkyFlyer;
  name: string;
  icon: string;
  desc: string;
}

const SKY_FLYERS: SkyFlyerOption[] = [
  { id: 'glider', name: 'Sky Paraglider', icon: '🪂', desc: 'Aerodynamic glide with lift cushions' },
  { id: 'balloon', name: 'Hot Air Balloon', icon: '🎈', desc: 'Classic thermal air floater' },
  { id: 'rocket', name: 'Aero Jetpack', icon: '🚀', desc: 'High-thrust dual turbo exhausts' },
  { id: 'falcon', name: 'Golden Falcon', icon: '🦅', desc: 'Majestic bird soaring on updrafts' },
  { id: 'ufo', name: 'Anti-Gravity Drone', icon: '🛸', desc: 'Futuristic magnetic levitation craft' },
];

export const TypingSpeedGame: React.FC = () => {
  const [mode, setMode] = useState<GameMode>('sky'); // Default to newly requested Sky Altitude Floater
  const [duration, setDuration] = useState<TimeDuration>(30);
  const [raceDifficulty, setRaceDifficulty] = useState<RaceDifficulty>('pro');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showKeyboard, setShowKeyboard] = useState<boolean>(true);

  // Common typing states
  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [currentWpm, setCurrentWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [activeKey, setActiveKey] = useState<string>('');
  const [nitroActive, setNitroActive] = useState<boolean>(false);

  // CUSTOM SKY ALTITUDE FLOATER STATES
  const [skyAltitudePct, setSkyAltitudePct] = useState<number>(55); // 0 (ground) to 100 (high stratosphere)
  const [skyAltitudeMeters, setSkyAltitudeMeters] = useState<number>(550);
  const [skyMaxAltitude, setSkyMaxAltitude] = useState<number>(550);
  const [skyClimbRate, setSkyClimbRate] = useState<number>(0); // m/s climbing or falling
  const [skyChutesLeft, setSkyChutesLeft] = useState<number>(3); // 3 emergency cushions
  const [skyGravity, setSkyGravity] = useState<SkyGravity>('normal');
  const [skyFlyer, setSkyFlyer] = useState<SkyFlyer>('glider');
  const [isSkyBoosting, setIsSkyBoosting] = useState<boolean>(false);
  const [skyFlightTimeSec, setSkyFlightTimeSec] = useState<number>(0);

  // 2-3 LINES DISPLAY PAGING STATES (Requested User Preference)
  const [displayMode, setDisplayMode] = useState<'chunk' | 'all'>('chunk'); // 'chunk' = 2-3 lines auto-paging
  const [chunkWordCount, setChunkWordCount] = useState<number>(12); // exactly 2-3 lines (~12 words)

  // TypeRacer Grand Prix states
  const [racers, setRacers] = useState<Racer[]>([
    { id: 'player', name: 'You (Champion)', car: '🏎️', color: 'from-amber-400 to-rose-500', wpm: 0, progress: 0, isPlayer: true },
    { id: 'bot1', name: 'Emerald Swift', car: '🚗', color: 'from-emerald-400 to-teal-500', wpm: 40, progress: 0, isPlayer: false },
    { id: 'bot2', name: 'Apex Viper', car: '🏎️', color: 'from-sky-400 to-blue-600', wpm: 60, progress: 0, isPlayer: false },
    { id: 'bot3', name: 'Ghost Phantom', car: '⚡', color: 'from-purple-400 to-indigo-600', wpm: 80, progress: 0, isPlayer: false },
  ]);
  const [playerRank, setPlayerRank] = useState<number>(1);

  // Space Blaster Defender states
  const [spaceTargets, setSpaceTargets] = useState<SpaceTarget[]>([]);
  const [activeTargetIndex, setActiveTargetIndex] = useState<number>(0);
  const [spaceScore, setSpaceScore] = useState<number>(0);
  const [spaceWave, setSpaceWave] = useState<number>(1);
  const [shields, setShields] = useState<number>(5);
  const [laserFiring, setLaserFiring] = useState<boolean>(false);

  // High scores & stats
  const [highScoreWpm, setHighScoreWpm] = useState<number>(() => {
    return parseInt(localStorage.getItem('utilityhub_typing_best_wpm') || '0', 10);
  });
  const [totalRacesWon, setTotalRacesWon] = useState<number>(() => {
    return parseInt(localStorage.getItem('utilityhub_typing_races_won') || '0', 10);
  });
  const [spaceHighScore, setSpaceHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('utilityhub_typing_space_highscore') || '0', 10);
  });
  const [skyHighScoreMeters, setSkyHighScoreMeters] = useState<number>(() => {
    return parseInt(localStorage.getItem('utilityhub_typing_sky_max_altitude') || '0', 10);
  });
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastDangerWarningRef = useRef<number>(0);

  // Web Audio API engine click, thrusters & alert sounds
  const playSound = (type: 'key' | 'space' | 'error' | 'nitro' | 'win' | 'laser' | 'explosion' | 'lift' | 'danger' | 'chute' | 'milestone') => {
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

      if (type === 'key') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440 + Math.random() * 60, ctx.currentTime);
        gain.gain.setValueAtTime(0.025, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } else if (type === 'space') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } else if (type === 'lift') {
        // Sky upward thrust whoosh
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(760, ctx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      } else if (type === 'danger') {
        // Low altitude warning beep
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(720, ctx.currentTime);
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'chute') {
        // Emergency parachute deployment sound
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.22);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } else if (type === 'laser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'explosion') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'nitro') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(250, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'win') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'milestone') {
        // Satisfying chime when completing a 2-3 lines batch
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      }
    } catch {
      // Audio fallback
    }
  };

  // Configure AI rival speeds based on difficulty
  const getAiSpeeds = useCallback((diff: RaceDifficulty) => {
    if (diff === 'rookie') {
      return { bot1: 30, bot2: 42, bot3: 52 };
    }
    if (diff === 'legend') {
      return { bot1: 65, bot2: 80, bot3: 95 };
    }
    // Pro
    return { bot1: 42, bot2: 58, bot3: 72 };
  }, []);

  // Spawn Space Defender Targets
  const generateSpaceTargets = useCallback((wave: number) => {
    const shuffled = [...SPACE_INVADERS_WORDS].sort(() => 0.5 - Math.random());
    const lanes = [14, 38, 62, 86];
    const newTargets: SpaceTarget[] = [];
    const count = 4;
    for (let i = 0; i < count; i++) {
      newTargets.push({
        id: `wave-${wave}-target-${i}-${Date.now()}`,
        word: shuffled[i % shuffled.length],
        x: lanes[i % lanes.length],
        progress: 10 + i * 8, // slight offset
        destroyed: false,
        type: i % 2 === 0 ? 'drone' : 'cruiser'
      });
    }
    return newTargets;
  }, []);

  // Initialize a new round
  const startNewRound = useCallback(() => {
    setCurrentWordIndex(0);
    setCurrentInput('');
    setStartTime(null);
    setIsGameOver(false);
    setCurrentWpm(0);
    setAccuracy(100);
    setStreak(0);
    setMaxStreak(0);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setNitroActive(false);
    setTimeLeft(duration);
    setLaserFiring(false);
    lastDangerWarningRef.current = 0;

    if (mode === 'sky') {
      // Reset Sky Altitude Floater
      setSkyAltitudePct(55);
      setSkyAltitudeMeters(550);
      setSkyMaxAltitude(550);
      setSkyClimbRate(0);
      setSkyChutesLeft(3);
      setIsSkyBoosting(false);
      setSkyFlightTimeSec(0);
      const shuffled = [...SKY_WORDS, ...COMMON_WORDS].sort(() => 0.5 - Math.random());
      setTargetWords(shuffled.slice(0, 45));
    } else if (mode === 'space') {
      setShields(5);
      setSpaceScore(0);
      setSpaceWave(1);
      const targets = generateSpaceTargets(1);
      setSpaceTargets(targets);
      setActiveTargetIndex(0);
      setTargetWords(targets.map(t => t.word));
    } else {
      let words: string[] = [];
      if (mode === 'racer') {
        const shuffled = [...COMMON_WORDS].sort(() => 0.5 - Math.random());
        words = shuffled.slice(0, 30); // 30 words per race track
      } else if (mode === 'sprint') {
        const shuffled = [...COMMON_WORDS].sort(() => 0.5 - Math.random());
        words = shuffled.slice(0, 50);
      } else if (mode === 'code') {
        const shuffled = [...CODE_WORDS].sort(() => 0.5 - Math.random());
        words = shuffled.slice(0, 35);
      } else if (mode === 'quote') {
        const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        words = q.split(' ');
      }
      setTargetWords(words);
    }

    // Reset racers
    const ai = getAiSpeeds(raceDifficulty);
    setRacers([
      { id: 'player', name: 'You (Champion)', car: '🏎️', color: 'from-amber-400 to-rose-500', wpm: 0, progress: 0, isPlayer: true },
      { id: 'bot1', name: 'Emerald Swift', car: '🚗', color: 'from-emerald-400 to-teal-500', wpm: ai.bot1, progress: 0, isPlayer: false },
      { id: 'bot2', name: 'Apex Viper', car: '🏎️', color: 'from-sky-400 to-blue-600', wpm: ai.bot2, progress: 0, isPlayer: false },
      { id: 'bot3', name: 'Ghost Phantom', car: '⚡', color: 'from-purple-400 to-indigo-600', wpm: ai.bot3, progress: 0, isPlayer: false },
    ]);
    setPlayerRank(1);

    setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 50);
  }, [mode, duration, raceDifficulty, getAiSpeeds, generateSpaceTargets]);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  // Finish round handler
  const finishRound = useCallback(() => {
    setIsGameOver(true);
    playSound('win');
    confetti({ particleCount: 75, spread: 85, origin: { y: 0.6 } });

    // Save best WPM
    setCurrentWpm((finalWpm) => {
      if (finalWpm > highScoreWpm) {
        setHighScoreWpm(finalWpm);
        localStorage.setItem('utilityhub_typing_best_wpm', finalWpm.toString());
      }
      return finalWpm;
    });

    // Save Sky Highscore (Peak Altitude)
    if (mode === 'sky') {
      setSkyMaxAltitude((peak) => {
        if (peak > skyHighScoreMeters) {
          setSkyHighScoreMeters(peak);
          localStorage.setItem('utilityhub_typing_sky_max_altitude', peak.toString());
        }
        return peak;
      });
    }

    // Save Space Defender highscore
    if (mode === 'space') {
      setSpaceScore((score) => {
        if (score > spaceHighScore) {
          setSpaceHighScore(score);
          localStorage.setItem('utilityhub_typing_space_highscore', score.toString());
        }
        return score;
      });
    }

    // Check if won race
    if (mode === 'racer') {
      setRacers((currentRacers) => {
        const sorted = [...currentRacers].sort((a, b) => b.progress - a.progress);
        const rankIndex = sorted.findIndex(r => r.isPlayer);
        const finalRank = rankIndex !== -1 ? rankIndex + 1 : 1;
        setPlayerRank(finalRank);

        if (finalRank === 1) {
          setTotalRacesWon(prev => {
            const next = prev + 1;
            localStorage.setItem('utilityhub_typing_races_won', next.toString());
            return next;
          });
        }
        return currentRacers;
      });
    }
  }, [highScoreWpm, mode, spaceHighScore, skyHighScoreMeters]);

  // Sprint / Duration countdown timer
  useEffect(() => {
    if (startTime && !isGameOver && mode !== 'racer' && mode !== 'space' && mode !== 'sky') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishRound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [startTime, isGameOver, mode, finishRound]);

  // Sky Floater: Real-time Gravity Physics & Altitude Loop
  useEffect(() => {
    if (mode !== 'sky' || !startTime || isGameOver) return;

    const gravityTickMs = 100;
    const gravityRate = skyGravity === 'gentle' ? 0.48 : skyGravity === 'storm' ? 1.15 : 0.76;

    const interval = setInterval(() => {
      setSkyFlightTimeSec((t) => t + 0.1);

      setSkyAltitudePct((prevPct) => {
        const nextPct = Math.max(0, prevPct - gravityRate);

        // Calculate descending rate
        const descendRate = -Math.round(gravityRate * 16);
        setSkyClimbRate(descendRate);

        // Calculate actual meters
        const currentMeters = Math.max(0, Math.round(nextPct * 30 + 10));
        setSkyAltitudeMeters(currentMeters);
        setSkyMaxAltitude((prevMax) => Math.max(prevMax, currentMeters));

        // Low altitude warning sound
        if (nextPct <= 18 && nextPct > 2) {
          const now = Date.now();
          if (now - lastDangerWarningRef.current > 1800) {
            lastDangerWarningRef.current = now;
            playSound('danger');
          }
        }

        // Ground touchdown / crash detection
        if (nextPct <= 1) {
          setSkyChutesLeft((chutes) => {
            if (chutes > 1) {
              // Deploy emergency parachute cushion back to safe 35% altitude
              playSound('chute');
              setTimeout(() => {
                setSkyAltitudePct(35);
              }, 40);
              return chutes - 1;
            } else {
              // Out of emergency cushions -> round ends with touchdown
              finishRound();
              return 0;
            }
          });
          return 0;
        }

        return nextPct;
      });
    }, gravityTickMs);

    return () => clearInterval(interval);
  }, [mode, startTime, isGameOver, skyGravity, finishRound]);

  // Race Loop: Progress AI competitors in real-time
  useEffect(() => {
    if (mode !== 'racer' || !startTime || isGameOver) return;

    const interval = setInterval(() => {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      const totalWords = targetWords.length || 30;

      setRacers((prev) => {
        const updated = prev.map((racer) => {
          if (racer.isPlayer) return racer;
          // Progress = (wordsTyped / totalWords) * 100
          const wordsTyped = racer.wpm * elapsedMinutes;
          const prog = Math.min(100, Math.round((wordsTyped / totalWords) * 100));
          return { ...racer, progress: prog };
        });

        // Compute current live rank
        const sorted = [...updated].sort((a, b) => b.progress - a.progress);
        const rankIdx = sorted.findIndex(r => r.isPlayer);
        setPlayerRank(rankIdx !== -1 ? rankIdx + 1 : 1);

        return updated;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [mode, startTime, isGameOver, targetWords.length]);

  // Space Defender: Slow gradual approach loop
  useEffect(() => {
    if (mode !== 'space' || !startTime || isGameOver) return;

    const interval = setInterval(() => {
      setSpaceTargets((prev) => {
        let shieldDamage = 0;
        const updated = prev.map((t) => {
          if (t.destroyed) return t;
          const nextProg = t.progress + 1.2; // Gentle slow approach
          if (nextProg >= 95) {
            shieldDamage += 1;
            return { ...t, destroyed: true };
          }
          return { ...t, progress: nextProg };
        });

        if (shieldDamage > 0) {
          playSound('error');
          setShields((s) => {
            const nextS = Math.max(0, s - shieldDamage);
            if (nextS <= 0) {
              finishRound();
            }
            return nextS;
          });
        }

        // Check if all targets in wave are destroyed
        const allCleared = updated.every(t => t.destroyed);
        if (allCleared) {
          // Next wave
          setSpaceWave((w) => {
            const nextWave = w + 1;
            if (nextWave > 4) {
              // Victorious campaign
              finishRound();
            } else {
              const newTargets = generateSpaceTargets(nextWave);
              setSpaceTargets(newTargets);
              setActiveTargetIndex(0);
              setTargetWords(newTargets.map(nt => nt.word));
              setCurrentWordIndex(0);
              setCurrentInput('');
            }
            return nextWave;
          });
        }

        return updated;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [mode, startTime, isGameOver, finishRound, generateSpaceTargets]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isGameOver) return;
    const value = e.target.value;

    // Start timer on first keystroke
    if (!startTime) {
      setStartTime(Date.now());
    }

    const activeWord = targetWords[currentWordIndex] || '';
    setTotalKeystrokes((prev) => prev + 1);

    // Check if word completed via Space OR reached the end of the last word
    const isLastWord = currentWordIndex === targetWords.length - 1;
    const isCompletedWithSpace = value.endsWith(' ') && value.trim().length > 0;
    const isCompletedDirectly = isLastWord && value === activeWord;

    if (isCompletedWithSpace || isCompletedDirectly) {
      const typedWord = isCompletedWithSpace ? value.trim() : value;

      if (typedWord === activeWord) {
        // Correct Word!
        if (mode === 'sky') {
          // SKY FLOATER UPWARD THRUST!
          playSound('lift');
          setIsSkyBoosting(true);
          setTimeout(() => setIsSkyBoosting(false), 350);

          // Give dynamic upward lift based on streak
          const boostLift = 8.5 + Math.min(8, streak * 1.2);
          setSkyAltitudePct((prev) => {
            const newPct = Math.min(97, prev + boostLift);
            const newMeters = Math.round(newPct * 30 + 10);
            setSkyAltitudeMeters(newMeters);
            setSkyMaxAltitude((prevMax) => Math.max(prevMax, newMeters));
            setSkyClimbRate(Math.round(boostLift * 3.8)); // positive climbing velocity
            return newPct;
          });
        } else if (mode === 'space') {
          playSound('laser');
          setLaserFiring(true);
          setTimeout(() => {
            playSound('explosion');
            setLaserFiring(false);
          }, 150);

          // Mark current target destroyed
          setSpaceTargets((prev) =>
            prev.map((t, idx) => (idx === activeTargetIndex ? { ...t, destroyed: true } : t))
          );
          setSpaceScore((s) => s + 100 + streak * 25);
          setActiveTargetIndex((idx) => idx + 1);
        } else {
          playSound('space');
        }

        setCorrectKeystrokes((prev) => prev + activeWord.length + 1);
        setStreak((prev) => {
          const next = prev + 1;
          if (next > maxStreak) setMaxStreak(next);
          if (next >= 5 && !nitroActive) {
            setNitroActive(true);
            playSound('nitro');
            setTimeout(() => setNitroActive(false), 2500);
          }
          return next;
        });

        const nextIndex = currentWordIndex + 1;

        // Check if completing a 2-3 lines batch
        const effectiveChunk = displayMode === 'chunk' ? chunkWordCount : targetWords.length || 1;
        const curBatch = Math.floor(currentWordIndex / effectiveChunk);
        const nxtBatch = Math.floor(nextIndex / effectiveChunk);
        if (displayMode === 'chunk' && nxtBatch > curBatch && nextIndex < targetWords.length) {
          playSound('milestone');
        }

        setCurrentWordIndex(nextIndex);
        setCurrentInput('');

        // If in Sky mode and getting near end of words list, seamlessly append more sky words!
        if (mode === 'sky' && nextIndex >= targetWords.length - 8) {
          const moreWords = [...SKY_WORDS, ...COMMON_WORDS].sort(() => 0.5 - Math.random()).slice(0, 36);
          setTargetWords((prev) => [...prev, ...moreWords]);
        }

        // Update player race progress
        if (mode === 'racer') {
          const totalWordsCount = targetWords.length || 30;
          const playerProgress = Math.min(100, Math.round((nextIndex / totalWordsCount) * 100));

          setRacers((prev) =>
            prev.map((r) => (r.isPlayer ? { ...r, progress: playerProgress } : r))
          );

          if (playerProgress >= 100 || nextIndex >= targetWords.length) {
            finishRound();
          }
        } else if (nextIndex >= targetWords.length && mode !== 'space' && mode !== 'sky') {
          finishRound();
        }
      } else {
        // Word typo on space
        playSound('error');
        setStreak(0);
        setCurrentInput(value.trim()); // keep word so they can backspace
      }
    } else {
      // Mid-word keystroke
      playSound('key');
      setCurrentInput(value);

      // Check current letter matching
      const isMismatch = !activeWord.startsWith(value);
      if (isMismatch) {
        playSound('error');
      } else {
        setCorrectKeystrokes((prev) => prev + 1);
        // Small micro-lift for every correct character typed in Sky mode!
        if (mode === 'sky') {
          setSkyAltitudePct((prev) => Math.min(97, prev + 0.6));
        }
      }
    }

    // Calculate real-time WPM & Accuracy
    const elapsedMinutes = startTime ? Math.max(0.01, (Date.now() - startTime) / 60000) : 0.01;
    const wordsDone = currentWordIndex + (value.length / 5);
    const calculatedWpm = Math.max(0, Math.round(wordsDone / elapsedMinutes));
    setCurrentWpm(calculatedWpm);

    const acc = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;
    setAccuracy(Math.min(100, Math.max(0, acc)));
  };

  // Keyboard visualizer keys
  const KEYBOARD_ROWS = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'Space']
  ];

  const currentTargetChar = () => {
    const activeWord = targetWords[currentWordIndex] || '';
    if (currentInput.length < activeWord.length) {
      return activeWord[currentInput.length]?.toLowerCase() || '';
    }
    return ' '; // Space to complete word
  };

  const nextChar = currentTargetChar();

  const getRankBadge = (wpm: number) => {
    if (wpm >= 110) return { title: 'Stratosphere God', emoji: '👑', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (wpm >= 90) return { title: 'Lightning Ace', emoji: '⚡', color: 'text-violet-400 bg-violet-500/10 border-violet-500/30' };
    if (wpm >= 70) return { title: 'Sonic Jet Flyer', emoji: '🚀', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' };
    if (wpm >= 50) return { title: 'Sky Glider', emoji: '🪂', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (wpm >= 30) return { title: 'Steady Cruiser', emoji: '🎈', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    return { title: 'Novice Drifter', emoji: '🐢', color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' };
  };

  const rank = getRankBadge(currentWpm);
  const activeFlyerOption = SKY_FLYERS.find(f => f.id === skyFlyer) || SKY_FLYERS[0];

  const shareScore = () => {
    let text = '';
    if (mode === 'sky') {
      text = `🪂 I stayed airborne in Sky Altitude Floater reaching ${skyMaxAltitude}m peak altitude at ${currentWpm} WPM! Can you keep the pointer in the sky?`;
    } else if (mode === 'racer') {
      text = `🏎️ I raced in TypeRush Grand Prix! Finished ${playerRank === 1 ? '1st Place 🏆' : `${playerRank}th Place`} at ${currentWpm} WPM with ${accuracy}% accuracy! Can you beat my time?`;
    } else if (mode === 'space') {
      text = `🚀 I defended the galaxy in Space Blaster with ${spaceScore} points at ${currentWpm} WPM! Can you top my highscore?`;
    } else {
      text = `⚡ I hit ${currentWpm} WPM with ${accuracy}% accuracy on TypeRush speed sprint!`;
    }
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header / Mode Switcher */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 font-black text-2xl">
              {mode === 'sky' ? activeFlyerOption.icon : mode === 'space' ? '🚀' : mode === 'racer' ? '🏎️' : '⚡'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white">
                  TypeRush: Sky Floater & Turbo Racing Games
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950 tracking-wider">
                  Custom Games
                </span>
              </div>
              <p className="text-xs text-indigo-200/80">
                Type rapidly to keep your flyer floating in the sky, race AI cars, or blast alien drones!
              </p>
            </div>
          </div>

          {/* Quick Settings */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-indigo-600/60 border-indigo-500/60 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="Toggle Mechanical Key Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Audio On' : 'Muted'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowKeyboard(!showKeyboard)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showKeyboard
                  ? 'bg-indigo-600/60 border-indigo-500/60 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="Toggle On-Screen Keyboard"
            >
              <Keyboard className="w-4 h-4 text-indigo-300" />
              <span className="hidden sm:inline">Visualizer</span>
            </button>
          </div>

        </div>

        {/* Mode & Difficulty Selector */}
        <div className="relative z-10 pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-indigo-500/20 mt-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-900/80 border border-slate-800">
            {[
              { id: 'sky', label: '🪂 Sky Altitude Floater', desc: 'Type to Float in the Sky' },
              { id: 'racer', label: '🏎️ Nitro Grand Prix', desc: 'Car Race' },
              { id: 'space', label: '🚀 Galaxy Blaster', desc: 'Space Laser' },
              { id: 'sprint', label: '⚡ Speed Sprint', desc: 'WPM Test' },
              { id: 'code', label: '💻 Code Ninja', desc: 'Code Syntax' },
              { id: 'quote', label: '📖 Quotes', desc: 'Literature' },
            ].map((m) => {
              const isSelected = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMode(m.id as GameMode);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Mode-specific Controls */}
          {mode === 'sky' && (
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* Gravity Wind Selector */}
              <div className="flex items-center gap-1">
                <span className="text-slate-400 mr-1 flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-sky-400" /> Wind Gravity:
                </span>
                {[
                  { id: 'gentle', label: '🍃 Gentle (Easy)' },
                  { id: 'normal', label: '💨 Normal' },
                  { id: 'storm', label: '🌪️ Storm (Hard)' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSkyGravity(g.id as SkyGravity)}
                    className={`px-2 py-0.5 rounded-lg font-semibold transition-colors cursor-pointer text-[11px] ${
                      skyGravity === g.id
                        ? 'bg-sky-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              {/* Emergency Chutes Left */}
              <div className="flex items-center gap-1 font-mono text-xs bg-slate-950/60 px-2.5 py-1 rounded-xl border border-slate-800">
                <span className="text-slate-400">Emergency Chutes:</span>
                <span className="text-rose-400 font-bold">
                  {skyChutesLeft > 0 ? '🪂'.repeat(skyChutesLeft) : '⚠️ 0'}
                </span>
              </div>
            </div>
          )}

          {mode === 'racer' && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 mr-1 flex items-center gap-1">
                <Flag className="w-3.5 h-3.5 text-amber-400" /> Rivals:
              </span>
              {[
                { id: 'rookie', label: 'Rookie (30-50 WPM)' },
                { id: 'pro', label: 'Pro (45-70 WPM)' },
                { id: 'legend', label: 'Legend (65-95 WPM)' },
              ].map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => {
                    setRaceDifficulty(diff.id as RaceDifficulty);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    raceDifficulty === diff.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          )}

          {mode === 'space' && (
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <Shield className="w-3.5 h-3.5" /> Shields: {'❤️'.repeat(shields)}
              </span>
              <span className="text-amber-400 font-bold">
                Wave {spaceWave}/4
              </span>
            </div>
          )}

          {(mode === 'sprint' || mode === 'code' || mode === 'quote') && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 mr-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Time:
              </span>
              {[15, 30, 60].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setDuration(t as TimeDuration);
                    setTimeLeft(t);
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

      {/* GAME MODE 1: CUSTOM SKY ALTITUDE FLOATER (Requested Feature) */}
      {mode === 'sky' && (
        <div className="space-y-4">
          
          {/* Top Flight Cockpit Telemetry Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-5">
              
              {/* Live Altitude */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center text-sky-500">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Altitude</span>
                  <span className="text-base font-black font-mono text-sky-600 dark:text-sky-400 flex items-center gap-1">
                    <span>{skyAltitudeMeters}m</span>
                    <span className="text-xs text-slate-400">({Math.round(skyAltitudePct)}%)</span>
                  </span>
                </div>
              </div>

              {/* Climb Velocity Rate */}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  skyClimbRate >= 0 
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-500' 
                    : 'bg-rose-50 dark:bg-rose-950 text-rose-500'
                }`}>
                  <ArrowUp className={`w-4 h-4 transition-transform ${skyClimbRate < 0 ? 'rotate-180' : ''}`} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Climb Rate</span>
                  <span className={`text-sm font-black font-mono ${skyClimbRate >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {skyClimbRate >= 0 ? `+${skyClimbRate} m/s` : `${skyClimbRate} m/s`}
                  </span>
                </div>
              </div>

              {/* Peak Max Altitude Reached */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-500">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Peak Altitude</span>
                  <span className="text-sm font-black font-mono text-amber-500">
                    {skyMaxAltitude}m
                  </span>
                </div>
              </div>

              {/* Updraft Booster Status */}
              {isSkyBoosting && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-black text-xs shadow-md animate-bounce">
                  <Flame className="w-3.5 h-3.5" />
                  <span>UPWARD THRUST!</span>
                </div>
              )}
            </div>

            {/* Flyer Vehicle Customizer */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Flyer:</span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {SKY_FLYERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSkyFlyer(f.id)}
                    className={`p-1.5 rounded-lg text-sm transition-all cursor-pointer ${
                      skyFlyer === f.id
                        ? 'bg-white dark:bg-slate-700 shadow-xs scale-110'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    title={f.name}
                  >
                    <span>{f.icon}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={startNewRound}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                title="Restart Flight"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Atmospheric Vertical Sky Arena */}
          <div className="rounded-3xl p-5 bg-gradient-to-b from-[#090d16] via-[#102a45] to-[#1e3a5f] border-2 border-sky-500/30 shadow-2xl relative overflow-hidden h-64 sm:h-72 flex flex-col justify-between select-none">
            
            {/* Ambient Celestial Sky Elements */}
            <div className="absolute top-3 right-6 flex items-center gap-2 text-xs font-mono text-amber-300/60 pointer-events-none">
              <Sun className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '30s' }} />
              <span>Stratosphere Zenith</span>
            </div>

            {/* Drifting Clouds in Background */}
            <div className="absolute top-[22%] left-[10%] opacity-25 text-3xl pointer-events-none animate-pulse">
              ☁️
            </div>
            <div className="absolute top-[48%] right-[15%] opacity-35 text-4xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }}>
              ☁️
            </div>
            <div className="absolute top-[70%] left-[25%] opacity-30 text-2xl pointer-events-none">
              ⛅
            </div>

            {/* Altitude Scale Ruler on Left Edge */}
            <div className="absolute left-3 top-3 bottom-12 w-16 border-r border-sky-400/20 flex flex-col justify-between text-[10px] font-mono text-sky-300/60 pointer-events-none">
              <div className="flex items-center gap-1">
                <span>3,000m</span>
                <span className="text-[8px] text-amber-400">Orbit</span>
              </div>
              <div className="flex items-center gap-1">
                <span>2,000m</span>
              </div>
              <div className="flex items-center gap-1">
                <span>1,000m</span>
                <span className="text-[8px] text-sky-400">Clouds</span>
              </div>
              <div className="flex items-center gap-1">
                <span>500m</span>
              </div>
              <div className="flex items-center gap-1 text-rose-400">
                <span>100m</span>
                <span className="text-[8px]">Danger</span>
              </div>
            </div>

            {/* THE FLOATING POINTER / FLYER AVATAR */}
            <div
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-150 ease-out z-20 flex flex-col items-center"
              style={{
                bottom: `calc(${Math.min(92, Math.max(4, skyAltitudePct))}%)`,
              }}
            >
              {/* Live Altitude Meter Tag on Top of Flyer */}
              <div className={`mb-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 shadow-lg transition-all ${
                skyAltitudePct <= 20
                  ? 'bg-rose-500 text-white animate-pulse'
                  : isSkyBoosting
                  ? 'bg-amber-400 text-slate-950 scale-105'
                  : 'bg-slate-900/90 text-sky-300 border border-sky-400/30'
              }`}>
                <span>{skyAltitudeMeters}m</span>
                <span>{skyClimbRate >= 0 ? '⬆️' : '⬇️'}</span>
              </div>

              {/* Flyer Body with Thruster Flame */}
              <div className="relative flex flex-col items-center">
                <div className={`text-4xl filter drop-shadow-[0_4px_10px_rgba(56,189,248,0.5)] transition-transform duration-100 ${
                  isSkyBoosting ? 'scale-125 -translate-y-1' : ''
                }`}>
                  {activeFlyerOption.icon}
                </div>

                {/* Booster Flame / Upward Exhaust */}
                {isSkyBoosting && (
                  <div className="absolute -bottom-5 flex flex-col items-center animate-bounce">
                    <span className="text-base">🔥</span>
                    <span className="text-[9px] font-bold text-amber-400 font-mono tracking-tight">BOOST</span>
                  </div>
                )}
                {!isSkyBoosting && skyAltitudePct > 20 && (
                  <div className="text-[10px] text-sky-300/70 font-mono animate-pulse">
                    ~ ~ ~
                  </div>
                )}
              </div>
            </div>

            {/* Danger Impact Ground Zone at Bottom */}
            <div className="relative z-10 mt-auto pt-2 border-t border-rose-500/30 flex items-center justify-between text-xs px-2 bg-gradient-to-t from-rose-950/40 to-transparent">
              <div className="flex items-center gap-2">
                {skyAltitudePct <= 20 ? (
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold animate-pulse">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>⚠️ LOW ALTITUDE WARNING! TYPE WORDS FASTER TO GAIN LIFT!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-sky-300 font-medium">
                    <Cloud className="w-4 h-4 text-sky-400" />
                    <span>Airborne Cruising Layer: Keep typing rhythm to stay floating!</span>
                  </div>
                )}
              </div>

              <div className="text-slate-400 font-mono text-[11px] hidden sm:block">
                Touchdown Cushion: <strong className="text-rose-400">{skyChutesLeft} Left</strong>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* GAME MODE 2: Turbo TypeRacer Grand Prix Track */}
      {mode === 'racer' && (
        <div className="space-y-4">
          
          {/* Race Track Header Stats */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-5">
              {/* Live Rank */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 uppercase font-bold">Position:</span>
                <span className={`px-2.5 py-0.5 rounded-lg font-black text-sm ${
                  playerRank === 1
                    ? 'bg-amber-400 text-slate-950 shadow-sm animate-pulse'
                    : playerRank === 2
                    ? 'bg-slate-200 text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {playerRank === 1 ? '🥇 1st Place' : playerRank === 2 ? '🥈 2nd Place' : playerRank === 3 ? '🥉 3rd Place' : '4th Place'}
                </span>
              </div>

              {/* Speedometer */}
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-indigo-500" />
                <span className="text-xs text-slate-400 uppercase font-bold">Speed:</span>
                <span className="text-base font-black font-mono text-indigo-600 dark:text-indigo-400">
                  {currentWpm} WPM
                </span>
              </div>

              {/* Nitro status */}
              {nitroActive && (
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-xs shadow-md animate-bounce">
                  <Flame className="w-3.5 h-3.5" />
                  <span>NITRO BOOST!</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono">
                🏆 Races Won: <strong className="text-slate-800 dark:text-slate-200">{totalRacesWon}</strong>
              </span>
              <button
                type="button"
                onClick={startNewRound}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                title="Restart Race"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4-Lane Animated Race Track */}
          <div className="rounded-3xl p-5 bg-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden space-y-3">
            {/* Asphalt road finish line */}
            <div className="absolute top-0 bottom-0 right-10 w-4 bg-[repeating-linear-gradient(0deg,#fff,#fff_8px,#000_8px,#000_16px)] opacity-60 z-10 pointer-events-none"></div>

            {racers.map((racer) => (
              <div
                key={racer.id}
                className={`relative p-2.5 rounded-2xl border transition-all ${
                  racer.isPlayer
                    ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md ring-1 ring-amber-400/30'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1 px-1">
                  <span className={`font-bold flex items-center gap-1.5 ${racer.isPlayer ? 'text-amber-400' : 'text-slate-300'}`}>
                    <span>{racer.car}</span>
                    <span>{racer.name}</span>
                    {racer.isPlayer && nitroActive && (
                      <span className="text-rose-400 text-[10px] animate-pulse">🔥 NITRO ACTIVE</span>
                    )}
                  </span>
                  <span>{racer.progress}% Completed</span>
                </div>

                {/* Track Lane */}
                <div className="relative h-9 rounded-xl bg-slate-950/80 border border-slate-800/80 overflow-hidden flex items-center px-1">
                  {/* Dashed center lane divider */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b border-dashed border-slate-800"></div>

                  {/* Racing Car Moving Object */}
                  <div
                    className="absolute transition-all duration-150 ease-out flex items-center"
                    style={{
                      left: `calc(${Math.min(92, racer.progress)}%)`,
                    }}
                  >
                    <div className="relative flex items-center">
                      {racer.isPlayer && nitroActive && (
                        <span className="absolute -left-6 text-sm animate-ping">🔥</span>
                      )}
                      <span className="text-2xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {racer.car}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* GAME MODE 3: Space Blaster Galaxy Defender */}
      {mode === 'space' && (
        <div className="space-y-4">
          <div className="rounded-3xl p-6 bg-slate-950 border border-indigo-500/30 shadow-2xl relative overflow-hidden h-72 flex flex-col justify-between">
            {/* Starfield background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-black pointer-events-none"></div>

            {/* Top Wave & Score HUD */}
            <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-300 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  🛸 Wave {spaceWave}/4
                </span>
                <span className="text-amber-400 font-black text-sm">
                  SCORE: {spaceScore}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span>Shields: {'❤️'.repeat(shields)}</span>
                <span className="text-slate-500">Best: {spaceHighScore}</span>
              </div>
            </div>

            {/* Approaching Space Targets */}
            <div className="relative z-10 flex-1 py-4 flex items-center justify-around">
              {spaceTargets.map((target, idx) => {
                const isActive = idx === activeTargetIndex;
                if (target.destroyed) {
                  return (
                    <div key={target.id} className="flex flex-col items-center opacity-20 scale-75 transition-all">
                      <span className="text-2xl">💥</span>
                      <span className="text-xs line-through text-slate-600">{target.word}</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={target.id}
                    className={`flex flex-col items-center transition-all duration-300 ${
                      isActive ? 'scale-110 z-20' : 'scale-90 opacity-70'
                    }`}
                    style={{
                      transform: `translateY(${Math.min(70, target.progress * 0.7)}px)`
                    }}
                  >
                    {isActive && (
                      <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-1 animate-pulse">
                        <Crosshair className="w-3 h-3 text-amber-400" />
                        <span>LOCK-ON</span>
                      </div>
                    )}
                    <div className={`p-2 rounded-2xl border text-center transition-all ${
                      isActive 
                        ? 'bg-indigo-950/90 border-amber-400 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/50' 
                        : 'bg-slate-900/80 border-slate-800'
                    }`}>
                      <div className="text-2xl mb-1 filter drop-shadow">
                        {target.type === 'drone' ? '🛸' : '👾'}
                      </div>
                      <span className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                        isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {target.word}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Starship Cannon */}
            <div className="relative z-10 flex justify-center items-end pt-2">
              <div className="relative flex flex-col items-center">
                {laserFiring && (
                  <div className="absolute -top-32 w-1.5 h-32 bg-gradient-to-t from-amber-400 via-rose-500 to-indigo-400 rounded-full shadow-[0_0_12px_#f59e0b] animate-pulse"></div>
                )}
                <div className="text-3xl filter drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                  🚀
                </div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold mt-1">
                  DEFENDER SHIP
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Main Interactive Typing Prompt Card */}
      {(() => {
        // 2-3 Lines Chunk Display Calculations (User Preference)
        const effectiveChunkSize = displayMode === 'chunk' ? chunkWordCount : targetWords.length || 1;
        const currentBatchIndex = Math.floor(currentWordIndex / effectiveChunkSize);
        const batchStartIndex = currentBatchIndex * effectiveChunkSize;
        const batchEndIndex = Math.min(targetWords.length, batchStartIndex + effectiveChunkSize);
        const currentBatchWords = targetWords.slice(batchStartIndex, batchEndIndex);
        const totalBatches = Math.ceil(targetWords.length / effectiveChunkSize) || 1;
        const wordsInCurrentBatchDone = currentWordIndex - batchStartIndex;

        return (
          <div className="space-y-4">
            
            {/* Words Display Canvas / Prompt Container */}
            <div
              onClick={() => inputRef.current?.focus({ preventScroll: true })}
              className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl cursor-text relative select-none"
            >
              {/* Header with 2-3 Lines Mode Status & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{displayMode === 'chunk' ? '2-3 Lines Mode (Auto-Clearing)' : 'Continuous Mode'}</span>
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {displayMode === 'chunk'
                      ? `Batch ${currentBatchIndex + 1} of ${totalBatches} (${wordsInCurrentBatchDone}/${currentBatchWords.length} words)`
                      : `${currentWordIndex}/${targetWords.length} words`}
                  </span>
                </div>

                {/* Chunk Size Controls */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDisplayMode('chunk');
                      setChunkWordCount(8);
                      inputRef.current?.focus({ preventScroll: true });
                    }}
                    className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                      displayMode === 'chunk' && chunkWordCount === 8
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                    title="Compact 2 Lines (8 words)"
                  >
                    2 Lines
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDisplayMode('chunk');
                      setChunkWordCount(12);
                      inputRef.current?.focus({ preventScroll: true });
                    }}
                    className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                      displayMode === 'chunk' && chunkWordCount === 12
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                    title="2-3 Lines (12 words - Default)"
                  >
                    2-3 Lines
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDisplayMode('chunk');
                      setChunkWordCount(16);
                      inputRef.current?.focus({ preventScroll: true });
                    }}
                    className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                      displayMode === 'chunk' && chunkWordCount === 16
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                    title="3-4 Lines (16 words)"
                  >
                    3-4 Lines
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDisplayMode(displayMode === 'all' ? 'chunk' : 'all');
                      inputRef.current?.focus({ preventScroll: true });
                    }}
                    className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                      displayMode === 'all'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                    title="Show all continuous text"
                  >
                    All
                  </button>
                </div>
              </div>

              {/* Target Words Stream - Strict 2-3 Lines Container */}
              <div
                key={`chunk-${currentBatchIndex}`}
                className="flex flex-wrap gap-2 sm:gap-2.5 text-base sm:text-xl font-mono leading-relaxed tracking-wide min-h-[75px] max-h-[105px] overflow-hidden items-center content-start animate-in fade-in-50 duration-200"
              >
                {currentBatchWords.map((word, relIdx) => {
                  const globalIdx = batchStartIndex + relIdx;
                  const isPast = globalIdx < currentWordIndex;
                  const isCurrent = globalIdx === currentWordIndex;

                  return (
                    <span
                      key={globalIdx}
                      className={`relative px-2 py-0.5 rounded-xl transition-all ${
                        isPast
                          ? 'text-emerald-600 dark:text-emerald-400 opacity-60'
                          : isCurrent
                          ? 'bg-indigo-50 dark:bg-indigo-950/80 text-slate-900 dark:text-white ring-2 ring-indigo-500 font-bold shadow-sm'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {isCurrent ? (
                        word.split('').map((char, cIdx) => {
                          let charClass = 'text-slate-900 dark:text-white';
                          if (cIdx < currentInput.length) {
                            if (currentInput[cIdx] === char) {
                              charClass = 'text-emerald-500 dark:text-emerald-400 font-bold';
                            } else {
                              charClass = 'text-rose-500 bg-rose-100 dark:bg-rose-950 rounded-xs underline decoration-rose-500';
                            }
                          } else if (cIdx === currentInput.length) {
                            charClass = 'border-b-2 border-indigo-500 animate-pulse text-indigo-600 dark:text-indigo-400';
                          }

                          return (
                            <span key={cIdx} className={charClass}>
                              {char}
                            </span>
                          );
                        })
                      ) : (
                        word
                      )}
                    </span>
                  );
                })}
              </div>

              {/* Active Input Box */}
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={handleInputChange}
                    onKeyDown={(e) => setActiveKey(e.key.toLowerCase())}
                    onKeyUp={() => setActiveKey('')}
                    placeholder={
                      startTime 
                        ? (mode === 'sky' ? "Type fast to gain lift! Spacebar to thrust up..." : "Type current word and hit Spacebar...") 
                        : (mode === 'sky' ? "Start typing to float in the sky! Complete words to thrust up!" : "Click here or start typing to begin!")
                    }
                    className="w-full px-5 py-3 text-base sm:text-lg font-mono rounded-2xl border-2 border-indigo-500/40 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white shadow-inner focus:outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                  />
                </div>

                <button
                  type="button"
                  onClick={startNewRound}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer shadow-xs"
                  title="Restart Round"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

        {/* Live Flight / Race Telemetry HUD */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Current Velocity</span>
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">{currentWpm} WPM</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Accuracy</span>
              <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{accuracy}%</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Combo Streak</span>
              <span className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">{streak}x</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                {mode === 'sky' ? 'Peak Altitude' : mode === 'space' ? 'Space Score' : 'Best Record'}
              </span>
              <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
                {mode === 'sky' ? `${Math.max(skyMaxAltitude, skyHighScoreMeters)}m` : mode === 'space' ? spaceScore : `${Math.max(currentWpm, highScoreWpm)} WPM`}
              </span>
            </div>
          </div>

        </div>

      </div>
        );
      })()}

      {/* Game Over Victory Podium Screen */}
      {isGameOver && (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-2 border-amber-500/50 shadow-2xl text-white space-y-6 animate-in zoom-in-95 duration-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
                <span>
                  {mode === 'sky'
                    ? `🪂 Flight Completed: ${skyMaxAltitude}m Peak Altitude`
                    : mode === 'racer' 
                    ? (playerRank === 1 ? '🥇 1st Place Victory' : `${playerRank}th Place Finish`)
                    : mode === 'space'
                    ? `🛸 Mission Result: Wave ${spaceWave}`
                    : `⚡ Sprint Result: ${currentWpm} WPM`}
                </span>
                <span>• Rank: {rank.title}</span>
              </div>
              <h3 className="text-3xl font-black text-white">
                {mode === 'sky' && '🪂 Touchdown! Great Flight in the Sky!'}
                {mode === 'racer' && playerRank === 1 && '🏆 Grand Prix Champion!'}
                {mode === 'racer' && playerRank > 1 && '🏁 Race Completed!'}
                {mode === 'space' && '🚀 Galaxy Defense Complete!'}
                {mode !== 'racer' && mode !== 'space' && mode !== 'sky' && '🎉 Speed Benchmark Complete!'}
              </h3>
              <p className="text-xs text-indigo-200">
                {mode === 'sky'
                  ? `You kept the pointer soaring up to ${skyMaxAltitude} meters! Practice fast typing rhythm to stay floating even longer.`
                  : playerRank === 1 
                  ? 'Outstanding typing velocity and accuracy!' 
                  : 'Great run! Try again to beat your record and climb the leaderboard.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={shareScore}
                className="px-4 py-2.5 rounded-xl border border-indigo-400/40 bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedShare ? 'Copied Link!' : 'Share Result'}</span>
              </button>

              <button
                type="button"
                onClick={startNewRound}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-transform"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
            </div>
          </div>

          {/* Performance Podium Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-slate-400 uppercase block">Final Speed</span>
              <span className="text-3xl font-black text-amber-400">{currentWpm}</span>
              <span className="text-xs text-slate-400 block">WPM</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-slate-400 uppercase block">Accuracy</span>
              <span className="text-3xl font-black text-emerald-400">{accuracy}%</span>
              <span className="text-xs text-slate-400 block">Precision</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-slate-400 uppercase block">Max Streak</span>
              <span className="text-3xl font-black text-rose-400">{maxStreak}</span>
              <span className="text-xs text-slate-400 block">Combo Words</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-slate-400 uppercase block">
                {mode === 'sky' ? 'Max Altitude' : mode === 'space' ? 'Total Score' : 'All-time Best'}
              </span>
              <span className="text-3xl font-black text-indigo-400">
                {mode === 'sky' ? `${skyMaxAltitude}m` : mode === 'space' ? spaceScore : highScoreWpm}
              </span>
              <span className="text-xs text-slate-400 block">
                {mode === 'sky' ? 'Peak Height' : mode === 'space' ? 'Points' : 'Record WPM'}
              </span>
            </div>
          </div>

        </div>
      )}

      {/* Mechanical Keyboard Visualizer */}
      {showKeyboard && !isGameOver && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-2 select-none">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-1">
            <span>On-Screen Mechanical Key Guide</span>
            <span className="text-amber-400 font-bold">
              Target Key: <span className="underline uppercase">{nextChar === ' ' ? 'SPACEBAR' : nextChar}</span>
            </span>
          </div>

          <div className="space-y-1.5 flex flex-col items-center">
            {KEYBOARD_ROWS.map((row, rIdx) => (
              <div key={rIdx} className="flex gap-1.5 justify-center w-full">
                {row.map((k) => {
                  const isNext = (k === 'Space' && nextChar === ' ') || k === nextChar;
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
  );
};
