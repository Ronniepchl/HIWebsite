// icons.jsx — minimal stroke icons + brand mark
const Ic = ({ d, size = 22, sw = 1.6, fill = "none", children, vb = "0 0 24 24" }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill}
       stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    {d ? <path d={d} /> : children}
  </svg>
);

const ICONS = {
  income:   (p) => <Ic {...p} d="M3 17l5-5 4 3 6-7M21 8v4M21 8h-4" />,
  family:   (p) => <Ic {...p}><circle cx="8" cy="8" r="2.6"/><circle cx="16" cy="8" r="2.6"/><path d="M3.5 19c0-2.8 2-4.5 4.5-4.5S12.5 16.2 12.5 19M11.5 19c0-2.8 2-4.5 4.5-4.5s4.5 1.7 4.5 4.5"/></Ic>,
  debt:     (p) => <Ic {...p}><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.4"/></Ic>,
  health:   (p) => <Ic {...p} d="M12 20s-7-4.3-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7-2.8M14 12h2.5l1.5 2.5L20 9l1.5 3H24" />,
  critical: (p) => <Ic {...p} d="M3 12h4l2-5 3 9 2.5-6 1.5 3H21" />,
  emergency:(p) => <Ic {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></Ic>,
  retirement:(p)=> <Ic {...p} d="M4 20c0-5 3.5-8 8-8s8 3 8 8M12 12V4M12 4l3 2M12 4L9 6" />,
  life:     (p) => <Ic {...p} d="M12 21s-7-4.5-9-9.5C1.5 7 4.5 4 8 4c2 0 3.3 1 4 2 .7-1 2-2 4-2 3.5 0 6.5 3 5 7.5C19 16.5 12 21 12 21z" />,
  tax:      (p) => <Ic {...p}><path d="M6 21V5a2 2 0 0 1 2-2h6l4 4v14"/><path d="M14 3v4h4M9 11h6M9 15h6"/></Ic>,
  legacy:   (p) => <Ic {...p} d="M4 21h16M6 21V9l6-4 6 4v12M10 21v-5h4v5" />,
  corporate:(p) => <Ic {...p}><path d="M3 21h18M5 21V7l6-3v17M19 21V11l-8-4M8.5 10h0M8.5 13.5h0M8.5 17h0M15 14h0M15 17h0"/></Ic>,
  shield:   (p) => <Ic {...p} d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />,
  check:    (p) => <Ic {...p} d="M4 12.5l5 5 11-12" />,
  arrow:    (p) => <Ic {...p} d="M5 12h14M13 6l6 6-6 6" />,
  plus:     (p) => <Ic {...p} d="M12 5v14M5 12h14" />,
  minus:    (p) => <Ic {...p} d="M5 12h14" />,
  q:        (p) => <Ic {...p} d="M9.2 9a2.8 2.8 0 1 1 4 2.6c-1 .6-1.2 1-1.2 2M12 17h.01" />,
  doc:      (p) => <Ic {...p}><path d="M7 3h7l4 4v14H7z" vb="0 0 24 24"/><path d="M14 3v4h4M9 12h6M9 16h4"/></Ic>,
  eye:      (p) => <Ic {...p} d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12zM12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
  spark:    (p) => <Ic {...p} d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
  close:    (p) => <Ic {...p} d="M6 6l12 12M18 6L6 18" />,
  target:   (p) => <Ic {...p}><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/></Ic>,
  scan:     (p) => <Ic {...p}><path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M4 12h16"/></Ic>,
  idea:     (p) => <Ic {...p}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10.5c-.7.6-1 1.2-1 2H9c0-.8-.3-1.4-1-2A6 6 0 0 1 12 3z"/></Ic>,
  cycle:    (p) => <Ic {...p}><path d="M20 12a8 8 0 0 1-13.7 5.6M4 12A8 8 0 0 1 17.7 6.4M4 8v3.5h3.5M20 16v-3.5h-3.5"/></Ic>,
};

const Icon = ({ name, ...rest }) => {
  const F = ICONS[name];
  return F ? F(rest) : null;
};

// Brand mark — Truth Conversation™: a speech bubble holding a verified check
const BrandMark = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <path d="M25 17 H75 A15 15 0 0 1 90 32 V57 A15 15 0 0 1 75 72 H47 L31 87 L32 72 H25 A15 15 0 0 1 10 57 V32 A15 15 0 0 1 25 17 Z" fill="#13294b"/>
    <path d="M35 43 L46 54 L66 31" stroke="#c2a14a" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

Object.assign(window, { Icon, BrandMark });
