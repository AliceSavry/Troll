import { useEffect, useRef, useCallback, useState } from 'react';

// Constants
const VIRTUAL_WIDTH = 540;
const VIRTUAL_HEIGHT = 960;
const TOTAL_LEVELS = 150;

// Theme definitions with enhanced visuals
const THEMES = {
  neonCity: {
    name: 'NEON CITY',
    bg1: '#0a0a1a', bg2: '#1a0a2a',
    platform: '#00f2ff', platformGlow: '#00f2ff',
    trap: '#ff2d55', trapGlow: '#ff2d55',
    player: '#ff2d55', exit: '#ffd700',
    particle: '#00f2ff', gridColor: 'rgba(0, 242, 255, 0.05)',
    ambient: ['#ff2d55', '#00f2ff', '#ffd700'],
    bgPattern: 'grid'
  },
  lavaHell: {
    name: 'LAVA HELL',
    bg1: '#1a0500', bg2: '#2a0a00',
    platform: '#ff6600', platformGlow: '#ff3300',
    trap: '#ff0000', trapGlow: '#ff0000',
    player: '#ffcc00', exit: '#00ff00',
    particle: '#ff6600', gridColor: 'rgba(255, 102, 0, 0.05)',
    ambient: ['#ff0000', '#ff6600', '#ffcc00'],
    bgPattern: 'lava'
  },
  iceWorld: {
    name: 'ICE WORLD',
    bg1: '#0a1a2a', bg2: '#0a2a3a',
    platform: '#88ddff', platformGlow: '#00ccff',
    trap: '#ff88aa', trapGlow: '#ff4477',
    player: '#ffffff', exit: '#ffff00',
    particle: '#aaeeff', gridColor: 'rgba(136, 221, 255, 0.05)',
    ambient: ['#88ddff', '#ffffff', '#aaeeff'],
    bgPattern: 'snow'
  },
  toxicSwamp: {
    name: 'TOXIC SWAMP',
    bg1: '#0a1a0a', bg2: '#1a2a0a',
    platform: '#44ff44', platformGlow: '#00ff00',
    trap: '#aa00ff', trapGlow: '#ff00ff',
    player: '#00ffaa', exit: '#ffff00',
    particle: '#88ff88', gridColor: 'rgba(68, 255, 68, 0.05)',
    ambient: ['#44ff44', '#00ffaa', '#aaff00'],
    bgPattern: 'bubbles'
  },
  darkVoid: {
    name: 'DARK VOID',
    bg1: '#050505', bg2: '#0a0a0a',
    platform: '#8844ff', platformGlow: '#aa66ff',
    trap: '#ff0044', trapGlow: '#ff0088',
    player: '#ff44ff', exit: '#00ffff',
    particle: '#aa88ff', gridColor: 'rgba(136, 68, 255, 0.03)',
    ambient: ['#8844ff', '#ff44ff', '#4488ff'],
    bgPattern: 'stars'
  },
  sunsetDesert: {
    name: 'SUNSET DESERT',
    bg1: '#2a1a0a', bg2: '#3a2010',
    platform: '#ffaa44', platformGlow: '#ff8800',
    trap: '#ff4444', trapGlow: '#ff0000',
    player: '#ff6644', exit: '#44ff88',
    particle: '#ffcc88', gridColor: 'rgba(255, 170, 68, 0.05)',
    ambient: ['#ffaa44', '#ff6644', '#ffcc00'],
    bgPattern: 'dunes'
  },
  deepOcean: {
    name: 'DEEP OCEAN',
    bg1: '#001122', bg2: '#002244',
    platform: '#0088ff', platformGlow: '#0066cc',
    trap: '#ff4488', trapGlow: '#ff0066',
    player: '#00ffcc', exit: '#ffff44',
    particle: '#44aaff', gridColor: 'rgba(0, 136, 255, 0.05)',
    ambient: ['#0088ff', '#00ffcc', '#44aaff'],
    bgPattern: 'waves'
  },
  crystalCave: {
    name: 'CRYSTAL CAVE',
    bg1: '#1a0a2a', bg2: '#2a1040',
    platform: '#ff88ff', platformGlow: '#ff44ff',
    trap: '#44ffff', trapGlow: '#00ffff',
    player: '#ffaaff', exit: '#aaff44',
    particle: '#ffccff', gridColor: 'rgba(255, 136, 255, 0.05)',
    ambient: ['#ff88ff', '#ffaaff', '#ff44aa'],
    bgPattern: 'crystals'
  },
  stormyNight: {
    name: 'STORMY NIGHT',
    bg1: '#0a0a15', bg2: '#151525',
    platform: '#6688aa', platformGlow: '#4466aa',
    trap: '#ffff00', trapGlow: '#ffcc00',
    player: '#aaccff', exit: '#ff8844',
    particle: '#88aacc', gridColor: 'rgba(102, 136, 170, 0.05)',
    ambient: ['#6688aa', '#aaccff', '#ffffff'],
    bgPattern: 'lightning'
  },
  techMatrix: {
    name: 'TECH MATRIX',
    bg1: '#000a00', bg2: '#001500',
    platform: '#00ff00', platformGlow: '#00cc00',
    trap: '#ff0000', trapGlow: '#cc0000',
    player: '#00ff88', exit: '#ffffff',
    particle: '#44ff44', gridColor: 'rgba(0, 255, 0, 0.08)',
    ambient: ['#00ff00', '#00ff88', '#88ff00'],
    bgPattern: 'matrix'
  },
  candyLand: {
    name: 'CANDY LAND',
    bg1: '#2a1020', bg2: '#3a1530',
    platform: '#ff66aa', platformGlow: '#ff4488',
    trap: '#44ddff', trapGlow: '#00ccff',
    player: '#ffaacc', exit: '#aaff66',
    particle: '#ffccdd', gridColor: 'rgba(255, 102, 170, 0.05)',
    ambient: ['#ff66aa', '#ffaacc', '#ff88bb'],
    bgPattern: 'candy'
  },
  cosmicNebula: {
    name: 'COSMIC NEBULA',
    bg1: '#0a0020', bg2: '#200040',
    platform: '#ff00ff', platformGlow: '#cc00cc',
    trap: '#00ffff', trapGlow: '#00cccc',
    player: '#ffaaff', exit: '#ffff00',
    particle: '#ff88ff', gridColor: 'rgba(255, 0, 255, 0.05)',
    ambient: ['#ff00ff', '#ffaaff', '#aa00ff'],
    bgPattern: 'nebula'
  },
  volcanicAsh: {
    name: 'VOLCANIC ASH',
    bg1: '#1a1010', bg2: '#2a1515',
    platform: '#ff4400', platformGlow: '#ff2200',
    trap: '#ffff00', trapGlow: '#ffcc00',
    player: '#ff8844', exit: '#00ffaa',
    particle: '#ff6644', gridColor: 'rgba(255, 68, 0, 0.05)',
    ambient: ['#ff4400', '#ff8844', '#ffaa00'],
    bgPattern: 'ash'
  },
  electricStorm: {
    name: 'ELECTRIC STORM',
    bg1: '#101020', bg2: '#202040',
    platform: '#00aaff', platformGlow: '#0088ff',
    trap: '#ffff00', trapGlow: '#ffcc00',
    player: '#88ddff', exit: '#ff8800',
    particle: '#44ccff', gridColor: 'rgba(0, 170, 255, 0.05)',
    ambient: ['#00aaff', '#88ddff', '#ffffff'],
    bgPattern: 'electric'
  },
  bloodMoon: {
    name: 'BLOOD MOON',
    bg1: '#150505', bg2: '#250a0a',
    platform: '#aa2222', platformGlow: '#880000',
    trap: '#ff0044', trapGlow: '#cc0033',
    player: '#ff6666', exit: '#ffaa00',
    particle: '#ff4444', gridColor: 'rgba(170, 34, 34, 0.05)',
    ambient: ['#aa2222', '#ff6666', '#ff4444'],
    bgPattern: 'blood'
  }
};

