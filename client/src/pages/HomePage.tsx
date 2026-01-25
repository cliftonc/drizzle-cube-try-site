import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  BookOpenIcon,
  CheckIcon,
  SparklesIcon,
  LinkIcon,
  BoltIcon
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

type AITool = 'claude-desktop' | 'claude-web' | 'chatgpt' | 'n8n'

export default function HomePage() {
  const [theme, setTheme] = useState<Theme>('light')
  const [activeAITool, setActiveAITool] = useState<AITool>('claude-desktop')

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

  // Re-apply Prism highlighting when AI tool tab changes
  useEffect(() => {
    setTimeout(() => {
      try {
        if ((window as any).Prism) {
          ;(window as any).Prism.highlightAll()
        }
      } catch (error) {
        // Silently fail if Prism encounters an error
      }
    }, 0)
  }, [activeAITool])

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
            <span className="text-dc-success">Self-service analytics.</span> <span className="text-dc-info">AI agentic data access.</span><br />Add both to your platform in hours, not months. MIT Licensed.
          </h2>

          <p className="text-base sm:text-lg text-dc-text-muted max-w-2xl mx-auto leading-relaxed mb-8">
            Give your users powerful dashboards and insights using your existing Drizzle schema.
            Zero new infrastructure. Multi-tenant by default. <span className="text-dc-text font-medium">AI-ready out of the box.</span>
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
            <a
              href="#ai-ready"
              className="w-full sm:w-auto px-8 py-3 bg-dc-accent hover:bg-dc-accent-hover text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <SparklesIcon className="w-5 h-5" />
              Enable AI Agents
            </a>
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
            <h2 className="text-xl sm:text-2xl font-bold text-dc-text mb-3 sm:mb-4">Why Add a Semantic Layer?</h2>
            <p className="text-dc-text-muted mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
              A semantic layer decouples your analytics from raw database schemas. Define business metrics once, then access them via dashboards, APIs, or AI agents—all with consistent definitions and built-in security.
            </p>
            <ul className="text-sm text-dc-text-muted space-y-2">
              <li className="flex items-start">
                <span className="text-dc-success mr-2 mt-0.5 shrink-0">✓</span>
                <span><strong>Natural language ready</strong> - AI agents query your data using business terms</span>
              </li>
              <li className="flex items-start">
                <span className="text-dc-success mr-2 mt-0.5 shrink-0">✓</span>
                <span><strong>Single source of truth</strong> - Define metrics once, use everywhere</span>
              </li>
              <li className="flex items-start">
                <span className="text-dc-success mr-2 mt-0.5 shrink-0">✓</span>
                <span><strong>Decoupled from schema</strong> - Change your database without breaking analytics</span>
              </li>
              <li className="flex items-start">
                <span className="text-dc-success mr-2 mt-0.5 shrink-0">✓</span>
                <span><strong>Multi-tenant security</strong> - Row-level isolation enforced at the semantic layer</span>
              </li>
              <li className="flex items-start">
                <span className="text-dc-success mr-2 mt-0.5 shrink-0">✓</span>
                <span><strong>AI workflow integration</strong> - Connect Claude, ChatGPT, or custom agents directly</span>
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
{`GET https://try.drizzle-cube.dev/cubejs-api/v1/load?query=

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

        {/* AI-Ready Data Layer Section */}
        <div id="ai-ready" className="mt-12 sm:mt-16 mb-12 sm:mb-16 scroll-mt-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 border border-purple-200 dark:border-purple-800 rounded-full px-4 py-2 mb-4">
              <SparklesIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">AI-Ready Data Layer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-dc-text mb-3">
              Enable AI Agents in Your Customer's Workflow
            </h2>
            <p className="text-dc-text-secondary max-w-2xl mx-auto">
              Your customers can connect Claude, ChatGPT, or any AI agent directly to your application's analytics.
              Natural language queries against your semantic layer—secure, multi-tenant, and ready out of the box.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* MCP Tools Card */}
            <div className="bg-dc-surface border border-dc-border rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <LinkIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-dc-text">Built-in MCP Tools</h3>
              </div>
              <p className="text-sm text-dc-text-secondary mb-4">
                The MCP server exposes tools that let AI agents query your semantic layer:
              </p>
              <div className="space-y-3">
                <div className="bg-dc-bg rounded-lg p-3 border border-dc-border">
                  <code className="text-sm font-mono text-purple-600 dark:text-purple-400">drizzle_cube_discover</code>
                  <p className="text-xs text-dc-text-muted mt-1">Find relevant cubes based on topic or intent with relevance scores</p>
                </div>
                <div className="bg-dc-bg rounded-lg p-3 border border-dc-border">
                  <code className="text-sm font-mono text-green-600 dark:text-green-400">drizzle_cube_validate</code>
                  <p className="text-xs text-dc-text-muted mt-1">Validate queries and get auto-corrections for any issues</p>
                </div>
                <div className="bg-dc-bg rounded-lg p-3 border border-dc-border">
                  <code className="text-sm font-mono text-blue-600 dark:text-blue-400">drizzle_cube_load</code>
                  <p className="text-xs text-dc-text-muted mt-1">Execute validated queries and return results</p>
                </div>
              </div>
            </div>

            {/* How It Works Card */}
            <div className="bg-dc-surface border border-dc-border rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <BoltIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-dc-text">How AI Integration Works</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dc-text">Rich Semantic Metadata</p>
                    <p className="text-xs text-dc-text-muted">AI agents fetch cube metadata with descriptions, relationships, and measure/dimension definitions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dc-text">Cross-Cube Query Building</p>
                    <p className="text-xs text-dc-text-muted">AI builds queries that span multiple cubes—joins are handled automatically by the semantic layer</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dc-text">Secure Multi-Tenant Execution</p>
                    <p className="text-xs text-dc-text-muted">Every query runs through your security context—customers only see their own data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connect AI Tools - Tabbed Interface with Screenshot */}
          <div className="bg-dc-surface border border-dc-border rounded-xl p-6 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left side - Tabs and content */}
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-dc-text mb-2">Connect AI Tools to Your App</h3>
                  <p className="text-sm text-dc-text-secondary">Your customers can connect their favorite AI tools directly to your application's analytics</p>
                </div>

                {/* Tab Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveAITool('claude-desktop')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeAITool === 'claude-desktop'
                    ? 'bg-dc-primary text-white shadow-md'
                    : 'bg-dc-surface-secondary text-dc-text-secondary hover:bg-dc-surface-hover border border-dc-border'
                }`}
              >
                {/* Claude Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/>
                </svg>
                Claude Desktop
              </button>
              <button
                onClick={() => setActiveAITool('claude-web')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeAITool === 'claude-web'
                    ? 'bg-dc-primary text-white shadow-md'
                    : 'bg-dc-surface-secondary text-dc-text-secondary hover:bg-dc-surface-hover border border-dc-border'
                }`}
              >
                {/* Claude Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/>
                </svg>
                Claude.ai
              </button>
              <button
                onClick={() => setActiveAITool('chatgpt')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeAITool === 'chatgpt'
                    ? 'bg-dc-primary text-white shadow-md'
                    : 'bg-dc-surface-secondary text-dc-text-secondary hover:bg-dc-surface-hover border border-dc-border'
                }`}
              >
                {/* OpenAI/ChatGPT Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
                </svg>
                ChatGPT
              </button>
              <button
                onClick={() => setActiveAITool('n8n')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeAITool === 'n8n'
                    ? 'bg-dc-primary text-white shadow-md'
                    : 'bg-dc-surface-secondary text-dc-text-secondary hover:bg-dc-surface-hover border border-dc-border'
                }`}
              >
                {/* n8n Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.4737 5.6842c-1.1772 0-2.1663.8051-2.4468 1.8947h-2.8955c-1.235 0-2.289.893-2.492 2.111l-.1038.623a1.263 1.263 0 0 1-1.246 1.0555H11.289c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947s-2.1663.8051-2.4467 1.8947H4.973c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947C1.1311 9.4737 0 10.6047 0 12s1.131 2.5263 2.5263 2.5263c1.1772 0 2.1663-.8051 2.4468-1.8947h1.4223c.2804 1.0896 1.2696 1.8947 2.4467 1.8947 1.1772 0 2.1663-.8051 2.4468-1.8947h1.0008a1.263 1.263 0 0 1 1.2459 1.0555l.1038.623c.203 1.218 1.257 2.111 2.492 2.111h.3692c.2804 1.0895 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263c-1.1772 0-2.1664.805-2.4468 1.8947h-.3692a1.263 1.263 0 0 1-1.246-1.0555l-.1037-.623A2.52 2.52 0 0 0 13.9607 12a2.52 2.52 0 0 0 .821-1.4794l.1038-.623a1.263 1.263 0 0 1 1.2459-1.0555h2.8955c.2805 1.0896 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263m0 1.2632a1.263 1.263 0 0 1 1.2631 1.2631 1.263 1.263 0 0 1-1.2631 1.2632 1.263 1.263 0 0 1-1.2632-1.2632 1.263 1.263 0 0 1 1.2632-1.2631M2.5263 10.7368A1.263 1.263 0 0 1 3.7895 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 1.2632 12a1.263 1.263 0 0 1 1.2631-1.2632m6.3158 0A1.263 1.263 0 0 1 10.1053 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 7.579 12a1.263 1.263 0 0 1 1.2632-1.2632m10.1053 3.7895a1.263 1.263 0 0 1 1.2631 1.2632 1.263 1.263 0 0 1-1.2631 1.2631 1.263 1.263 0 0 1-1.2632-1.2631 1.263 1.263 0 0 1 1.2632-1.2632"/>
                </svg>
                n8n
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-dc-surface-secondary rounded-lg border border-dc-border overflow-hidden">
              {/* Claude Desktop */}
              {activeAITool === 'claude-desktop' && (
                <div className="p-4">
                  <p className="text-sm text-dc-text-secondary mb-3">
                    Add this to your Claude Desktop <code className="text-dc-primary bg-dc-primary/10 px-1.5 py-0.5 rounded font-mono text-xs">claude_desktop_config.json</code>:
                  </p>
                  <div className="bg-dc-surface rounded-lg p-4 border border-dc-border overflow-x-auto">
                    <pre className="text-sm font-mono text-dc-text-secondary whitespace-pre"><code className="language-json">{`{
  "mcpServers": {
    "your-app-analytics": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-remote", "https://try.drizzle-cube.dev/mcp"]
    }
  }
}`}</code></pre>
                  </div>
                </div>
              )}

              {/* Claude.ai Web */}
              {activeAITool === 'claude-web' && (
                <div className="p-4">
                  <p className="text-sm text-dc-text-secondary mb-3">
                    Add as a Connector in Claude.ai to enable analytics tools:
                  </p>
                  <div className="bg-dc-surface rounded-lg p-4 border border-dc-border overflow-x-auto">
                    <pre className="text-sm font-mono text-dc-text-secondary whitespace-pre"><code>{`Server URL: https://try.drizzle-cube.dev/mcp

Available tools:
• drizzle_cube_discover - Find relevant cubes by topic/intent
• drizzle_cube_validate - Validate queries with auto-corrections
• drizzle_cube_load     - Execute queries and return results`}</code></pre>
                  </div>
                  <p className="text-xs text-dc-text-muted mt-3">
                    Go to Settings → Connectors → Add Connector to connect the MCP server.
                  </p>
                </div>
              )}

              {/* ChatGPT */}
              {activeAITool === 'chatgpt' && (
                <div className="p-4">
                  <p className="text-sm text-dc-text-secondary mb-3">
                    Enable Developer Mode to add MCP connectors in ChatGPT:
                  </p>
                  <div className="bg-dc-surface rounded-lg p-4 border border-dc-border overflow-x-auto">
                    <pre className="text-sm font-mono text-dc-text-secondary whitespace-pre"><code>{`Server URL: https://try.drizzle-cube.dev/mcp

Available tools:
• drizzle_cube_discover - Find relevant cubes by topic/intent
• drizzle_cube_validate - Validate queries with auto-corrections
• drizzle_cube_load     - Execute queries and return results`}</code></pre>
                  </div>
                  <p className="text-xs text-dc-text-muted mt-3">
                    Go to Settings → Connectors → Advanced → Developer Mode to add the MCP server.
                  </p>
                </div>
              )}

              {/* n8n */}
              {activeAITool === 'n8n' && (
                <div className="p-4">
                  <p className="text-sm text-dc-text-secondary mb-3">
                    Use the n8n MCP Client node to connect to the Drizzle Cube MCP server:
                  </p>
                  <div className="bg-dc-surface rounded-lg p-4 border border-dc-border overflow-x-auto">
                    <pre className="text-sm font-mono text-dc-text-secondary whitespace-pre"><code>{`MCP Server URL: https://try.drizzle-cube.dev/mcp

Available tools in your workflow:
• drizzle_cube_discover - Find relevant cubes
• drizzle_cube_validate - Validate queries
• drizzle_cube_load     - Execute queries

Workflow: AI Agent → MCP Client → Your Analytics`}</code></pre>
                  </div>
                  <p className="text-xs text-dc-text-muted mt-3">
                    See <a href="https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.mcpclienttool/" target="_blank" rel="noopener noreferrer" className="text-dc-primary hover:underline">n8n MCP Client documentation</a> for setup instructions.
                  </p>
                </div>
              )}
            </div>

              </div>

              {/* Right side - Screenshot */}
              <div className="hidden md:flex items-center justify-center">
                <div className="rounded-lg overflow-hidden shadow-lg border border-dc-border max-w-md">
                  <img
                    src="/claude_mcp.png"
                    alt="Claude using Drizzle Cube MCP tools to analyze employee pull requests"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            <p className="text-sm text-dc-text-muted mt-4">
              <strong className="text-dc-text">The result:</strong> Your customers ask their AI "What were our top products last month?" and get answers directly from your application's data—no extra infrastructure, no separate BI tool, just AI-powered analytics embedded in their workflow.
            </p>
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
