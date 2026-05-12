import { useState, useEffect, useRef } from "react";
import Icon, { Icons } from "./Icon";

const PRESET_TIMES = [
  { label: "5 min", value: 5 },
  { label: "10 min", value: 10 },
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
  { label: "2 hours", value: 120 },
];

export default function SleepTimer({ 
  isPlaying, 
  onPause, 
  onSleepComplete, 
  onClose 
}) {
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedTime, setSelectedTime] = useState(30);
  const [customMinutes, setCustomMinutes] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeRemaining]);

  const handleTimerComplete = () => {
    if (isPlaying) {
      onPause();
    }
    onSleepComplete?.();
    
    // Show notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Sleep Timer", {
        body: "Music has been stopped as scheduled",
        icon: "/favicon.ico"
      });
    }
  };

  const startTimer = (minutes) => {
    setTimeRemaining(minutes * 60);
    setIsActive(true);
    
    // Request notification permission if not granted
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const stopTimer = () => {
    setIsActive(false);
    setTimeRemaining(0);
  };

  const handleCustomTimeSubmit = (e) => {
    e.preventDefault();
    const minutes = parseInt(customMinutes);
    if (minutes > 0 && minutes <= 480) { // Max 8 hours
      startTimer(minutes);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalTime = selectedTime * 60;
    return totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;
  };

  return (
    <div className="sleep-timer glass-card">
      <div className="sleep-timer__header">
        <h2 className="sleep-timer__title">
          <Icon d={Icons.moon} size={20} />
          Sleep Timer
        </h2>
        <button 
          type="button" 
          className="sleep-timer__close"
          onClick={onClose}
        >
          <Icon d={Icons.close} size={18} />
        </button>
      </div>

      <div className="sleep-timer__content">
        {isActive ? (
          <div className="sleep-timer__active">
            <div className="sleep-timer__display">
              <div className="sleep-timer__time">{formatTime(timeRemaining)}</div>
              <div className="sleep-timer__progress">
                <div 
                  className="sleep-timer__progress-bar"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
            
            <div className="sleep-timer__status">
              <Icon d={Icons.moon} size={16} className="sleep-timer__icon" />
              <p>Music will stop in {formatTime(timeRemaining)}</p>
            </div>

            <div className="sleep-timer__actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setTimeRemaining(selectedTime * 60);
                }}
              >
                Reset
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={stopTimer}
              >
                Cancel Timer
              </button>
            </div>
          </div>
        ) : (
          <div className="sleep-timer__setup">
            <div className="sleep-timer__presets">
              <h3>Quick Set</h3>
              <div className="sleep-timer__preset-grid">
                {PRESET_TIMES.map(preset => (
                  <button
                    key={preset.value}
                    type="button"
                    className={`sleep-timer__preset ${
                      selectedTime === preset.value ? 'sleep-timer__preset--selected' : ''
                    }`}
                    onClick={() => {
                      setSelectedTime(preset.value);
                      startTimer(preset.value);
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="sleep-timer__custom">
              <h3>Custom Time</h3>
              <form onSubmit={handleCustomTimeSubmit} className="sleep-timer__form">
                <div className="sleep-timer__input-group">
                  <input
                    type="number"
                    min="1"
                    max="480"
                    placeholder="Enter minutes"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                    className="sleep-timer__input"
                  />
                  <span className="sleep-timer__input-suffix">minutes</span>
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!customMinutes || parseInt(customMinutes) <= 0}
                >
                  Start Timer
                </button>
              </form>
            </div>

            <div className="sleep-timer__info">
              <div className="sleep-timer__info-item">
                <Icon d={Icons.info} size={16} />
                <span>The music will automatically stop when the timer ends</span>
              </div>
              <div className="sleep-timer__info-item">
                <Icon d={Icons.bell} size={16} />
                <span>You'll receive a notification when the timer completes</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
