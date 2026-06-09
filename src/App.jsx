import React, { useEffect, useMemo, useState } from 'react';

import qSrc from './sounds/another-one.mp3';
import wSrc from './sounds/dun-dun-dun.mp3';
import eSrc from './sounds/error.mp3';
import aSrc from './sounds/fahhhh.mp3';
import sSrc from './sounds/rizz.mp3';
import dSrc from './sounds/ahhhh.mp3';
import zSrc from './sounds/undertakers-bell.mp3';
import xSrc from './sounds/boom.mp3';
import cSrc from './sounds/wow.mp3';

const pads = [
  { key: 'Q', id: 'another-one', label: 'another-one', src: qSrc },
  { key: 'W', id: 'dun-dun-dun', label: 'dun-dun-dun', src: wSrc },
  { key: 'E', id: 'error', label: 'error', src: eSrc },
  { key: 'A', id: 'fahhhh', label: 'fahhhh', src: aSrc },
  { key: 'S', id: 'rizz', label: 'rizz', src: sSrc },
  { key: 'D', id: 'ahhhh', label: 'ahhhh', src: dSrc },
  { key: 'Z', id: 'undertakers-bell', label: 'undertakers-bell', src: zSrc },
  { key: 'X', id: 'boom', label: 'boom', src: xSrc },
  { key: 'C', id: 'wow', label: 'wow', src: cSrc },
];

export default function App() {
  const [display, setDisplay] = useState('Ready');
  const [power, setPower] = useState(true);
  const clips = useMemo(() => pads, []);

  const triggerPad = (key) => {
    if (!power) return;
    const pad = clips.find((item) => item.key === key);
    if (!pad) return;

    const audio = document.getElementById(key);
    if (audio) {
      audio.currentTime = 0;
      const playResult = audio.play();
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(() => {});
      }
    }

    setDisplay(pad.label);
  };

  useEffect(() => {
    const handleKeydown = (event) => {
      const key = (event.key || String.fromCodePoint(event.keyCode || event.which || 0)).toUpperCase();
      triggerPad(key);
    };

    globalThis.addEventListener('keydown', handleKeydown);

    return () => {
      globalThis.removeEventListener('keydown', handleKeydown);
    };
  }, [clips]);

  return (
    <main id="drum-machine" className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4">
      <section className="w-full rounded-none border-4 border-emerald-900 bg-gradient-to-br from-emerald-800 to-emerald-600 p-6 shadow-[8px_8px_0_rgba(3,86,52,0.9)]">
        <div className="mb-4 flex items-center justify-between">
          <div
            id="display"
            className="flex min-h-14 items-center justify-center rounded-none border-4 border-emerald-900 bg-emerald-700/90 px-4 text-center text-sm font-semibold tracking-wide text-white w-3/5"
          >
            {power ? display : 'Off'}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-white">Power</span>
            <button
              aria-pressed={!power}
              id="power"
              onClick={() => {
                setPower((p) => {
                  const next = !p;
                  setDisplay(next ? 'Ready' : 'Off');
                  return next;
                });
              }}
              className={`h-8 w-14 rounded-none p-1 border-2 border-emerald-900 ${power ? 'bg-emerald-600' : 'bg-emerald-400/30'}`}
            >
              <span
                className={`block h-6 w-6 bg-white transform transition-transform ${power ? 'translate-x-6' : 'translate-x-0'}`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {clips.map((pad) => (
            <button
              key={pad.key}
              id={pad.id}
              type="button"
              disabled={!power}
              className={`drum-pad flex aspect-square items-center justify-center rounded-none border-4 p-2 text-2xl font-bold text-white transition-transform ${
                !power
                  ? 'opacity-40 cursor-not-allowed border-emerald-800 shadow-none'
                  : 'bg-gradient-to-br from-emerald-700 to-emerald-500 border-emerald-900 shadow-[6px_6px_0_rgba(4,77,45,0.85)] hover:brightness-105'
              }`}
              onClick={() => triggerPad(pad.key)}
              aria-label={pad.label}
            >
              <span className="drum-key text-2xl">{pad.key}</span>
              <audio className="clip" id={pad.key} src={pad.src} preload="auto">
                <track kind="captions" />
              </audio>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}