import { useState } from "react";

function profileFromEmail(email, name = "") {
  const trimmed = email.trim();
  const local = trimmed.split("@")[0] || trimmed;
  const cleaned = local.replace(/[._-]+/g, " ").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  let initials = "MS";
  
  // Use provided name, fallback to email-derived display name
  const displayName = name.trim() || trimmed;
  
  // Generate initials from name if available, otherwise from email
  if (name.trim()) {
    const nameParts = name.trim().split(/\s+/).filter(Boolean);
    if (nameParts.length >= 2) {
      initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    } else if (name.trim().length >= 2) {
      initials = name.trim().slice(0, 2).toUpperCase();
    } else if (name.trim().length === 1) {
      initials = (name.trim()[0] + name.trim()[0]).toUpperCase();
    }
  } else {
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (local.length >= 2) {
      initials = local.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "MS";
    } else if (local.length === 1) {
      initials = (local[0] + local[0]).toUpperCase();
    }
  }
  
  return { displayName, initials };
}

export default function LoginView({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setError("");
    const em = email.trim();
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    onLogin({ ...profileFromEmail(em, name), email: em, name: name.trim() }, remember);
  };

  const guest = () => {
    onLogin(
      { email: null, displayName: "Guest", initials: "GU" },
      false,
    );
  };

  return (
    <div className="login-page">
      <div className="login-page__glow" aria-hidden />
      <div className="login-card glass-card">
        <div className="login-card__brand">
          <span className="login-card__logo logo-text">MusicStream</span>
          <p className="login-card__tagline">Sign in to stream, save, and sync your library.</p>
        </div>

        <form className="login-form" onSubmit={submit} noValidate>
          {error && (
            <div className="login-form__error" role="alert">
              {error}
            </div>
          )}

          <label className="login-field">
            <span className="login-field__label">Name</span>
            <input
              className="login-field__input"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="login-field">
            <span className="login-field__label">Email</span>
            <input
              className="login-field__input"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="login-field">
            <span className="login-field__label">Password</span>
            <input
              className="login-field__input"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <div className="login-form__row">
            <label className="login-check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <button type="button" className="login-link" onClick={() => setError("Demo only — use any valid email and a 6+ character password.")}>
              Forgot password?
            </button>
          </div>

          <button type="submit" className="login-submit btn-primary">
            Sign in
          </button>
        </form>

        <p className="login-card__hint">
          No backend yet — this is a UI demo. Use any real-looking email and a password of 6+ characters.
        </p>

        <button type="button" className="login-guest" onClick={guest}>
          Continue as guest
        </button>
      </div>
    </div>
  );
}
