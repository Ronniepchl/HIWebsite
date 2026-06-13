// te-assessment.jsx — multi-step diagnostic wizard

function TEProgress({ steps, current }) {
  return (
    <div className="te-progress">
      {steps.map((s, i) => (
        <div key={s.id} className={"te-prog-seg" + (i < current ? " done" : i === current ? " active" : "")}>
          <span className="te-prog-dot">{i < current ? <TIcon name="check" size={12}/> : i+1}</span>
          <span className="te-prog-label">{s.th}</span>
        </div>
      ))}
    </div>
  );
}

function TEAssessment({ onComplete, motion }) {
  const steps = window.TE_STEPS;
  const [stepIdx, setStepIdx] = React.useState(0);
  const [qIdx, setQIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState({});

  const step = steps[stepIdx];
  const q = step.questions[qIdx];
  const totalQ = steps.reduce((n, s) => n + s.questions.length, 0);
  const answeredCount = steps.slice(0, stepIdx).reduce((n,s)=>n+s.questions.length,0) + qIdx;
  const pct = Math.round((answeredCount / totalQ) * 100);

  const isScored = q.kind === "scored";

  const back = () => {
    if (qIdx > 0) { setQIdx(qIdx - 1); return; }
    if (stepIdx > 0) { const ps = steps[stepIdx-1]; setStepIdx(stepIdx-1); setQIdx(ps.questions.length-1); }
  };

  const answersRef = React.useRef(answers);
  answersRef.current = answers;
  const current = answers[q.id];
  const choose2 = (val) => {
    const next = { ...answersRef.current, [q.id]: val };
    setAnswers(next);
    answersRef.current = next;
    const finish = () => {
      if (qIdx < step.questions.length - 1) { setQIdx(qIdx + 1); return; }
      if (stepIdx < steps.length - 1) { setStepIdx(stepIdx + 1); setQIdx(0); return; }
      const result = window.teComputeScore(next);
      onComplete({ answers: next, ...result });
    };
    setTimeout(finish, motion ? 230 : 0);
  };

  const firstQOfStep = qIdx === 0;

  return (
    <div className="te-assess">
      <TEProgress steps={steps} current={stepIdx} />

      <div className="te-assess-body" key={step.id + qIdx}>
        {firstQOfStep && (
          <div className="te-step-intro">
            <span className="te-step-kicker mono">STEP {stepIdx+1} · {step.label}</span>
            <p className="te-step-desc">{step.intro}</p>
          </div>
        )}

        <div className="te-qmeta">
          <span className="mono">{String(answeredCount+1).padStart(2,"0")} / {String(totalQ).padStart(2,"0")}</span>
          {q.en && <span className="te-qen">{q.en}</span>}
        </div>
        <h2 className="te-q">{q.th}</h2>

        <div className="te-options">
          {q.options.map((o, i) => {
            const val = isScored ? i : o.v;
            const sel = current === val;
            return (
              <button key={i} className={"te-opt" + (sel ? " sel" : "")} onClick={() => choose2(val)}>
                <span className="te-opt-dot"/>
                <span className="te-opt-th">{o.th}</span>
                {o.en && <span className="te-opt-en mono">{o.en}</span>}
              </button>
            );
          })}
        </div>

        <div className="te-assess-nav">
          <button className="te-back" disabled={stepIdx===0 && qIdx===0} onClick={back}>
            <TIcon name="back" size={16}/> ย้อนกลับ
          </button>
          <span className="te-assess-pct mono">{pct}%</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TEAssessment });
