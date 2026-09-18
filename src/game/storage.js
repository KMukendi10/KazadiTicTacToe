const KEY = "tictactoe-settings-v1";

export function loadSaved() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null; // private browsing, disabled storage, corrupted value, etc.
  }
}

export function saveState(partial) {
  try {
    localStorage.setItem(KEY, JSON.stringify(partial));
  } catch {
    // ignore — persistence is a nice-to-have, not a requirement
  }
}
