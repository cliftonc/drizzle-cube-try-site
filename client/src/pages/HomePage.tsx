import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  BookOpenIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import PageHead from '../components/PageHead'
import GitHubStarsButton from '../components/GitHubStarsButton'
import { getTheme, watchThemeChanges, type Theme } from '../theme/utils'

// Dynamically load Prism.js only on HomePage
function loadPrism(): Promise<void> {
  return new Promise((resolve) => {
    // Check if already loaded
    if ((window as any).Prism) {
      resolve()
      return
    }

    // Determine theme for Prism
    const theme = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    const isDark = theme !== 'light'

    // Load CSS themes
    const lightTheme = document.createElement('link')
    lightTheme.id = 'prism-light-theme'
    lightTheme.rel = 'stylesheet'
    lightTheme.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/themes/prism.min.css'
    lightTheme.disabled = isDark
    document.head.appendChild(lightTheme)

    const darkTheme = document.createElement('link')
    darkTheme.id = 'prism-dark-theme'
    darkTheme.rel = 'stylesheet'
    darkTheme.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/themes/prism-tomorrow.min.css'
    darkTheme.disabled = !isDark
    document.head.appendChild(darkTheme)

    // Load Prism core
    const coreScript = document.createElement('script')
    coreScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/components/prism-core.min.js'
    coreScript.onload = () => {
      // Load autoloader after core is ready
      const autoloaderScript = document.createElement('script')
      autoloaderScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/plugins/autoloader/prism-autoloader.min.js'
      autoloaderScript.onload = () => resolve()
      document.head.appendChild(autoloaderScript)
    }
    document.head.appendChild(coreScript)
  })
}

