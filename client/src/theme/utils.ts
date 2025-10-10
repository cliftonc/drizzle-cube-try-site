/**
 * Theme utilities for three-theme system (light, dark, neon)
 *
 * This is a local implementation to ensure compatibility.
 * The main drizzle-cube package exports these from 'drizzle-cube/client/theme'
 */

export type Theme = 'light' | 'dark' | 'neon' | 'cyberpunk'

/**
 * Get the current theme
 */
export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'light'

  // Check localStorage first
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'neon' || stored === 'light' || stored === 'cyberpunk') {
    return stored
  }

  // Check for data-theme attribute
  const dataTheme = document.documentElement.getAttribute('data-theme')
  if (dataTheme === 'dark' || dataTheme === 'neon' || dataTheme === 'cyberpunk') {
    return dataTheme
  }

  // Check for dark class
  if (document.documentElement.classList.contains('dark')) {
    return 'dark'
  }

  // Check for neon class
  if (document.documentElement.classList.contains('neon')) {
    return 'neon'
  }

  // Check for cyberpunk class
  if (document.documentElement.classList.contains('cyberpunk')) {
    return 'cyberpunk'
  }

  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

/**
 * Set the theme
 */
export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return

  // Remove all theme classes
  document.documentElement.classList.remove('dark', 'neon', 'cyberpunk')

  // Set data-theme attribute
  document.documentElement.setAttribute('data-theme', theme)

  // Add appropriate class for backwards compatibility
  if (theme === 'dark' || theme === 'neon' || theme === 'cyberpunk') {
    document.documentElement.classList.add(theme)
  }

  // Persist to localStorage
  localStorage.setItem('theme', theme)
}

/**
 * Watch for theme changes
 */
export function watchThemeChanges(callback: (theme: Theme) => void): () => void {
  if (typeof window === 'undefined') return () => {}

  // Watch for class changes on html element
  const observer = new MutationObserver(() => {
    callback(getTheme())
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme']
  })

  // Watch for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const mediaListener = () => callback(getTheme())
  mediaQuery.addEventListener('change', mediaListener)

  // Return cleanup function
  return () => {
    observer.disconnect()
    mediaQuery.removeEventListener('change', mediaListener)
  }
}
