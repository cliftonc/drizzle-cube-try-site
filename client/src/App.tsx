import { Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { CubeProvider } from 'drizzle-cube/client'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import DashboardListPage from './pages/DashboardListPage'
import DashboardViewPage from './pages/DashboardViewPage'
import QueryBuilderPage from './pages/QueryBuilderPage'
import AnalysisBuilderPage from './pages/AnalysisBuilderPage'

function App() {
  return (
    <HelmetProvider>
      <CubeProvider
        apiOptions={{ apiUrl: '/cubejs-api/v1' }}
        features={{ showSchemaDiagram: true, useAnalysisBuilder: true, enableAI: true, aiEndpoint: '/api/ai/generate' }}
      >
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboards" element={<DashboardListPage />} />
            <Route path="/dashboards/:id" element={<DashboardViewPage />} />
            <Route path="/query-builder" element={<QueryBuilderPage />} />
            <Route path="/analysis-builder" element={<AnalysisBuilderPage />} />
          </Routes>
        </Layout>
      </CubeProvider>
    </HelmetProvider>
  )
}

export default App
