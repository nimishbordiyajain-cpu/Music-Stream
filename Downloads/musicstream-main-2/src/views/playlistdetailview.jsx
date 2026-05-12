import TrackRow from "../components/TrackRow";

export default function PlaylistDetailView({
  playlist,
  tracks,
  currentTrack,
  isPlaying,
  onPlay,
  liked,
  onLike,
  onAddToQueue,
  onAddToPlaylist,
  onDownloadTrack,
  hasPremiumDownloads,
}) {
  const plTracks = tracks.filter((t) => playlist.tracks.includes(t.id));

  return (
    <div className="view">
      <div className="liked-header">
        <div
          className="liked-header__icon"
          style={{
            background: playlist.color + "22",
            borderColor: playlist.color,
          }}
        >
          <span style={{ color: playlist.color, fontSize: 24 }}>♪</span>
        </div>
        <div>
          <h1 className="view__heading" style={{ marginBottom: 4 }}>
            {playlist.name}
          </h1>
          <p className="muted">{plTracks.length} songs</p>
        </div>
      </div>

      <div className="track-list">
        {plTracks.length === 0 && (
          <p className="empty-state">
            No songs yet. Add songs from the library.
          </p>
        )}
        {plTracks.map((t) => (
          <TrackRow
            key={t.id}
            track={t}
            isCurrent={currentTrack?.id === t.id}
            isPlaying={isPlaying}
            onPlay={() => onPlay(t)}
            liked={liked.includes(t.id)}
            onLike={() => onLike(t.id)}
            onAddToQueue={() => onAddToQueue(t)}
            onAddToPlaylist={() => onAddToPlaylist?.(t)}
            onDownloadTrack={onDownloadTrack}
            hasPremiumDownloads={hasPremiumDownloads}
          />
        ))}
      </div>
    </div>
  );
}