const THEME_ORDER = Object.keys(THEMES);

interface Theme {
  name: string;
  bg1: string;
  bg2: string;
  platform: string;
  platformGlow: string;
  trap: string;
  trapGlow: string;
  player: string;
  exit: string;
  particle: string;
  gridColor: string;
  ambient: string[];
  bgPattern: string;
}

function getThemeForLevel(level: number): Theme {
  const themeIndex = Math.floor((level - 1) / 10) % THEME_ORDER.length;
  return THEMES[THEME_ORDER[themeIndex] as keyof typeof THEMES];
}

// Audio Engine
class AudioEngine {
  private ctx: AudioContext | null = null;
  
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
  }
  
  play(type: string) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    const now = this.ctx.currentTime;
    
    switch(type) {
      case 'jump':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
        break;
      case 'death':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      case 'win':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, now);
        gain.gain.setValueAtTime(0.1, now);
        osc.start(now);
        setTimeout(() => {
          if (this.ctx) osc.frequency.setValueAtTime(659, this.ctx.currentTime);
        }, 80);
        setTimeout(() => {
          if (this.ctx) {
            osc.frequency.setValueAtTime(784, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.15);
          }
        }, 160);
        osc.stop(now + 0.4);
        break;
      case 'combo':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      case 'perfect':
        osc.type = 'sine';
        [523, 659, 784, 1047].forEach((freq, i) => {
          setTimeout(() => {
            if (this.ctx) {
              const o = this.ctx.createOscillator();
              const g = this.ctx.createGain();
              o.connect(g);
              g.connect(this.ctx.destination);
              o.type = 'sine';
              o.frequency.value = freq;
              g.gain.setValueAtTime(0.08, this.ctx.currentTime);
              g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
              o.start(this.ctx.currentTime);
              o.stop(this.ctx.currentTime + 0.15);
            }
          }, i * 80);
        });
        break;
    }
  }
}

const audioEngine = new AudioEngine();

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  type: 'normal' | 'star' | 'spark' | 'trail';
}

interface AmbientParticle {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  alpha: number;
  wobble: number;
  wobbleSpeed: number;
}

interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
  type: string;
  originalX?: number;
  originalY?: number;
  shakeTime?: number;
  falling?: boolean;
  speed?: number;
  range?: number;
  offset?: number;
  startX?: number;
  startY?: number;
  direction?: number;
  active?: boolean;
  timer?: number;
  action?: (player: Player, plat: Platform) => void;
}

interface Trap {
  x: number;
  y: number;
  w: number;
  h: number;
  triggered: boolean;
  triggerX?: number;
  triggerY?: number;
  speed: number;
  targetY?: number;
  direction?: number;
  warningShown?: boolean;
  action: (player: Player, trap: Trap) => void;
}

interface Exit {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Player {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  speed: number;
  jumpForce: number;
  grounded: boolean;
  scaleX: number;
  scaleY: number;
  rotation: number;
  eyeOffset: number;
  coyoteTime: number;
  jumpBuffer: number;
  trail: Array<{x: number; y: number; alpha: number}>;
}

interface Ghost {
  x: number;
  y: number;
  life: number;
  scaleX: number;
  scaleY: number;
}

// Level Generator
function generateLevel(id: number): { platforms: Platform[]; traps: Trap[]; movingPlatforms: Platform[]; exit: Exit; spawn: { x: number; y: number }; theme: Theme } {
  const theme = getThemeForLevel(id);
  const platforms: Platform[] = [];
  const traps: Trap[] = [];
  const movingPlatforms: Platform[] = [];
  const exit: Exit = { x: 460, y: 100, w: 50, h: 80 };
  const spawn = { x: 60, y: 800 };
  
  // Phase de difficulté
  let phase: number;
  if (id <= 25) phase = 0;       // Tutorial - No traps
  else if (id <= 55) phase = 1;  // Easy - Few slow traps
  else if (id <= 90) phase = 2;  // Medium - More traps
  else if (id <= 125) phase = 3; // Hard - Many fast traps
  else phase = 4;                // Extreme - Maximum challenge
  
  const difficulty = Math.max(0, (id - 25) / (TOTAL_LEVELS - 25));
  const pattern = id <= 25 ? (id - 1) % 6 : (id - 1) % 12;
  
  // Ground platform
  platforms.push({ x: 0, y: 870, w: 250, h: 90, type: 'ground' });
  
  // Generate pattern
  switch(pattern) {
    case 0: generateEasyStairs(platforms, exit, phase); break;
    case 1: generateSimpleZigzag(platforms, exit, phase); break;
    case 2: generateWidePlatforms(platforms, exit, phase); break;
    case 3: generateGentleClimb(platforms, exit, phase); break;
    case 4: generateSafeSpiral(platforms, exit, phase); break;
    case 5: generateAlternating(platforms, exit, phase); break;
    case 6: generateTowerClimb(platforms, exit, phase); break;
    case 7: generateMixedPath(platforms, exit, phase); break;
    case 8: generateNarrowPath(platforms, exit, phase); break;
    case 9: generateDiagonalClimb(platforms, exit, phase); break;
    case 10: generateBouncePads(platforms, movingPlatforms, exit, phase); break;
    case 11: generateLabyrinth(platforms, exit, phase); break;
  }
  
  // Add moving platforms for higher difficulty
  if (phase >= 2 && Math.random() < 0.3 + difficulty * 0.3) {
    addMovingPlatforms(movingPlatforms, phase, difficulty);
  }
  
  // Add traps after tutorial
  if (phase >= 1) {
    addTraps(traps, platforms, phase, difficulty);
  }
  
  // Add fake platforms in harder phases
  if (phase >= 3 && platforms.length > 3) {
    addFakePlatforms(platforms, phase);
  }
  
  return { platforms, traps, movingPlatforms, exit, spawn, theme };
}

function generateEasyStairs(platforms: Platform[], exit: Exit, phase: number) {
  const steps = 5 + phase;
  const platWidth = 150 - phase * 12;
  
  for (let i = 0; i < steps; i++) {
    const x = i % 2 === 0 ? 30 : VIRTUAL_WIDTH - platWidth - 30;
    const y = 750 - i * (130 - phase * 5);
    platforms.push({ x, y, w: platWidth, h: 30, type: 'normal' });
  }
  
  const lastX = (steps - 1) % 2 === 0 ? 30 : VIRTUAL_WIDTH - platWidth - 30;
  exit.x = lastX + platWidth/2 - 25;
  exit.y = 750 - (steps - 1) * (130 - phase * 5) - 80;
}

function generateSimpleZigzag(platforms: Platform[], exit: Exit, phase: number) {
  const platWidth = 160 - phase * 18;
  const count = 6 + phase;
  
  for (let i = 0; i < count; i++) {
    const x = i % 2 === 0 ? 40 : VIRTUAL_WIDTH - platWidth - 40;
    const y = 730 - i * (120 - phase * 8);
    platforms.push({ x, y, w: platWidth, h: 30, type: 'normal' });
  }
  
  exit.x = (count - 1) % 2 === 0 ? 40 + platWidth/2 - 25 : VIRTUAL_WIDTH - platWidth - 40 + platWidth/2 - 25;
  exit.y = 730 - (count - 1) * (120 - phase * 8) - 80;
}

function generateWidePlatforms(platforms: Platform[], exit: Exit, phase: number) {
  const count = 5 + phase;
  for (let i = 0; i < count; i++) {
    const width = VIRTUAL_WIDTH - 80 - i * (40 - phase * 5) - phase * 20;
    const x = 40 + i * (20 - phase * 2);
    platforms.push({
      x, y: 750 - i * (150 - phase * 10), w: Math.max(80, width), h: 35, type: 'normal'
    });
  }
  
  exit.x = VIRTUAL_WIDTH/2 - 25;
  exit.y = 750 - (count - 1) * (150 - phase * 10) - 80;
}

function generateGentleClimb(platforms: Platform[], exit: Exit, phase: number) {
  const platWidth = 120 - phase * 10;
  let x = 50;
  let direction = 1;
  const count = 6 + phase;
  
  for (let i = 0; i < count; i++) {
    platforms.push({
      x, y: 750 - i * (120 - phase * 8), w: platWidth, h: 28, type: 'normal'
    });
    
    x += direction * (100 + phase * 10);
    if (x > VIRTUAL_WIDTH - platWidth - 50 || x < 50) {
      direction *= -1;
      x += direction * (100 + phase * 10);
    }
  }
  
  exit.x = x + platWidth/2 - 25;
  exit.y = 750 - (count - 1) * (120 - phase * 8) - 80;
}

function generateSafeSpiral(platforms: Platform[], exit: Exit, phase: number) {
  const steps = 6 + phase;
  const platWidth = 130 - phase * 12;
  
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * (1 + phase * 0.3);
    const radius = 120 + phase * 15;
    const x = VIRTUAL_WIDTH/2 + Math.cos(angle) * radius - platWidth/2;
    const y = 780 - i * (110 - phase * 8);
    platforms.push({ 
      x: Math.max(20, Math.min(VIRTUAL_WIDTH - platWidth - 20, x)), 
      y, w: platWidth, h: 28, type: 'normal' 
    });
  }
  
