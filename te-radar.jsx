// te-radar.jsx — Hidden Risk Analysis: protection radar + gap heatmap

// Animated count-up gauge (large score)
function TEGauge({ score, motion, size = 240 }) {
  const [n, setN] = React.useState(motion ? 0 : score);
  React.useEffect(() => {
    if (!motion) { setN(score); return; }
    let raf, start; const dur = 1700;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start)/dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(score * e));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    const id = setTimeout(()=>{ raf = requestAnimationFrame(step); }, 250);
    return ()=>{ clearTimeout(id); cancelAnimationFrame(raf); };
  }, [score, motion]);
  const seg = window.teSegmentFor(n);
  const R = 100, C = 2*Math.PI*R, span = 0.75, frac = n/100;
  return (
    <div className="te-gauge" style={{ width: size }}>
      <svg viewBox="0 0 240 240" width="100%">
        <circle cx="120" cy="120" r={R} fill="none" stroke="rgba(19,41,75,.08)" strokeWidth="16"
          strokeLinecap="round" strokeDasharray={`${C*span} ${C}`} transform="rotate(135 120 120)" />
        <circle cx="120" cy="120" r={R} fill="none" stroke={seg.color} strokeWidth="16"
          strokeLinecap="round" strokeDasharray={`${C*span*frac} ${C}`} transform="rotate(135 120 120)"
          style={{ filter:`drop-shadow(0 4px 12px ${seg.color})`, transition:"stroke-dasharray .2s linear" }} />
      </svg>
      <div className="te-gauge-c">
        <span className="te-gauge-num" style={{ color: seg.color }}>{n}</span>
        <span className="te-gauge-cap mono">/ 100</span>
      </div>
    </div>
  );
}

// Radar chart of 5 category scores (0..1)
function TERadar({ cats, motion }) {
  const order = window.TE_CATS;
  const N = order.length;
  const cx = 150, cy = 150, R = 110;
  const [grow, setGrow] = React.useState(motion ? 0 : 1);
  React.useEffect(() => {
    if (!motion) { setGrow(1); return; }
    let raf, start; const dur = 1100;
    const step = (t)=>{ if(!start)start=t; const p=Math.min((t-start)/dur,1); setGrow(1-Math.pow(1-p,3)); if(p<1) raf=requestAnimationFrame(step); };
    const id = setTimeout(()=>{ raf=requestAnimationFrame(step); }, 400);
    return ()=>{ clearTimeout(id); cancelAnimationFrame(raf); };
  }, [motion]);

  const pt = (i, r) => {
    const ang = -Math.PI/2 + i * (2*Math.PI/N);
    return [cx + Math.cos(ang)*r, cy + Math.sin(ang)*r];
  };
  const rings = [0.25, 0.5, 0.75, 1];
  const dataPts = order.map((c, i) => pt(i, R * (cats[c.key]||0) * grow));
  const dataPath = dataPts.map((p,i)=> (i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1)).join(" ") + " Z";

  return (
    <div className="te-radar">
      <svg viewBox="0 0 300 300" width="100%">
        {rings.map((rr, i) => (
          <polygon key={i} fill="none" stroke="rgba(19,41,75,.10)" strokeWidth="1"
            points={order.map((_,j)=>pt(j, R*rr).join(",")).join(" ")} />
        ))}
        {order.map((_, i) => { const [x,y]=pt(i,R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(19,41,75,.10)" strokeWidth="1"/>; })}
        <polygon points={dataPts.map(p=>p.join(",")).join(" ")} fill="rgba(42,79,134,.16)" stroke="var(--navy)" strokeWidth="2" strokeLinejoin="round"/>
        {dataPts.map((p,i)=> <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="var(--navy)"/>)}
        {order.map((c, i) => {
          const [x,y]=pt(i, R+24);
          return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            fontFamily="var(--font-mono)" fontSize="9.5" fill="var(--text-dim)">{c.en}</text>;
        })}
      </svg>
    </div>
  );
}

// Gap heatmap bars
function TEGapMap({ cats }) {
  const order = window.TE_CATS;
  const level = (v) => v >= 0.7 ? "ok" : v >= 0.45 ? "mid" : "low";
  const labelOf = (v) => v >= 0.7 ? "ดี" : v >= 0.45 ? "ควรทบทวน" : "ช่องว่าง";
  return (
    <div className="te-gapmap">
      {order.map(c => {
        const v = cats[c.key] || 0; const lv = level(v);
        return (
          <div key={c.key} className="te-gap-row">
            <span className="te-gap-label">{c.th}</span>
            <span className="te-gap-track"><i className={"te-gap-fill " + lv} style={{ width: Math.max(6, v*100)+"%" }}/></span>
            <span className={"te-gap-tag " + lv}>{labelOf(v)}</span>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { TEGauge, TERadar, TEGapMap });
