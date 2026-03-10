import { Link, useLocation } from 'react-router-dom'
import { DocumentTextIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import DrizzleCubeIcon from './DrizzleCubeIcon'
import ThemeToggle from './ThemeToggle'
import GitHubStarsButton from './GitHubStarsButton'

// GitHub icon component (kept for FloatingGitHubButton)
const GitHubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
  </svg>
)

// Floating GitHub source button component
const FloatingGitHubButton = () => {
  const location = useLocation()

  // Map routes to their source files
  const getSourcePath = (pathname: string) => {
    const basePath = 'https://github.com/cliftonc/drizzle-cube-try-site/blob/main/client/src/'

    if (pathname === '/') {
      return `${basePath}/pages/HomePage.tsx`
    } else if (pathname.startsWith('/dashboards') && pathname !== '/dashboards') {
      return `${basePath}/pages/DashboardViewPage.tsx`
    } else if (pathname === '/dashboards') {
      return `${basePath}/pages/DashboardListPage.tsx`
    } else if (pathname === '/analysis-builder') {
      return `${basePath}/pages/AnalysisBuilderPage.tsx`
    } else if (pathname.startsWith('/notebooks') && pathname !== '/notebooks') {
      return `${basePath}/pages/NotebookViewPage.tsx`
    } else if (pathname === '/notebooks') {
      return `${basePath}/pages/NotebooksListPage.tsx`
    } else if (pathname === '/schema') {
      return `${basePath}/pages/SchemaPage.tsx`
    }

    return `${basePath}/App.tsx`
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={getSourcePath(location.pathname)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 bg-dc-text hover:bg-dc-text-secondary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
        title="View this page in GitHub"
      >
        <GitHubIcon className="w-6 h-6" />
        <span className="absolute right-14 bg-dc-text text-white px-2 py-1 rounded-sm text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          View source
        </span>
      </a>
    </div>
  )
}

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showThemeHint, setShowThemeHint] = useState(() => {
    // Check localStorage to see if hint was previously dismissed
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('themeHintDismissed')
      return dismissed !== 'true'
    }
    return true
  })

  // Detect print mode from URL parameter
  const searchParams = new URLSearchParams(location.search)
  const isPrintMode = searchParams.get('print') === 'true'

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  // In print mode, render minimal layout without nav and no width constraints
  if (isPrintMode) {
    return (
      <div className="min-h-screen bg-white print-mode">
        <main className="w-full px-4">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dc-page-gradient transition-colors">
      <FloatingGitHubButton />
      <nav className="bg-dc-surface shadow-2xs border-b border-dc-border relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Desktop layout */}
            <div className="flex">
              <div className="shrink-0 flex items-center">
                <Link to="/" className="flex items-center space-x-3 text-xl font-bold text-dc-text hover:text-dc-primary transition-colors">
                  <DrizzleCubeIcon className="text-dc-primary" size={28} />
                  <span>Drizzle Cube</span>
                </Link>
              </div>
              {/* Desktop navigation */}
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link
                  to="/"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
                    isActive('/')
                      ? 'border-dc-primary text-dc-text'
                      : 'border-transparent text-dc-text-muted hover:text-dc-text-secondary hover:border-dc-border'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/analysis-builder"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
                    isActive('/analysis-builder')
                      ? 'border-dc-primary text-dc-text'
                      : 'border-transparent text-dc-text-muted hover:text-dc-text-secondary hover:border-dc-border'
                  }`}
                >
                  Analysis Builder
                </Link>
                <Link
                  to="/dashboards"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
                    isActive('/dashboards')
                      ? 'border-dc-primary text-dc-text'
                      : 'border-transparent text-dc-text-muted hover:text-dc-text-secondary hover:border-dc-border'
                  }`}
                >
                  Dashboards
                </Link>
                <Link
                  to="/notebooks"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
                    isActive('/notebooks')
                      ? 'border-dc-primary text-dc-text'
                      : 'border-transparent text-dc-text-muted hover:text-dc-text-secondary hover:border-dc-border'
                  }`}
                >
                  Notebooks
                </Link>
                <Link
                  to="/schema"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
                    isActive('/schema')
                      ? 'border-dc-primary text-dc-text'
                      : 'border-transparent text-dc-text-muted hover:text-dc-text-secondary hover:border-dc-border'
                  }`}
                >
                  Schema
                </Link>
              </div>
            </div>

            {/* Desktop external links */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <a
                href="https://discord.gg/kFvT97hZsv"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-dc-text-muted hover:text-[#5865F2] text-sm font-semibold transition-colors"
              >
                <DiscordIcon className="w-4 h-4 mr-1.5" />
                Discord
              </a>
              <a
                href="https://www.drizzle-cube.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-dc-text-muted hover:text-dc-text text-sm font-semibold transition-colors"
              >
                <DocumentTextIcon className="w-4 h-4 mr-1.5" />
                Docs
              </a>
              <GitHubStarsButton />
              <div className="relative">
                <ThemeToggle />
                {/* Theme hint - only shown on home page */}
                {isHomePage && showThemeHint && (
                  <div className="absolute top-14 -right-4 z-50">
                    {/* Hint box with shadow */}
                    <div className="bg-dc-primary text-dc-primary-content px-3 py-2 rounded-lg shadow-xl w-48 relative">
                      {/* Pointer arrow - attached to box */}
                      <div className="absolute -top-2 right-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-dc-primary"></div>
                      <button
                        onClick={() => {
                          setShowThemeHint(false)
                          localStorage.setItem('themeHintDismissed', 'true')
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-dc-surface text-dc-text rounded-full hover:bg-dc-surface-hover transition-colors flex items-center justify-center text-lg font-bold shadow-md"
                        aria-label="Close hint"
                      >
                        ×
                      </button>
                      <p className="text-xs font-semibold pr-4 leading-snug">
                        See how you can customize it for your platform...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-dc-text-muted hover:text-dc-text hover:bg-dc-surface-hover focus:outline-hidden focus:ring-2 focus:ring-dc-primary focus:ring-offset-2 dark:focus:ring-offset-dc-surface transition-colors"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dc-surface border-t border-dc-border">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/')
                    ? 'text-dc-primary bg-dc-primary/10 border-l-4 border-dc-primary'
                    : 'text-dc-text-muted hover:text-dc-text hover:bg-dc-surface-hover'
                }`}
              >
                Home
              </Link>
              <Link
                to="/analysis-builder"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/analysis-builder')
                    ? 'text-dc-primary bg-dc-primary/10 border-l-4 border-dc-primary'
                    : 'text-dc-text-muted hover:text-dc-text hover:bg-dc-surface-hover'
                }`}
              >
                Analysis Builder
              </Link>
              <Link
                to="/dashboards"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/dashboards')
                    ? 'text-dc-primary bg-dc-primary/10 border-l-4 border-dc-primary'
                    : 'text-dc-text-muted hover:text-dc-text hover:bg-dc-surface-hover'
                }`}
              >
                Dashboards
              </Link>
              <Link
                to="/notebooks"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/notebooks')
                    ? 'text-dc-primary bg-dc-primary/10 border-l-4 border-dc-primary'
                    : 'text-dc-text-muted hover:text-dc-text hover:bg-dc-surface-hover'
                }`}
              >
                Notebooks
              </Link>
              <Link
                to="/schema"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/schema')
                    ? 'text-dc-primary bg-dc-primary/10 border-l-4 border-dc-primary'
                    : 'text-dc-text-muted hover:text-dc-text hover:bg-dc-surface-hover'
                }`}
              >
                Schema
              </Link>

              {/* Mobile external links */}
              <div className="border-t border-dc-border pt-4 pb-3">
                <div className="space-y-1">
                  <a
                    href="https://discord.gg/kFvT97hZsv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 rounded-md text-base font-medium text-dc-text-muted hover:text-[#5865F2] hover:bg-dc-surface-hover transition-colors"
                  >
                    <DiscordIcon className="w-5 h-5 inline mr-2" />
                    Discord
                  </a>
                  <a
                    href="https://www.drizzle-cube.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 rounded-md text-base font-medium text-dc-text-muted hover:text-dc-text hover:bg-dc-surface-hover transition-colors"
                  >
                    <DocumentTextIcon className="w-5 h-5 inline mr-2" />
                    Documentation
                  </a>
                  <GitHubStarsButton mobile />
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {isHomePage ? (
        children
      ) : (
        <main className="max-w-7xl mx-auto py-3 md:py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-2 md:py-6 sm:px-0">
            {children}
          </div>
        </main>
      )}
    </div>
  )
}
