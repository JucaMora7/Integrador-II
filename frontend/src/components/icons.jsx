export function LogoIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
  );
}

export function StackIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M4 20V10M11 20V4M18 20v-7" />
      <path d="M4 20h16" />
    </svg>
  );
}

export function TrendUpIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

export function TrendDownIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M3 7l6 6 4-4 8 8" />
      <path d="M15 17h6v-6" />
    </svg>
  );
}

export function WarningIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M12 3l9 16H3z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <circle cx="12" cy="16.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ClockStopIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 15.5c1-1.2 2.2-1.8 3.5-1.8s2.5.6 3.5 1.8" />
      <line x1="9" y1="9.5" x2="9.6" y2="9.5" />
      <line x1="14.4" y1="9.5" x2="15" y2="9.5" />
    </svg>
  );
}
