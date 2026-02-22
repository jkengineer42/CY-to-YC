import { useState, useCallback, useEffect } from "react";

/**
 * Browser-native TTS hooks using the Web Speech API.
 * Waits for voices to load and prefers an English voice.
 */

function useEnglishVoice() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  const pick = useCallback((): SpeechSynthesisVoice | null => {
    const v = voices.length ? voices : window.speechSynthesis.getVoices();
    return (
      v.find((x) => x.lang === "en-US" && x.name.includes("Natural")) ||
      v.find((x) => x.lang.startsWith("en")) ||
      v[0] ||
      null
    );
  }, [voices]);

  return pick;
}

/** Simple play/stop for a single utterance (FeatureCarousel, AnimatedChatBox) */
export const useSimpleTTS = () => {
  const [playing, setPlaying] = useState(false);
  const pickVoice = useEnglishVoice();

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setPlaying(false);
  }, []);

  const play = useCallback((text: string) => {
    if (playing) { stop(); return; }
    stop();

    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "en-US";
    utt.rate = 1;
    const voice = pickVoice();
    if (voice) utt.voice = voice;
    utt.onend = () => setPlaying(false);
    utt.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utt);
    setPlaying(true);
  }, [playing, stop, pickVoice]);

  useEffect(() => () => { window.speechSynthesis.cancel(); }, []);

  return { play, stop, playing, loading: false };
};

/** Indexed play/stop for message lists (Chat page) */
export const useIndexedTTS = () => {
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const pickVoice = useEnglishVoice();

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setPlayingIdx(null);
  }, []);

  const play = useCallback((text: string, idx: number) => {
    if (playingIdx === idx) { stop(); return; }
    stop();

    const utt = new SpeechSynthesisUtterance(text.slice(0, 5000));
    utt.lang = "en-US";
    utt.rate = 1;
    const voice = pickVoice();
    if (voice) utt.voice = voice;
    utt.onend = () => setPlayingIdx(null);
    utt.onerror = () => setPlayingIdx(null);
    window.speechSynthesis.speak(utt);
    setPlayingIdx(idx);
  }, [playingIdx, stop, pickVoice]);

  useEffect(() => () => { window.speechSynthesis.cancel(); }, []);

  return { play, stop, playingIdx, loadingIdx: null };
};
