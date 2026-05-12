import Icon, { Icons } from "./Icon";

export default function AddToPlaylistModal({
  track,
  playlists,
  setPlaylists,
  onClose,
}) {
  const addTo = (id) => {
    setPlaylists((pls) =>
      pls.map((pl) =>
        pl.id === id && !pl.tracks.includes(track.id)
          ? { ...pl, tracks: [...pl.tracks, track.id] }
          : pl,
      ),
    );
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <span>Add to Playlist</span>
          <button className="icon-btn" onClick={onClose}>
            <Icon d={Icons.close} size={16} />
          </button>
        </div>
        <p className="muted" style={{ padding: "0 20px 12px" }}>
          {track.title}
        </p>

        {playlists.length === 0 && (
          <p className="empty-state" style={{ padding: "0 20px 20px" }}>
            No playlists yet.
          </p>
        )}

        {playlists.map((pl) => (
          <button
            key={pl.id}
            className="modal-pl-item"
            onClick={() => addTo(pl.id)}
          >
            <span className="playlist-dot" style={{ background: pl.color }} />
            {pl.name}
            {pl.tracks.includes(track.id) && (
              <Icon d={Icons.check} size={14} style={{ marginLeft: "auto" }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
