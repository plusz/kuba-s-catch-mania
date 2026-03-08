import { useEffect, useRef, useState, useCallback } from 'react';
import backgroundMusicSrc from '@/assets/background_music.mp3';

const MUSIC_VOLUME = 0.2;
const STORAGE_KEY = 'catch-game-music-enabled';

export function useBackgroundMusic(playing: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicEnabled, setMusicEnabled] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== 'false'; // default on
  });

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(backgroundMusicSrc);
      audio.loop = true;
      audio.volume = MUSIC_VOLUME;
      audioRef.current = audio;
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing && musicEnabled) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [playing, musicEnabled]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggleMusic = useCallback(() => {
    setMusicEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { musicEnabled, toggleMusic };
}
