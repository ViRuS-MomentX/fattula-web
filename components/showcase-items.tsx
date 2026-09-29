import type { ReactNode } from "react";
import { withBase } from "@/lib/format";

export type ShowcaseItem = {
  name: string;
  source: string;
  kind: "Игра" | "Сериал" | "Фильм" | "Мем";
  fact: string;
  glow: string;
  art: ReactNode;
};

/* Pixel-art diamond pickaxe: a quarter ring for the head, a diagonal for the handle. */
function Pickaxe() {
  const cells: ReactNode[] = [];
  const size = 14;
  const px = 200 / (size + 2);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - 2, y - 11);
      let fill: string | null = null;
      if (d >= 9.2 && d <= 11 && x >= 2 && y <= 11) fill = d < 10.1 ? "#1ba3ad" : "#4ee2ec";
      else if (x + y === 13 && x <= 8) fill = x % 2 ? "#8b5a2b" : "#5c3a1a";
      if (fill)
        cells.push(
          <rect key={`${x}-${y}`} x={(x + 1) * px} y={(y + 1) * px} width={px + 0.5} height={px + 0.5} fill={fill} />,
        );
    }
  }
  return <svg viewBox="0 0 200 200">{cells}</svg>;
}

export const ITEMS: ShowcaseItem[] = [
  {
    name: "Трифорс",
    source: "The Legend of Zelda",
    kind: "Игра",
    fact: "Три золотых треугольника: Сила, Мудрость и Смелость. Вокруг них строится почти каждая часть серии.",
    glow: "#f5c542",
    art: (
      <svg viewBox="0 0 200 200">
        <g fill="#f5c542" stroke="#b8860b" strokeWidth="3" strokeLinejoin="round">
          <path d="M100 22 138 88H62Z" />
          <path d="M62 92 100 158H24Z" />
          <path d="M138 92 176 158H100Z" />
        </g>
      </svg>
    ),
  },
  {
    name: "Алмазная кирка",
    source: "Minecraft",
    kind: "Игра",
    fact: "Без неё не добыть обсидиан, а без обсидиана не построить портал в Незер.",
    glow: "#4ee2ec",
    art: <Pickaxe />,
  },
  {
    name: "Гирлянда-алфавит",
    source: "Очень странные дела",
    kind: "Сериал",
    fact: "Джойс развешивает лампочки над нарисованным на стене алфавитом, чтобы сын мог отвечать ей из Изнанки.",
    glow: "#ff8a3d",
    art: (
      <svg viewBox="0 0 200 200">
        <rect x="14" y="30" width="172" height="140" rx="10" fill="#e9dcc0" />
        <path d="M14 58 Q42 80 68 60 T122 62 T186 58" fill="none" stroke="#2f3a26" strokeWidth="3" />
        {[
          [30, 68, "#ff4d4d"],
          [56, 70, "#ffd23d"],
          [82, 58, "#4dd8ff"],
          [108, 64, "#62e06b"],
          [134, 68, "#ff4d4d"],
          [160, 60, "#ff8a3d"],
        ].map(([x, y, c], i) => (
          <g key={i}>
            <circle cx={x as number} cy={(y as number) + 10} r="11" fill={c as string} opacity="0.35" />
            <ellipse cx={x as number} cy={(y as number) + 9} rx="5" ry="7" fill={c as string} />
          </g>
        ))}
        <g fill="#20140f" fontFamily="Georgia, serif" fontSize="44" fontWeight="700" textAnchor="middle">
          <text x="56" y="140">R</text>
          <text x="100" y="140">U</text>
          <text x="144" y="140">N</text>
        </g>
      </svg>
    ),
  },
  {
    name: "Куб-компаньон",
    source: "Portal",
    kind: "Игра",
    fact: "Единственный друг героини в испытательной камере. В конце уровня его приходится отправить в мусоросжигатель.",
    glow: "#f58cc4",
    art: (
      <svg viewBox="0 0 200 200">
        <rect x="28" y="28" width="144" height="144" rx="16" fill="#a3a8b8" />
        <g fill="#6d7385">
          <path d="M28 44a16 16 0 0 1 16-16h30v18H46v28H28Z" />
          <path d="M172 44a16 16 0 0 0-16-16h-30v18h28v28h18Z" />
          <path d="M28 156a16 16 0 0 0 16 16h30v-18H46v-28H28Z" />
          <path d="M172 156a16 16 0 0 1-16 16h-30v-18h28v-28h18Z" />
        </g>
        <circle cx="100" cy="100" r="40" fill="#d8dbe4" stroke="#6d7385" strokeWidth="6" />
        <path d="M100 122c-18-12-26-20-26-31a13 13 0 0 1 26-3 13 13 0 0 1 26 3c0 11-8 19-26 31Z" fill="#f58cc4" />
      </svg>
    ),
  },
  {
    name: "Щит Капитана Америки",
    source: "Первый мститель",
    kind: "Фильм",
    fact: "Щит из вибраниума гасит почти любой удар. А если его бросить, он может отскочить от стены и вернуться к хозяину.",
    glow: "#3b6fd9",
    art: (
      <svg viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="84" fill="#b3122e" />
        <circle cx="100" cy="100" r="67" fill="#eceef4" />
        <circle cx="100" cy="100" r="51" fill="#c8102e" />
        <circle cx="100" cy="100" r="35" fill="#0b3d91" />
        <path d="M100.0 70.0 L107.1 90.3 L128.5 90.7 L111.4 103.7 L117.6 124.3 L100.0 112.0 L82.4 124.3 L88.6 103.7 L71.5 90.7 L92.9 90.3Z" fill="#eceef4" />
        <path d="M40 60A72 72 0 0 1 120 30" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.35" />
      </svg>
    ),
  },
  {
    name: "Печенье дальгона",
    source: "Игра в кальмара",
    kind: "Сериал",
    fact: "Во втором испытании фигуру нужно вырезать из сахарного печенья иглой. Сломал — выбыл.",
    glow: "#e0a458",
    art: (
      <svg viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="78" fill="#b8742f" />
        <circle cx="100" cy="100" r="68" fill="#d9a45b" />
        <g fill="none" stroke="#8a4f1d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M58 100Q100 42 142 100Q131 90 121 100Q110 90 100 100Q90 90 79 100Q69 90 58 100Z" />
          <path d="M100 100V140q0 10-10 10q-9 0-9-9" />
        </g>
      </svg>
    ),
  },
  {
    name: "Голубые кристаллы",
    source: "Во все тяжкие",
    kind: "Сериал",
    fact: "Фирменный знак Уолтера Уайта: голубой цвет выдавал продукт, которого не было ни у кого другого.",
    glow: "#6fd3ff",
    art: (
      <svg viewBox="0 0 200 200">
        <g stroke="#1d6f9c" strokeWidth="2.5" strokeLinejoin="round">
          <path d="M60 150 78 70 104 58 112 140Z" fill="#6fd3ff" />
          <path d="M78 70 104 58 96 142 60 150Z" fill="#a8e8ff" opacity="0.7" />
          <path d="M104 152 122 48 150 62 142 150Z" fill="#3ba6e0" />
          <path d="M122 48 150 62 132 152Z" fill="#6fd3ff" opacity="0.8" />
          <path d="M40 156 50 110 70 104 72 156Z" fill="#a8e8ff" />
          <path d="M140 158 152 116 170 122 164 158Z" fill="#6fd3ff" />
        </g>
      </svg>
    ),
  },
  {
    name: "Член экипажа",
    source: "Among Us",
    kind: "Игра",
    fact: "Выполняет задания на корабле. Или только делает вид, если на самом деле он предатель.",
    glow: "#ff4d57",
    art: (
      <svg viewBox="0 0 200 200">
        <rect x="42" y="74" width="28" height="60" rx="10" fill="#a31d2a" />
        <path d="M64 70Q64 30 106 30Q148 30 148 74V160H122V138H96V160H64Z" fill="#e0343b" />
        <rect x="98" y="54" width="62" height="34" rx="17" fill="#9fd8f0" stroke="#3b5a6a" strokeWidth="4" />
        <rect x="112" y="60" width="26" height="9" rx="4.5" fill="#fff" opacity="0.8" />
      </svg>
    ),
  },
  {
    name: "Супергриб",
    source: "Super Mario",
    kind: "Игра",
    fact: "Съешь его — и Марио вырастет вдвое. Пропустишь удар — снова станет маленьким.",
    glow: "#ff5a5f",
    art: (
      <svg viewBox="0 0 200 200">
        <rect x="64" y="96" width="72" height="66" rx="24" fill="#f5e6c8" />
        <rect x="84" y="112" width="9" height="22" rx="4.5" fill="#20140f" />
        <rect x="107" y="112" width="9" height="22" rx="4.5" fill="#20140f" />
        <path d="M30 110Q30 36 100 36Q170 36 170 110Z" fill="#e5383b" />
        <g fill="#fff">
          <circle cx="100" cy="64" r="20" />
          <circle cx="52" cy="94" r="13" />
          <circle cx="148" cy="94" r="13" />
        </g>
      </svg>
    ),
  },
  {
    name: "Будущий владелец сайта",
    source: "fattula",
    kind: "Мем",
    fact: "Лично проверяет каждый пиксель. Если вы долистали досюда, он вами доволен.",
    glow: "#d9985f",
    art: <img className="showcase__photo" src={withBase("/images/owner.webp")} alt="" loading="lazy" decoding="async" />,
  },
];
