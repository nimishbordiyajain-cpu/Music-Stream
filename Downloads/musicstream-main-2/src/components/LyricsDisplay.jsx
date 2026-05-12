import { useState, useEffect, useRef } from "react";
import Icon, { Icons } from "./Icon";

// Helper function to get lyrics for a track
const getTrackLyrics = (track) => {
  if (!track || !track.lyrics) {
    // Fallback lyrics if track doesn't have lyrics
    return [
      { time: 0, text: "♪ No lyrics available for this track ♪" },
      { time: 3, text: "Enjoy the music!" },
    ];
  }
  return track.lyrics;
};

export default function LyricsDisplay({
  track,
  currentTime,
  onClose,
}) {
  const [lyrics, setLyrics] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showTranslation, setShowTranslation] = useState(false);
  const lyricsContainerRef = useRef(null);

  useEffect(() => {
    if (track) {
      const trackLyrics = getTrackLyrics(track);
      setLyrics(trackLyrics);
      setCurrentLineIndex(-1);
    }
  }, [track]);

  useEffect(() => {
    if (!lyrics.length) return;

    const currentLyricIndex = lyrics.findIndex(
      (lyric, index) =>
        currentTime >= lyric.time &&
        (index === lyrics.length - 1 || currentTime < lyrics[index + 1].time)
    );

    if (currentLyricIndex !== currentLineIndex) {
      setCurrentLineIndex(currentLyricIndex);
    }
  }, [currentTime, lyrics, currentLineIndex]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  useEffect(() => {
    if (currentLineIndex >= 0 && lyricsContainerRef.current) {
      const activeLine = lyricsContainerRef.current.children[currentLineIndex];
      if (activeLine) {
        activeLine.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [currentLineIndex]);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  const resetFontSize = () => {
    setFontSize(16);
  };

  if (!track) {
    return (
      <div
        className="lyrics-overlay"
        onClick={onClose}
        role="presentation"
      >
        <div
          className="lyrics-display lyrics-display--empty"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lyrics-empty-title"
          onClick={(e) => e.stopPropagation()}
        >
          <p id="lyrics-empty-title">No track playing</p>
          <button
            type="button"
            className="lyrics-display__dismiss"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="lyrics-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`lyrics-display ${isFullscreen ? "lyrics-display--fullscreen" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lyrics-display-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lyrics-display__header">
          <div className="lyrics-display__track-info">
            <h3 className="lyrics-display__title" id="lyrics-display-title">
              {track.title}
            </h3>
            <p className="lyrics-display__artist">{track.artist}</p>
          </div>

          <div className="lyrics-display__controls">
            <button
              type="button"
              className="lyrics-display__control-btn"
              onClick={decreaseFontSize}
              title="Decrease font size"
            >
              A-
            </button>
            <button
              type="button"
              className="lyrics-display__control-btn"
              onClick={resetFontSize}
              title="Reset font size"
            >
              A
            </button>
            <button
              type="button"
              className="lyrics-display__control-btn"
              onClick={increaseFontSize}
              title="Increase font size"
            >
              A+
            </button>
            <button
              type="button"
              className="lyrics-display__control-btn"
              onClick={() => setShowTranslation(!showTranslation)}
              title="Toggle translation"
              aria-pressed={showTranslation}
              aria-label="Toggle translation"
            >
              <Icon d={Icons.globe} size={16} />
            </button>
            <button
              type="button"
              className="lyrics-display__control-btn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title="Toggle fullscreen"
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen lyrics"}
            >
              <Icon d={Icons.expand} size={16} />
            </button>
            <button
              type="button"
              className="lyrics-display__control-btn lyrics-display__control-btn--close"
              onClick={onClose}
              title="Close lyrics"
              aria-label="Close lyrics"
            >
              <Icon d={Icons.close} size={16} />
            </button>
          </div>
        </div>

        <div
          className="lyrics-display__content"
          ref={lyricsContainerRef}
          style={{ fontSize: `${fontSize}px` }}
        >
          {lyrics.map((lyric, index) => (
            <div
              key={index}
              className={`lyrics-line ${
                index === currentLineIndex ? "lyrics-line--active" : ""
              } ${index < currentLineIndex ? "lyrics-line--past" : ""}`}
            >
              <span className="lyrics-line__text">{lyric.text}</span>
              {showTranslation && (
                <span className="lyrics-line__translation">
                  [Translation placeholder]
                </span>
              )}
              {isFullscreen && (
                <span className="lyrics-line__time">
                  {Math.floor(lyric.time / 60)}:
                  {String(Math.floor(lyric.time % 60)).padStart(2, "0")}
                </span>
              )}
            </div>
          ))}
        </div>

        {!isFullscreen && (
          <div className="lyrics-display__footer">
            <div className="lyrics-display__progress">
              <div className="lyrics-display__progress-bar">
                <div
                  className="lyrics-display__progress-fill"
                  style={{
                    width: `${track.duration ? (currentTime / track.duration) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="lyrics-display__time">
                {Math.floor(currentTime / 60)}:
                {String(Math.floor(currentTime % 60)).padStart(2, "0")} /{" "}
                {track.duration
                  ? `${Math.floor(track.duration / 60)}:${String(Math.floor(track.duration % 60)).padStart(2, "0")}`
                  : "0:00"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
