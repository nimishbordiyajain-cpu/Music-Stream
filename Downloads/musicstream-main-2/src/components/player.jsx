import Icon, { Icons } from "./Icon";
import EqualizerBars from "./EqualizerBars";
import VinylArt from "./VinylArt";
import LyricsMarquee from "./LyricsMarquee";
import PlayerWaveformSeek from "./PlayerWaveformSeek";

const fmt = (s) => {
  if (!s || isNaN(s)) return "0:00";
  const secs = Math.floor(s);
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
};

export default function Player({
  track,
  isPlaying,
  toggle,
  next,
  prev,
  progress,
  setProgress,
  duration,
  volume,
  setVolume,
  onToggleMute,
  shuffle,
  toggleShuffle,
  repeat,
  toggleRepeat,
  onDownloadTrack,
  hasPremiumDownloads,
  setView,
  onShowDownloadManager,
  onShowLyrics,
  onShowSleepTimer,
}) {
  const currentSec = (progress || 0) * (duration || 0);
  const marqueeText =
    track && `${track.title} · ${track.artist} · ${track.title} · ${track.artist}`;

  if (!track) {
    return (
      <footer className="player player--empty">
        <span>Pick a song to start playing ♪</span>
      </footer>
    );
  }

  const download = () => {
    if (!hasPremiumDownloads) {
      setView?.("subscription");
      return;
    }
    onDownloadTrack?.(track);
  };

  return (
    <footer className="player player--glass">
      <div className="player__cluster player__cluster--left">
        <button
          type="button"
          className={`player-ctrl-btn ${shuffle ? "player-ctrl-btn--active" : ""}`}
          onClick={toggleShuffle}
          title="Shuffle"
        >
          <Icon d={Icons.shuffle} size={17} />
        </button>
        <button type="button" className="player-ctrl-btn" onClick={prev} title="Previous">
          <Icon d={Icons.prev} fill="currentColor" stroke="none" size={22} />
        </button>
        <button type="button" className="player-ctrl-btn" onClick={next} title="Next">
          <Icon d={Icons.skip} fill="currentColor" stroke="none" size={22} />
        </button>
        <button
          type="button"
          className={`player-ctrl-btn ${repeat !== "none" ? "player-ctrl-btn--active" : ""}`}
          onClick={toggleRepeat}
          title="Repeat"
        >
          <Icon d={Icons.repeat} size={17} />
          {repeat === "one" && <span className="repeat-badge">1</span>}
        </button>
      </div>

      <div className="player__center">
        <VinylArt src={track.cover} alt={track.title} isPlaying={isPlaying} />

        <div className="player__center-body">
          <div className="player__title-line">
            <EqualizerBars playing={isPlaying} className="player__eq" />
            <div className="player__titles">
              <span className="player__track-title">{track.title}</span>
            </div>
          </div>
          <p className="player__track-artist">{track.artist}</p>
          <LyricsMarquee text={marqueeText} playing={isPlaying} />

          <div className="player__seek-row">
            <span className="player__time">{fmt(currentSec)}</span>
            <PlayerWaveformSeek progress={progress} onSeek={setProgress} />
            <span className="player__time">{fmt(duration)}</span>
          </div>
        </div>

        <button type="button" className="play-btn player__play-btn" onClick={toggle}>
          <Icon
            d={isPlaying ? Icons.pause : Icons.play}
            fill="currentColor"
            stroke="none"
            size={22}
          />
        </button>
      </div>

      <div className="player__cluster player__cluster--right">
        <button
          type="button"
          className="player-ctrl-btn"
          onClick={onShowLyrics}
          title="Show lyrics"
          aria-label="Show lyrics"
        >
          <Icon d={Icons.lyrics} size={18} />
        </button>
        <button
          type="button"
          className="player-ctrl-btn"
          onClick={onShowSleepTimer}
          title="Set sleep timer"
          aria-label="Set sleep timer"
        >
          <Icon d={Icons.moon} size={18} />
        </button>
        <button
          type="button"
          className={`player-ctrl-btn ${!hasPremiumDownloads ? "player-ctrl-btn--locked" : ""}`}
          onClick={onShowDownloadManager}
          title={
            hasPremiumDownloads
              ? "Download manager"
              : "Downloads require a paid plan"
          }
          aria-label={
            hasPremiumDownloads ? "Download manager" : "Upgrade to download"
          }
        >
          <Icon
            d={hasPremiumDownloads ? Icons.downloadMultiple : Icons.lock}
            size={18}
          />
        </button>
        <div className="player__volume-group">
          <button
            type="button"
            className="player-ctrl-btn"
            onClick={onToggleMute}
            title={volume === 0 ? "Unmute" : "Mute"}
            aria-label={volume === 0 ? "Unmute" : "Mute"}
          >
            <Icon d={volume === 0 ? Icons.volumeMute : Icons.volume} size={19} />
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="volume-slider"
            aria-label="Volume"
          />
        </div>
      </div>
    </footer>
  );
}
