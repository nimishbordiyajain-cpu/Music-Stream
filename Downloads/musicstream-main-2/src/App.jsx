import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";

import { ARTISTS, TRACKS } from "./data";
import Sidebar from "./components/sidebar";
import Player from "./components/player";
import AddToPlaylistModal from "./components/AddToPlaylist";
import HomeView from "./views/Homeview";
import SearchView from "./views/searchview";
import LikedView from "./views/Likedview";
import QueueView from "./views/queueview";
import ArtistsView from "./views/Artistsview";
import PlaylistsView from "./views/playlistview";
import PlaylistDetailView from "./views/playlistdetailview";
import SubscriptionView from "./views/SubscriptionView";
import LoginView from "./views/LoginView";
import OnboardingView from "./views/OnboardingView";
import ProfileView from "./views/ProfileView";
import SettingsView from "./views/SettingsView";
import PaymentView from "./views/PaymentView";
import DownloadManager from "./components/DownloadManager";
import LyricsDisplay from "./components/LyricsDisplay";
import SleepTimer from "./components/SleepTimer";

import { downloadTrackFile } from "./utils/downloadTrack";
const AUTH_REMEMBER = "musicstream_remember";
const AUTH_SESSION = "musicstream_session";

function parseGenres(raw) {
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  if (typeof raw === "string")
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

const SUBSCRIPTION_TIERS = new Set(["free", "student", "individual", "family"]);

function normalizeAuth(raw) {
  if (!raw || typeof raw !== "object") return null;
  const tier = raw.subscriptionTier;
  return {
    email: raw.email ?? null,
    displayName: raw.displayName ?? "Guest",
    name: raw.name ?? null,
    initials: String(raw.initials ?? "GU").toUpperCase().slice(0, 3),
    remember: Boolean(raw.remember),
    favoriteArtist: raw.favoriteArtist != null ? String(raw.favoriteArtist) : "",
    favoriteGenres: parseGenres(raw.favoriteGenres),
    onboardingComplete: raw.onboardingComplete === true,
    subscriptionTier: SUBSCRIPTION_TIERS.has(tier) ? tier : "free",
  };
}

function readAuth() {
  try {
    const remembered = localStorage.getItem(AUTH_REMEMBER);
    if (remembered) {
      const p = normalizeAuth(JSON.parse(remembered));
      if (p) return { ...p, remember: true };
    }
    const session = sessionStorage.getItem(AUTH_SESSION);
    if (session) {
      const p = normalizeAuth(JSON.parse(session));
      if (p) return { ...p, remember: false };
    }
  } catch {
    /* ignore */
  }
  return null;
}

function writeAuth(profile, remember) {
  const raw = JSON.stringify(profile);
  if (remember) {
    localStorage.setItem(AUTH_REMEMBER, raw);
    sessionStorage.removeItem(AUTH_SESSION);
  } else {
    sessionStorage.setItem(AUTH_SESSION, raw);
    localStorage.removeItem(AUTH_REMEMBER);
  }
}

function clearAuth() {
  sessionStorage.removeItem(AUTH_SESSION);
  localStorage.removeItem(AUTH_REMEMBER);
}

/** Fisher-Yates shuffle — returns a new shuffled array */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function App() {
  const [auth, setAuth] = useState(() => readAuth());
  const [view, setView] = useState("home");
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [liked, setLiked] = useState([]);
  const [queue, setQueue] = useState([...TRACKS]);
  const [shuffle, setShuffle] = useState(false);
  const [shuffleQueue, setShuffleQueue] = useState([]); // pre-generated shuffle order
  const [repeat, setRepeat] = useState("none");
  const [playlists, setPlaylists] = useState([
    { id: 1, name: "Chill Mix", color: "#f5a623", tracks: [1, 2] },
    { id: 2, name: "Late Night", color: "#e8742a", tracks: [3, 5] },
  ]);
  const [addModal, setAddModal] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState(null);
  const [showDownloadManager, setShowDownloadManager] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const volumeBeforeMute = useRef(75);

  const audioRef = useRef(new Audio());

  const toggleMute = useCallback(() => {
    setVolume((v) => {
      if (v === 0) return volumeBeforeMute.current || 75;
      volumeBeforeMute.current = v;
      return 0;
    });
  }, []);

  const persistAuth = useCallback((updates) => {
    setAuth((prev) => {
      if (!prev) return prev;
      const next = normalizeAuth({ ...prev, ...updates });
      writeAuth(next, next.remember);
      return next;
    });
  }, []);

  const hasPremiumDownloads =
    auth?.subscriptionTier && auth.subscriptionTier !== "free";

  const handleSleepComplete = () => {
    setIsPlaying(false);
    setShowSleepTimer(false);
  };

  const handleDownloadTrack = useCallback(
    (track) => {
      if (!hasPremiumDownloads) {
        setView("subscription");
        return;
      }
      downloadTrackFile(track);
    },
    [hasPremiumDownloads, setView],
  );

  // ── Volume sync ───────────────────────────────────────────────────────────
  useEffect(() => {
    audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (view !== "payment") setPaymentPlan(null);
  }, [view]);

  // ── Load track + wire events ──────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!currentTrack) return;

    audio.src = currentTrack.audio;
    audio.load();
    audio.volume = volume / 100;

    const onTimeUpdate = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => handleNext();

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    if (isPlaying) audio.play().catch(() => {});

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentTrack]);

  // ── Play / pause ──────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!currentTrack) return;
    if (isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [isPlaying]);

  // ── When shuffle is toggled ON, pre-generate a shuffled play order ────────
  useEffect(() => {
    if (shuffle) {
      // Build shuffled list, putting current track first so playback is seamless
      const rest = TRACKS.filter((t) => t.id !== currentTrack?.id);
      const newQueue = currentTrack
        ? [currentTrack, ...shuffleArray(rest)]
        : shuffleArray(TRACKS);
      setShuffleQueue(newQueue);
    }
  }, [shuffle]);

  // ── Controls ──────────────────────────────────────────────────────────────
  const handlePlay = (track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying((p) => !p);
      return;
    }
    // If shuffle is on, rebuild shuffle queue starting from this track
    if (shuffle) {
      const rest = TRACKS.filter((t) => t.id !== track.id);
      setShuffleQueue([track, ...shuffleArray(rest)]);
    }
    setCurrentTrack(track);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleNext = useCallback(() => {
    if (!currentTrack) return;

    if (repeat === "one") {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      return;
    }

    if (shuffle) {
      // Use pre-generated shuffle queue
      const idx = shuffleQueue.findIndex((t) => t.id === currentTrack.id);
      const next = shuffleQueue[(idx + 1) % shuffleQueue.length];
      // If we've reached end of shuffle queue, regenerate it
      if (idx === shuffleQueue.length - 1 && repeat === "all") {
        setShuffleQueue(shuffleArray(TRACKS));
      }
      setCurrentTrack(next);
    } else {
      const idx = TRACKS.findIndex((t) => t.id === currentTrack.id);
      const next = TRACKS[(idx + 1) % TRACKS.length];
      if (idx === TRACKS.length - 1 && repeat !== "all") return; // stop at end
      setCurrentTrack(next);
    }

    setProgress(0);
    setIsPlaying(true);
  }, [currentTrack, shuffle, shuffleQueue, repeat]);

  const handlePrev = () => {
    const audio = audioRef.current;
    // If more than 3s in, restart current track
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      setProgress(0);
      return;
    }

    if (shuffle) {
      const idx = shuffleQueue.findIndex((t) => t.id === currentTrack?.id);
      const prev =
        shuffleQueue[(idx - 1 + shuffleQueue.length) % shuffleQueue.length];
      setCurrentTrack(prev);
    } else {
      const idx = TRACKS.findIndex((t) => t.id === currentTrack?.id);
      setCurrentTrack(TRACKS[(idx - 1 + TRACKS.length) % TRACKS.length]);
    }
    setProgress(0);
    setIsPlaying(true);
  };

  const handleSeek = (ratio) => {
    const audio = audioRef.current;
    if (audio.duration) audio.currentTime = ratio * audio.duration;
    setProgress(ratio);
  };

  const toggleShuffle = () => {
    const next = !shuffle;
    setShuffle(next);
    if (next) {
      // Pre-generate shuffle queue immediately
      const rest = TRACKS.filter((t) => t.id !== currentTrack?.id);
      setShuffleQueue(
        currentTrack
          ? [currentTrack, ...shuffleArray(rest)]
          : shuffleArray(TRACKS),
      );
    }
  };

  const toggleLike = (id) =>
    setLiked((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  const addToQueue = (t) => setQueue((q) => [...q, t]);
  const removeFromQueue = (i) =>
    setQueue((q) => q.filter((_, idx) => idx !== i));
  const toggleRepeat = () =>
    setRepeat((r) => (r === "none" ? "all" : r === "all" ? "one" : "none"));

  const common = {
    tracks: TRACKS,
    currentTrack,
    isPlaying,
    onPlay: handlePlay,
    liked,
    onLike: toggleLike,
    onAddToQueue: addToQueue,
    onAddToPlaylist: (t) => setAddModal(t),
    onDownloadTrack: handleDownloadTrack,
    hasPremiumDownloads,
  };

  const renderView = () => {
    if (view === "home") return <HomeView {...common} />;
    if (view === "search") return <SearchView {...common} />;
    if (view === "liked") return <LikedView {...common} />;
    if (view === "queue")
      return (
        <QueueView
          queue={queue}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onRemove={removeFromQueue}
          onDownloadTrack={handleDownloadTrack}
          hasPremiumDownloads={hasPremiumDownloads}
        />
      );
    if (view === "artists")
      return <ArtistsView artists={ARTISTS} {...common} />;
    if (view === "subscription")
      return (
        <SubscriptionView
          onChoosePlan={(plan) => {
            setPaymentPlan(plan);
            setView("payment");
          }}
        />
      );
    if (view === "payment" && paymentPlan)
      return (
        <PaymentView
          planKey={paymentPlan.planKey}
          planTitle={paymentPlan.title}
          isYearly={paymentPlan.isYearly}
          amountLabel={paymentPlan.amountLabel}
          onBack={() => {
            setPaymentPlan(null);
            setView("subscription");
          }}
          onPaid={(tier) => {
            persistAuth({ subscriptionTier: tier });
            setPaymentPlan(null);
            setView("subscription");
          }}
        />
      );
    if (view === "profile")
      return (
        <ProfileView auth={auth} onUpdateProfile={(patch) => persistAuth(patch)} />
      );
    if (view === "settings")
      return (
        <SettingsView
          auth={auth}
          setView={setView}
          onLogout={() => {
            clearAuth();
            setAuth(null);
          }}
        />
      );
    if (view === "playlists")
      return (
        <PlaylistsView
          playlists={playlists}
          setPlaylists={setPlaylists}
          {...common}
        />
      );
    if (view.startsWith("playlist-")) {
      const pl = playlists.find((p) => p.id === Number(view.split("-")[1]));
      if (pl) return <PlaylistDetailView playlist={pl} {...common} />;
    }
    return <HomeView {...common} />;
  };

  if (!auth) {
    return (
      <div className="app app--login-only">
        <LoginView
          onLogin={(profile, remember) => {
            const next = normalizeAuth({
              ...profile,
              remember,
              favoriteArtist: profile.favoriteArtist ?? "",
              favoriteGenres: profile.favoriteGenres ?? [],
              onboardingComplete: false,
              subscriptionTier: profile.subscriptionTier ?? "free",
            });
            writeAuth(next, next.remember);
            setAuth(next);
          }}
        />
      </div>
    );
  }

  if (auth && !auth.onboardingComplete) {
    return (
      <div className="app app--login-only">
        <OnboardingView
          displayName={auth.displayName}
          onComplete={({ favoriteArtist, favoriteGenres }) => {
            persistAuth({
              favoriteArtist,
              favoriteGenres,
              onboardingComplete: true,
            });
          }}
          onSkip={() => {
            persistAuth({ onboardingComplete: true });
          }}
        />
      </div>
    );
  }

  return (
    <div className={`app ${sidebarCollapsed ? "app--sidebar-collapsed" : ""}`}>
      <Sidebar
        view={view}
        setView={setView}
        playlists={playlists}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((c) => !c)}
        userName={auth.displayName}
        userInitials={auth.initials}
        subscriptionTier={auth.subscriptionTier}
      />
      <main className="main">{renderView()}</main>
      <Player
        track={currentTrack}
        isPlaying={isPlaying}
        toggle={() => setIsPlaying((p) => !p)}
        next={handleNext}
        prev={handlePrev}
        progress={progress}
        setProgress={handleSeek}
        duration={duration}
        volume={volume}
        setVolume={setVolume}
        onToggleMute={toggleMute}
        shuffle={shuffle}
        toggleShuffle={toggleShuffle}
        repeat={repeat}
        toggleRepeat={toggleRepeat}
        onDownloadTrack={handleDownloadTrack}
        hasPremiumDownloads={hasPremiumDownloads}
        setView={setView}
        onShowDownloadManager={() => setShowDownloadManager(true)}
        onShowLyrics={() => setShowLyrics(true)}
        onShowSleepTimer={() => setShowSleepTimer(true)}
      />
      {addModal && (
        <AddToPlaylistModal
          track={addModal}
          playlists={playlists}
          setPlaylists={setPlaylists}
          onClose={() => setAddModal(null)}
        />
      )}
      {showDownloadManager && (
        <DownloadManager
          tracks={TRACKS}
          onDownloadTrack={handleDownloadTrack}
          hasPremiumDownloads={hasPremiumDownloads}
          setView={setView}
          onClose={() => setShowDownloadManager(false)}
        />
      )}
      {showLyrics && currentTrack && (
        <LyricsDisplay
          track={currentTrack}
          currentTime={(progress || 0) * (duration || 0)}
          onClose={() => setShowLyrics(false)}
        />
      )}
      {showSleepTimer && (
        <SleepTimer
          isPlaying={isPlaying}
          onPause={() => setIsPlaying(false)}
          onSleepComplete={handleSleepComplete}
          onClose={() => setShowSleepTimer(false)}
        />
      )}
    </div>
  );
}
