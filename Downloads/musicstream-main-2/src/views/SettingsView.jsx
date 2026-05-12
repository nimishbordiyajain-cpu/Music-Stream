import Icon, { Icons } from "../components/Icon";

export default function SettingsView({ auth, setView, onLogout }) {
  return (
    <div className="view settings-view">
      <h1 className="view__heading">Settings</h1>
      <p className="settings-lede muted">
        Manage your account and listening preferences.
      </p>

      <div className="settings-grid">
        <section className="settings-card glass-card">
          <h2 className="settings-card__title">Profile</h2>
          <p className="settings-card__text">
            View your name, email, plan, and music taste (favourite artist & genres).
          </p>
          <button
            type="button"
            className="btn-primary settings-card__btn"
            onClick={() => setView("profile")}
          >
            <Icon d={Icons.user} size={17} />
            View profile
          </button>
        </section>

        <section className="settings-card glass-card">
          <h2 className="settings-card__title">Account</h2>
          <dl className="settings-dl">
            <div>
              <dt>Display name</dt>
              <dd>{auth.displayName}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{auth.email || "—"}</dd>
            </div>
            <div>
              <dt>Plan</dt>
              <dd className="settings-plan-dd">
                {auth.subscriptionTier && auth.subscriptionTier !== "free" ? (
                  <span className="settings-plan settings-plan--paid">
                    <Icon d={Icons.checkCircle} size={16} strokeWidth={2} />
                    {auth.subscriptionTier === "student"
                      ? "Student"
                      : auth.subscriptionTier === "individual"
                        ? "Individual"
                        : "Family"}
                    <span className="settings-plan__sub muted">Subscribed</span>
                  </span>
                ) : (
                  <span className="settings-plan settings-plan--free">
                    <Icon d={Icons.gift} size={16} strokeWidth={2} />
                    Free
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt>Favourite artist</dt>
              <dd>{auth.favoriteArtist?.trim() || "—"}</dd>
            </div>
            <div>
              <dt>Genres</dt>
              <dd>
                {(auth.favoriteGenres || []).length
                  ? auth.favoriteGenres.join(", ")
                  : "—"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="settings-card glass-card settings-card--danger">
          <h2 className="settings-card__title">Session</h2>
          <p className="settings-card__text">
            Sign out on this device. You will need to sign in again to access your library.
          </p>
          <button
            type="button"
            className="settings-signout-btn"
            onClick={onLogout}
          >
            <Icon d={Icons.logOut} size={18} />
            Log out
          </button>
        </section>
      </div>
    </div>
  );
}