  exit.x = VIRTUAL_WIDTH/2 - 25;
  exit.y = 780 - (steps - 1) * (110 - phase * 8) - 80;
}

function generateAlternating(platforms: Platform[], exit: Exit, phase: number) {
  const platWidth = 140 - phase * 15;
  const count = 6 + phase;
  
  for (let i = 0; i < count; i++) {
    const x = i % 2 === 0 ? 30 : VIRTUAL_WIDTH - platWidth - 30;
    const y = 740 - i * (125 - phase * 10);
    platforms.push({ x, y, w: platWidth, h: 30, type: 'normal' });
  }
  
  exit.x = (count - 1) % 2 === 0 ? 30 + platWidth/2 - 25 : VIRTUAL_WIDTH - platWidth - 30 + platWidth/2 - 25;
  exit.y = 740 - (count - 1) * (125 - phase * 10) - 80;
}

function generateTowerClimb(platforms: Platform[], exit: Exit, phase: number) {
  const centerX = VIRTUAL_WIDTH/2 - 70;
  const platWidth = 140 - phase * 12;
  const count = 7 + phase;
  
  for (let i = 0; i < count; i++) {
    const offset = Math.sin(i * (0.7 + phase * 0.2)) * (60 + phase * 25);
    const x = Math.max(20, Math.min(VIRTUAL_WIDTH - platWidth - 20, centerX + offset));
    platforms.push({
      x, y: 780 - i * (100 - phase * 6), w: platWidth, h: 28, type: 'normal'
    });
  }
  
  exit.x = centerX + 35;
  exit.y = 780 - (count - 1) * (100 - phase * 6) - 80;
}

function generateMixedPath(platforms: Platform[], exit: Exit, phase: number) {
  const platWidth = 130 - phase * 10;
  
  platforms.push({ x: 30, y: 720, w: platWidth, h: 28, type: 'normal' });
  platforms.push({ x: 30, y: 480, w: platWidth, h: 28, type: 'normal' });
  platforms.push({ x: VIRTUAL_WIDTH - platWidth - 30, y: 600, w: platWidth, h: 28, type: 'normal' });
  platforms.push({ x: VIRTUAL_WIDTH - platWidth - 30, y: 360, w: platWidth, h: 28, type: 'normal' });
  platforms.push({ x: VIRTUAL_WIDTH/2 - platWidth/2, y: 240, w: platWidth, h: 28, type: 'normal' });
  
  if (phase >= 2) {
    platforms.push({ x: 30, y: 240, w: platWidth * 0.7, h: 28, type: 'normal' });
    platforms.push({ x: VIRTUAL_WIDTH - platWidth * 0.7 - 30, y: 120, w: platWidth * 0.7, h: 28, type: 'normal' });
    exit.x = VIRTUAL_WIDTH - platWidth * 0.7 - 30 + 20;
    exit.y = 40;
  } else {
    exit.x = VIRTUAL_WIDTH/2 - 25;
    exit.y = 160;
  }
}

function generateNarrowPath(platforms: Platform[], exit: Exit, phase: number) {
  const platWidth = 100 - phase * 8;
  const count = 8 + phase;
  
  for (let i = 0; i < count; i++) {
    const x = 50 + Math.sin(i * 1.2) * (VIRTUAL_WIDTH/2 - platWidth - 50);
    const y = 760 - i * (90 - phase * 5);
    platforms.push({ x, y, w: platWidth, h: 25, type: 'normal' });
  }
  
  exit.x = 50 + Math.sin((count - 1) * 1.2) * (VIRTUAL_WIDTH/2 - platWidth - 50) + platWidth/2 - 25;
  exit.y = 760 - (count - 1) * (90 - phase * 5) - 80;
}

function generateDiagonalClimb(platforms: Platform[], exit: Exit, phase: number) {
  const platWidth = 110 - phase * 10;
  const count = 7 + phase;
  
  let direction = 1;
  for (let i = 0; i < count; i++) {
    const x = direction > 0 ? 30 + i * 30 : VIRTUAL_WIDTH - platWidth - 30 - i * 30;
    const y = 750 - i * (100 - phase * 6);
    platforms.push({ 
      x: Math.max(20, Math.min(VIRTUAL_WIDTH - platWidth - 20, x)), 
      y, w: platWidth, h: 28, type: 'normal' 
    });
    if (i % 3 === 2) direction *= -1;
  }
  
  exit.x = VIRTUAL_WIDTH/2 - 25;
  exit.y = 750 - (count - 1) * (100 - phase * 6) - 80;
}

function generateBouncePads(platforms: Platform[], movingPlatforms: Platform[], exit: Exit, phase: number) {
  const platWidth = 120 - phase * 8;
  
  platforms.push({ x: VIRTUAL_WIDTH/2 - platWidth/2, y: 650, w: platWidth, h: 30, type: 'normal' });
  platforms.push({ x: 30, y: 450, w: platWidth, h: 30, type: 'normal' });
  platforms.push({ x: VIRTUAL_WIDTH - platWidth - 30, y: 250, w: platWidth, h: 30, type: 'normal' });
  
  // Add horizontal moving platforms
  movingPlatforms.push({
    x: VIRTUAL_WIDTH/2 - 50, y: 550, w: 100, h: 25,
    type: 'moving',
    startX: 100, range: 150, speed: 1.5 + phase * 0.3, offset: 0
  });
  
  movingPlatforms.push({
    x: VIRTUAL_WIDTH/2 - 50, y: 350, w: 100, h: 25,
    type: 'moving',
    startX: VIRTUAL_WIDTH - 200, range: 150, speed: 1.8 + phase * 0.3, offset: Math.PI
  });
  
  platforms.push({ x: VIRTUAL_WIDTH/2 - platWidth/2, y: 150, w: platWidth, h: 30, type: 'normal' });
  
  exit.x = VIRTUAL_WIDTH/2 - 25;
  exit.y = 70;
}

