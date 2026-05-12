import { useRef, useState } from "react";
import Icon, { Icons } from "../components/Icon";

export default function HomeView({
  tracks,
  currentTrack,
  isPlaying,
  onPlay,
  liked,
  onLike,
  onAddToQueue,
  onAddToPlaylist,
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const carouselRef = useRef(null);

  const goTo = (idx) => {
    const clamped = Math.max(0, Math.min(tracks.length - 1, idx));
    setActiveIdx(clamped);
  };

  const handleDragStart = useRef(null);
  const onPointerDown = (e) => { handleDragStart.current = e.clientX; };
  const onPointerUp = (e) => {
    if (handleDragStart.current === null) return;
    const diff = handleDragStart.current - e.clientX;
    if (diff > 40) goTo(activeIdx + 1);
    else if (diff < -40) goTo(activeIdx - 1);
    handleDragStart.current = null;
  };

  return (
    <div className="view home-view">
      <h1 className="view__heading">Good Evening ✦</h1>

      <div
        className="carousel"
        ref={carouselRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {tracks.map((t, i) => {
          const offset = i - activeIdx;
          const isCenter = offset === 0;
          const isVisible = Math.abs(offset) <= 2;
          if (!isVisible) return null;

          return (
            <div
              key={t.id}
              className={`carousel-card ${isCenter ? "carousel-card--active" : ""}`}
              style={{
                transform: `
                  translateX(calc(-50% + ${offset * 200}px))
                  translateZ(${isCenter ? 0 : -120}px)
                  rotateY(${offset * -18}deg)
                  scale(${isCenter ? 1 : 0.78})
                `,
                opacity: isCenter ? 1 : Math.abs(offset) === 1 ? 0.65 : 0.3,
                zIndex: 10 - Math.abs(offset),
                cursor: isCenter ? "default" : "pointer",
              }}
              onClick={() => (isCenter ? onPlay(t) : goTo(i))}
            >
              <img src={t.cover} alt={t.title} className="carousel-card__img" />

              {isCenter && (
                <div className="carousel-card__info">
                  <div className="carousel-card__title">{t.title}</div>
                  <div className="carousel-card__artist">{t.artist}</div>
                  <div className="carousel-card__actions">
                    <button
                      className={`card-action-btn ${liked.includes(t.id) ? "card-action-btn--liked" : ""}`}
                      onClick={(e) => { e.stopPropagation(); onLike(t.id); }}
                      title="Like"
                    >
                      <Icon d={liked.includes(t.id) ? Icons.heartFill : Icons.heart} fill={liked.includes(t.id) ? "currentColor" : "none"} size={16} />
                    </button>
                    <button
                      className="card-action-btn"
                      onClick={(e) => { e.stopPropagation(); onAddToQueue(t); }}
                      title="Add to queue"
                    >
                      <Icon d={Icons.queue} size={16} />
                    </button>
                    <button
                      className="card-action-btn"
                      onClick={(e) => { e.stopPropagation(); onAddToPlaylist(t); }}
                      title="Add to playlist"
                    >
                      <Icon d={Icons.plus} size={16} />
                    </button>
                  </div>
                </div>
              )}

              {isCenter && (
                <div className="carousel-card__play-btn" onClick={() => onPlay(t)}>
                  <Icon
                    d={currentTrack?.id === t.id && isPlaying ? Icons.pause : Icons.play}
                    fill="white"
                    stroke="none"
                    size={24}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="carousel-dots">
        {tracks.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === activeIdx ? "carousel-dot--active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <div className="carousel-arrows">
        <button className="carousel-arrow" onClick={() => goTo(activeIdx - 1)} disabled={activeIdx === 0}>
          <Icon d={Icons.prev} fill="currentColor" stroke="none" size={18} />
        </button>
        <button className="carousel-arrow" onClick={() => goTo(activeIdx + 1)} disabled={activeIdx === tracks.length - 1}>
          <Icon d={Icons.skip} fill="currentColor" stroke="none" size={18} />
        </button>
      </div>
    </div>
  );
}
