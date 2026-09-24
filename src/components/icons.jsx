const defaultProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function GearIcon({ size = 18, className, ...rest }) {
  return (
    <svg
      {...defaultProps}
      width={size}
      height={size}
      className={className}
      focusable="false"
      {...rest}
    >
      <circle cx="12" cy="12" r="3.25" />
      <path d="M12 3.5v2.1M12 18.4v2.1M20.5 12h-2.1M5.6 12H3.5M17.8 6.2l-1.5 1.5M7.7 16.3l-1.5 1.5M17.8 17.8l-1.5-1.5M7.7 7.7 6.2 6.2" />
    </svg>
  );
}

export function UndoIcon({ size = 18, className, ...rest }) {
  return (
    <svg
      {...defaultProps}
      width={size}
      height={size}
      className={className}
      focusable="false"
      {...rest}
    >
      <path d="M4 10.5h9.5a5.5 5.5 0 0 1 0 11H10" />
      <path d="M8 6 4 10.5 8 15" />
    </svg>
  );
}

export function TrophyIcon({ size = 28, className, ...rest }) {
  return (
    <svg
      {...defaultProps}
      width={size}
      height={size}
      className={className}
      focusable="false"
      {...rest}
    >
      <path d="M7 4h10v4.2a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5.5H4.2a.7.7 0 0 0-.7.75c.15 2.05 1.2 3.55 3.5 3.95" />
      <path d="M17 5.5h2.8a.7.7 0 0 1 .7.75c-.15 2.05-1.2 3.55-3.5 3.95" />
      <path d="M12 13.2v3.1" />
      <path d="M8.6 20h6.8" />
      <path d="M9.6 16.9c0 1.4 1 2.4 2.4 2.4s2.4-1 2.4-2.4" />
    </svg>
  );
}

export function PeopleIcon({ size = 20, className, ...rest }) {
  return (
    <svg
      {...defaultProps}
      width={size}
      height={size}
      className={className}
      focusable="false"
      {...rest}
    >
      <circle cx="8.2" cy="8" r="2.4" />
      <circle cx="15.8" cy="8" r="2.4" />
      <path d="M3.5 18c.5-2.7 2.4-4.3 4.7-4.3S12.4 15.3 12.9 18" />
      <path d="M11.1 18c.5-2.7 2.4-4.3 4.7-4.3s4.2 1.6 4.7 4.3" />
    </svg>
  );
}

export function RobotIcon({ size = 20, className, ...rest }) {
  return (
    <svg
      {...defaultProps}
      width={size}
      height={size}
      className={className}
      focusable="false"
      {...rest}
    >
      <rect x="4.5" y="8.5" width="15" height="10" rx="3" />
      <path d="M12 8.5V5.2" />
      <circle cx="12" cy="3.7" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="9" cy="13.2" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13.2" r="1.1" fill="currentColor" stroke="none" />
      <path d="M9 16.3h6" />
      <path d="M2.5 12.5v3M21.5 12.5v3" />
    </svg>
  );
}
