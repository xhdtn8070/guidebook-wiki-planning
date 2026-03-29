import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase(props: IconProps) {
  const { children, ...rest } = props;
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M5 12h14" />
    <path d="m13 5 7 7-7 7" />
  </IconBase>
);

export const ArrowLeft = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M19 12H5" />
    <path d="m11 5-7 7 7 7" />
  </IconBase>
);

export const ChevronDown = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m6 9 6 6 6-6" />
  </IconBase>
);

export const ChevronRight = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m9 6 6 6-6 6" />
  </IconBase>
);

export const Search = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx={11} cy={11} r={7} />
    <path d="m20 20-3.5-3.5" />
  </IconBase>
);

export const Book = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
  </IconBase>
);

export const BookOpen = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M2 6.5C2 5.1 3.1 4 4.5 4H10v16H4.5A2.5 2.5 0 0 1 2 17.5v-11Z" />
    <path d="M22 6.5C22 5.1 20.9 4 19.5 4H14v16h5.5a2.5 2.5 0 0 0 2.5-2.5v-11Z" />
  </IconBase>
);

export const Spark = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
  </IconBase>
);

export const Bell = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M15 17H5l1.4-1.4A2 2 0 0 0 7 14.2V10a5 5 0 1 1 10 0v4.2a2 2 0 0 0 .6 1.4L19 17h-4" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </IconBase>
);

export const User = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx={12} cy={8} r={4} />
    <path d="M4 20c1.8-3.3 5-5 8-5s6.2 1.7 8 5" />
  </IconBase>
);

export const Layers = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m12 3 9 4.5-9 4.5L3 7.5 12 3Z" />
    <path d="m3 12.5 9 4.5 9-4.5" />
    <path d="m3 17.5 9 4.5 9-4.5" />
  </IconBase>
);

export const Folder = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-10Z" />
  </IconBase>
);

export const FileText = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M8 3h6l5 5v13H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    <path d="M14 3v5h5" />
    <path d="M10 12h6" />
    <path d="M10 16h6" />
  </IconBase>
);

export const Lock = (props: IconProps) => (
  <IconBase {...props}>
    <rect x={4} y={11} width={16} height={10} rx={2} />
    <path d="M8 11V8a4 4 0 1 1 8 0v3" />
  </IconBase>
);

export const External = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M14 5h5v5" />
    <path d="M10 14 19 5" />
    <path d="M19 13v6H5V5h6" />
  </IconBase>
);

export const PanelLeft = (props: IconProps) => (
  <IconBase {...props}>
    <rect x={3} y={4} width={18} height={16} rx={2} />
    <path d="M9 4v16" />
  </IconBase>
);

export const Pencil = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m4 20 4.5-1 9.7-9.7a1.8 1.8 0 0 0 0-2.6l-.9-.9a1.8 1.8 0 0 0-2.6 0L5 15.5 4 20Z" />
    <path d="M13.5 6.5 17.5 10.5" />
  </IconBase>
);

export const CheckCircle = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx={12} cy={12} r={9} />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </IconBase>
);

export const Moon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M20 14.5A7.5 7.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </IconBase>
);

export const Sun = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx={12} cy={12} r={4} />
    <path d="M12 2v3" />
    <path d="M12 19v3" />
    <path d="m4.9 4.9 2.1 2.1" />
    <path d="m17 17 2.1 2.1" />
    <path d="M2 12h3" />
    <path d="M19 12h3" />
    <path d="m4.9 19.1 2.1-2.1" />
    <path d="M17 7l2.1-2.1" />
  </IconBase>
);

export const Monitor = (props: IconProps) => (
  <IconBase {...props}>
    <rect x={3} y={4} width={18} height={12} rx={2} />
    <path d="M8 20h8" />
    <path d="M12 16v4" />
  </IconBase>
);

export const Palette = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 3a9 9 0 1 0 0 18h1.2a2.8 2.8 0 0 0 0-5.6H12a2.4 2.4 0 0 1 0-4.8h3a4 4 0 0 0 0-8h-3Z" />
    <path d="M7.5 10h.01" />
    <path d="M8.5 6.5h.01" />
    <path d="M12 5h.01" />
  </IconBase>
);

export const Star = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m12 3 2.7 5.4 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.3l6-.9L12 3Z" />
  </IconBase>
);

export const Code = (props: IconProps) => (
  <IconBase {...props}>
    <path d="m8 8-4 4 4 4" />
    <path d="m16 8 4 4-4 4" />
    <path d="m14 4-4 16" />
  </IconBase>
);

export const Zap = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
  </IconBase>
);
