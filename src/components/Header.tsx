import React from 'react';
import { Volume2, VolumeX, Globe } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  language: 'en' | 'bn';
  onToggleLanguage: () => void;
  onHomeClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  onHomeClick,
}) => {
  const [isMuted, setIsMuted] = React.useState(soundManager.getMuted());

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundManager.playClick();
    }
  };

  return (
    <header className="w-full max-w-5xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between border-b border-slate-800/80 shrink-0 [@media(max-height:500px)_and_(orientation:landscape)]:hidden">
      <button
        onClick={onHomeClick}
        className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-lg p-1 group transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center shadow-md relative overflow-hidden border border-emerald-500/50">
          <div className="w-4 h-4 rounded-full bg-rose-600"></div>
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
            Bangladesh 64
          </h1>
          <span className="text-xs text-slate-400 font-bangla block -mt-0.5">
            দেশ চেনা
          </span>
        </div>
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleMute}
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
          aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <button
          onClick={onToggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 text-xs font-semibold"
          aria-label="Toggle language"
        >
          <Globe size={15} />
          <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
        </button>
      </div>
    </header>
  );
};
