import { useState, useEffect } from "react";
import Icon, { Icons } from "../components/Icon";
import { GENRE_OPTIONS } from "../musicPreferences";

function planBadge(auth) {
  const tier = auth.subscriptionTier || "free";
  if (tier === "student")
    return { label: "Student", Icon: Icons.checkCircle, className: "profile-hero__plan--paid" };
  if (tier === "individual")
    return { label: "Individual", Icon: Icons.checkCircle, className: "profile-hero__plan--paid" };
  if (tier === "family")
    return { label: "Family", Icon: Icons.checkCircle, className: "profile-hero__plan--paid" };
  return { label: "Free", Icon: Icons.gift, className: "profile-hero__plan--free" };
}

export default function ProfileView({ auth, onUpdateProfile }) {
  const [editing, setEditing] = useState(false);
  const [artist, setArtist] = useState(auth.favoriteArtist || "");
  const [genres, setGenres] = useState([...(auth.favoriteGenres || [])]);
  const [name, setName] = useState(auth.name || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!editing) {
      setArtist(auth.favoriteArtist || "");
      setGenres([...(auth.favoriteGenres || [])]);
      setName(auth.name || "");
    }
  }, [auth, editing]);

  const toggleGenre = (g) => {
    setGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );
  };

  const save = () => {
    onUpdateProfile({
      name: name.trim(),
      favoriteArtist: artist.trim(),
      favoriteGenres: genres,
    });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const cancel = () => {
    setArtist(auth.favoriteArtist || "");
    setGenres([...(auth.favoriteGenres || [])]);
    setName(auth.name || "");
    setEditing(false);
  };

  const badge = planBadge(auth);

  return (
    <div className="view profile-view">
      <h1 className="view__heading">Profile</h1>

      <div className="profile-hero glass-card">
        <div className="profile-hero__avatar" aria-hidden>
          {auth.initials}
        </div>
        <div className="profile-hero__meta">
          <h2 className="profile-hero__name">{auth.name || auth.displayName}</h2>
          {auth.email ? (
            <p className="profile-hero__email">{auth.email}</p>
          ) : (
            <p className="profile-hero__email muted">Guest session</p>
          )}
          <span
            className={`sidebar__plan-pill profile-hero__plan ${badge.className}`}
          >
            <Icon d={badge.Icon} size={14} strokeWidth={2} />
            {badge.label}
          </span>
        </div>
        {!editing && (
          <button
            type="button"
            className="btn-primary profile-hero__edit"
            onClick={() => setEditing(true)}
          >
            Edit profile
          </button>
        )}
      </div>

      {saved && (
        <p className="profile-saved" role="status">
          Preferences saved.
        </p>
      )}

      <section className="profile-section glass-card">
        <h3 className="profile-section__title">Profile Information</h3>
        {editing ? (
          <div className="profile-edit">
            <label className="login-field">
              <span className="login-field__label">Name</span>
              <input
                className="login-field__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </label>
          </div>
        ) : (
          <div className="profile-taste">
            <div className="profile-taste__row">
              <span className="profile-taste__label">Name</span>
              <span className="profile-taste__value">
                {auth.name?.trim() || auth.displayName || "—"}
              </span>
            </div>
          </div>
        )}
      </section>

      <section className="profile-section glass-card">
        <h3 className="profile-section__title">Listening taste</h3>
        {editing ? (
          <div className="profile-edit">
            <label className="login-field">
              <span className="login-field__label">Favourite artist</span>
              <input
                className="login-field__input"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Artist name"
              />
            </label>
            <div className="onboarding-genres">
              <span className="login-field__label">Genres you like</span>
              <div className="genre-chip-grid">
                {GENRE_OPTIONS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={`genre-chip genre-chip--toggle ${genres.includes(g) ? "genre-chip--active" : ""}`}
                    onClick={() => toggleGenre(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="profile-edit__actions">
              <button type="button" className="btn-primary" onClick={save}>
                Save
              </button>
              <button type="button" className="profile-btn-ghost" onClick={cancel}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-taste">
            <div className="profile-taste__row">
              <span className="profile-taste__label">Favourite artist</span>
              <span className="profile-taste__value">
                {auth.favoriteArtist?.trim() || "—"}
              </span>
            </div>
            <div className="profile-taste__row profile-taste__row--stack">
              <span className="profile-taste__label">Music types</span>
              <div className="profile-tags">
                {(auth.favoriteGenres || []).length ? (
                  auth.favoriteGenres.map((g) => (
                    <span key={g} className="profile-tag">
                      {g}
                    </span>
                  ))
                ) : (
                  <span className="muted">Not set yet</span>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
