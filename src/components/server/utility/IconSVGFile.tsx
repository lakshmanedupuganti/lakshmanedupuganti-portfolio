type IconSVGFileProps = {
  width?: number;
  height?: number;
  background?: string;
  color?: string;
  className?: string;
} & React.SVGProps<SVGSVGElement & SVGCircleElement & SVGRectElement>;

export function ModalCloseIcon(props: IconSVGFileProps) {
  const { width = 17, height = 17, color = "white", className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      fill="none"
      {...props}
    >
      <rect
        width="20.5671"
        height="2.2747"
        transform="matrix(0.710531 0.703666 -0.710531 0.703666 1.61719 0)"
        fill={color}
      />
      <rect
        width="20.5671"
        height="2.2747"
        transform="matrix(0.710531 -0.703666 0.710531 0.703666 0 14.4727)"
        fill={color}
      />
    </svg>
  );
}

export function CloseIconInCircle(props: IconSVGFileProps) {
  const {
    width = 55,
    height = 55,
    color = "#0067AC",
    className,
    background = "#0067AC",
  } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 55 55"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M40.597 14.534 15.4 39.732m0-25.198 25.198 25.198"
        stroke={color}
        strokeWidth="6"
      />
      <circle
        cx="27.911"
        cy="27.089"
        r="25.089"
        stroke={background}
        strokeWidth="4"
      />
    </svg>
  );
}

