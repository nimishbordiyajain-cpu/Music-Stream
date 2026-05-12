import { useEffect, useRef } from "react";

// Module-level singletons so they survive React re-renders & StrictMode
let _audioCtx = null;
let _source = null;
let _analyser = null;
let _connectedEl = null; // which audio element is wired

function getOrCreateChain(audioEl) {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Only create source once per audio element
  if (_connectedEl !== audioEl) {
    if (_source) {
      try {
        _source.disconnect();
      } catch (_) {}
    }
    _analyser = _audioCtx.createAnalyser();
    _analyser.fftSize = 128;
    _analyser.smoothingTimeConstant = 0.82;

    _source = _audioCtx.createMediaElementSource(audioEl);
    _source.connect(_analyser);
    _analyser.connect(_audioCtx.destination);
    _connectedEl = audioEl;
  }
  return { audioCtx: _audioCtx, analyser: _analyser };
}

export default function Visualizer({ audioRef, isPlaying }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const audio = audioRef?.current;
    const canvas = canvasRef.current;
    if (!audio || !canvas) return;

    let chain;
    try {
      chain = getOrCreateChain(audio);
    } catch (e) {
      console.warn("Visualizer: Web Audio setup failed", e);
      return;
    }

    const { audioCtx, analyser } = chain;
    const ctx = canvas.getContext("2d");
    const data = new Uint8Array(analyser.frequencyBinCount);
    const W = canvas.width;
    const H = canvas.height;
    const BAR_COUNT = 32;
    const gap = 2;
    const barW = (W - gap * (BAR_COUNT - 1)) / BAR_COUNT;

    function draw() {
      rafRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(data);

      ctx.clearRect(0, 0, W, H);

      const style = getComputedStyle(document.documentElement);
      const accent = style.getPropertyValue("--accent").trim() || "#f5a623";
      const accent2 = style.getPropertyValue("--accent2").trim() || "#e8742a";

      for (let i = 0; i < BAR_COUNT; i++) {
        // Map BAR_COUNT bars across the full frequency data array
        const dataIdx = Math.floor((i / BAR_COUNT) * data.length);
        const raw = isPlaying ? data[dataIdx] : 0;
        // Idle animation: gentle pulse when paused
        const val = isPlaying
          ? raw
          : (Math.sin(Date.now() / 600 + i * 0.4) * 0.5 + 0.5) * 18;
        const barH = Math.max(3, (val / 255) * H);
        const x = i * (barW + gap);
        const y = H - barH;

        const grad = ctx.createLinearGradient(0, H, 0, y);
        grad.addColorStop(0, accent2 + "99");
        grad.addColorStop(1, accent + "ff");
        ctx.fillStyle = grad;

        const r = Math.min(barW / 2, 3);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + barW - r, y);
        ctx.arcTo(x + barW, y, x + barW, y + r, r);
        ctx.lineTo(x + barW, H);
        ctx.lineTo(x, H);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
        ctx.fill();
      }
    }

    if (audioCtx.state === "suspended") audioCtx.resume();
    draw();

    return () => cancelAnimationFrame(rafRef.current);
  }, [audioRef, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={180}
      height={44}
      className="visualizer-canvas"
    />
  );
}
