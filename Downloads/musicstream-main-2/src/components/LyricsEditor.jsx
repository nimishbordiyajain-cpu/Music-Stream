import { useState } from "react";
import Icon, { Icons } from "./Icon";

export default function LyricsEditor({ track, onSaveLyrics, onClose }) {
  const [lyricsText, setLyricsText] = useState(
    track?.lyrics?.map(l => `${l.time}s: ${l.text}`).join('\n') || ''
  );
  const [isSaving, setIsSaving] = useState(false);

  const parseLyricsFromText = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const match = line.match(/^(\d+(?:\.\d+)?)s:\s*(.+)$/);
      if (match) {
        return {
          time: parseFloat(match[1]),
          text: match[2].trim()
        };
      }
      return null;
    }).filter(Boolean);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const parsedLyrics = parseLyricsFromText(lyricsText);
      await onSaveLyrics(track.id, parsedLyrics);
      onClose();
    } catch (error) {
      console.error('Error saving lyrics:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="lyrics-editor glass-card">
        <div className="lyrics-editor__header">
          <h3>Edit Lyrics: {track?.title}</h3>
          <button type="button" onClick={onClose} className="btn-close">
            <Icon d={Icons.close} size={16} />
          </button>
        </div>
        
        <div className="lyrics-editor__content">
          <div className="lyrics-editor__instructions">
            <p>Format: <code>time_in_seconds: lyric text</code></p>
            <p>Example: <code>0s: Hello world</code></p>
          </div>
          
          <textarea
            className="lyrics-editor__textarea"
            value={lyricsText}
            onChange={(e) => setLyricsText(e.target.value)}
            placeholder="Enter lyrics with timing..."
            rows={10}
          />
        </div>
        
        <div className="lyrics-editor__footer">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleSave} 
            className="btn-primary"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Lyrics'}
          </button>
        </div>
      </div>
    </div>
  );
}
