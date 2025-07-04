let inactivityTimer: NodeJS.Timeout;

export function resetInactivityTimer(callback: () => void) {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    callback();
  }, 30 * 60 * 1000); // 30 minutes
}

export function setupInactivityListener(callback: () => void) {
  const events = ["click", "keydown", "mousemove", "scroll"];
  const handler = () => resetInactivityTimer(callback);
  events.forEach((event) => window.addEventListener(event, handler));
  resetInactivityTimer(callback);
}
