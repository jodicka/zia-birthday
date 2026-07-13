"use client";

import { useEffect, useRef, useState } from "react";

const melody = [523.25, 659.25, 783.99, 659.25, 698.46, 587.33, 523.25, 392];

export default function Home() {
  const [scene, setScene] = useState(0);
  const [letterOpen, setLetterOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const noteRef = useRef(0);
  const touchStart = useRef(0);

  const stopTape = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    audioRef.current?.close();
    audioRef.current = null;
    setPlaying(false);
  };

  const playNote = () => {
    const context = audioRef.current;
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = melody[noteRef.current % melody.length];
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.24);
    noteRef.current += 1;
  };

  const toggleTape = async () => {
    if (playing) {
      stopTape();
      return;
    }
    const context = new AudioContext();
    audioRef.current = context;
    setPlaying(true);
    if (context.state === "suspended") void context.resume();
    noteRef.current = 0;
    playNote();
    timerRef.current = setInterval(playNote, 320);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (letterOpen && event.key === "Escape") setLetterOpen(false);
      if (!letterOpen && event.key === "ArrowRight") setScene(1);
      if (!letterOpen && event.key === "ArrowLeft") setScene(0);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (timerRef.current) clearInterval(timerRef.current);
      audioRef.current?.close();
    };
  }, [letterOpen]);

  const onTouchEnd = (event: React.TouchEvent) => {
    if (letterOpen) return;
    const distance = touchStart.current - event.changedTouches[0].clientX;
    if (distance > 50) setScene(1);
    if (distance < -50) setScene(0);
  };

  return (
    <main
      className="story"
      onTouchStart={(event) => (touchStart.current = event.touches[0].clientX)}
      onTouchEnd={onTouchEnd}
    >
      <div className="paper-noise" aria-hidden="true" />
      <div className="scene-track" style={{ transform: `translateX(-${scene * 50}%)` }}>
        <section className="scene intro-scene" aria-hidden={scene !== 0}>
          <header className="tiny-header">
            <span>for zia</span>
            <span>15 · 07 · 1998</span>
          </header>

          <div className="intro-copy">
            <p className="scribble-kicker">a tiny thing for your birthday</p>
            <h1>i know it&apos;s not much,<br />but i made this for you.</h1>
          </div>

          <div className="cassette-cluster">
            <p className="cassette-note">i think about us<br />while made this song <span>↘</span></p>
            <button
              className={`cassette ${playing ? "is-playing" : ""}`}
              type="button"
              onClick={toggleTape}
              aria-pressed={playing}
              aria-label={playing ? "Pause the birthday tape" : "Play the birthday tape"}
            >
              <span className="cassette-label">inspired by us.</span>
              <span className="reel-window">
                <i className="reel left-reel" /><i className="tape-line" /><i className="reel right-reel" />
              </span>
              <span className="cassette-footer">{playing ? "sleepless dawn" : "press to play"}</span>
            </button>
          </div>

          <div className={`letter-wrap ${letterOpen ? "is-open" : ""}`}>
            <button
              className={`letter-object ${letterOpen ? "is-open" : ""}`}
              type="button"
              onClick={() => setLetterOpen((open) => !open)}
              aria-expanded={letterOpen}
              aria-label={letterOpen ? "Fold the letter" : "Unfold the letter"}
            >
              <span className="fold-panel fold-a" /><span className="fold-panel fold-b" />
              <span className="fold-panel fold-c" /><span className="fold-panel fold-d" />
              <span className="letter-seal">for you</span>
              <span className="letter-copy">
                <strong>dear maulida,</strong>
                <span>Happy birthday. Selamat menginjak umur 28.</span>
                <span>I hope the days ahead are kind to you, and every dream you keep reaches you at the right time.</span>
                <span>I root for your future and dreams. Wopyu.</span>
                <em>— always rooting for you</em>
              </span>
            </button>
            <span className="letter-hint">{letterOpen ? "tap the paper to fold it" : "tap to unfold my letter ↗"}</span>
          </div>

          <CapyNav direction="next" label="Go to the birthday page" onClick={() => setScene(1)} />
        </section>

        <section className="scene birthday-scene" aria-hidden={scene !== 1}>
          <div className="confetti" aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
          </div>
          <p className="birthday-date">15 july · 2026</p>
          <div className="birthday-title">
            <span>happy birthday,</span>
            <strong>princess!</strong>
          </div>

          <div className="capy-stage" aria-label="A capybara walking in place with a birthday hat and party blower">
            <span className="ground-shadow" aria-hidden="true" />
            <img src="/assets/capybara-birthday.png" alt="Capybara wearing a birthday hat and party blower" />
            <span className="walk-dust dust-one" aria-hidden="true">✦</span>
            <span className="walk-dust dust-two" aria-hidden="true">·</span>
          </div>

          <div className="birthday-message">
            <p>selamat menginjak umur <strong>28</strong>.</p>
            <p>i root for your future and dreams!</p>
            <span>wopyu.</span>
          </div>

          <CapyNav direction="back" label="Back to the first page" onClick={() => setScene(0)} />
        </section>
      </div>

      <div className="page-dots" aria-label={`Page ${scene + 1} of 2`}>
        <button className={scene === 0 ? "active" : ""} onClick={() => setScene(0)} aria-label="First page" />
        <button className={scene === 1 ? "active" : ""} onClick={() => setScene(1)} aria-label="Birthday page" />
      </div>
    </main>
  );
}

function CapyNav({ direction, label, onClick }: { direction: "next" | "back"; label: string; onClick: () => void }) {
  return (
    <button className={`capy-nav ${direction}`} type="button" onClick={onClick} aria-label={label}>
      <img src="/assets/capybara-next.png" alt="" aria-hidden="true" />
      <span>{direction === "next" ? "next page" : "go back"}</span>
    </button>
  );
}
