// lib/themeToggle.js (or any utilities file)
export function toggleTheme() {
  const html = document.documentElement;
  html.classList.toggle('dark');

  // Optional: persist preference
  const isDark = html.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}