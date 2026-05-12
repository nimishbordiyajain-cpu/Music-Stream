import Icon, { Icons } from "./Icon";

export default function Sidebar({
  view,
  setView,
  playlists,
  collapsed,
  onToggleCollapsed,
  userName = "Listener",
  userInitials = "LS",
  subscriptionTier = "free",
}) {
  const navItems = [
    { id: "home", icon: Icons.home, label: "Home" },
    { id: "search", icon: Icons.search, label: "Search" },
    { id: "liked", icon: Icons.heart, label: "Liked Songs" },
    { id: "queue", icon: Icons.queue, label: "Queue" },
    { id: "artists", icon: Icons.artist, label: "Artists" },
    { id: "subscription", icon: Icons.star, label: "Subscription", isNew: true },
    { id: "profile", icon: Icons.user, label: "Profile" },
    { id: "settings", icon: Icons.settings, label: "Settings" },
  ];

  const tierLabel =
    subscriptionTier === "student"
      ? "Student"
      : subscriptionTier === "individual"
        ? "Individual"
        : subscriptionTier === "family"
          ? "Family"
          : null;
  const isPaid = subscriptionTier && subscriptionTier !== "free";

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar__top">
        <div className="sidebar__brand-row">
          {!collapsed && <span className="logo-text">MusicStream</span>}
          <button
            type="button"
            className="sidebar__collapse-btn"
            onClick={onToggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon
              d={collapsed ? Icons.chevronRight : Icons.chevronLeft}
              size={18}
            />
          </button>
        </div>

        <div className="sidebar__user">
          <div className="sidebar__avatar" aria-hidden>
            {userInitials}
          </div>
          {!collapsed && (
            <div className="sidebar__user-meta">
              <span className="sidebar__user-name">{userName}</span>
              {isPaid ? (
                <span
                  className="sidebar__plan-pill sidebar__plan-pill--subscribed"
                  title="Subscribed"
                >
                  <Icon d={Icons.checkCircle} size={13} strokeWidth={2} />
                  {tierLabel}
                </span>
              ) : (
                <span className="sidebar__plan-pill sidebar__plan-pill--free" title="Free plan">
                  <Icon d={Icons.gift} size={13} strokeWidth={2} />
                  Free
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            data-tooltip={collapsed ? item.label : undefined}
            className={`nav-item ${
              view === item.id ||
              (item.id === "subscription" && view === "payment")
                ? "nav-item--active"
                : ""
            }`}
            onClick={() => setView(item.id)}
          >
            <Icon d={item.icon} size={18} />
            {!collapsed && (
              <span className="nav-item__label">
                {item.label}
                {item.isNew && (
                  <span className="nav-item__new" aria-label="New">
                    New
                  </span>
                )}
              </span>
            )}
            {collapsed && item.isNew && (
              <span className="nav-item__new-dot" title="New: Subscription" aria-hidden />
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar__section">
        {!collapsed && (
          <div className="sidebar__section-header">
            <span>Playlists</span>
            <button
              type="button"
              className="icon-btn"
              onClick={() => setView("playlists")}
              title="Your playlists"
            >
              <Icon d={Icons.plus} size={14} />
            </button>
          </div>
        )}
        {collapsed && (
          <div className="sidebar__section-header sidebar__section-header--icons">
            <button
              type="button"
              className="icon-btn"
              data-tooltip="Playlists"
              onClick={() => setView("playlists")}
              title="Playlists"
            >
              <Icon d={Icons.library} size={16} />
            </button>
          </div>
        )}
        {playlists.map((pl) => (
          <button
            key={pl.id}
            type="button"
            data-tooltip={collapsed ? pl.name : undefined}
            className={`playlist-item ${view === `playlist-${pl.id}` ? "playlist-item--active" : ""}`}
            onClick={() => setView(`playlist-${pl.id}`)}
          >
            <span className="playlist-dot" style={{ background: pl.color }} />
            {!collapsed && <span className="playlist-item__name">{pl.name}</span>}
          </button>
        ))}
      </div>
    </aside>
  );
}
