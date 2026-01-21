import { useState, useEffect } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

function formatStars(count: number | null | undefined): string {
  if (count == null) return ''
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
  }
  return count.toString()
}

interface GitHubStarsButtonProps {
  className?: string
  mobile?: boolean
}

export default function GitHubStarsButton({ className = '', mobile = false }: GitHubStarsButtonProps) {
  const [stars, setStars] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/github-stars')
      .then(res => res.json() as Promise<{ stars: number | null }>)
      .then(data => {
        if (data.stars !== null) {
          setStars(data.stars)
        }
      })
      .catch(() => {
        // Silently fail - just won't show star count
      })
      .finally(() => setLoading(false))
  }, [])

  const href = 'https://github.com/cliftonc/drizzle-cube'

  if (mobile) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`block px-3 py-2 rounded-md text-base font-medium text-dc-text-muted hover:text-dc-text hover:bg-dc-surface-hover transition-colors ${className}`}
      >
        <GitHubIcon className="w-5 h-5 inline mr-2" />
        GitHub
        {!loading && stars != null && stars > 0 && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-dc-surface-hover text-dc-text">
            <StarIcon className="w-3 h-3 mr-1 text-yellow-500" />
            {formatStars(stars)}
          </span>
        )}
      </a>
    )
  }

  const showStars = !loading && stars != null && stars > 0

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center text-dc-text-muted hover:text-dc-text text-sm font-semibold transition-colors ${className}`}
    >
      <GitHubIcon className="w-4 h-4 mr-1.5" />
      {showStars ? (
        <span className="inline-flex items-center">
          <StarIcon className="w-3.5 h-3.5 mr-1 text-yellow-500" />
          {formatStars(stars)}
        </span>
      ) : (
        'GitHub'
      )}
    </a>
  )
}
