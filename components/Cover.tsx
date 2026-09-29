import { withBase } from "@/lib/format";

const PALETTE = ["#a97cff", "#6b3fd9", "#d8c3ff", "#e36fd8", "#ffc4a3", "#3b2466"];

function hash(str: string) {
  let h = 2166136261;
  for (const ch of str) {
    h ^= ch.codePointAt(0)!;
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A fresh seeded random stream and a colour picker that draws from it. */
function generator(seed: string, colors: string[]) {
  const r = rng(hash(seed));
  const pick = () => colors[Math.floor(r() * colors.length)];
  return { r, pick };
}

const W = 320;
const H = 200;

function Orbits({ seed, colors }: Pattern) {
  const { r, pick } = generator(seed, colors);
  const cx = 60 + r() * 200;
  const cy = 40 + r() * 120;
  return (
    <>
      {Array.from({ length: 7 }, (_, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={24 + i * 26}
          fill="none"
          stroke={pick()}
          strokeWidth={4 + r() * 14}
          strokeDasharray={r() > 0.5 ? `${10 + r() * 60} ${6 + r() * 20}` : undefined}
          opacity={0.35 + r() * 0.6}
        />
      ))}
      <circle cx={cx} cy={cy} r={10 + r() * 10} fill={pick()} />
    </>
  );
}

function Stripes({ seed, colors }: Pattern) {
  const { r, pick } = generator(seed, colors);
  const angle = -35 + r() * 70;
  let x = -120;
  const bands = [];
  while (x < W + 120) {
    const w = 8 + r() * 36;
    bands.push(
      <rect key={x} x={x} y={-100} width={w} height={H + 200} fill={pick()} opacity={0.4 + r() * 0.6} />,
    );
    x += w + 4 + r() * 18;
  }
  return <g transform={`rotate(${angle} ${W / 2} ${H / 2})`}>{bands}</g>;
}

function Dots({ seed, colors }: Pattern) {
  const { r, pick } = generator(seed, colors);
  const step = 22 + Math.floor(r() * 10);
  const fx = r() * W;
  const fy = r() * H;
  const dots = [];
  for (let y = step / 2; y < H; y += step) {
    for (let x = step / 2; x < W; x += step) {
      const d = Math.hypot(x - fx, y - fy) / 260;
      dots.push(
        <circle key={`${x}-${y}`} cx={x} cy={y} r={Math.max(1.2, (step / 2) * (1 - d))} fill={pick()} />,
      );
    }
  }
  return <>{dots}</>;
}

type Pattern = { seed: string; colors: string[] };
const PATTERNS = [Orbits, Stripes, Dots];

/** Project cover: an image if one is set, otherwise a pattern drawn from the slug. */
export default function Cover({ seed, src, alt = "" }: { seed: string; src?: string; alt?: string }) {
  if (src) return <img className="cover" src={withBase(src)} alt={alt} loading="lazy" />;

  const rotate = hash(seed + "c") % PALETTE.length;
  const colors = PALETTE.slice(rotate).concat(PALETTE.slice(0, rotate)).slice(0, 3);
  const Pattern = PATTERNS[hash(seed + "p") % PATTERNS.length];

  return (
    <svg className="cover" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
      <rect width={W} height={H} fill="#21143a" />
      <Pattern seed={seed} colors={colors} />
    </svg>
  );
}