export function CloseBtnIcon(props: IconSVGFileProps) {
  const { width = 17, height = 17, color = "white", className } = props;
  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
      class="${className}"
      viewBox="0 0 ${width} ${height}"
      fill="none"
      ${Object.entries(props)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ")}
    >
      <rect
        width="20.5671"
        height="2.2747"
        transform="matrix(0.710531 0.703666 -0.710531 0.703666 1.61719 0)"
        fill="${color}"
        ${Object.entries(props)
          .map(([key, value]) => `${key}="${value}"`)
          .join(" ")}
      />
      <rect
        width="20.5671"
        height="2.2747"
        transform="matrix(0.710531 -0.703666 0.710531 0.703666 0 14.4727)"
        fill="${color}"
        ${Object.entries(props)
          .map(([key, value]) => `${key}="${value}"`)
          .join(" ")}
      />
    </svg>
  `;
}

export function CaretArrowDownIcon(props: IconSVGFileProps) {
  const {
    width = 30,
    height = 30,
    background = "#FFF4E8",
    color = "#2B2B2B",
    className,
  } = props;
  return `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
      className="${className}"
      viewBox="${`0 0 ${width} ${height}`}"
      fill="none"
      ${Object.entries(props)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ")}
    >
      <circle
        cx="15"
        cy="15"
        r="15"
        transform="rotate(90 15 15)"
        fill="${background}"
        ${Object.entries(props)
          .map(([key, value]) => `${key}="${value}"`)
          .join(" ")}

      />
      <path
        d="M14.3086 18.5742C14.4141 18.6445 14.5195 18.6797 14.625 18.6797C14.7656 18.6797 14.8359 18.6445 14.9063 18.5742L20.1445 13.4062C20.2148 13.3008 20.25 13.1953 20.25 13.0898C20.25 12.9844 20.2148 12.8789 20.1094 12.8086L19.4414 12.1055C19.3711 12.0352 19.2656 12 19.125 12C19.0195 12 18.9141 12.0352 18.8438 12.1055L14.625 16.2891L10.4063 12.1055C10.3359 12.0352 10.2656 12 10.125 12C10.0195 12 9.91406 12.0352 9.80859 12.1055L9.10547 12.8086C9.03516 12.8789 9 12.9844 9 13.0898C9 13.1953 9.03516 13.3008 9.10547 13.4062L14.3086 18.5742Z"
        fill="${color}"
      />
    </svg>`;
}

export function CaretArrowUpIcon(props: IconSVGFileProps) {
  const {
    width = 30,
    height = 30,
    background = "#0067AC",
    color = "white",
    className,
  } = props;
  return `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
      className="${className}"
      viewBox="${`0 0 ${width} ${height}`}"
      fill="none"
      ${Object.entries(props)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ")}
    >
      <circle
        cx="15"
        cy="15"
        r="15"
        transform="rotate(90 15 15)"
        fill="${background}"
        ${Object.entries(props)
          .map(([key, value]) => `${key}="${value}"`)
          .join(" ")}
      />
      <path
        d="M14.3086 12.1055C14.4141 12.0352 14.5195 12 14.625 12C14.7656 12 14.8359 12.0352 14.9063 12.1055L20.1445 17.2734C20.2148 17.3789 20.25 17.4844 20.25 17.5898C20.25 17.6953 20.2148 17.8008 20.1094 17.8711L19.4414 18.5742C19.3711 18.6445 19.2656 18.6797 19.125 18.6797C19.0195 18.6797 18.9141 18.6445 18.8438 18.5742L14.625 14.3906L10.4063 18.5742C10.3359 18.6445 10.2656 18.6797 10.125 18.6797C10.0195 18.6797 9.91406 18.6445 9.80859 18.5742L9.10547 17.8711C9.03516 17.8008 9 17.6953 9 17.5898C9 17.4844 9.03516 17.3789 9.10547 17.2734L14.3086 12.1055Z"
        fill="${color}"
      />
    </svg>`;
}

export function CaretArrowRightIcon(props: IconSVGFileProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="175"
      height="36"
      viewBox="0 0 175 36"
      fill="none"
    >
      <circle cx="15" cy="18" r="15" fill="#FFF4E8" />
      <path
        d="M10.1055 17.3086C10.0352 17.4141 10 17.5195 10 17.625C10 17.7656 10.0352 17.8359 10.1055 17.9063L15.2734 23.1445C15.3789 23.2148 15.4844 23.25 15.5898 23.25C15.6953 23.25 15.8008 23.2148 15.8711 23.1094L16.5742 22.4414C16.6445 22.3711 16.6797 22.2656 16.6797 22.125C16.6797 22.0195 16.6445 21.9141 16.5742 21.8438L12.3906 17.625L16.5742 13.4063C16.6445 13.3359 16.6797 13.2656 16.6797 13.125C16.6797 13.0195 16.6445 12.9141 16.5742 12.8086L15.8711 12.1055C15.8008 12.0352 15.6953 12 15.5898 12C15.4844 12 15.3789 12.0352 15.2734 12.1055L10.1055 17.3086Z"
        fill="#2B2B2B"
      />
      <circle
        cx="15"
        cy="18"
        r="16.5"
        stroke="url(#paint0_linear_4229_661)"
        strokeWidth="3"
      />
      <defs>
        <linearGradient
          id="paint0_linear_4229_661"
          x1="142"
          y1="18"
          x2="172"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF7A00" />
          <stop offset="1" stopColor="#FFB347" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CarouselPrevIcon(props: IconSVGFileProps) {
  const {
    width = 40,
    height = 40,
    id,
    className = "prev-lineargradient",
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={"carousel-next-icon"}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <circle
        cx="18"
        cy="18"
        r="15"
        fill="#FFF4E8"
        className={"carousel-prev-icon"}
      />
      <path
        d="M13.426 18.0586C13.355 18.1641 13.32 18.2695 13.32 18.375C13.32 18.5156 13.355 18.5859 13.426 18.6562L18.594 23.8945C18.699 23.9648 18.805 24 18.91 24C19.016 24 19.121 23.9648 19.191 23.8594L19.895 23.1914C19.965 23.1211 20 23.0156 20 22.875C20 22.7695 19.965 22.6641 19.895 22.5938L15.711 18.375L19.895 14.1562C19.965 14.0859 20 14.0156 20 13.875C20 13.7695 19.965 13.6641 19.895 13.5586L19.191 12.8555C19.121 12.7852 19.016 12.75 18.91 12.75C18.805 12.75 18.699 12.7852 18.594 12.8555L13.426 18.0586Z"
        fill="#2B2B2B"
      />
      <circle
        cx="18"
        cy="18"
        r="16.5"
        stroke={`url(#${id || "paint0_linear_4284_4002"})`}
        strokeWidth="3"
        className={className}
      />
      <defs>
        <linearGradient
          id={id || "paint0_linear_4284_4002"}
          x1="3"
          y1="18"
          x2="33"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF7A00" />
          <stop offset="1" stopColor="#FFB347" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CarouselNextIcon(props: IconSVGFileProps) {
  const {
    width = 40,
    height = 40,
    id,
    className = "next-lineargradient",
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={"carousel-next-icon"}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <circle
        cx="20"
        cy="20"
        r="15"
        fill="#FFF4E8"
        className="carousel-next-icon"
      />
      <path
        d="M24.574 19.9414C24.645 19.8359 24.68 19.7305 24.68 19.625C24.68 19.4844 24.645 19.4141 24.574 19.3437L19.406 14.1055C19.301 14.0352 19.195 14 19.09 14C18.984 14 18.879 14.0352 18.809 14.1406L18.105 14.8086C18.035 14.8789 18 14.9844 18 15.125C18 15.2305 18.035 15.3359 18.105 15.4062L22.289 19.625L18.105 23.8437C18.035 23.9141 18 23.9844 18 24.125C18 24.2305 18.035 24.3359 18.105 24.4414L18.809 25.1445C18.879 25.2148 18.984 25.25 19.09 25.25C19.195 25.25 19.301 25.2148 19.406 25.1445L24.574 19.9414Z"
        fill="#2B2B2B"
      />
      <circle
        cx="20"
        cy="20"
        r="16.5"
        stroke={`url(#${id || "paint0_linear_4284_4003"})`}
        strokeWidth="3"
        className={className}
      />
      <defs>
        <linearGradient
          id={id || "paint0_linear_4284_4003"}
          x1="5"
          y1="20"
          x2="35"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF7A00" />
          <stop offset="1" stopColor="#FFB347" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CarouselPauseIcon(props: IconSVGFileProps) {
  const { color = "#fff" } = props;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z" fill="${color}"/>
</svg>`;
}

export function CarouselPlayIcon(props: IconSVGFileProps) {
  const { color = "#fff" } = props;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M8.5 8.64L13.77 12L8.5 15.36V8.64ZM6.5 5V19L17.5 12L6.5 5Z" fill="${color}"/>
</svg>`;
}

export function CarouselProgressIcon(props: IconSVGFileProps) {
  const {
    width = 50,
    height = 50,
    className = "progressRing",
    background = "transparent",
    color = "#fff",
  } = props;

  const radius = width / 2 + 4;
  const length = Math.ceil(Math.PI * 2 * radius);

  return (
    <svg
      className={className}
      width={width}
      height={height}
      strokeDasharray={length}
      strokeDashoffset={length}
    >
      <circle
        r={radius}
        cx={width / 2}
        cy={height / 2}
        stroke={color}
        strokeWidth="3"
        fill={background}
      />
    </svg>
  );
}

export function SliderArrowRight(props: IconSVGFileProps) {
  const { className, width = "6", height = "9" } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      fill="none"
    >
      <path
        d="M4.92105 3.775C4.97368 3.85 5 3.925 5 4C5 4.1 4.97368 4.15 4.92105 4.2L1.05263 7.925C0.973684 7.975 0.894737 8 0.81579 8C0.736843 8 0.657895 7.975 0.605264 7.9L0.0789475 7.425C0.0263161 7.375 4.46239e-07 7.3 4.41868e-07 7.2C4.3859e-07 7.125 0.0263161 7.05 0.0789475 7L3.21053 4L0.0789472 1C0.0263159 0.95 1.66486e-07 0.9 1.62115e-07 0.8C1.58837e-07 0.725 0.0263158 0.65 0.0789472 0.575L0.605263 0.0750001C0.657895 0.025 0.736842 3.26486e-07 0.815789 3.2044e-07C0.894737 3.14394e-07 0.973684 0.0249999 1.05263 0.0750001L4.92105 3.775Z"
        fill="#211F1D"
      />
    </svg>
  );
}

export function SliderArrowLeft(props: IconSVGFileProps) {
  const { className, width = "6", height = "9" } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      fill="none"
    >
      <path
        d="M0.0789474 3.775C0.0263158 3.85 4.85939e-08 3.925 4.76995e-08 4C4.6507e-08 4.1 0.0263158 4.15 0.0789474 4.2L3.94737 7.925C4.02632 7.975 4.10526 8 4.18421 8C4.26316 8 4.3421 7.975 4.39474 7.9L4.92105 7.425C4.97368 7.375 5 7.3 5 7.2C5 7.125 4.97368 7.05 4.92105 7L1.78947 4L4.92105 1C4.97368 0.95 5 0.9 5 0.8C5 0.725 4.97368 0.65 4.92105 0.575L4.39474 0.075C4.34211 0.0249998 4.26316 1.90975e-07 4.18421 1.87439e-07C4.10526 1.83902e-07 4.02632 0.0249998 3.94737 0.075L0.0789474 3.775Z"
        fill="#211F1D"
      />
    </svg>
  );
}

export function PlayButton(props: IconSVGFileProps) {
  const { width = 97, height = 97, className } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      fill="none"
      {...props}
    >
      <circle cx="48.5" cy="48.5" r="42.5" fill="white" {...props} />
      <circle
        cx="48.5"
        cy="48.5"
        r="45.5"
        fill="#FFF4E8"
        stroke="#FF7A00"
        strokeWidth="6"
        {...props}
      />
      <path
        d="M61.4604 48.334C61.6597 48.0352 61.7593 47.7363 61.7593 47.4375C61.7593 47.0391 61.6597 46.8398 61.4604 46.6406L46.8179 31.7988C46.519 31.5996 46.2202 31.5 45.9214 31.5C45.6226 31.5 45.3237 31.5996 45.1245 31.8984L43.1323 33.791C42.9331 33.9902 42.8335 34.2891 42.8335 34.6875C42.8335 34.9863 42.9331 35.2852 43.1323 35.4844L54.9858 47.4375L43.1323 59.3906C42.9331 59.5898 42.8335 59.7891 42.8335 60.1875C42.8335 60.4863 42.9331 60.7852 43.1323 61.084L45.1245 63.0762C45.3237 63.2754 45.6226 63.375 45.9214 63.375C46.2202 63.375 46.519 63.2754 46.8179 63.0762L61.4604 48.334Z"
        fill="#2B2B2B"
        {...props}
      />
      <defs {...props}>
        <linearGradient
          id="linear_play_button"
          x1="6"
          y1="48.5"
          x2="91"
          y2="48.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF7A00" />
          <stop offset="1" stopColor="#FFB347" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ArrowRight(props: IconSVGFileProps) {
  const { width = 30, height = 30, className, color = "white" } = props;

  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m11.875 21.25 6.25 -6.25 -6.25 -6.25z" fill={color} />
    </svg>
  );
}

export function RightCircleArrow(props: IconSVGFileProps) {
  const {
    width = 20,
    height = 20,
    className,
    background = "#0067AC",
    color = "white",
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      {...props}
    >
      <circle cx="10" cy="10" r="10" fill={background} {...props} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.78596 5.19221C10.0422 4.93593 10.4578 4.93593 10.714 5.19221L14.6515 9.12971C14.9078 9.38599 14.9078 9.80151 14.6515 10.0578L10.714 13.9953C10.4578 14.2516 10.0422 14.2516 9.78596 13.9953C9.52968 13.739 9.52968 13.3235 9.78596 13.0672L13.2594 9.59375L9.78596 6.12029C9.52968 5.86401 9.52968 5.44849 9.78596 5.19221Z"
        fill={color}
        {...props}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 9.59375C5 9.23131 5.29381 8.9375 5.65625 8.9375H13.6406C14.0031 8.9375 14.2969 9.23131 14.2969 9.59375C14.2969 9.95619 14.0031 10.25 13.6406 10.25H5.65625C5.29381 10.25 5 9.95619 5 9.59375Z"
        fill={color}
        {...props}
      />
    </svg>
  );
}

export function PlusIcon(props: IconSVGFileProps) {
  const { width = 24, height = 24, color = "#000", className } = props;
  return `
    <svg xmlns="http://www.w3.org/2000/svg"
    width="${width}"
    height="${height}"
    class="${className}"
    viewBox="0 0 ${width} ${height}"
    fill="${color}"
    >
  <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="${color}"/>
</svg>
  `;
}

export function MinusIcon(props: IconSVGFileProps) {
  const { width = 24, height = 24, color = "#000", className } = props;

  return `
  <svg xmlns="http://www.w3.org/2000/svg" 
  width="${width}"
  height="${height}" 
  viewBox="0 0 ${width} ${height}" 
  fill="${color}"
  >
  <path d="M19 13H5V11H19V13Z" fill="${color}"/>
</svg>
`;
}

export function ArrowUpIcon(props: IconSVGFileProps) {
  const { width = 10, height = 10, color = "#0067AC", className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      viewBox="0 0 16 16"
      fill={color}
    >
      <path
        d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z"
        fill={color}
      />
    </svg>
  );
}

export function DividerArrowIcon(props: IconSVGFileProps) {
  const { width = 113, height = 18, color = "#0067AC", className } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <g clipPath="url(#clip0_3890_115759)">
        <path
          d="M52.1599 1L59.8599 8.7L52.1599 16.4"
          stroke="#ADAEAC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0 8.69995H112.02"
          stroke="#ADAEAC"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3890_115759">
          <rect width="112.02" height="17.4" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function RightCircle(props: IconSVGFileProps) {
  const { width = 30, height = 30, color = "#0067AC", className } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 0.9 0.9"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...props}
    >
      <path
        d="M0.45 0.075a0.375 0.375 0 1 0 0.375 0.375A0.375 0.375 0 0 0 0.45 0.075m0.102 0.402 -0.112 0.112a0.037 0.037 0 0 1 -0.053 0 0.037 0.037 0 0 1 0 -0.053l0.086 -0.086 -0.086 -0.086a0.037 0.037 0 0 1 0.053 -0.053l0.112 0.112a0.037 0.037 0 0 1 0 0.053"
        fill={color}
        {...props}
      />
    </svg>
  );
}

export function CircleCheckBoxIcon(props: IconSVGFileProps) {
  const {
    width = 30,
    height = 30,
    color = "#fff",
    className,
    background = "#2B2B2B",
  } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 10a10 10 0 1 1 20 0A10 10 0 0 1 0 10" fill={background} />
      <path
        d="m7.866 12.6 -2.8 -2.8 -0.934 0.934 3.734 3.734 8 -8 -0.934 -0.934z"
        fill={color}
      />
    </svg>
  );
}

export function CloseCrossIcon(props: IconSVGFileProps) {
  const { width = 24, height = 24, color = "#000", className } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 0.6 0.6"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0.132 0.132a0.025 0.025 0 0 1 0.035 0L0.3 0.265l0.132 -0.132a0.025 0.025 0 1 1 0.035 0.035L0.335 0.3l0.132 0.132a0.025 0.025 0 0 1 -0.035 0.035L0.3 0.335l-0.132 0.132a0.025 0.025 0 0 1 -0.035 -0.035L0.265 0.3 0.132 0.168a0.025 0.025 0 0 1 0 -0.035"
        fill={color}
      />
    </svg>
  );
}

export function FormQuestionIcon(props: IconSVGFileProps) {
  const { width = 25, height = 25, color = "#0067AC" } = props;
  return (
    <svg
      fill={color}
      width={width}
      height={height}
      viewBox="0 0 0.75 0.75"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M.353.478.349.483.346.489.344.495v.006l.003.012A.03.03 0 0 0 .364.53a.03.03 0 0 0 .024 0A.03.03 0 0 0 .405.513L.406.5A.03.03 0 0 0 .397.478a.03.03 0 0 0-.044 0M.375.063a.313.313 0 1 0 .313.313.313.313 0 0 0-.313-.313m0 .563a.25.25 0 1 1 .25-.25.25.25 0 0 1-.25.25m0-.406a.1.1 0 0 0-.081.047.031.031 0 1 0 .054.031.03.03 0 0 1 .027-.017.031.031 0 0 1 0 .063.03.03 0 0 0-.031.031v.031a.031.031 0 0 0 .063 0V.4A.094.094 0 0 0 .375.219" />
    </svg>
  );
}

export function FormExclamationCircle(props: IconSVGFileProps) {
  const { width = 25, height = 25, color = "#0067AC" } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 0.469 0.469"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0.234a0.234 0.234 0 1 1 0.469 0 0.234 0.234 0 0 1 -0.469 0M0.219 0.25V0.125h0.031v0.125zm0.031 0.063v0.032H0.219V0.313z"
        fill={color}
      />
    </svg>
  );
}

export function FormSquareBox(props: IconSVGFileProps) {
  const { width = 25, height = 25, color = "#009ace" } = props;
  return (
    <svg
      fill={color}
      width={width}
      height={height}
      viewBox="0 0 0.75 0.75"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0.656 0.063H0.094a0.031 0.031 0 0 0 -0.031 0.031v0.563a0.031 0.031 0 0 0 0.031 0.031h0.563a0.031 0.031 0 0 0 0.031 -0.031V0.094a0.031 0.031 0 0 0 -0.031 -0.031m-0.031 0.563H0.125V0.125h0.5Z" />
    </svg>
  );
}

export function FormCheckSquareBox(props: IconSVGFileProps) {
  const { width = 25, height = 25, color = "#009ace" } = props;
  return (
    <svg
      fill={color}
      width={width}
      height={height}
      viewBox="0 0 0.75 0.75"
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 24 24"
    >
      <path d="M0.656 0.063H0.094c-0.019 0 -0.031 0.013 -0.031 0.031v0.563c0 0.019 0.013 0.031 0.031 0.031h0.563c0.019 0 0.031 -0.013 0.031 -0.031V0.094c0 -0.019 -0.013 -0.031 -0.031 -0.031m-0.103 0.228 -0.212 0.212c-0.013 0.013 -0.031 0.013 -0.044 0l-0.1 -0.1c-0.013 -0.013 -0.013 -0.031 0 -0.044s0.031 -0.013 0.044 0l0.078 0.078 0.191 -0.191c0.013 -0.013 0.031 -0.013 0.044 0s0.013 0.031 0 0.044" />
    </svg>
  );
}

export function ChevronUp(props: IconSVGFileProps) {
  const { width = 25, height = 25, color = "#000000" } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
      width={width}
      height={height}
      viewBox="0 0 1.95 1.95"
      enableBackground="new 0 0 52 52"
      xmlSpace="preserve"
      {...props}
    >
      <path d="m0.165 1.282 0.769 -0.776c0.022 -0.022 0.06 -0.022 0.083 0l0.769 0.776c0.022 0.022 0.022 0.06 0 0.083l-0.083 0.083c-0.022 0.022 -0.06 0.022 -0.083 0L1.016 0.832c-0.022 -0.022 -0.06 -0.022 -0.083 0L0.33 1.444c-0.022 0.022 -0.06 0.022 -0.083 0l-0.083 -0.083c-0.019 -0.022 -0.019 -0.056 0 -0.079" />
    </svg>
  );
}

export function ChevronDown(props: IconSVGFileProps) {
  const { width = 25, height = 25, color = "#000000" } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
      width={width}
      height={height}
      viewBox="0 0 1.95 1.95"
      enableBackground="new 0 0 52 52"
      xmlSpace="preserve"
      {...props}
    >
      <path d="M1.785 0.667 1.016 1.444c-0.022 0.022 -0.06 0.022 -0.083 0L0.165 0.667c-0.022 -0.022 -0.022 -0.06 0 -0.083l0.083 -0.083c0.022 -0.022 0.06 -0.022 0.083 0l0.604 0.611c0.022 0.022 0.06 0.022 0.083 0l0.604 -0.607c0.022 -0.022 0.06 -0.022 0.083 0l0.083 0.083c0.019 0.022 0.019 0.056 0 0.079" />
    </svg>
  );
}

