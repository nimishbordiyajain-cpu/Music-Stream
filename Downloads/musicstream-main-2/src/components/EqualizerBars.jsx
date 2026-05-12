/**
 * Five CSS-animated equalizer bars. Visible when `playing` is true.
 */
export default function EqualizerBars({ playing, className = "" }) {
  if (!playing) return null;
  return (
    <div
      className={`eq-bars ${className}`.trim()}
      aria-hidden
      role="presentation"
    >
      <span className="eq-bars__bar" />
      <span className="eq-bars__bar" />
      <span className="eq-bars__bar" />
      <span className="eq-bars__bar" />
      <span className="eq-bars__bar" />
    </div>
  );
}
