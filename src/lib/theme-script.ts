/**
 * Theme initialization script that runs before the app renders
 * Always uses light theme
 */
export function initializeTheme(): void {
  const script = `
    (function() {
      try {
        // Always use light theme
        document.documentElement.classList.remove('dark');

        // Remove any stored theme preference
        if (localStorage.getItem('theme')) {
          localStorage.removeItem('theme');
        }
      } catch (e) {
        // If localStorage is not available, still use light theme
        console.error('Failed to initialize theme:', e);
      }
    })();
  `;

  // Create a script element to inject the initialization code
  const scriptElement = document.createElement('script');
  scriptElement.innerHTML = script;
  document.head.appendChild(scriptElement);
}