export function SearchIcon(props: IconSVGFileProps) {
  const { width = 25, height = 25, color = "#000000" } = props;
  return (
    <svg
      fill={color}
      width={width}
      height={height}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m13 14 -3.031 -3.031q-1.313 1 -2.969 1 -1.344 0 -2.5 -0.656 -1.156 -0.688 -1.813 -1.844 -0.688 -1.156 -0.688 -2.5t0.688 -2.5q0.656 -1.156 1.813 -1.813 1.156 -0.688 2.5 -0.688t2.5 0.688q1.156 0.656 1.844 1.813 0.656 1.156 0.656 2.5 0 1.688 -1.031 3l3.031 3.031zM6.969 10.5q1.469 0 2.5 -1.031 1 -1.031 1 -2.469 0 -1.469 -1 -2.469 -1.031 -1.031 -2.5 -1.031 -1.438 0 -2.469 1.031 -1.031 1 -1.031 2.469 0 1.438 1.031 2.469t2.469 1.031" />
    </svg>
  );
}

export function CheckBoxDone(props: IconSVGFileProps) {
  const {
    width = 30,
    height = 30,
    color = "#fff",
    background = "#2B2B2B",
  } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 15C0 6.71573 6.71573 0 15 0C23.2843 0 30 6.71573 30 15C30 23.2843 23.2843 30 15 30C6.71573 30 0 23.2843 0 15Z"
        fill={background}
      />
      <path
        d="M11.8 18.8998L7.59995 14.6998L6.19995 16.0998L11.8 21.6998L23.8 9.6998L22.4 8.2998L11.8 18.8998Z"
        fill={color}
      />
    </svg>
  );
}

