// te-icons.jsx — icon set + brand mark for Trust Engine (mirrors landing)
const TIc = ({ d, size = 22, sw = 1.6, vb = "0 0 24 24", children }) => (
  <svg width={size} height={size} viewBox={vb} fill="none"
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d ? <path d={d} /> : children}
  </svg>
);
const TE_ICONS = {
  income:   (p)=> <TIc {...p} d="M3 17l5-5 4 3 6-7M21 8v4M21 8h-4" />,
  health:   (p)=> <TIc {...p} d="M12 20s-7-4.3-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7-2.8M14 12h2.5l1.5 2.5L20 9l1.5 3H24" />,
  family:   (p)=> <TIc {...p}><circle cx="8" cy="8" r="2.6"/><circle cx="16" cy="8" r="2.6"/><path d="M3.5 19c0-2.8 2-4.5 4.5-4.5S12.5 16.2 12.5 19M11.5 19c0-2.8 2-4.5 4.5-4.5s4.5 1.7 4.5 4.5"/></TIc>,
  critical: (p)=> <TIc {...p} d="M3 12h4l2-5 3 9 2.5-6 1.5 3H21" />,
  emergency:(p)=> <TIc {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></TIc>,
  retirement:(p)=><TIc {...p} d="M4 20c0-5 3.5-8 8-8s8 3 8 8M12 12V4M12 4l3 2M12 4L9 6" />,
  future:   (p)=> <TIc {...p} d="M4 20c0-5 3.5-8 8-8s8 3 8 8M12 12V4M12 4l3 2M12 4L9 6" />,
  shield:   (p)=> <TIc {...p} d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />,
  check:    (p)=> <TIc {...p} d="M4 12.5l5 5 11-12" />,
  arrow:    (p)=> <TIc {...p} d="M5 12h14M13 6l6 6-6 6" />,
  back:     (p)=> <TIc {...p} d="M19 12H5M11 6l-6 6 6 6" />,
  plus:     (p)=> <TIc {...p} d="M12 5v14M5 12h14" />,
  warn:     (p)=> <TIc {...p} d="M12 3l9 16H3z M12 10v4 M12 17h.01" />,
  doc:      (p)=> <TIc {...p}><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M9 12h6M9 16h4"/></TIc>,
  q:        (p)=> <TIc {...p} d="M9.2 9a2.8 2.8 0 1 1 4 2.6c-1 .6-1.2 1-1.2 2M12 17h.01" />,
  book:     (p)=> <TIc {...p} d="M4 5a2 2 0 0 1 2-2h6v16H6a2 2 0 0 0-2 2zM20 5a2 2 0 0 0-2-2h-6v16h6a2 2 0 0 1 2 2z" />,
  user:     (p)=> <TIc {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></TIc>,
  calendar: (p)=> <TIc {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></TIc>,
  grid:     (p)=> <TIc {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></TIc>,
  spark:    (p)=> <TIc {...p} d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
};
const TIcon = ({ name, ...rest }) => { const F = TE_ICONS[name]; return F ? F(rest) : null; };

const TEMark = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="1.2" y="1.2" width="29.6" height="29.6" rx="9" stroke="url(#tem)" strokeWidth="1.5"/>
    <rect x="8.5" y="16" width="3.4" height="8" rx="1.7" fill="#2a4f86"/>
    <rect x="14.3" y="11" width="3.4" height="13" rx="1.7" fill="#a07d1f"/>
    <rect x="20.1" y="7" width="3.4" height="17" rx="1.7" fill="#1f7a52"/>
    <defs><linearGradient id="tem" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#2a4f86" stopOpacity="0.7"/><stop offset="1" stopColor="#1f7a52" stopOpacity="0.5"/></linearGradient></defs>
  </svg>
);
Object.assign(window, { TIcon, TEMark });
