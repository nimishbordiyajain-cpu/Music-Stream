import { useState, useEffect } from "react";
import Icon, { Icons } from "./Icon";

export default function DownloadManager({ 
  tracks, 
  onDownloadTrack, 
  hasPremiumDownloads, 
  setView,
  onClose 
}) {
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({});

  // Load download history from localStorage
  useEffect(() => {
    try {
      const history = localStorage.getItem("musicstream_download_history");
      if (history) {
        setDownloadHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error("Failed to load download history:", error);
    }
  }, []);

  const saveToHistory = (track) => {
    const newEntry = {
      id: Date.now(),
      trackId: track.id,
      title: track.title,
      artist: track.artist,
      downloadDate: new Date().toISOString(),
    };
    
    const updatedHistory = [newEntry, ...downloadHistory].slice(0, 50); // Keep last 50
    setDownloadHistory(updatedHistory);
    
    try {
      localStorage.setItem("musicstream_download_history", JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Failed to save download history:", error);
    }
  };

  const handleSingleDownload = async (track) => {
    if (!hasPremiumDownloads) {
      setView("subscription");
      return;
    }
    
    setIsDownloading(true);
    setDownloadProgress(prev => ({ ...prev, [track.id]: 0 }));
    
    try {
      // Simulate download progress
      for (let i = 0; i <= 100; i += 10) {
        setDownloadProgress(prev => ({ ...prev, [track.id]: i }));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      onDownloadTrack(track);
      saveToHistory(track);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[track.id];
        return newProgress;
      });
    }
  };

  const handleBatchDownload = async () => {
    if (!hasPremiumDownloads) {
      setView("subscription");
      return;
    }
    
    if (selectedTracks.size === 0) return;
    
    setIsDownloading(true);
    const tracksToDownload = Array.from(selectedTracks);
    
    for (const trackId of tracksToDownload) {
      const track = tracks.find(t => t.id === trackId);
      if (track) {
        setDownloadProgress(prev => ({ ...prev, [track.id]: 0 }));
        
        // Simulate download progress
        for (let i = 0; i <= 100; i += 20) {
          setDownloadProgress(prev => ({ ...prev, [track.id]: i }));
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        onDownloadTrack(track);
        saveToHistory(track);
        
        setDownloadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[track.id];
          return newProgress;
        });
      }
    }
    
    setSelectedTracks(new Set());
    setIsDownloading(false);
  };

  const toggleTrackSelection = (trackId) => {
    setSelectedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedTracks(new Set(tracks.map(t => t.id)));
  };

  const clearSelection = () => {
    setSelectedTracks(new Set());
  };

  const clearHistory = () => {
    setDownloadHistory([]);
    try {
      localStorage.removeItem("musicstream_download_history");
    } catch (error) {
      console.error("Failed to clear download history:", error);
    }
  };

  return (
    <div className="download-manager glass-card">
      <div className="download-manager__header">
        <h2 className="download-manager__title">
          <Icon d={Icons.download} size={20} />
          Download Manager
        </h2>
        <button 
          type="button" 
          className="download-manager__close"
          onClick={onClose}
        >
          <Icon d={Icons.close} size={18} />
        </button>
      </div>

      {!hasPremiumDownloads && (
        <div className="download-manager__upgrade">
          <Icon d={Icons.lock} size={16} />
          <p>Downloads require a premium subscription</p>
          <button 
            type="button" 
            className="btn-primary"
            onClick={() => setView("subscription")}
          >
            Upgrade Now
          </button>
        </div>
      )}

      <div className="download-manager__content">
        <div className="download-manager__section">
          <h3>Available Tracks</h3>
          
          <div className="download-manager__controls">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={selectAll}
              disabled={!hasPremiumDownloads}
            >
              Select All
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={clearSelection}
              disabled={!hasPremiumDownloads}
            >
              Clear Selection
            </button>
            <button 
              type="button" 
              className="btn-primary"
              onClick={handleBatchDownload}
              disabled={!hasPremiumDownloads || selectedTracks.size === 0 || isDownloading}
            >
              <Icon d={Icons.downloadMultiple} size={16} />
              Download Selected ({selectedTracks.size})
            </button>
          </div>

          <div className="download-manager__tracks">
            {tracks.slice(0, 10).map(track => (
              <div key={track.id} className="download-track">
                <input
                  type="checkbox"
                  checked={selectedTracks.has(track.id)}
                  onChange={() => toggleTrackSelection(track.id)}
                  disabled={!hasPremiumDownloads || isDownloading}
                />
                <div className="download-track__info">
                  <span className="download-track__title">{track.title}</span>
                  <span className="download-track__artist">{track.artist}</span>
                </div>
                {downloadProgress[track.id] !== undefined ? (
                  <div className="download-progress">
                    <div 
                      className="download-progress__bar"
                      style={{ width: `${downloadProgress[track.id]}%` }}
                    />
                    <span>{downloadProgress[track.id]}%</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="download-track__btn"
                    onClick={() => handleSingleDownload(track)}
                    disabled={!hasPremiumDownloads || isDownloading}
                  >
                    <Icon d={Icons.download} size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="download-manager__section">
          <div className="download-manager__section-header">
            <h3>Download History</h3>
            {downloadHistory.length > 0 && (
              <button 
                type="button" 
                className="btn-ghost"
                onClick={clearHistory}
              >
                Clear History
              </button>
            )}
          </div>
          
          {downloadHistory.length === 0 ? (
            <p className="download-manager__empty">No downloads yet</p>
          ) : (
            <div className="download-history">
              {downloadHistory.map(entry => (
                <div key={entry.id} className="download-history__item">
                  <div className="download-history__info">
                    <span className="download-history__title">{entry.title}</span>
                    <span className="download-history__artist">{entry.artist}</span>
                  </div>
                  <span className="download-history__date">
                    {new Date(entry.downloadDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
