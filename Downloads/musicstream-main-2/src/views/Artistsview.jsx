import { useState } from "react";
import TrackRow from "../components/TrackRow";

export default function ArtistsView({
  artists,
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
  const [selected, setSelected] = useState(null);
  const artist = artists.find((a) => a.id === selected);
  const artistTracks = selected
    ? tracks.filter((t) => t.artist === artist?.name)
    : [];

  if (selected && artist) {
    return (
      <div className="view">
        <button className="back-btn" onClick={() => setSelected(null)}>
          ← All Artists
        </button>

        <div className="artist-header">
          <img
            src={artist.avatar}
            alt={artist.name}
            className="artist-avatar"
          />
          <div>
            <div className="artist-genre">{artist.genre}</div>
            <h1 className="view__heading">{artist.name}</h1>
            <p className="muted">
              {artist.albums.length} album
              {artist.albums.length !== 1 ? "s" : ""} · {artistTracks.length}{" "}
              songs
            </p>
          </div>
        </div>

        <h2 className="view__subheading">Albums</h2>
        <div className="albums-grid">
          {artist.albums.map((al) => (
            <div key={al.id} className="album-card">
              <img src={al.cover} alt={al.title} />
              <div className="album-card__title">{al.title}</div>
              <div className="album-card__year">{al.year}</div>
            </div>
          ))}
        </div>

        <h2 className="view__subheading">Songs</h2>
        <div className="track-list">
          {artistTracks.map((t) => (
            <TrackRow
              key={t.id}
              track={t}
              isCurrent={currentTrack?.id === t.id}
              isPlaying={isPlaying}
              onPlay={() => onPlay(t)}
              liked={liked.includes(t.id)}
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

  return (
    <div className="view">
      <h1 className="view__heading">Artists</h1>
      <div className="artists-grid">
        {artists.map((a) => {
          const count = tracks.filter((t) => t.artist === a.name).length;
          return (
            <button
              key={a.id}
              className="artist-card"
              onClick={() => setSelected(a.id)}
            >
              <img
                src={a.avatar}
                alt={a.name}
                className="artist-card__avatar"
              />
              <div className="artist-card__name">{a.name}</div>
              <div className="artist-card__meta">
                {a.genre} · {count} songs
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
