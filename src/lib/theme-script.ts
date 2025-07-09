/**
 * Theme initialization script that runs before the app renders
 * Always uses light theme (no localStorage usage)
 */
export function initializeTheme(): void {
  const script = `
    (function() {
      try {
        // Always use light theme
        document.documentElement.classList.remove('dark');
        // No localStorage usage - theme is always light
      } catch (e) {
        // If theme setting fails, still use light theme
        console.error('Failed to initialize theme:', e);
      }
    })();
  `;

  // Create a script element to inject the initialization code
  const scriptElement = document.createElement("script");
  scriptElement.innerHTML = script;
  document.head.appendChild(scriptElement);
}
