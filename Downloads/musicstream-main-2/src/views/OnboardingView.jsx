import { useState } from "react";
import { GENRE_OPTIONS } from "../musicPreferences";

export default function OnboardingView({ displayName, onComplete, onSkip }) {
  const [artist, setArtist] = useState("");
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState("");

  const toggleGenre = (g) => {
    setGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );
  };

  const submit = (e) => {
    e.preventDefault();
    setError("");
    const a = artist.trim();
    if (!a) {
      setError("Please tell us your favourite artist.");
      return;
    }
    if (genres.length === 0) {
      setError("Pick at least one type of music you enjoy.");
      return;
    }
    onComplete({ favoriteArtist: a, favoriteGenres: genres });
  };

  return (
    <div className="login-page onboarding-page">
      <div className="login-page__glow" aria-hidden />
      <div className="login-card glass-card onboarding-card">
        <div className="login-card__brand">
          <span className="login-card__logo logo-text">MusicStream</span>
          <p className="login-card__tagline">
            Hi
            {displayName
              ? `, ${displayName.includes("@") ? displayName.split("@")[0] : displayName}`
              : ""}{" "}
            — help us tune your experience.
          </p>
        </div>

        <form className="login-form" onSubmit={submit} noValidate>
          {error && (
            <div className="login-form__error" role="alert">
              {error}
            </div>
          )}

          <label className="login-field">
            <span className="login-field__label">Favourite artist</span>
            <input
              className="login-field__input"
              type="text"
              name="favoriteArtist"
              autoComplete="off"
              placeholder="e.g. Taylor Swift, AR Rahman, The Weeknd"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
          </label>

          <div className="onboarding-genres">
            <span className="login-field__label">Types of music you like</span>
            <div className="genre-chip-grid" role="group" aria-label="Music genres">
              {GENRE_OPTIONS.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`genre-chip genre-chip--toggle ${genres.includes(g) ? "genre-chip--active" : ""}`}
                  onClick={() => toggleGenre(g)}
                  aria-pressed={genres.includes(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="login-submit btn-primary">
            Continue
          </button>
        </form>

        <button type="button" className="login-guest" onClick={onSkip}>
          Skip for now
        </button>
        <p className="login-card__hint onboarding-hint">
          You can update this anytime from your profile or settings.
        </p>
      </div>
    </div>
  );
}