function generateLabyrinth(platforms: Platform[], exit: Exit, phase: number) {
  const platWidth = 100 - phase * 6;
  
  // Create a complex path
  const positions = [
    { x: 30, y: 750 },
    { x: 200, y: 680 },
    { x: 380, y: 750 },
    { x: 420, y: 600 },
    { x: 250, y: 530 },
    { x: 80, y: 600 },
    { x: 30, y: 450 },
    { x: 180, y: 380 },
    { x: 350, y: 450 },
    { x: 420, y: 300 },
    { x: 250, y: 230 },
    { x: 100, y: 300 },
    { x: 30, y: 150 }
  ];
  
  const count = Math.min(positions.length, 8 + phase);
  for (let i = 0; i < count; i++) {
    platforms.push({ 
      x: positions[i].x, 
      y: positions[i].y, 
      w: platWidth, 
      h: 25, 
      type: 'normal' 
    });
  }
  
  exit.x = positions[count - 1].x + platWidth/2 - 25;
  exit.y = positions[count - 1].y - 80;
}

function addMovingPlatforms(movingPlatforms: Platform[], phase: number, difficulty: number) {
  const count = 1 + Math.floor(phase / 2);
  
  for (let i = 0; i < count; i++) {
    const isVertical = Math.random() < 0.3;
    
    if (isVertical) {
      movingPlatforms.push({
        x: 100 + Math.random() * (VIRTUAL_WIDTH - 200),
        y: 400 + Math.random() * 200,
        w: 100 - phase * 5,
        h: 25,
        type: 'movingV',
        startY: 400 + Math.random() * 200,
        range: 60 + phase * 20,
        speed: 1 + difficulty * 1.5,
        offset: Math.random() * Math.PI * 2
      });
    } else {
      movingPlatforms.push({
        x: 150 + Math.random() * 100,
        y: 300 + Math.random() * 300,
        w: 100 - phase * 5,
        h: 25,
        type: 'moving',
        startX: 150 + Math.random() * 100,
        range: 80 + phase * 30,
        speed: 1.2 + difficulty * 1.5,
        offset: Math.random() * Math.PI * 2
      });
    }
  }
}

function addTraps(traps: Trap[], _platforms: Platform[], phase: number, difficulty: number) {
  let trapCount = 0;
  if (phase === 1) {
    trapCount = Math.random() < 0.3 + difficulty * 0.3 ? 1 : 0;
  } else if (phase === 2) {
    trapCount = 1 + (Math.random() < 0.3 + difficulty * 0.3 ? 1 : 0);
  } else if (phase === 3) {
    trapCount = 2 + (Math.random() < 0.4 + difficulty * 0.3 ? 1 : 0);
  } else {
    trapCount = 3 + Math.floor(Math.random() * 2);
  }
  
  for (let i = 0; i < trapCount; i++) {
    addSingleTrap(traps, phase, difficulty, i);
  }
}

function addSingleTrap(traps: Trap[], phase: number, difficulty: number, index: number) {
  let trapTypes: number[];
  if (phase === 1) {
    trapTypes = [1];
  } else if (phase === 2) {
    trapTypes = [0, 1, 2];
  } else if (phase === 3) {
    trapTypes = [0, 1, 2, 3];
  } else {
    trapTypes = [0, 1, 2, 3, 4];
  }
  
  const trapType = trapTypes[Math.floor(Math.random() * trapTypes.length)];
  
  let baseSpeed: number;
  if (phase === 1) baseSpeed = 1.5;
  else if (phase === 2) baseSpeed = 2.5;
  else if (phase === 3) baseSpeed = 3.5;
  else baseSpeed = 4.5;
  
  const speed = baseSpeed + difficulty * 2;
  
  switch(trapType) {
    case 0: { // Falling trap
      const fallX = 150 + Math.random() * (VIRTUAL_WIDTH - 300);
      traps.push({
        x: fallX,
        y: -150,
        w: 35,
        h: 120,
        triggered: false,
        triggerX: fallX + 17,
        speed: speed,
        action: function(p, t) {
          if (Math.abs(p.x + 20 - (t.triggerX || 0)) < 80) {
            t.y += t.speed;
          }
          if (t.y > 1000) t.y = -150;
        }
      });
      break;
    }
    case 1: { // Rising trap
      const riseX = 100 + Math.random() * (VIRTUAL_WIDTH - 200);
      const targetY = 400 + Math.random() * 300;
      traps.push({
        x: riseX,
        y: VIRTUAL_HEIGHT + 50,
        w: 50,
        h: 80,
        triggered: false,
        triggerX: riseX + 25,
        targetY: targetY,
        speed: speed * 0.8,
        action: function(p, t) {
          if (p.x > (t.triggerX || 0) - 120 && p.x < (t.triggerX || 0) + 120 && t.y > (t.targetY || 0)) {
            t.y -= t.speed;
          }
        }
      });
      break;
    }
    case 2: { // Side trap
      const fromLeft = index % 2 === 0;
      const sideY = 300 + Math.random() * 400;
      traps.push({
        x: fromLeft ? -150 : VIRTUAL_WIDTH + 50,
        y: sideY,
        w: 100,
        h: 25,
        triggered: false,
        triggerY: sideY,
        direction: fromLeft ? 1 : -1,
        speed: speed * 0.7,
        action: function(p, t) {
          if (Math.abs(p.y - (t.triggerY || 0)) < 150) {
            t.x += (t.direction || 1) * t.speed;
          }
          if ((t.direction || 1) > 0 && t.x > VIRTUAL_WIDTH + 100) {
            t.x = -150;
          } else if ((t.direction || 1) < 0 && t.x < -200) {
            t.x = VIRTUAL_WIDTH + 50;
          }
        }
      });
      break;
    }
    case 3: { // Oscillating trap
      const oscX = 100 + Math.random() * (VIRTUAL_WIDTH - 200);
      const oscY = 300 + Math.random() * 300;
      traps.push({
        x: oscX,
        y: oscY,
        w: 60,
        h: 60,
        triggered: false,
        speed: speed * 0.5,
        action: function(_p, t) {
          t.x = oscX + Math.sin(Date.now() / 500 * t.speed) * 80;
        }
      });
      break;
    }
    case 4: { // Chasing trap (advanced)
      traps.push({
        x: VIRTUAL_WIDTH / 2,
        y: 500,
        w: 40,
        h: 40,
        triggered: false,
        speed: speed * 0.3,
        action: function(p, t) {
          const dx = p.x - t.x;
          const dy = p.y - t.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 50 && dist < 300) {
            t.x += (dx / dist) * t.speed;
            t.y += (dy / dist) * t.speed * 0.5;
          }
        }
      });
      break;
    }
  }
}