export function CopyIcon(props: IconSVGFileProps) {
  const { width = 20, height = 20, color = "#666", className } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"
        fill={color}
      />
    </svg>
  );
}

export function CheckIcon(props: IconSVGFileProps) {
  const { width = 20, height = 20, color = "#28a745", className } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
        fill={color}
      />
    </svg>
  );
}

export function CheckBoxUnselected(props: IconSVGFileProps) {
  const { width = 30, height = 30, color = "#fff", stroke = "#EFEFEF" } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 31 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="15.5"
        cy="15"
        r="14"
        fill={color}
        stroke={stroke}
        strokeWidth="2"
      />
    </svg>
  );
}

export function FilterIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_4067_1732)">
        <mask
          id="mask0_4067_1732"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="25"
          height="25"
        >
          <rect width="25" height="25" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4067_1732)">
          <path
            d="M8.25 15.75V11.25H9.75V12.75H15.75V14.25H9.75V15.75H8.25ZM2.25 14.25V12.75H6.75V14.25H2.25ZM5.25 11.25V9.75H2.25V8.25H5.25V6.75H6.75V11.25H5.25ZM8.25 9.75V8.25H15.75V9.75H8.25ZM11.25 6.75V2.25H12.75V3.75H15.75V5.25H12.75V6.75H11.25ZM2.25 5.25V3.75H9.75V5.25H2.25Z"
            fill="#2B2B2B"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_4067_1732">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function ClearFiltersIcon() {
  return (
    <svg
      width="23"
      height="20"
      viewBox="0 0 23 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11.5" cy="10" r="10" fill="#0067AC" />
      <g clipPath="url(#clip0_4074_2943)">
        <mask
          id="mask0_4074_2943"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="-2"
          y="-3"
          width="26"
          height="25"
        >
          <rect x="-1.5" y="-3" width="25" height="25" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4074_2943)">
          <path
            d="M8.61999 13.3602L7.89999 12.6402L10.78 9.76016L7.89999 6.88016L8.61999 6.16016L11.5 9.04016L14.38 6.16016L15.1 6.88016L12.22 9.76016L15.1 12.6402L14.38 13.3602L11.5 10.4802L8.61999 13.3602Z"
            fill="white"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_4074_2943">
          <rect
            width="12"
            height="12"
            fill="white"
            transform="translate(5.5 4)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export function CalendarIcon(props: IconSVGFileProps) {
  const { width = 24, height = 24, color = "#000000" } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 3H19V1H17V3H7V1H5V3H4C2.9 3 2 3.9 2 5V21C2 22.1 2.9 23 4 23H20C21.1 23 22 22.1 22 21V5C22 3.9 21.1 3 20 3ZM20 21H4V10H20V21ZM20 8H4V5H20V8Z"
        fill={color}
      />
    </svg>
  );
}
