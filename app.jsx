// app.jsx — compose sections, tweaks, mount

const ACCENTS = {
  navy:  { a:"#1d3a63", b:"#2a4f86", d:"#13294b", g:"rgba(19,41,75,.18)" },
  gold:  { a:"#a07d1f", b:"#c2a14a", d:"#876818", g:"rgba(160,125,31,.20)" },
  green: { a:"#1f7a52", b:"#2c9268", d:"#185f40", g:"rgba(31,122,82,.18)" },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroStyle": "editorial",
  "gaugeStyle": "arc",
  "calcOptionStyle": "cards",
  "accent": "navy",
  "motion": true
}/*EDITMODE-END*/;

function useReveal(active) {
  React.useEffect(() => {
    if (!active) {
      document.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    const els = document.querySelectorAll(".reveal:not(.in)");
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [scoreOpen, setScoreOpen] = React.useState(false);
  const [reportOpen, setReportOpen] = React.useState(false);
  const [advisorOpen, setAdvisorOpen] = React.useState(false);

  // apply accent + motion to :root
  React.useEffect(() => {
    const ac = ACCENTS[t.accent] || ACCENTS.navy;
    const r = document.documentElement.style;
    r.setProperty("--accent", ac.a);
    r.setProperty("--accent-bright", ac.b);
    r.setProperty("--accent-deep", ac.d);
    r.setProperty("--accent-glow", ac.g);
    document.documentElement.setAttribute("data-motion", t.motion ? "on" : "off");
  }, [t.accent, t.motion]);

  useReveal(t.motion);

  const openScore = () => setScoreOpen(true);
  const openReport = () => { setScoreOpen(false); setReportOpen(true); };
  const openAdvisor = () => { setScoreOpen(false); setReportOpen(false); setAdvisorOpen(true); };

  return (
    <>
      <Nav onScore={openScore} />
      <main>
        <Hero variant={t.heroStyle} motion={t.motion} onScore={openScore} onReport={openReport} />
        <Confusion />
        <TruthReportPreview onReport={openReport} />
        <ScoreBand onScore={openScore} motion={t.motion} />
        <Truth />
        <Why />
        <How onScore={openScore} />
        <Areas />
        <Stories />
        <Team />
        <Career onJoin={openAdvisor} />
        <FAQ />
        <FinalCTA onScore={openScore} onReport={openReport} />
      </main>
      <Manifesto />
      <Footer />

      <ScoreWizard open={scoreOpen} onClose={() => setScoreOpen(false)} onReport={openReport} tweaks={t} />
      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} />
      <AdvisorModal open={advisorOpen} onClose={() => setAdvisorOpen(false)} />

      <StickyCTA onScore={openScore} onReport={openReport} onJoin={openAdvisor} hidden={scoreOpen || reportOpen || advisorOpen} />
      <ExitIntent onScore={openScore} onReport={openReport} suppressed={scoreOpen || reportOpen || advisorOpen} />
      <WelcomeModal onScore={openScore} onReport={openReport} suppressed={scoreOpen || reportOpen || advisorOpen} />

      <TweaksPanel>
        <TweakSection label="Hero direction" />
        <TweakRadio label="Layout" value={t.heroStyle}
          options={["editorial","centered","statement"]}
          onChange={v => setTweak("heroStyle", v)} />

        <TweakSection label="Score calculator" />
        <TweakRadio label="Result gauge" value={t.gaugeStyle}
          options={["arc","ring","linear"]}
          onChange={v => setTweak("gaugeStyle", v)} />
        <TweakRadio label="Answer style" value={t.calcOptionStyle}
          options={["cards","rows"]}
          onChange={v => setTweak("calcOptionStyle", v)} />

        <TweakSection label="Appearance" />
        <TweakColor label="Primary accent" value={ACCENTS[t.accent] ? ACCENTS[t.accent].a : ACCENTS.navy.a}
          options={[ACCENTS.navy.a, ACCENTS.gold.a, ACCENTS.green.a]}
          onChange={(v) => {
            const key = Object.keys(ACCENTS).find(k => ACCENTS[k].a === v) || "navy";
            setTweak("accent", key);
          }} />
        <TweakToggle label="Motion & animation" value={t.motion}
          onChange={v => setTweak("motion", v)} />

        <TweakButton label="Preview Score wizard" onClick={openScore} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
