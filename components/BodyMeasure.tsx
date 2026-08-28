'use client';

import { useState } from 'react';
import { BODY_SHAPES, getBodyShape, type BodyShapeName } from '@/lib/bodyShapes';
import { trackGA4 } from '@/lib/analytics';

export default function BodyMeasure() {
  const [unit, setUnit] = useState<'cm' | 'in'>('in');
  const [s, setS] = useState('');
  const [w, setW] = useState('');
  const [h, setH] = useState('');
  const [result, setResult] = useState<BodyShapeName | null>(null);

  function calc() {
    const sh = parseFloat(s);
    const wa = parseFloat(w);
    const hi = parseFloat(h);
    if (!(sh > 0 && wa > 0 && hi > 0)) return;
    const shape = getBodyShape(sh, wa, hi);
    setResult(shape);
    trackGA4('tool_complete', { tool: 'body', body_type: shape });
  }

  function reset() {
    setResult(null);
    setS('');
    setW('');
    setH('');
  }

  if (result) {
    const info = BODY_SHAPES[result];
    return (
      <section className="bodyres" id="result">
        <div className="wrap">
          <div className="resultcard bodycard">
            <svg className="bodyfigsvg" viewBox="0 0 200 240" aria-hidden="true">
              <circle cx="100" cy="34" r="16" fill="#E9E6FB" stroke="#6D5DFC" strokeWidth="2.5" />
              <path d={info.svg} fill="#E9E6FB" stroke="#6D5DFC" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
            <div className="bodyinfo">
              <div className="rshape">{info.name}</div>
              <div className="rconf">{info.desc}</div>
              <div className="bodytips">
                <div className="btcol">
                  <b>Emphasize</b>
                  <span>{info.emphasize}</span>
                </div>
                <div className="btcol">
                  <b>Minimize</b>
                  <span>{info.minimize}</span>
                </div>
              </div>
              <div className="seasontips">
                <div className="stcol good">
                  <b>Wear</b>
                  <ul>
                    {info.wear.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div className="stcol avoid">
                  <b>Avoid</b>
                  <ul>
                    {info.avoid.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <button type="button" className="btn-secondary" onClick={reset}>
                Recalculate
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="measuresec" id="measure">
      <div className="wrap">
        <div className="measform">
          <div className="unitrow">
            <span>Unit</span>
            <button type="button" className={unit === 'in' ? 'unit on' : 'unit'} onClick={() => setUnit('in')}>
              in
            </button>
            <button type="button" className={unit === 'cm' ? 'unit on' : 'unit'} onClick={() => setUnit('cm')}>
              cm
            </button>
          </div>
          <div className="mfields">
            <label className="mfield">
              <span>Shoulders</span>
              <input
                type="number"
                inputMode="decimal"
                value={s}
                min="0"
                placeholder="e.g. 38"
                onChange={(e) => setS(e.target.value)}
              />
            </label>
            <label className="mfield">
              <span>Waist</span>
              <input
                type="number"
                inputMode="decimal"
                value={w}
                min="0"
                placeholder="e.g. 28"
                onChange={(e) => setW(e.target.value)}
              />
            </label>
            <label className="mfield">
              <span>Hips</span>
              <input
                type="number"
                inputMode="decimal"
                value={h}
                min="0"
                placeholder="e.g. 40"
                onChange={(e) => setH(e.target.value)}
              />
            </label>
          </div>
          <button type="button" className="btn-primary" onClick={calc}>
            See my shape
          </button>
          <p className="mnote">
            Measure shoulders straight across the widest point, waist at the narrowest, hips around the fullest part. All in {unit}.
            Nothing leaves your browser.
          </p>
        </div>
      </div>
    </section>
  );
}
