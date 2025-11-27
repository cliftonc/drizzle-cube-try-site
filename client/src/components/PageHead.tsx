import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

interface PageHeadProps {
  title?: string
  description?: string
}

const SITE_URL = 'https://try.drizzle-cube.dev'
const DEFAULT_TITLE = 'Drizzle Cube - Embeddable Analytics'
const DEFAULT_DESCRIPTION = "Experience Drizzle Cube's powerful analytics dashboard with type-safe queries, real-time data visualization, and Cube.js compatibility."

export default function PageHead({ title, description }: PageHeadProps) {
  const location = useLocation()
  const canonicalUrl = `${SITE_URL}${location.pathname}`
  const pageTitle = title || DEFAULT_TITLE
  const pageDescription = description || DEFAULT_DESCRIPTION

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />

      {/* Twitter */}
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDescription} />
    </Helmet>
  )
}
