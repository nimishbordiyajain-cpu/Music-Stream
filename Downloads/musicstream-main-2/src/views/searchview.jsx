import { useState } from "react";
import Icon, { Icons } from "../components/Icon";
import TrackRow from "../components/TrackRow";

export default function SearchView({
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
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("All");

  // Dynamically build genre list from actual tracks — never stale
  const genres = ["All", ...new Set(tracks.map((t) => t.genre))];

  // If selected genre no longer exists in tracks, reset to All
  const activeGenre = genres.includes(genre) ? genre : "All";

  const filtered = tracks.filter((t) => {
    const matchGenre = activeGenre === "All" || t.genre === activeGenre;
    const matchQ =
      !q ||
      t.title.toLowerCase().includes(q.toLowerCase()) ||
      t.artist.toLowerCase().includes(q.toLowerCase()) ||
      t.genre.toLowerCase().includes(q.toLowerCase());
    return matchGenre && matchQ;
  });

  return (
    <div className="view">
      <h1 className="view__heading">Search</h1>

      <div className="search-bar">
        <Icon d={Icons.search} size={16} />
        <input
          placeholder="Search songs, artists, genres…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="search-input"
          autoFocus
        />
        {q && (
          <button className="icon-btn" onClick={() => setQ("")}>
            <Icon d={Icons.close} size={14} />
          </button>
        )}
      </div>

      <div className="genre-chips">
        {genres.map((g) => (
          <button
            key={g}
            className={`genre-chip ${activeGenre === g ? "genre-chip--active" : ""}`}
            onClick={() => setGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>

      <p className="search-results-count">
        {filtered.length} song{filtered.length !== 1 ? "s" : ""}
        {activeGenre !== "All" ? ` in ${activeGenre}` : ""}
        {q ? ` for "${q}"` : ""}
      </p>

      <div className="track-list">
        {filtered.length === 0 && (
          <p className="empty-state">No results found.</p>
        )}
        {filtered.map((t) => (
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
