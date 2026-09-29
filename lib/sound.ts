/**
 * Tiny synthesized sounds (Web Audio, no files). Off by default: a visitor
 * has to switch them on in the footer, and the choice is kept in the browser.
 */
export const SOUND_KEY = "fattula:sound";

let ctx: AudioContext | null = null;

export function soundEnabled() {
  try {
    return localStorage.getItem(SOUND_KEY) === "on";
  } catch {
    return false;
  }
}

type Tone = { freq: number; at?: number; length?: number; type?: OscillatorType; gain?: number };

function play(tones: Tone[]) {
  if (typeof window === "undefined" || !soundEnabled()) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;
    for (const t of tones) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + (t.at ?? 0);
      const length = t.length ?? 0.12;
      osc.type = t.type ?? "sine";
      osc.frequency.setValueAtTime(t.freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(t.gain ?? 0.06, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + length + 0.02);
    }
  } catch {
    /* audio is a bonus: never break the page over it */
  }
}

/** Pentatonic scale, so any run of pops sounds pleasant. */
const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];

export const sounds = {
  pop: (streak = 0) => play([{ freq: SCALE[streak % SCALE.length], length: 0.14, type: "triangle" }]),
  collect: () =>
    play([
      { freq: 659.25, length: 0.12 },
      { freq: 987.77, at: 0.09, length: 0.18 },
    ]),
  win: () =>
    play(SCALE.map((freq, i) => ({ freq, at: i * 0.08, length: 0.22, type: "triangle" as const }))),
  party: () =>
    play(
      [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
        freq: SCALE[(i * 2) % SCALE.length] * (i > 3 ? 2 : 1),
        at: i * 0.09,
        length: 0.16,
        type: "square" as const,
        gain: 0.03,
      })),
    ),
};
