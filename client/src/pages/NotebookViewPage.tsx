import { useParams, Link } from 'react-router-dom'
import { useCallback, useState, useRef } from 'react'
import { AgenticNotebook } from 'drizzle-cube/client'
import type { NotebookConfig } from 'drizzle-cube/client'
import {
  ChevronRightIcon,
  CheckIcon,
  KeyIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useNotebook, useUpdateNotebook } from '../hooks/useNotebooks'

const API_KEY_STORAGE_KEY = 'dc-notebook-api-key'
const ANTHROPIC_API_KEY_GUIDE_URL = 'https://docs.anthropic.com/en/api/getting-started#access-the-api'

export default function NotebookViewPage() {
  const { id } = useParams<{ id: string }>()
  const { data: notebook, isLoading, error } = useNotebook(id!)
  const updateNotebook = useUpdateNotebook()

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE_KEY) || '')
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const hasApiKey = apiKey.trim().length > 0

  const handleSave = useCallback(async (config: NotebookConfig) => {
    if (!id) return

    setSaveStatus('saving')
    try {
      await updateNotebook.mutateAsync({
        id: parseInt(id, 10),
        config
      })
      setSaveStatus('saved')
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (err) {
      console.error('Failed to save notebook:', err)
      setSaveStatus('idle')
    }
  }, [id, updateNotebook])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-dc-text-muted">Loading notebook...</div>
      </div>
    )
  }

  if (error || !notebook) {
    return (
      <div className="text-center py-12">
        <p className="text-dc-error text-lg">Failed to load notebook</p>
        <p className="text-dc-text-muted text-sm mt-2">{(error as Error)?.message || 'Notebook not found'}</p>
        <Link to="/notebooks" className="text-dc-primary text-sm mt-4 inline-block hover:underline">
          Back to notebooks
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4" style={{ height: 'calc(100vh - 10rem)' }}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between shrink-0">
        <div className="flex items-center gap-1 text-sm text-dc-text-muted">
          <Link to="/notebooks" className="hover:text-dc-text transition-colors">
            Notebooks
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="text-dc-text font-medium truncate max-w-[260px]">
            {notebook.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus === 'saving' && (
            <span className="text-xs text-dc-text-muted">Saving...</span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-xs text-dc-success flex items-center gap-1">
              <CheckIcon className="w-3 h-3" />
              Saved
            </span>
          )}

          <div className="relative">
            <button
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                hasApiKey
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
              }`}
              title={hasApiKey ? 'API key configured' : 'Set your Anthropic API key'}
            >
              <KeyIcon className="w-3.5 h-3.5" />
              {hasApiKey ? 'API Key Set' : 'Set API Key'}
            </button>

            {showApiKeyInput && (
              <div className="absolute right-0 top-full mt-2 z-50 w-80 bg-dc-surface rounded-lg shadow-xl border border-dc-border p-4">
                <label className="block text-sm font-medium text-dc-text mb-1.5">
                  Anthropic API Key
                </label>
                <p className="text-xs text-dc-text-muted mb-3">
                  Required for notebook chat. Stored in this browser only (localStorage) and passed through as
                  <code className="mx-1">X-Agent-Api-Key</code> for notebook agent requests only.
                </p>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => {
                    const val = e.target.value
                    setApiKey(val)
                    if (val) {
                      localStorage.setItem(API_KEY_STORAGE_KEY, val)
                    } else {
                      localStorage.removeItem(API_KEY_STORAGE_KEY)
                    }
                  }}
                  placeholder="sk-ant-..."
                  className="w-full px-3 py-2 border border-dc-border rounded-lg bg-dc-surface text-dc-text placeholder:text-dc-text-muted focus:outline-none focus:ring-2 focus:ring-dc-primary text-sm font-mono"
                  autoFocus
                />
                <a
                  href={ANTHROPIC_API_KEY_GUIDE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-xs text-dc-primary hover:underline"
                >
                  How to get an Anthropic API key
                </a>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => setShowApiKeyInput(false)}
                    className="px-3 py-1.5 text-xs font-medium text-dc-text-secondary hover:text-dc-text transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {!hasApiKey && (
        <div className="p-4 bg-dc-warning-bg border border-dc-warning rounded-lg shrink-0">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-dc-warning mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-dc-text mb-1">
                Add your own Anthropic API key to start chatting
              </p>
              <p className="text-sm text-dc-text-secondary">
                Notebook chat requests require your own key. The key stays in your browser only and is
                passed through in <code className="mx-1">X-Agent-Api-Key</code> for notebook requests.
              </p>
              <div className="flex flex-wrap gap-3 mt-3">
                <button
                  onClick={() => setShowApiKeyInput(true)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-dc-primary text-white hover:opacity-90 transition-opacity"
                >
                  Add API Key
                </button>
                <a
                  href={ANTHROPIC_API_KEY_GUIDE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-dc-border text-dc-primary hover:bg-dc-surface-secondary transition-colors"
                >
                  How to get a key
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-3 bg-dc-surface border border-dc-border rounded-lg text-xs text-dc-text-secondary inline-flex items-start gap-2 shrink-0">
        <InformationCircleIcon className="w-4 h-4 mt-0.5 shrink-0 text-dc-info" />
        <span>
          This dataset contains employees, teams, time entries, and productivity metrics. Ask questions related to those topics (for example by team, employee, segment, or time period). The notebook saves blocks and chat history automatically.
        </span>
      </div>

      <div className="flex-1 rounded-xl border border-dc-border overflow-hidden min-h-0">
        <AgenticNotebook
          config={notebook.config as NotebookConfig | undefined}
          onSave={handleSave}
          agentApiKey={hasApiKey ? apiKey : undefined}
        />
      </div>
    </div>
  )
}
