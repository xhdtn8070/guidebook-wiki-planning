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
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ChevronLeft = (props: IconProps) => (
  <IconBase {...props}>
    <polyline points="15 18 9 12 15 6" />
  </IconBase>
);

export const ChevronRight = (props: IconProps) => (
  <IconBase {...props}>
    <polyline points="9 18 15 12 9 6" />
  </IconBase>
);

export const ChevronDown = (props: IconProps) => (
  <IconBase {...props}>
    <polyline points="6 9 12 15 18 9" />
  </IconBase>
);

export const BookOpen = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a4 4 0 0 0-4-4H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a4 4 0 0 1 4-4h6z" />
  </IconBase>
);

export const GitBranch = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M6 3v12" />
    <circle cx={6} cy={18} r={3} />
    <circle cx={18} cy={6} r={3} />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </IconBase>
);

export const Search = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx={11} cy={11} r={8} />
    <line x1={21} y1={21} x2={16.65} y2={16.65} />
  </IconBase>
);

export const Server = (props: IconProps) => (
  <IconBase {...props}>
    <rect x={2} y={2} width={20} height={8} rx={2} ry={2} />
    <rect x={2} y={14} width={20} height={8} rx={2} ry={2} />
    <line x1={6} y1={6} x2={6.01} y2={6} />
    <line x1={6} y1={18} x2={6.01} y2={18} />
  </IconBase>
);

export const ShieldCheck = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </IconBase>
);

export const Zap = (props: IconProps) => (
  <IconBase {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </IconBase>
);

export const FileText = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1={8} y1={13} x2={16} y2={13} />
    <line x1={8} y1={17} x2={16} y2={17} />
  </IconBase>
);

export const Folder = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6l2 2h8a2 2 0 0 1 2 2z" />
  </IconBase>
);

export const Lock = (props: IconProps) => (
  <IconBase {...props}>
    <rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </IconBase>
);

export const Sun = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx={12} cy={12} r={4} />
    <line x1={12} y1={2} x2={12} y2={4} />
    <line x1={12} y1={20} x2={12} y2={22} />
    <line x1={4.22} y1={4.22} x2={5.64} y2={5.64} />
    <line x1={18.36} y1={18.36} x2={19.78} y2={19.78} />
    <line x1={2} y1={12} x2={4} y2={12} />
    <line x1={20} y1={12} x2={22} y2={12} />
    <line x1={4.22} y1={19.78} x2={5.64} y2={18.36} />
    <line x1={18.36} y1={5.64} x2={19.78} y2={4.22} />
  </IconBase>
);

export const Moon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </IconBase>
);

export const Monitor = (props: IconProps) => (
  <IconBase {...props}>
    <rect x={2} y={3} width={20} height={14} rx={2} ry={2} />
    <line x1={8} y1={21} x2={16} y2={21} />
    <line x1={12} y1={17} x2={12} y2={21} />
  </IconBase>
);

export const Palette = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M21 14c0 4-4.03 8-9 8s-9-4.03-9-9 4.03-9 9-9a9 9 0 0 1 3.32.6c1.02.4 1.68 1.46 1.68 2.57a2.4 2.4 0 0 1-2.4 2.4H12a3 3 0 0 0 0 6h1" />
    <circle cx={7.5} cy={10.5} r={1.5} />
    <circle cx={12} cy={7.5} r={1.5} />
    <circle cx={16.5} cy={10.5} r={1.5} />
  </IconBase>
);

export const User = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx={12} cy={7} r={4} />
    <path d="M5.5 21v-2a4.5 4.5 0 0 1 4.5-4.5h4a4.5 4.5 0 0 1 4.5 4.5v2" />
  </IconBase>
);

export const Code2 = (props: IconProps) => (
  <IconBase {...props}>
    <polyline points="18 16 22 12 18 8" />
    <polyline points="6 8 2 12 6 16" />
    <line x1={14} y1={4} x2={10} y2={20} />
  </IconBase>
);

export const Edit = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z" />
  </IconBase>
);

export const Star = (props: IconProps) => (
  <IconBase {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21 12 17.77 5.82 21 7 14.14 2 9.27 8.91 8.26 12 2" />
  </IconBase>
);
