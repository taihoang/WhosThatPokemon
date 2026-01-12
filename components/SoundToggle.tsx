'use client';

interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export default function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <button
      className={`sound-toggle ${enabled ? 'enabled' : 'disabled'}`}
      onClick={onToggle}
      aria-label={enabled ? 'Disable sound' : 'Enable sound'}
      aria-pressed={enabled}
    >
      <span className="sound-icon" aria-hidden="true">
        {enabled ? '🔊' : '🔇'}
      </span>
      <span className="sound-label">{enabled ? 'Sound On' : 'Sound Off'}</span>
    </button>
  );
}
