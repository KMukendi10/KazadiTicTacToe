let audioCtx;

function getContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function tone(freq, duration, delay = 0, type = "sine", volume = 0.08) {
  try {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);

    const startTime = ctx.currentTime + delay;
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration);
  } catch {
    // Web Audio unavailable (unsupported browser, blocked autoplay, etc.) — fail silently.
  }
}

export function playMoveSound(muted) {
  if (muted) return;
  tone(520, 0.08);
}

export function playWinSound(muted) {
  if (muted) return;
  tone(523.25, 0.12, 0);
  tone(659.25, 0.12, 0.1);
  tone(783.99, 0.2, 0.2);
}

export function playDrawSound(muted) {
  if (muted) return;
  tone(330, 0.15, 0, "triangle");
  tone(246.94, 0.25, 0.12, "triangle");
}