function addFakePlatforms(platforms: Platform[], phase: number) {
  const fakeCount = Math.min(2, Math.floor((phase - 2) / 2) + 1);
  const eligibleIndices = platforms.slice(1, -1).map((_p, i) => i + 1);
  
  for (let i = 0; i < fakeCount && eligibleIndices.length > 0; i++) {
    const randIdx = Math.floor(Math.random() * eligibleIndices.length);
    const idx = eligibleIndices.splice(randIdx, 1)[0];
    const plat = platforms[idx];
    
    plat.type = 'fake';
    plat.originalX = plat.x;
    plat.originalY = plat.y;
    plat.shakeTime = 0;
    plat.falling = false;
    plat.action = function(p, t) {
      if (p.x + 40 > t.x && p.x < t.x + t.w && 
          p.y + 50 >= t.y - 5 && p.y + 50 <= t.y + 10) {
        t.shakeTime = (t.shakeTime || 0) + 0.016;
        
        if ((t.shakeTime || 0) > 1.2) {
          t.falling = true;
        } else {
          t.x = (t.originalX || 0) + Math.sin((t.shakeTime || 0) * 40) * 4;
        }
      }
      
      if (t.falling) {
        t.y += 8;
      }
    };
  }
}

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef({
    state: 'START' as 'START' | 'PLAYING' | 'GAMEOVER',
    levelId: 1,
    deaths: 0,
    totalTime: 0,
    combo: 0,
    maxCombo: 0,
    perfectLevels: 0,
    levelDeaths: 0,
    particles: [] as Particle[],
    ambientParticles: [] as AmbientParticle[],
    shake: 0,
    flash: 0,
    flashColor: 'white',
    time: 0,
    ghosts: [] as Ghost[],
    level: null as ReturnType<typeof generateLevel> | null,
    player: {
      x: 60, y: 800, w: 40, h: 50,
      vx: 0, vy: 0,
      speed: 7,
      jumpForce: -17,
      grounded: false,
      scaleX: 1, scaleY: 1,
      rotation: 0,
      eyeOffset: 0,
      coyoteTime: 0,
      jumpBuffer: 0,
      trail: [] as Array<{x: number; y: number; alpha: number}>
    },
    input: { left: false, right: false, up: false },
    lastFrame: 0,
    showCombo: false,
    comboTimer: 0,
    showPerfect: false,
    perfectTimer: 0,
    screenPulse: 0,
    stars: [] as Array<{x: number; y: number; size: number; speed: number}>
  });
  
  const [_updateTrigger] = useState(0);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [levelId, setLevelId] = useState(1);
  const [deaths, setDeaths] = useState(0);
  const [combo, setCombo] = useState(0);
  
  const resetLevel = useCallback(() => {
    const gs = gameStateRef.current;
    gs.level = generateLevel(gs.levelId);
    gs.player.x = gs.level.spawn.x;
    gs.player.y = gs.level.spawn.y;
    gs.player.vx = gs.player.vy = 0;
    gs.player.rotation = 0;
    gs.player.trail = [];
    gs.ghosts = [];
    
    // Initialize ambient particles
    gs.ambientParticles = [];
    for (let i = 0; i < 40; i++) {
      gs.ambientParticles.push({
        x: Math.random() * VIRTUAL_WIDTH,
        y: Math.random() * VIRTUAL_HEIGHT,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.2,
        color: gs.level.theme.ambient[Math.floor(Math.random() * gs.level.theme.ambient.length)],
        alpha: Math.random() * 0.3 + 0.1,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01
      });
    }
    
    // Initialize stars for background
    gs.stars = [];
    for (let i = 0; i < 50; i++) {
      gs.stars.push({
        x: Math.random() * VIRTUAL_WIDTH,
        y: Math.random() * VIRTUAL_HEIGHT,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.3 + 0.1
      });
    }
    
    setLevelId(gs.levelId);
  }, []);
  
  const die = useCallback(() => {
    const gs = gameStateRef.current;
    gs.deaths++;
    gs.levelDeaths++;
    gs.combo = 0;
    gs.shake = 30;
    gs.flash = 0.6;
    gs.flashColor = gs.level?.theme.trap || '#ff0000';
    audioEngine.play('death');
    
    // Death particles
    for (let i = 0; i < 30; i++) {
      gs.particles.push({
        x: gs.player.x + gs.player.w/2,
        y: gs.player.y + gs.player.h/2,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15 - 3,
        life: 1.0,
        color: gs.level?.theme.player || '#ff2d55',
        size: Math.random() * 10 + 4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.4,
        type: 'normal'
      });
    }
    
    setDeaths(gs.deaths);
    setCombo(0);
    
    setTimeout(() => resetLevel(), 350);
  }, [resetLevel]);
  
  const win = useCallback(() => {
    const gs = gameStateRef.current;
    audioEngine.play('win');
    gs.flash = 0.5;
    gs.flashColor = gs.level?.theme.exit || '#ffd700';
    gs.screenPulse = 1;
    
    // Check for perfect level (no deaths)
    const isPerfect = gs.levelDeaths === 0;
    if (isPerfect) {
      gs.perfectLevels++;
      gs.showPerfect = true;
      gs.perfectTimer = 2;
      audioEngine.play('perfect');
    }
    
    // Increase combo
    gs.combo++;
    if (gs.combo > gs.maxCombo) gs.maxCombo = gs.combo;
    gs.showCombo = true;
    gs.comboTimer = 1.5;
    
    if (gs.combo >= 3) {
      audioEngine.play('combo');
    }
    
    setCombo(gs.combo);
    
    // Win particles
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 2;
      gs.particles.push({
        x: gs.level!.exit.x + gs.level!.exit.w/2,
        y: gs.level!.exit.y + gs.level!.exit.h/2,
        vx: Math.cos(angle) * (5 + Math.random() * 5),
        vy: Math.sin(angle) * (5 + Math.random() * 5),
        life: 1.0,
        color: ['#ffd700', '#ff6600', '#00ff00'][Math.floor(Math.random() * 3)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        type: 'star'
      });
    }
    
    gs.levelId++;
    gs.levelDeaths = 0;
    
    if (gs.levelId > TOTAL_LEVELS) {
      setTimeout(() => {
        gs.state = 'GAMEOVER';
        setGameState('GAMEOVER');
      }, 600);
    } else {
      setTimeout(() => resetLevel(), 600);
    }
  }, [resetLevel]);
  
  const startGame = useCallback(() => {
    const gs = gameStateRef.current;
    gs.state = 'PLAYING';
    gs.levelId = 1;
    gs.deaths = 0;
    gs.totalTime = 0;
    gs.combo = 0;
    gs.maxCombo = 0;
    gs.perfectLevels = 0;
    gs.levelDeaths = 0;
    setGameState('PLAYING');
    setDeaths(0);
    setCombo(0);
    resetLevel();
  }, [resetLevel]);
  
  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);
  
  useEffect(() => {
    audioEngine.init();
    
    const gs = gameStateRef.current;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') gs.input.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') gs.input.right = true;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        gs.input.up = true;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') gs.input.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') gs.input.right = false;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') gs.input.up = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const gs = gameStateRef.current;
    
    const checkCollision = (a: {x: number; y: number; w: number; h: number}, b: {x: number; y: number; w: number; h: number}) => {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    };
    
    const checkTrapCollision = (player: Player, trap: Trap) => {
      const marginX = 8;
      const marginY = 8;
      const hitbox = {
        x: trap.x + marginX,
        y: trap.y + marginY,
        w: Math.max(0, trap.w - marginX * 2),
        h: Math.max(0, trap.h - marginY * 2)
      };
      return checkCollision(player, hitbox);
    };
    
    const resolveCollision = (player: Player, obj: Platform, wasGrounded: boolean) => {
      const overlapX = Math.min(player.x + player.w - obj.x, obj.x + obj.w - player.x);
      const overlapY = Math.min(player.y + player.h - obj.y, obj.y + obj.h - player.y);
      
      if (overlapX < overlapY) {
        if (player.x < obj.x) {
          player.x -= overlapX;
        } else {
          player.x += overlapX;
        }
        player.vx = 0;
      } else {
        if (player.vy > 0 && player.y < obj.y) {
          player.y = obj.y - player.h;
          player.vy = 0;
          player.grounded = true;
          
          if (!wasGrounded) {
            player.scaleX = 1.3;
            player.scaleY = 0.7;
          }
        } else if (player.vy < 0) {
          player.y = obj.y + obj.h;
          player.vy = 0;
        }
      }
    };
    
    const adjustColor = (hex: string, amount: number) => {
      const num = parseInt(hex.replace('#', ''), 16);
      const r = Math.max(0, Math.min(255, (num >> 16) + amount));
      const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
      const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
      return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
    };
    
    const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };
    
    const update = (dt: number) => {
      gs.time += dt;
      
      // Update ambient particles
      gs.ambientParticles.forEach(p => {
        p.y += p.speed;
        p.wobble += p.wobbleSpeed;
        p.x += Math.sin(p.wobble) * 0.3;
        if (p.y > VIRTUAL_HEIGHT + 20) {
          p.y = -20;
          p.x = Math.random() * VIRTUAL_WIDTH;
        }
      });
      
      // Update stars
      gs.stars.forEach(s => {
        s.y += s.speed;
        if (s.y > VIRTUAL_HEIGHT) {
          s.y = 0;
          s.x = Math.random() * VIRTUAL_WIDTH;
        }
      });
      
      // Update timers
      if (gs.comboTimer > 0) gs.comboTimer -= dt;
      else gs.showCombo = false;
      
      if (gs.perfectTimer > 0) gs.perfectTimer -= dt;
      else gs.showPerfect = false;
      
      if (gs.screenPulse > 0) gs.screenPulse -= dt * 2;
      
      if (gs.state !== 'PLAYING' || !gs.level) return;
      
      gs.totalTime += dt;
      
      // Physics
      gs.player.vy += 0.7;
      if (gs.player.vy > 15) gs.player.vy = 15;
      
      // Input
      if (gs.input.left) {
        gs.player.vx = -gs.player.speed;
        gs.player.eyeOffset = -3;
      } else if (gs.input.right) {
        gs.player.vx = gs.player.speed;
        gs.player.eyeOffset = 3;
      } else {
        gs.player.vx *= 0.85;
        gs.player.eyeOffset *= 0.9;
      }
      
      // Apply velocity
      gs.player.x += gs.player.vx;
      gs.player.y += gs.player.vy;
      
      // Wall collision
      if (gs.player.x < 0) { gs.player.x = 0; gs.player.vx = 0; }
      if (gs.player.x > VIRTUAL_WIDTH - gs.player.w) {
        gs.player.x = VIRTUAL_WIDTH - gs.player.w;
        gs.player.vx = 0;
      }
      
      // Squash & Stretch
      gs.player.scaleX += (1 - gs.player.scaleX) * 0.15;
      gs.player.scaleY += (1 - gs.player.scaleY) * 0.15;
      
      // Rotation
      gs.player.rotation += gs.player.vx * 0.01;
      gs.player.rotation *= 0.95;
      
      // Trail effect
      gs.player.trail.unshift({ x: gs.player.x, y: gs.player.y, alpha: 0.6 });
      if (gs.player.trail.length > 8) gs.player.trail.pop();
      gs.player.trail.forEach(t => t.alpha -= 0.08);
      gs.player.trail = gs.player.trail.filter(t => t.alpha > 0);
      
      // Ghost trail
      if (Math.abs(gs.player.vx) > 2 || Math.abs(gs.player.vy) > 5) {
        gs.ghosts.push({
          x: gs.player.x,
          y: gs.player.y,
          life: 0.4,
          scaleX: gs.player.scaleX,
          scaleY: gs.player.scaleY
        });
        if (gs.ghosts.length > 6) gs.ghosts.shift();
      }
      
      // Update level
      gs.level.movingPlatforms.forEach(mp => {
        if (mp.type === 'moving') {
          mp.x = (mp.startX || 0) + Math.sin(gs.time * (mp.speed || 1) + (mp.offset || 0)) * (mp.range || 0);
        } else if (mp.type === 'movingV') {
          mp.y = (mp.startY || 0) + Math.sin(gs.time * (mp.speed || 1) + (mp.offset || 0)) * (mp.range || 0);
        }
      });
      
      gs.level.traps.forEach(t => {
        if (t.action) t.action(gs.player, t);
      });
      
      gs.level.platforms.forEach(p => {
        if (p.action) p.action(gs.player, p);
      });
      
      // Platform collision
      const wasGrounded = gs.player.grounded;
      gs.player.grounded = false;
      
      const allPlatforms = [...gs.level.platforms, ...gs.level.movingPlatforms];
      
      allPlatforms.forEach(obj => {
        if (obj.y > VIRTUAL_HEIGHT + 100) return;
        if (obj.type === 'fake' && obj.y > VIRTUAL_HEIGHT) return;
        
        if (checkCollision(gs.player, obj)) {
          resolveCollision(gs.player, obj, wasGrounded);
        }
      });
      
      // Trap collision
      for (const trap of gs.level.traps) {
        if (checkTrapCollision(gs.player, trap)) {
          die();
          return;
        }
      }
      
      // Coyote time
      if (gs.player.grounded) {
        gs.player.coyoteTime = 0.2;
      } else {
        gs.player.coyoteTime -= dt;
      }
      
      // Jump buffer
      if (gs.input.up) {
        gs.player.jumpBuffer = 0.15;
      } else {
        gs.player.jumpBuffer -= dt;
      }
      
      // Jump
      const canJump = gs.player.grounded || gs.player.coyoteTime > 0;
      const wantsToJump = gs.input.up || gs.player.jumpBuffer > 0;
      
      if (canJump && wantsToJump && gs.player.vy >= 0) {
        gs.player.vy = gs.player.jumpForce;
        gs.player.grounded = false;
        gs.player.coyoteTime = 0;
        gs.player.jumpBuffer = 0;
        gs.player.scaleX = 0.7;
        gs.player.scaleY = 1.4;
        gs.shake = 3;
        audioEngine.play('jump');
        
        // Jump particles
        for (let i = 0; i < 8; i++) {
          gs.particles.push({
            x: gs.player.x + gs.player.w/2,
            y: gs.player.y + gs.player.h,
            vx: (Math.random() - 0.5) * 8,
            vy: Math.random() * 3,
            life: 0.5,
            color: gs.level.theme.platform,
            size: Math.random() * 5 + 2,
            rotation: 0,
            rotationSpeed: 0,
            type: 'spark'
          });
        }
      }
      
      // Fall death
      if (gs.player.y > VIRTUAL_HEIGHT + 50) {
        die();
        return;
      }
      
      // Exit check
      if (checkCollision(gs.player, gs.level.exit)) {
        win();
        return;
      }
      
      // Update particles
      gs.particles = gs.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5;
        p.life -= dt * 2;
        p.rotation += p.rotationSpeed;
        return p.life > 0;
      });
      
      // Update ghosts
      gs.ghosts.forEach(g => g.life -= dt * 3);
      gs.ghosts = gs.ghosts.filter(g => g.life > 0);
      
      // Decay effects
      if (gs.shake > 0) gs.shake *= 0.9;
      if (gs.flash > 0) gs.flash -= dt * 3;
    };
    
    const draw = () => {
      const theme = gs.level?.theme || THEMES.neonCity;
      const SCALE = canvas.width / VIRTUAL_WIDTH;
      
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Camera shake
      if (gs.shake > 0.5) {
        ctx.translate(
          (Math.random() - 0.5) * gs.shake * SCALE,
          (Math.random() - 0.5) * gs.shake * SCALE
        );
      }
      
      ctx.scale(SCALE, SCALE);
      
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, VIRTUAL_HEIGHT);
      gradient.addColorStop(0, theme.bg1);
      gradient.addColorStop(1, theme.bg2);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
      
      // Stars background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      gs.stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Grid effect
      ctx.strokeStyle = theme.gridColor;
      ctx.lineWidth = 1;
      const gridOffset = (gs.time * 30) % 60;
      
      for (let x = 0; x < VIRTUAL_WIDTH; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, VIRTUAL_HEIGHT);
        ctx.stroke();
      }
      
      for (let y = gridOffset; y < VIRTUAL_HEIGHT; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(VIRTUAL_WIDTH, y);
        ctx.stroke();
      }
      
      // Ambient particles
      gs.ambientParticles.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      
      if (gs.level) {
        // Draw platforms
        ctx.shadowBlur = 20;
        
        [...gs.level.platforms, ...gs.level.movingPlatforms].forEach(p => {
          if (p.y > VIRTUAL_HEIGHT + 50) return;
          
          const isFake = p.type === 'fake';
          const isMoving = p.type === 'moving' || p.type === 'movingV';
          const color = isFake ? theme.trap : (isMoving ? adjustColor(theme.platform, 30) : theme.platform);
          
          ctx.shadowColor = isFake ? theme.trapGlow : theme.platformGlow;
          
          // Platform body
          const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
          grad.addColorStop(0, color);
          grad.addColorStop(1, adjustColor(color, -30));
          ctx.fillStyle = grad;
          
          roundRect(ctx, p.x, p.y, p.w, p.h, 6);
          ctx.fill();
          
          // Highlight
          ctx.strokeStyle = 'rgba(255,255,255,0.4)';
          ctx.lineWidth = 2;
          roundRect(ctx, p.x, p.y, p.w, p.h, 6);
          ctx.stroke();
          
          // Moving platform indicator
          if (isMoving) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(p.x + p.w / 2, p.y + p.h / 2, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        
        // Draw traps
        ctx.shadowColor = theme.trapGlow;
        ctx.shadowBlur = 25;
        gs.level.traps.forEach(t => {
          if (t.y > VIRTUAL_HEIGHT + 100 || t.y + t.h < -100) return;
          
          // Trap glow
          const trapGlow = ctx.createRadialGradient(
            t.x + t.w/2, t.y + t.h/2, 0,
            t.x + t.w/2, t.y + t.h/2, Math.max(t.w, t.h)
          );
          trapGlow.addColorStop(0, theme.trap + '44');
          trapGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = trapGlow;
          ctx.fillRect(t.x - 20, t.y - 20, t.w + 40, t.h + 40);
          
          ctx.fillStyle = theme.trap;
          
          // Spiky appearance
          ctx.beginPath();
          const spikes = Math.max(3, Math.floor(t.w / 12));
          for (let i = 0; i <= spikes; i++) {
            const x = t.x + (i / spikes) * t.w;
            const y = i % 2 === 0 ? t.y : t.y + 12;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.lineTo(t.x + t.w, t.y + t.h);
          ctx.lineTo(t.x, t.y + t.h);
          ctx.closePath();
          ctx.fill();
          
          // Inner glow
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fillRect(t.x + 4, t.y + 4, t.w - 8, t.h - 8);
        });
        
        // Draw exit portal
        const exitPulse = Math.sin(gs.time * 4) * 10;
        ctx.shadowColor = theme.exit;
        ctx.shadowBlur = 40 + exitPulse;
        
        // Portal outer glow
        const portalGrad = ctx.createRadialGradient(
          gs.level.exit.x + gs.level.exit.w/2,
          gs.level.exit.y + gs.level.exit.h/2,
          0,
          gs.level.exit.x + gs.level.exit.w/2,
          gs.level.exit.y + gs.level.exit.h/2,
          60 + exitPulse
        );
        portalGrad.addColorStop(0, theme.exit);
        portalGrad.addColorStop(0.3, theme.exit + 'aa');
        portalGrad.addColorStop(0.6, theme.exit + '44');
        portalGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = portalGrad;
        ctx.fillRect(
          gs.level.exit.x - 30,
          gs.level.exit.y - 30,
          gs.level.exit.w + 60,
          gs.level.exit.h + 60
        );
        
        // Portal rings
        for (let i = 0; i < 3; i++) {
          const ringRadius = 20 + i * 10 + Math.sin(gs.time * 3 + i) * 5;
          ctx.strokeStyle = theme.exit + (80 - i * 20).toString(16);
          ctx.lineWidth = 3 - i * 0.5;
          ctx.beginPath();
          ctx.arc(
            gs.level.exit.x + gs.level.exit.w/2,
            gs.level.exit.y + gs.level.exit.h/2,
            ringRadius,
            0, Math.PI * 2
          );
          ctx.stroke();
        }
        
        // Portal core
        ctx.fillStyle = theme.exit;
        roundRect(ctx,
          gs.level.exit.x - exitPulse/4,
          gs.level.exit.y - exitPulse/4,
          gs.level.exit.w + exitPulse/2,
          gs.level.exit.h + exitPulse/2,
          12
        );
        ctx.fill();
        
        // Portal star
        ctx.fillStyle = '#ffffff';
        const starSize = 8 + Math.sin(gs.time * 5) * 3;
        ctx.save();
        ctx.translate(gs.level.exit.x + gs.level.exit.w/2, gs.level.exit.y + gs.level.exit.h/2);
        ctx.rotate(gs.time * 2);
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
          const x = Math.cos(angle) * starSize;
          const y = Math.sin(angle) * starSize;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        
        // Draw player trail
        gs.player.trail.forEach((t) => {
          ctx.globalAlpha = t.alpha * 0.3;
          ctx.fillStyle = theme.player;
          roundRect(ctx, t.x, t.y, gs.player.w, gs.player.h, 8);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        
        // Draw ghosts
        gs.ghosts.forEach(g => {
          ctx.globalAlpha = g.life * 0.5;
          ctx.fillStyle = theme.player;
          ctx.save();
          ctx.translate(g.x + gs.player.w/2, g.y + gs.player.h);
          ctx.scale(g.scaleX, g.scaleY);
          roundRect(ctx, -gs.player.w/2, -gs.player.h, gs.player.w, gs.player.h, 10);
          ctx.fill();
          ctx.restore();
        });
        ctx.globalAlpha = 1;
        
        // Draw player
        ctx.save();
        ctx.translate(gs.player.x + gs.player.w/2, gs.player.y + gs.player.h);
        ctx.rotate(gs.player.rotation);
        ctx.scale(gs.player.scaleX, gs.player.scaleY);
        
        ctx.shadowBlur = 30;
        ctx.shadowColor = theme.player;
        
        // Body gradient
        const playerGrad = ctx.createLinearGradient(0, -gs.player.h, 0, 0);
        playerGrad.addColorStop(0, theme.player);
        playerGrad.addColorStop(1, adjustColor(theme.player, -50));
        ctx.fillStyle = playerGrad;
        roundRect(ctx, -gs.player.w/2, -gs.player.h, gs.player.w, gs.player.h, 12);
        ctx.fill();
        
        // Body highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        roundRect(ctx, -gs.player.w/2, -gs.player.h, gs.player.w, gs.player.h, 12);
        ctx.stroke();
        
        // Eyes
        ctx.shadowBlur = 0;
        const eyeY = -gs.player.h * 0.6;
        
        // Eye whites with glow
        ctx.fillStyle = 'white';
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(-9 + gs.player.eyeOffset, eyeY, 9, 0, Math.PI * 2);
        ctx.arc(9 + gs.player.eyeOffset, eyeY, 9, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-7 + gs.player.eyeOffset * 1.5, eyeY, 5, 0, Math.PI * 2);
        ctx.arc(11 + gs.player.eyeOffset * 1.5, eyeY, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(-10 + gs.player.eyeOffset, eyeY - 2, 2, 0, Math.PI * 2);
        ctx.arc(8 + gs.player.eyeOffset, eyeY - 2, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
      
      // Draw particles
      gs.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.life * 0.9;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        
        if (p.type === 'star') {
          // Star shape
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
            const x = Math.cos(angle) * p.size;
            const y = Math.sin(angle) * p.size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        }
        ctx.restore();
      });
      
      // Screen pulse effect
      if (gs.screenPulse > 0) {
        ctx.globalAlpha = gs.screenPulse * 0.3;
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
        ctx.globalAlpha = 1;
      }
      
      ctx.restore();
      
      // Flash effect
      if (gs.flash > 0) {
        ctx.fillStyle = gs.flashColor + Math.floor(gs.flash * 100).toString(16).padStart(2, '0');
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Vignette effect
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.height * 0.3,
        canvas.width / 2, canvas.height / 2, canvas.height * 0.8
      );
      vignette.addColorStop(0, 'transparent');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    
    let animationId: number;
    
    const loop = () => {
      const now = performance.now();
      const dt = Math.min((now - (gs.lastFrame || now)) / 1000, 0.05);
      gs.lastFrame = now;
      
      update(dt);
      draw();
      
      animationId = requestAnimationFrame(loop);
    };
    
    loop();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [die, win]);
  
  // Handle touch controls
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const gs = gameStateRef.current;
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = (e.touches[0].clientX - rect.left) / rect.width;
    const y = (e.touches[0].clientY - rect.top) / rect.height;
    
    if (y < 0.7) {
      gs.input.up = true;
    } else {
      if (x < 0.4) gs.input.left = true;
      else if (x > 0.6) gs.input.right = true;
      else gs.input.up = true;
    }
  }, []);
  
  const handleTouchEnd = useCallback(() => {
    const gs = gameStateRef.current;
    gs.input.left = gs.input.right = gs.input.up = false;
  }, []);
  
  const getDifficultyBadge = () => {
    if (levelId <= 25) return { text: '✨ TUTORIAL', color: 'bg-cyan-500' };
    if (levelId <= 55) return { text: '🌱 EASY', color: 'bg-green-500' };
    if (levelId <= 90) return { text: '⚡ MEDIUM', color: 'bg-yellow-500' };
    if (levelId <= 125) return { text: '🔥 HARD', color: 'bg-orange-500' };
    return { text: '💀 EXTREME', color: 'bg-red-600' };
  };
  
  const badge = getDifficultyBadge();
  
  return (
    <div className="relative w-full h-screen bg-[#050510] flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1a1a3a_0%,#050510_100%)]" />
      
      {/* Game canvas */}
      <canvas
        ref={canvasRef}
        width={540}
        height={960}
        className="relative z-10 max-w-full max-h-full rounded-xl shadow-[0_0_100px_rgba(0,242,255,0.15),inset_0_0_50px_rgba(255,45,85,0.1)]"
        style={{ aspectRatio: '9/16' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={(e) => e.preventDefault()}
      />
      
      {/* UI Layer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="relative max-w-[60.75vh] w-full h-full">
          {/* HUD */}
          {gameState === 'PLAYING' && (
            <>
              <div className="absolute top-6 left-0 right-0 px-6 flex justify-between items-center">
                <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 font-bold text-white text-sm tracking-wider">
                  STAGE {levelId.toString().padStart(2, '0')}
                </div>
                <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 font-bold text-white text-sm">
                  💀 {deaths}
                </div>
              </div>
              
              {/* Difficulty badge */}
              <div className="absolute top-20 left-1/2 -translate-x-1/2">
                <div className={`${badge.color} px-4 py-1 rounded-full text-white text-xs font-bold tracking-widest animate-pulse`}>
                  {badge.text}
                </div>
              </div>
              
              {/* Combo display */}
              {combo >= 2 && (
                <div className="absolute top-32 left-1/2 -translate-x-1/2 text-center animate-bounce">
                  <div className="text-2xl font-black text-yellow-400 drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]">
                    {combo}x COMBO!
                  </div>
                  <div className="text-xs text-yellow-200/80">NO DEATH STREAK</div>
                </div>
              )}
              
              {/* Progress bar */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[80%]">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-500 rounded-full"
                    style={{ width: `${(levelId / TOTAL_LEVELS) * 100}%` }}
                  />
                </div>
                <div className="text-center text-white/50 text-xs mt-2">
                  {Math.floor((levelId / TOTAL_LEVELS) * 100)}% COMPLETE
                </div>
              </div>
            </>
          )}
          
          {/* Start Screen */}
          {gameState === 'START' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-lg pointer-events-auto">
              <div className="relative mb-4">
                <div className="absolute inset-0 w-48 h-48 bg-[radial-gradient(circle,#ff2d55_0%,transparent_70%)] opacity-30 animate-pulse" />
                <div className="text-6xl animate-bounce">👿</div>
              </div>
              
              <h1 className="text-4xl font-black text-white mb-2 tracking-wider drop-shadow-[0_0_20px_#ff2d55]">
                LEVEL DEVIL
              </h1>
              <p className="text-sm text-white/60 tracking-[0.3em] mb-4">COR-TECH EDITION</p>
              <p className="text-xs text-white/40 mb-8">{TOTAL_LEVELS} LEVELS • PROGRESSIVE DIFFICULTY</p>
              
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white font-bold px-8 py-4 rounded-full shadow-[0_0_30px_rgba(255,45,85,0.5)] hover:shadow-[0_0_50px_rgba(255,45,85,0.8)] transition-all duration-300 hover:scale-110 active:scale-95 tracking-widest"
              >
                ▶ PLAY
              </button>
              
              <p className="text-xs text-white/30 mt-8 text-center">
                ARROWS/WASD TO MOVE<br />SPACE/W/↑ TO JUMP
              </p>
            </div>
          )}
          
          {/* Game Over Screen */}
          {gameState === 'GAMEOVER' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-lg pointer-events-auto">
              <div className="text-6xl mb-4 animate-bounce">🏆</div>
              <h1 className="text-3xl font-black text-white mb-2 tracking-wider drop-shadow-[0_0_20px_#ffd700]">
                VICTORY!
              </h1>
              <p className="text-sm text-white/60 tracking-widest mb-6">ALL {TOTAL_LEVELS} LEVELS CLEARED</p>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 px-4 py-4 rounded-xl border border-white/10 text-center">
                  <div className="text-2xl font-black text-cyan-400">{deaths}</div>
                  <div className="text-xs text-white/50">DEATHS</div>
                </div>
                <div className="bg-white/5 px-4 py-4 rounded-xl border border-white/10 text-center">
                  <div className="text-2xl font-black text-yellow-400">{gameStateRef.current.maxCombo}</div>
                  <div className="text-xs text-white/50">MAX COMBO</div>
                </div>
                <div className="bg-white/5 px-4 py-4 rounded-xl border border-white/10 text-center">
                  <div className="text-2xl font-black text-green-400">{gameStateRef.current.perfectLevels}</div>
                  <div className="text-xs text-white/50">PERFECT</div>
                </div>
              </div>
              
              <button
                onClick={restartGame}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold px-8 py-4 rounded-full shadow-[0_0_30px_rgba(0,242,255,0.5)] hover:shadow-[0_0_50px_rgba(0,242,255,0.8)] transition-all duration-300 hover:scale-110 active:scale-95 tracking-widest"
              >
                🔄 RESTART
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Touch controls hint */}
      {gameState === 'PLAYING' && (
        <div className="absolute bottom-4 left-4 text-white/20 text-xs md:hidden">
          TAP LEFT/RIGHT TO MOVE • TAP UP TO JUMP
        </div>
      )}
    </div>
  );
}
