import { useEffect, useState } from 'react'
import { SunIcon, MoonIcon, SparklesIcon, BoltIcon } from '@heroicons/react/24/outline'
import { getTheme, setTheme, watchThemeChanges, type Theme } from '../theme/utils'

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light')

  useEffect(() => {
    // Initialize theme state
    setCurrentTheme(getTheme())

    // Watch for theme changes from other sources
    const unwatch = watchThemeChanges((theme) => {
      setCurrentTheme(theme)
    })

    return unwatch
  }, [])

  const cycleTheme = () => {
    // Cycle through themes: light -> dark -> neon -> cyberpunk -> light
    const themeOrder: Theme[] = ['light', 'dark', 'neon', 'cyberpunk']
    const currentIndex = themeOrder.indexOf(currentTheme)
    const nextIndex = (currentIndex + 1) % themeOrder.length
    const nextTheme = themeOrder[nextIndex]

    setTheme(nextTheme)

    // Toggle Prism.js theme (only switch between light and dark for Prism)
    const lightTheme = document.getElementById('prism-light-theme') as HTMLLinkElement
    const darkTheme = document.getElementById('prism-dark-theme') as HTMLLinkElement

    if (lightTheme && darkTheme) {
      if (nextTheme === 'light') {
        lightTheme.disabled = false
        darkTheme.disabled = true
      } else {
        // Use dark theme for dark, neon, and cyberpunk modes
        lightTheme.disabled = true
        darkTheme.disabled = false
      }
    }

    setCurrentTheme(nextTheme)
  }

  // Icon and label based on current theme
  const themeIcon = {
    light: <SunIcon className="w-5 h-5" aria-hidden="true" />,
    dark: <MoonIcon className="w-5 h-5" aria-hidden="true" />,
    neon: <SparklesIcon className="w-5 h-5" aria-hidden="true" />,
    cyberpunk: <BoltIcon className="w-5 h-5" aria-hidden="true" />
  }

  const themeLabel = {
    light: 'Switch to dark mode',
    dark: 'Switch to neon mode',
    neon: 'Switch to cyberpunk mode',
    cyberpunk: 'Switch to light mode'
  }

  return (
    <button
      onClick={cycleTheme}
      className={`inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors ${className}`}
      aria-label={themeLabel[currentTheme]}
      title={themeLabel[currentTheme]}
    >
      {themeIcon[currentTheme]}
    </button>
  )
}
