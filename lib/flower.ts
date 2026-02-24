export type FlowerStage = "seed" | "sprout" | "budding" | "blooming";

export interface FlowerState {
  name: string;
  stage: FlowerStage;
  health: number;
  waterCount: number;
  wateredAt: string;
  createdAt: string;
  line: string;
}

const dialogue = {
  good: [
    "Please keep me alive.",
    "Life is beautiful!",
    "I love the sunshine!",
    "Thanks for taking care of me!",
    "I feel so healthy today!",
  ],
  mid: [
    "Please keep me alive.",
    "I could use some water...",
    "I've been better, honestly.",
    "A little attention would be nice.",
    "Don't forget about me, okay?",
  ],
  bad: [
    "Please keep me alive.",
    "I'm not doing so great...",
    "Is anyone there...?",
    "I don't want to wilt...",
    "Help... me...",
  ],
};

function pickLine(health: number): string {
  if (health === 0) return "ded";
  const lines = health > 75 ? dialogue.good : health >= 25 ? dialogue.mid : dialogue.bad;
  return lines[Math.floor(Math.random() * lines.length)];
}

// --- Pin state & listeners to globalThis so they survive HMR and are shared across all route imports ---
type FlowerListener = (state: FlowerState) => void;

interface FlowerGlobal {
  flower: FlowerState;
  listeners: Set<FlowerListener>;
  healthTimer: ReturnType<typeof setInterval> | null;
  waterTimer: ReturnType<typeof setInterval> | null;
}

const g = globalThis as unknown as { __flower?: FlowerGlobal };

if (!g.__flower) {
  const now = new Date().toISOString();
  g.__flower = {
    flower: {
      name: "Donny",
      stage: "seed",
      health: 100,
      waterCount: 0,
      wateredAt: now,
      createdAt: now,
      line: pickLine(100),
    },
    listeners: new Set(),
    healthTimer: null,
    waterTimer: null,
  };
}

const store = g.__flower;

function notify() {
  store.flower = { ...store.flower, line: pickLine(store.flower.health) };
  const snapshot = { ...store.flower };
  for (const fn of store.listeners) fn(snapshot);
}

// --- Public API ---

export function subscribe(listener: FlowerListener) {
  store.listeners.add(listener);
  return () => { store.listeners.delete(listener); };
}

export function getFlower(): FlowerState {
  return { ...store.flower };
}

export function mutateFlower(updates: Partial<FlowerState>): FlowerState {
  store.flower = { ...store.flower, ...updates };
  notify();
  return { ...store.flower };
}

export function resetFlower(): FlowerState {
  const now = new Date().toISOString();
  store.flower = { name: "Donny", stage: "seed", health: 100, waterCount: 0, wateredAt: now, createdAt: now, line: pickLine(100) };
  console.log(`[flower] reset!`);
  notify();
  return { ...store.flower };
}

export function waterFlower(): FlowerState {
  store.flower = {
    ...store.flower,
    waterCount: store.flower.waterCount + 1,
    wateredAt: new Date().toISOString(),
  };

  if (store.flower.waterCount > 3) {
    store.flower = { ...store.flower, health: Math.max(0, store.flower.health - 20) };
    console.log(`[flower] overwatered! waterCount=${store.flower.waterCount}, health=${store.flower.health}`);
  } else {
    store.flower = { ...store.flower, health: Math.min(100, store.flower.health + 10) };
    console.log(`[flower] watered! waterCount=${store.flower.waterCount}, health=${store.flower.health}`);
  }

  notify();
  return { ...store.flower };
}

// --- Decay timers (only start once) ---
const DECAY_INTERVAL_MS = 30_000;
const DECAY_AMOUNT = 5;
const WATER_DECAY_INTERVAL_MS = DECAY_INTERVAL_MS * 3;

// Clear old timers before starting new ones (survives HMR)
if (store.healthTimer) clearInterval(store.healthTimer);
if (store.waterTimer) clearInterval(store.waterTimer);

store.healthTimer = setInterval(() => {
  const prev = store.flower.health;
  store.flower = { ...store.flower, health: Math.max(0, prev - DECAY_AMOUNT) };
  console.log(`[flower] health decayed: ${prev} → ${store.flower.health}`);
  notify();
}, DECAY_INTERVAL_MS);

store.waterTimer = setInterval(() => {
  if (store.flower.waterCount > 0) {
    const prev = store.flower.waterCount;
    store.flower = { ...store.flower, waterCount: prev - 1 };
    console.log(`[flower] waterCount decayed: ${prev} → ${store.flower.waterCount}`);
    notify();
  }
}, WATER_DECAY_INTERVAL_MS);

if (typeof store.healthTimer === "object" && "unref" in store.healthTimer) store.healthTimer.unref();
if (typeof store.waterTimer === "object" && "unref" in store.waterTimer) store.waterTimer.unref();
