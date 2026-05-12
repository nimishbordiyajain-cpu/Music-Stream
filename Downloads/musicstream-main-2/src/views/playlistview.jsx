import { useState } from "react";
import TrackRow from "../components/TrackRow";

const COLORS = ["#e879f9", "#38bdf8", "#34d399", "#fb923c", "#f472b6"];

export default function PlaylistsView({
  playlists,
  setPlaylists,
  tracks,
  currentTrack,
  isPlaying,
  onPlay,
  liked,
  onLike,
  onAddToQueue,
}) {
  const [name, setName] = useState("");

  const create = () => {
    if (!name.trim()) return;
    setPlaylists((p) => [
      ...p,
      {
        id: Date.now(),
        name: name.trim(),
        color: COLORS[p.length % COLORS.length],
        tracks: [],
      },
    ]);
    setName("");
  };

  return (
    <div className="view">
      <h1 className="view__heading">Playlists</h1>

      <div className="create-playlist">
        <input
          placeholder="New playlist name…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && create()}
          className="search-input"
        />
        <button className="btn-primary" onClick={create}>
          Create
        </button>
      </div>

      {playlists.length === 0 && (
        <p className="empty-state">No playlists yet.</p>
      )}

      <div className="playlist-grid">
        {playlists.map((pl) => (
          <div key={pl.id} className="playlist-card">
            <div
              className="playlist-card__icon"
              style={{ background: pl.color + "33", borderColor: pl.color }}
            >
              <span style={{ color: pl.color, fontSize: 22 }}>♪</span>
            </div>
            <div className="playlist-card__name">{pl.name}</div>
            <div className="muted">{pl.tracks.length} songs</div>
          </div>
        ))}
      </div>
    </div>
  );
}
