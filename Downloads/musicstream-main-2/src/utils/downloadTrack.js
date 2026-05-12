/** Trigger browser download for a track file (same-origin URLs work best). */
export function downloadTrackFile(track) {
  if (!track?.audio) return;
  const safeName = `${track.title} - ${track.artist}`
    .replace(/[/\\?%*:|"<>]/g, "")
    .trim();
  const a = document.createElement("a");
  a.href = track.audio;
  a.download = `${safeName || "track"}.mp3`;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
