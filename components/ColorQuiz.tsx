'use client';

import { useState } from 'react';
import { COLOR_QUESTIONS, COLOR_SEASONS, getSeason, type Season, type ColorOption } from '@/lib/colorSeasons';
import { trackGA4 } from '@/lib/analytics';

export default function ColorQuiz() {
  const [step, setStep] = useState(0);
  const [votes, setVotes] = useState<{ u: string[]; v: string[]; c: string[] }>({ u: [], v: [], c: [] });
  const [result, setResult] = useState<Season | null>(null);

  const total = COLOR_QUESTIONS.length;
  const cur = COLOR_QUESTIONS[step];

  function choose(opt: ColorOption['vote']) {
    const nv = { u: [...votes.u], v: [...votes.v], c: [...votes.c] };
    if (opt.u) nv.u.push(opt.u);
    if (opt.v) nv.v.push(opt.v);
    if (opt.c) nv.c.push(opt.c);
    setVotes(nv);
    if (step + 1 < total) setStep(step + 1);
    else {
      const season = getSeason(nv);
      setResult(season);
      trackGA4('tool_complete', { tool: 'color', season });
    }
  }

  function reset() {
    setStep(0);
    setVotes({ u: [], v: [], c: [] });
    setResult(null);
  }

  if (result) {
    const s = COLOR_SEASONS[result];
    return (
      <section className="quizres" id="result">
        <div className="wrap">
          <div className="resultcard colorcard">
            <div className="rshape">{s.name}</div>
            <div className="rconf">{s.tagline} · Your color season</div>
            <div className="palette">
              {s.palette.map((c) => (
                <span className="swatch" key={c} style={{ background: c }} title={c} />
              ))}
            </div>
            <div className="seasontips">
              <div className="stcol good">
                <b>Wear</b>
                <ul>
                  {s.wear.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
              <div className="stcol avoid">
                <b>Avoid</b>
                <ul>
                  {s.avoid.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="makeup">
              <b>Makeup:</b> {s.makeup}
            </div>
            <button type="button" className="btn-secondary" onClick={reset}>
              Retake quiz
            </button>
          </div>
        </div>
      </section>
    );
  }

  const pct = Math.round((step / total) * 100);
  return (
    <section className="quizsec" id="quiz">
      <div className="wrap">
        <div className="qprog">
          <div className="qbar" style={{ width: `${pct}%` }} />
        </div>
        <div className="qcount">
          Question {step + 1} of {total}
        </div>
        <div className="qcard">
          <h3 className="qt">{cur.q}</h3>
          <div className="qopts">
            {cur.options.map((o) => (
              <button type="button" key={o.label} className="qopt" onClick={() => choose(o.vote)}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