export default function HomePage() {
  const [theme, setTheme] = useState<Theme>('light')

  // Load and apply Prism.js syntax highlighting
  useEffect(() => {
    loadPrism().then(() => {
      setTimeout(() => {
        try {
          ;(window as any).Prism.highlightAll()
        } catch (error) {
          // Silently fail if Prism encounters an error
        }
      }, 0)
    })
  }, [])

  // Watch for theme changes
  useEffect(() => {
    setTheme(getTheme())
    return watchThemeChanges(setTheme)
  }, [])

  return (
    <>
      <PageHead />
      {/* Override Prism.js background styling */}
      <style>{`
        .language-ts, .language-json, pre[class*="language-"] {
          background: transparent !important;
        }
        code[class*="language-"], pre[class*="language-"] {
          background: transparent !important;
          text-shadow: none !important;
        }
        /* Dark mode code styling */
        .dark code[class*="language-"],
        .dark pre[class*="language-"],
        .dark .token {
          text-shadow: none !important;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <img
              src="/drizzle-cube.png"
              alt="Drizzle Cube logo"
              className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20"
            />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dc-text">
              Drizzle Cube
            </h1>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dc-text-secondary mb-6">
            Add self-service analytics to your platform <span className="text-dc-primary">in hours, not months</span>
          </h2>

          <p className="text-base sm:text-lg text-dc-text-muted max-w-2xl mx-auto leading-relaxed mb-8">
            Give your users powerful dashboards and insights using your existing Drizzle schema.
            Zero new infrastructure. Multi-tenant by default.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link
              to="/dashboards"
              className="w-full sm:w-auto px-8 py-3 bg-dc-primary hover:bg-dc-primary-hover text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              View Live Dashboards
            </Link>
            <Link
              to="/analysis-builder"
              className="w-full sm:w-auto px-8 py-3 border-2 border-dc-primary text-dc-primary hover:bg-dc-primary/10 font-semibold rounded-lg transition-all duration-200"
            >
              Try Analysis Builder
            </Link>
          </div>

          {/* Secondary links row */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <GitHubStarsButton />
            <span className="text-dc-border">|</span>
            <a
              href="https://github.com/cliftonc/drizzle-cube/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dc-text-muted hover:text-dc-text transition-colors"
            >
              MIT Licensed
            </a>
            <span className="text-dc-border">|</span>
            <a
              href="https://www.drizzle-cube.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-dc-text-muted hover:text-dc-text transition-colors"
            >
              <BookOpenIcon className="w-4 h-4 mr-1" />
              Docs
            </a>
          </div>
        </div>

        {/* Dashboard Showcase Section */}
        <div className="mb-12 sm:mb-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-stretch">
            {/* Screenshot */}
            <div className="order-2 lg:order-1 flex items-center justify-end">
              <div className="rounded-lg overflow-hidden shadow-xl border border-dc-border relative z-10">
                <img
                  src={theme === 'light' ? '/dashboard_light.png' : '/dashboard_dark.png'}
                  alt="Dashboard screenshot"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Features with background */}
            <div className="order-1 lg:order-2 relative">
              {/* Background that extends behind the image on desktop */}
              <div className="absolute inset-0 bg-dc-surface-secondary rounded-2xl lg:rounded-r-none lg:-left-24" />
              <div className="relative z-10 p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-dc-text mb-6">
                  Full-featured analytics built in
                </h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-dc-success mr-3 mt-0.5 shrink-0" />
                    <span className="text-dc-text-secondary">
                      <strong className="text-dc-text">Rich visualizations</strong> - Bar, line, area, pie, scatter charts, KPI cards, and data tables
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-dc-success mr-3 mt-0.5 shrink-0" />
                    <span className="text-dc-text-secondary">
                      <strong className="text-dc-text">Multiple analysis modes</strong> - Query builder, funnel analysis, and flow analysis
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-dc-success mr-3 mt-0.5 shrink-0" />
                    <span className="text-dc-text-secondary">
                      <strong className="text-dc-text">Fully themeable</strong> - Try the theme switcher in the navbar to see it in action
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-dc-success mr-3 mt-0.5 shrink-0" />
                    <span className="text-dc-text-secondary">
                      <strong className="text-dc-text">AI-powered analysis</strong> - Natural language queries for your users
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-dc-success mr-3 mt-0.5 shrink-0" />
                    <span className="text-dc-text-secondary">
                      <strong className="text-dc-text">Multi-tenant security</strong> - Row-level isolation built into every query
                    </span>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/dashboards"
                    className="text-center px-6 py-2.5 bg-dc-primary hover:bg-dc-primary-hover text-white font-medium rounded-lg transition-colors"
                  >
                    Explore Dashboards
                  </Link>
                  <Link
                    to="/analysis-builder"
                    className="text-center px-6 py-2.5 border border-dc-border hover:border-dc-primary text-dc-text hover:text-dc-primary font-medium rounded-lg transition-colors"
                  >
                    Try Analysis Builder
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="bg-dc-surface rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-dc-text mb-3 sm:mb-4">Why Embed Analytics?</h2>
            <p className="text-dc-text-muted mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
              Turn your platform into a data-driven powerhouse. Embed sophisticated analytics directly into your application to increase user engagement, reduce churn, and drive revenue growth.
            </p>
            <ul className="text-sm text-dc-text-muted space-y-2">
              <li className="flex items-start">
                <span className="text-dc-success mr-2 mt-0.5 shrink-0">✓</span>
                <span><strong>Zero infrastructure setup</strong> - Uses your existing database</span>
              </li>
              <li className="flex items-start">
                <span className="text-dc-success mr-2 mt-0.5 shrink-0">✓</span>
                <span><strong>Seamless integration</strong> - Embed in any React application</span>
              </li>
              <li className="flex items-start">
                <span className="text-dc-success mr-2 mt-0.5 shrink-0">✓</span>
                <span><strong>Multi-tenant by design</strong> - Secure data isolation built-in</span>
              </li>
              <li className="flex items-start">
                <span className="text-dc-success mr-2 mt-0.5 shrink-0">✓</span>
                <span><strong>Developer-friendly</strong> - Type-safe with Drizzle ORM</span>
              </li>
            </ul>
          </div>

          <div className="bg-dc-surface rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-dc-text mb-3 sm:mb-4">How It Works</h2>
            <p className="text-dc-text-muted mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
              Simple 5-step process to add analytics to your platform:
            </p>
            <div className="space-y-3 text-sm text-dc-text-muted">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-dc-primary/10 rounded-full flex items-center justify-center text-dc-primary font-semibold mr-3 mt-0.5 shrink-0">1</div>
                <span><strong>Use your existing schema</strong> - Already have Drizzle ORM? You're 80% done, if not easily <a className="underline text-dc-primary hover:text-dc-primary-hover visited:text-dc-accent" href="https://orm.drizzle.team/docs/drizzle-kit-pull">create one</a></span>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-dc-primary/10 rounded-full flex items-center justify-center text-dc-primary font-semibold mr-3 mt-0.5 shrink-0">2</div>
                <span><strong>Define analytics cubes</strong> - Map your data to business metrics</span>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-dc-primary/10 rounded-full flex items-center justify-center text-dc-primary font-semibold mr-3 mt-0.5 shrink-0">3</div>
                <span><strong>Add REST endpoints</strong> - One-line integration with your framework</span>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-dc-primary/10 rounded-full flex items-center justify-center text-dc-primary font-semibold mr-3 mt-0.5 shrink-0">4</div>
                <span><strong>Embed React components</strong> - Drop charts and dashboards into your UI</span>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-dc-primary/10 rounded-full flex items-center justify-center text-dc-primary font-semibold mr-3 mt-0.5 shrink-0">5</div>
                <span><strong>Ship to users</strong> - Your customers now have powerful analytics</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dc-surface rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center text-dc-text">Quick Example</h3>

          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
            {/* Column 1: Schema + Cube Definition */}
            <div className="space-y-6">
              {/* Drizzle Schema */}
              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-3 text-dc-primary flex items-center">
                  <div className="w-6 h-6 bg-dc-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 shrink-0">1</div>
                  <span className="text-sm sm:text-base">Your EXISTING Drizzle Schema</span>
                </h4>
                <div className="border border-dc-border rounded-lg text-xs bg-dc-surface-secondary overflow-x-auto">
                  <pre className="language-ts text-dc-text-secondary p-3 bg-dc-surface-secondary min-w-0"><code className="language-ts">
{`// schema.ts
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  organisationId: integer('organisation_id'),
  name: text('name').notNull(),
  category: text('category').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
})`}
                  </code></pre>
                </div>
              </div>

              {/* Cube Definition */}
              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-3 text-dc-success flex items-center">
                  <div className="w-6 h-6 bg-dc-success text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 shrink-0">2</div>
                  <span className="text-sm sm:text-base">Create a Drizzle Cube Definition</span>
                </h4>
                <div className="border border-dc-border rounded-lg text-xs bg-dc-surface-secondary overflow-x-auto">
                  <pre className="language-ts text-dc-text-secondary p-3 bg-dc-surface-secondary min-w-0"><code className="language-ts">
{`// cubes.ts
import { defineCube } from 'drizzle-cube/server'
import { eq, sql } from 'drizzle-orm'

export const productsCube = defineCube('Products', {
  title: 'Product Analytics',
  description: 'Product inventory and pricing metrics',

  sql: (ctx) => ({
    from: schema.products,
    where: eq(schema.products.organisationId,
      ctx.securityContext.organisationId)
  }),

  dimensions: {
    name: {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      sql: schema.products.name
    },
    category: {
      name: 'category',
      title: 'Category',
      type: 'string',
      sql: schema.products.category
    },
    createdAt: {
      name: 'createdAt',
      title: 'Created Date',
      type: 'time',
      sql: schema.products.createdAt
    }
  },

  measures: {
    count: {
      name: 'count',
      title: 'Product Count',
      type: 'count',
      sql: schema.products.id
    },
    avgPrice: {
      name: 'avgPrice',
      title: 'Average Price',
      type: 'avg',
      sql: schema.products.price
    }
  }
})`}
                  </code></pre>
                </div>
              </div>
            </div>

            {/* Column 2: API Setup + Query Examples + Results */}
            <div className="space-y-6">
              {/* Step 3: API Setup */}
              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-3 text-dc-info flex items-center">
                  <div className="w-6 h-6 bg-dc-info text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 shrink-0">3</div>
                  <span className="text-sm sm:text-base">Add to your existing application</span>
                </h4>
                <div className="border border-dc-border rounded-lg text-xs bg-dc-surface-secondary overflow-x-auto">
                  <pre className="language-ts text-dc-text-secondary p-3 bg-dc-surface-secondary min-w-0"><code className="language-ts">
{`// app.ts - Your existing Hono app
import { Hono } from 'hono'
import { createCubeApp } from 'drizzle-cube/adapters/hono'
import { productsCube } from './cubes'

const app = new Hono()

// Create cube app with your cubes
const cubeApp = createCubeApp({
  cubes: [productsCube],
  drizzle: db,
  schema,
  extractSecurityContext: async (c) => ({
    organisationId: c.get('user')?.organisationId || 1
  }),
  engineType: 'postgres'
})

// Mount cube API routes
app.route('/', cubeApp) // Done!`}
                  </code></pre>
                </div>
              </div>

              {/* Step 4: Queries */}
              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-3 text-dc-warning flex items-center">
                  <div className="w-6 h-6 bg-dc-warning text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 shrink-0">4</div>
                  <span className="text-sm sm:text-base">Then use simple queries</span>
                </h4>
                <div className="border border-dc-border rounded-lg text-xs bg-dc-surface-secondary overflow-x-auto">
                  <pre className="language-json text-dc-text-secondary p-3 bg-dc-surface-secondary min-w-0"><code className="language-json">
{`GET https://your.application.com/cubejs-api/v1/load?query=

{
  "measures": [
    "Products.count",
    "Products.avgPrice",
    "Products.totalValue"
  ],
  "dimensions": ["Products.category"],
  "timeDimensions": [{
    "dimension": "Products.createdAt",
    "granularity": "month"
  }],
  "filters": [{
    "member": "Products.category",
    "operator": "equals",
    "values": ["Electronics"]
  }]
}`}
                  </code></pre>
                </div>
              </div>

              {/* Step 5: Results */}
              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-3 text-dc-accent flex items-center">
                  <div className="w-6 h-6 bg-dc-accent text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 shrink-0">5</div>
                  <span className="text-sm sm:text-base">To get fast results</span>
                </h4>
                <div className="border border-dc-border rounded-lg text-xs bg-dc-surface-secondary overflow-x-auto">
                  <pre className="language-json text-dc-text-secondary p-3 bg-dc-surface-secondary min-w-0"><code className="language-json">
{`[{
  "Products.category": "Electronics",
  "Products.createdAt": "2024-01",
  "Products.count": "15",
  "Products.avgPrice": "299.99",
  "Products.totalValue": "4499.85"
}]`}
                  </code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Used by these Platforms section */}
        <div className="mt-12 sm:mt-16">
          <h2 className="text-lg sm:text-xl font-semibold text-dc-text-secondary text-center mb-6">
            Used by these Platforms
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 max-w-5xl mx-auto">
            <a
              href="https://www.fintune.app"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-dc-card-bg hover:bg-dc-card-bg-hover border border-dc-card-border hover:border-dc-primary rounded-xl px-6 py-5 transition-all duration-200 shadow-2xs hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <img
                  src="https://www.fintune.app/img/logo_small.png"
                  alt="Fintune logo"
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h3 className="text-lg font-bold text-dc-text group-hover:text-dc-primary transition-colors">
                    Fintune
                  </h3>
                  <p className="text-sm text-dc-text-muted">
                    Team and financial planning for dynamic product organisations
                  </p>
                  <p className="text-xs text-dc-primary mt-1 group-hover:underline">
                    www.fintune.app
                  </p>
                </div>
              </div>
            </a>
            <a
              href="https://www.guidemode.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-dc-card-bg hover:bg-dc-card-bg-hover border border-dc-card-border hover:border-dc-primary rounded-xl px-6 py-5 transition-all duration-200 shadow-2xs hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <img
                  src="https://www.guidemode.dev/logo.svg"
                  alt="Guidemode logo"
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h3 className="text-lg font-bold text-dc-text group-hover:text-dc-primary transition-colors">
                    Guidemode
                  </h3>
                  <p className="text-sm text-dc-text-muted">
                    The only Discovery x Delivery - DX² - platform
                  </p>
                  <p className="text-xs text-dc-primary mt-1 group-hover:underline">
                    www.guidemode.dev
                  </p>
                </div>
              </div>
            </a>
            <a
              href="https://try.icelight.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-dc-card-bg hover:bg-dc-card-bg-hover border border-dc-card-border hover:border-dc-primary rounded-xl px-6 py-5 transition-all duration-200 shadow-2xs hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <img
                  src="/icelight-logo.png"
                  alt="Icelight logo"
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h3 className="text-lg font-bold text-dc-text group-hover:text-dc-primary transition-colors">
                    Icelight
                  </h3>
                  <p className="text-sm text-dc-text-muted">
                    Analytics Events to Apache Iceberg on Cloudflare
                  </p>
                  <p className="text-xs text-dc-primary mt-1 group-hover:underline">
                    try.icelight.dev
                  </p>
                </div>
              </div>
            </a>
            <a
              href="https://github.com/cliftonc/drizzle-cube/discussions/categories/show-and-tell"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-dc-card-bg hover:bg-dc-card-bg-hover border border-dashed border-dc-card-border hover:border-dc-primary rounded-xl px-6 py-5 transition-all duration-200 shadow-2xs hover:shadow-md"
            >
              <div className="flex items-center gap-4 h-full">
                <div className="w-12 h-12 bg-dc-muted-bg group-hover:bg-dc-primary/10 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-2xl text-dc-text-muted group-hover:text-dc-primary">+</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-dc-text group-hover:text-dc-primary transition-colors">
                    Add yours?
                  </h3>
                  <p className="text-sm text-dc-text-muted">
                    Share your platform in our discussions
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
