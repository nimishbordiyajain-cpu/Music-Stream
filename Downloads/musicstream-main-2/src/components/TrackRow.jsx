import Icon, { Icons } from "./Icon";
import EqualizerBars from "./EqualizerBars";

export default function TrackRow({
  track,
  isPlaying,
  isCurrent,
  onPlay,
  onLike,
  liked,
  onAddToQueue,
  onAddToPlaylist,
  onRemoveFromQueue,
  onDownloadTrack,
  hasPremiumDownloads,
}) {
  return (
    <div className={`track-row ${isCurrent ? "track-row--active" : ""}`}>
      <div className="track-row__cover" onClick={onPlay}>
        <img src={track.cover} alt={track.title} />
        <div className="track-row__play-overlay">
          <Icon
            d={isCurrent && isPlaying ? Icons.pause : Icons.play}
            fill="white"
            stroke="none"
            size={16}
          />
        </div>
      </div>
      <div className="track-row__info">
        <div className="track-row__title-row">
          <span className="track-row__title">{track.title}</span>
          <EqualizerBars playing={Boolean(isCurrent && isPlaying)} />
        </div>
        <span className="track-row__artist">{track.artist}</span>
      </div>
      <span className="track-row__genre">{track.genre}</span>
      <div className="track-row__actions">
        {onRemoveFromQueue ? (
          <button
            type="button"
            className="icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFromQueue();
            }}
            title="Remove from queue"
          >
            <Icon d={Icons.close} size={14} />
          </button>
        ) : (
          <>
            <button
              type="button"
              className={`icon-btn ${!hasPremiumDownloads ? "icon-btn--locked" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onDownloadTrack?.(track);
              }}
              title={
                hasPremiumDownloads
                  ? "Download track"
                  : "Downloads require a paid plan — open plans"
              }
            >
              <Icon
                d={hasPremiumDownloads ? Icons.download : Icons.lock}
                size={15}
              />
            </button>
            <button
              type="button"
              className={`icon-btn ${liked ? "icon-btn--liked" : ""}`}
              onClick={onLike}
              title="Like"
            >
              <Icon
                d={liked ? Icons.heartFill : Icons.heart}
                fill={liked ? "currentColor" : "none"}
                size={15}
              />
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={onAddToQueue}
              title="Add to queue"
            >
              <Icon d={Icons.queue} size={15} />
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={onAddToPlaylist}
              title="Add to playlist"
            >
              <Icon d={Icons.plus} size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
