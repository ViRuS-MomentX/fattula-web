type IconProps = { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const SearchIcon = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
);

export const ArchiveIcon = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <rect x="3" y="4" width="18" height="5" rx="1.5" />
    <path d="M5 9v9.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V9M10 13h4" />
  </svg>
);

export const RssIcon = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M5 5a14 14 0 0 1 14 14M5 11a8 8 0 0 1 8 8" />
    <circle cx="6" cy="18" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);

export const BackIcon = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const ExternalIcon = ({ size = 16 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M14 5h5v5M19 5l-8 8M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
  </svg>
);

export const HomeIcon = ({ size = 20 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1Z" />
  </svg>
);

export const PostsIcon = ({ size = 20 }: IconProps) => (
  <svg {...base(size)}>
    <rect x="5" y="3.5" width="14" height="17" rx="2" />
    <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
  </svg>
);

export const ProjectsIcon = ({ size = 20 }: IconProps) => (
  <svg {...base(size)}>
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" />
  </svg>
);

export const ClockIcon = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l2.5 2.5" />
  </svg>
);

export const CompassIcon = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="8" />
    <path d="m15 9-2 4-4 2 2-4Z" />
  </svg>
);

export const ListIcon = ({ size = 18 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M9 6h11M9 12h11M9 18h11" />
    <circle cx="4.5" cy="6" r="1" fill="currentColor" stroke="none" />
    <circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="4.5" cy="18" r="1" fill="currentColor" stroke="none" />
  </svg>
);
