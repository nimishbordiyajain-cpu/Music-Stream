import { useCallback, useRef, useState } from "react";

export default function PlayerWaveformSeek({ progress, onSeek }) {
  const trackRef = useRef(null);
  const draggingRef = useRef(false);
  const [dragging, setDragging] = useState(false);

  const ratioFromClientX = useCallback((clientX) => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  const commit = useCallback(
    (clientX) => {
      onSeek(ratioFromClientX(clientX));
    },
    [onSeek, ratioFromClientX],
  );

  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    draggingRef.current = true;
    setDragging(true);
    commit(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    commit(e.clientX);
  };

  const onPointerUp = (e) => {
    draggingRef.current = false;
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const pct = Math.max(0, Math.min(100, (progress || 0) * 100));

  return (
    <div
      ref={trackRef}
      className={`waveform-seek ${dragging ? "waveform-seek--dragging" : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      tabIndex={0}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 0.1 : 0.05;
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          onSeek(Math.max(0, (progress || 0) - step));
        }
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          onSeek(Math.min(1, (progress || 0) + step));
        }
        if (e.key === "Home") {
          e.preventDefault();
          onSeek(0);
        }
        if (e.key === "End") {
          e.preventDefault();
          onSeek(1);
        }
      }}
    >
      <div className="waveform-seek__rail" />
      <div className="waveform-seek__fill" style={{ width: `${pct}%` }} />
      <div className="waveform-seek__thumb-wrap" style={{ left: `${pct}%` }}>
        <span className="waveform-seek__thumb" />
      </div>
    </div>
  );
}
