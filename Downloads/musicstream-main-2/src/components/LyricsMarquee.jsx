/**
 * Slow horizontal marquee for “lyrics ticker” (title + artist).
 */
export default function LyricsMarquee({ text, playing }) {
  if (!text) return null;
  return (
    <div
      className={`lyrics-marquee ${playing ? "lyrics-marquee--playing" : ""}`}
      aria-live="polite"
    >
      <div className="lyrics-marquee__inner">
        <span className="lyrics-marquee__text">{text}</span>
        <span className="lyrics-marquee__text" aria-hidden>
          {text}
        </span>
      </div>
    </div>
  );
}
