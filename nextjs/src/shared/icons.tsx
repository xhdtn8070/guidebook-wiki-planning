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
