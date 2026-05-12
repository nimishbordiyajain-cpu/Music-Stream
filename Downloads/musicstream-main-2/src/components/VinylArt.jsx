/**
 * Album art as a disc with slow rotation when playing and a beat-pulse glow ring.
 */
export default function VinylArt({ src, alt, isPlaying }) {
  return (
    <div className={`vinyl-wrap ${isPlaying ? "vinyl-wrap--playing" : ""}`}>
      <div className="vinyl-wrap__pulse" aria-hidden />
      <div className={`vinyl-disc ${isPlaying ? "vinyl-disc--spinning" : ""}`}>
        <img src={src} alt={alt || "Album art"} className="vinyl-disc__img" />
        <span className="vinyl-disc__groove" aria-hidden />
        <span className="vinyl-disc__center" aria-hidden />
      </div>
    </div>
  );
}
