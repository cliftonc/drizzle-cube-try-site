import { Link } from 'react-router-dom'
import { useState } from 'react'
import { DashboardEditModal } from 'drizzle-cube/client'
import { 
  useAnalyticsPages, 
  useCreateExamplePage, 
  useDeleteAnalyticsPage,
  useCreateAnalyticsPage
} from '../hooks/useAnalyticsPages'

export default function DashboardListPage() {
  const { data: pages = [], isLoading, error } = useAnalyticsPages()
  const createExample = useCreateExamplePage()
  const deletePage = useDeleteAnalyticsPage()
  const createPage = useCreateAnalyticsPage()
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  const handleCreateExample = async () => {
    if (pages.length >= 10) {
      alert('I think 10 is enough dashboards for now, just delete one if you want to test that feature!')
      return
    }
    try {
      await createExample.mutateAsync()
    } catch (error) {
      console.error('Failed to create example dashboard:', error)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deletePage.mutateAsync(id)
      } catch (error) {
        console.error('Failed to delete dashboard:', error)
      }
    }
  }

  const handleCreateDashboard = async (data: { name: string; description?: string }) => {
    if (pages.length >= 10) {
      alert('I think 10 is enough dashboards for now, just delete one if you want to test that feature!')
      return
    }
    try {
      await createPage.mutateAsync({
        name: data.name,
        description: data.description,
        config: { portlets: [] }
      })
      // Note: We could navigate to the new page here if desired
      // navigate(`/dashboards/${newPage.id}`)
    } catch (error) {
      console.error('Failed to create dashboard:', error)
      throw error // Re-throw to keep modal open
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Loading dashboards...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">Failed to load dashboards</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">Analytics Dashboards</h1>
          <p className="mt-1 sm:mt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Manage your analytics dashboards and visualizations
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={handleCreateExample}
              disabled={createExample.isPending || pages.length >= 10}
              className="inline-flex items-center justify-center rounded-md border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/30 px-4 py-2 text-sm font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:border-purple-300 dark:hover:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 whitespace-nowrap"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {createExample.isPending ? 'Creating...' : 'Create Example'}
            </button>
            <button
              onClick={() => setIsNewModalOpen(true)}
              disabled={pages.length >= 10}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-xs hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 whitespace-nowrap"
            >
              New Dashboard
            </button>

          {pages.length >= 10 && (
            <div className="px-3 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-200 dark:border-amber-700 rounded-lg">
              <div className="flex items-center">
                <span className="text-lg mr-2">😊</span>
                <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                  I think we have enough dashboards for now
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-8 sm:py-12 px-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">No dashboards</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
            Get started by creating a new dashboard or example dashboard.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center max-w-xs mx-auto sm:max-w-none">
            <button
              onClick={handleCreateExample}
              disabled={createExample.isPending || pages.length >= 10}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-xs hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 w-full sm:w-auto"
            >
              Create Example Dashboard
            </button>
            <button
              onClick={() => setIsNewModalOpen(true)}
              disabled={pages.length >= 10}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 dark:bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 w-full sm:w-auto"
            >
              Create New Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <div
              key={page.id}
              className="relative group bg-white dark:bg-gray-800 rounded-lg shadow-xs hover:shadow-md transition-shadow touch-manipulation border border-transparent dark:border-gray-700"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 pr-2 leading-tight">
                    {page.name}
                  </h3>
                  <button
                    onClick={() => handleDelete(page.id, page.name)}
                    disabled={deletePage.isPending}
                    className="opacity-60 sm:opacity-0 sm:group-hover:opacity-100 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-opacity disabled:opacity-50 p-1 -m-1 touch-manipulation shrink-0"
                    title="Delete dashboard"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {page.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3 leading-relaxed">
                    {page.description}
                  </p>
                )}

                <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>{page.config.portlets.length} portlets</span>
                  <span className="mx-2">•</span>
                  <span className="truncate">Updated {new Date(page.updatedAt).toLocaleDateString()}</span>
                </div>

                <div>
                  <Link
                    to={`/dashboards/${page.id}`}
                    className="block w-full text-center bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 px-3 py-3 rounded-md text-base font-semibold transition-colors touch-manipulation"
                  >
                    View Dashboard
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DashboardEditModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={handleCreateDashboard}
        title="Create New Dashboard"
        submitText="Create Dashboard"
      />
    </div>
  )
}