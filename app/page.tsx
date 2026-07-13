"use client";

import { useEffect, useRef, useState } from "react";
import { letterText } from "./letter";

export default function Home() {
  const [scene, setScene] = useState(0);
  const [letterOpen, setLetterOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [songEnded, setSongEnded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const touchStart = useRef(0);

  const stopTape = () => {
    audioRef.current?.pause();
    setPlaying(false);
  };

  const toggleTape = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      stopTape();
      return;
    }
    if (audio.ended || songEnded) audio.currentTime = 0;
    setSongEnded(false);
    try {
      await audio.play();
    } catch {
      setPlaying(false);
    }
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
    };
  }, [letterOpen]);

  useEffect(() => () => audioRef.current?.pause(), []);

  const onTouchEnd = (event: React.TouchEvent) => {
    if (letterOpen) return;
    const distance = touchStart.current - event.changedTouches[0].clientX;
    if (distance > 50) setScene(1);
    if (distance < -50) setScene(0);
  };

  return (
    <main
      className={`story ${letterOpen ? "letter-is-open" : ""}`}
      onTouchStart={(event) => (touchStart.current = event.touches[0].clientX)}
      onTouchEnd={onTouchEnd}
    >
      <audio
        ref={audioRef}
        src="audio/sleepless-dawn.mp3"
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setSongEnded(true);
        }}
      />
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
            <p className={`cassette-note ${songEnded ? "song-ended" : ""}`}>
              {songEnded ? <span className="ended-copy">this song is too short<br />to tell our story.</span> : <>i think about us<br />while made this song</>}
              <span className="drawn-arrow note-arrow" aria-hidden="true" />
            </p>
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
            {letterOpen ? (
              <div className="letter-object is-open" role="document" aria-label="Birthday letter for Zia">
                <span className="letter-copy"><span className="letter-body">{letterText}</span></span>
              </div>
            ) : (
              <button className="letter-object envelope" type="button" onClick={() => setLetterOpen(true)} aria-expanded="false" aria-label="Open the envelope">
                <span className="envelope-paper" />
                <span className="envelope-side envelope-left" />
                <span className="envelope-side envelope-right" />
                <span className="envelope-flap" />
                <span className="letter-seal">for you</span>
              </button>
            )}
            {letterOpen && <button className="letter-close" type="button" onClick={() => setLetterOpen(false)}>fold it back ×</button>}
            <span className="letter-hint">
              {letterOpen ? "scroll to read my letter" : <>tap to open my letter <i className="drawn-arrow hint-arrow" aria-hidden="true" /></>}
            </span>
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
            <img src="assets/capybara-birthday.png" alt="Capybara wearing a birthday hat and party blower" />
            <span className="walk-dust dust-one" aria-hidden="true">✦</span>
            <span className="walk-dust dust-two" aria-hidden="true">·</span>
          </div>

          <div className="birthday-message">
            <p>selamat menginjak umur <strong>28</strong>.</p>
            <p>I&apos;m rooting for your future and your dreams.</p>
            <span>wopyu!</span>
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
      <img src="assets/capybara-next.png" alt="" aria-hidden="true" />
    </button>
  );
}
