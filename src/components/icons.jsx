const defaultProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style: { display: "block" },
};

export function GearIcon({ size = 18, className, ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      stroke="none"
      style={{ display: "block" }}
      className={className}
      focusable="false"
      {...rest}
    >
      <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
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
