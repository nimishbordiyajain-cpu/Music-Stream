import Icon, { Icons } from "../components/Icon";
import TrackRow from "../components/TrackRow";

export default function LikedView({
  tracks,
  liked,
  currentTrack,
  isPlaying,
  onPlay,
  onLike,
  onAddToQueue,
  onAddToPlaylist,
  onDownloadTrack,
  hasPremiumDownloads,
}) {
  const likedTracks = tracks.filter((t) => liked.includes(t.id));

  return (
    <div className="view">
      <div className="liked-header">
        <div className="liked-header__icon">
          <Icon d={Icons.heartFill} fill="#e879f9" stroke="none" size={28} />
        </div>
        <div>
          <h1 className="view__heading" style={{ marginBottom: 4 }}>
            Liked Songs
          </h1>
          <p className="muted">
            {likedTracks.length} song{likedTracks.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="track-list">
        {likedTracks.length === 0 && (
          <p className="empty-state">Like songs to see them here.</p>
        )}
        {likedTracks.map((t) => (
          <TrackRow
            key={t.id}
            track={t}
            isCurrent={currentTrack?.id === t.id}
            isPlaying={isPlaying}
            onPlay={() => onPlay(t)}
            liked
            onLike={() => onLike(t.id)}
            onAddToQueue={() => onAddToQueue(t)}
            onAddToPlaylist={() => onAddToPlaylist(t)}
            onDownloadTrack={onDownloadTrack}
            hasPremiumDownloads={hasPremiumDownloads}
          />
        ))}
      </div>
    </div>
  );
}
