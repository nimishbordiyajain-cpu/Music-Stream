import TrackRow from "../components/TrackRow";

export default function QueueView({
  queue,
  currentTrack,
  isPlaying,
  onPlay,
  onRemove,
  onDownloadTrack,
  hasPremiumDownloads,
}) {
  return (
    <div className="view">
      <h1 className="view__heading">Queue</h1>
      <p className="muted" style={{ marginBottom: 16 }}>
        {queue.length} song{queue.length !== 1 ? "s" : ""} in queue
      </p>

      {queue.length === 0 && (
        <p className="empty-state">Your queue is empty.</p>
      )}

      <div className="track-list">
        {queue.map((t, i) => (
          <TrackRow
            key={`${t.id}-${i}`}
            track={t}
            isCurrent={currentTrack?.id === t.id}
            isPlaying={isPlaying}
            onPlay={() => onPlay(t)}
            liked={false}
            onLike={() => {}}
            onAddToQueue={() => {}}
            onAddToPlaylist={() => {}}
            onRemoveFromQueue={() => onRemove(i)}
            onDownloadTrack={onDownloadTrack}
            hasPremiumDownloads={hasPremiumDownloads}
          />
        ))}
      </div>
    </div>
  );
}
