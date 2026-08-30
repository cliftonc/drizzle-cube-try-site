/**
 * Shared dashboard configuration
 * Used by both the seed script (`seed-utils.ts`) and the create-example API
 * endpoint (`analytics-routes.ts`), so this file is the single source of truth
 * for the demo dashboard.
 *
 * Format notes (drizzle-cube 0.7.0):
 * - Every portlet uses the canonical `analysisConfig` shape. The legacy
 *   top-level `query` / `chartType` / `chartConfig` / `displayConfig` fields are
 *   deprecated and are not written here. Note `analysisConfig.query` is a parsed
 *   OBJECT, not a JSON string.
 * - `layoutMode: 'rows'` means `rows` drives the layout. `x/y/w/h` are still
 *   required on every portlet and are re-derived from the rows by
 *   `convertRowsToPortlets`; they keep grid mode, the mobile stack and
 *   thumbnails working. The values here match that derivation.
 * - `groups` are combined portlets. They are a REFERENCE structure: children
 *   stay flat in `portlets` and are only named by id in `cells[].portletIds`.
 *   A group needs at least two portlets or it is collapsed back to a plain
 *   portlet, and every portlet must be referenced exactly once across
 *   `rows[].columns[].portletId` and `groups[].cells[].portletIds`.
 */

import type {
  ChartAxisConfig,
  ChartDisplayConfig,
  ChartType,
  CubeQuery,
  DashboardConfig,
  PortletConfig,
  PortletGroup
} from 'drizzle-cube/client'

// `RowLayout` is not re-exported from drizzle-cube/client, so take it from the
// config type that uses it rather than reaching into internals.
type RowLayout = NonNullable<DashboardConfig['rows']>[number]

/**
 * Portlets are declared without geometry; `x/y/w/h` are derived from `rows`
 * below. They are still required by the type and still drive grid mode, the
 * mobile stack and thumbnails - deriving them just means the layout is stated
 * once instead of twice.
 */
type PortletDraft = Omit<PortletConfig, 'w' | 'h' | 'x' | 'y'>

/** Builds the canonical analysisConfig wrapper for a standard query portlet. */
function queryPortlet(args: {
  id: string
  title: string
  query: CubeQuery
  chartType: ChartType
  chartConfig?: ChartAxisConfig
  displayConfig?: ChartDisplayConfig
  filters?: string[]
}): PortletDraft {
  return {
    id: args.id,
    title: args.title,
    analysisConfig: {
      version: 1,
      analysisType: 'query',
      activeView: 'chart',
      charts: {
        query: {
          chartType: args.chartType,
          chartConfig: args.chartConfig ?? {},
          displayConfig: args.displayConfig ?? {}
        }
      },
      query: args.query
    },
    ...(args.filters ? { dashboardFilterMapping: args.filters } : {})
  }
}

/** A full-width markdown divider that introduces a section. */
function sectionDivider(id: string, content: string): PortletDraft {
  return queryPortlet({
    id,
    title: id,
    query: {},
    chartType: 'markdown',
    displayConfig: {
      content,
      transparentBackground: true,
      accentBorder: 'left',
      fontSize: 'medium',
      alignment: 'left'
    }
  })
}

/** Largest-remainder split, mirroring the library's partitionUnits. */
function partition(total: number, count: number): number[] {
  if (count === 0) return []
  if (total <= count) return Array(count).fill(1)
  const base = Math.floor(total / count)
  const out = Array(count).fill(base)
  let remainder = total - base * count
  for (let i = 0; i < count && remainder > 0; i++, remainder--) out[i]++
  return out
}

/** Walks the rows and stamps each draft with the geometry it will be given. */
function withGeometry(
  drafts: PortletDraft[],
  rows: RowLayout[],
  groups: PortletGroup[]
): PortletConfig[] {
  const geometry = new Map<string, { x: number; y: number; w: number; h: number }>()
  const groupsById = new Map(groups.map(g => [g.id, g]))
  let y = 0
  for (const row of rows) {
    let x = 0
    for (const column of row.columns) {
      if (column.portletId) {
        geometry.set(column.portletId, { x, y, w: column.w, h: row.h })
      } else if (column.groupId) {
        const group = groupsById.get(column.groupId)
        if (!group) throw new Error(`row ${row.id} references unknown group ${column.groupId}`)
        const widths = partition(column.w, group.cells.length)
        let cellX = x
        group.cells.forEach((cell, i) => {
          const heights = partition(row.h, cell.portletIds.length)
          let cellY = y
          cell.portletIds.forEach((portletId, j) => {
            geometry.set(portletId, { x: cellX, y: cellY, w: widths[i], h: heights[j] })
            cellY += heights[j]
          })
          cellX += widths[i]
        })
      }
      x += column.w
    }
    y += row.h
  }

  return drafts.map(draft => {
    const box = geometry.get(draft.id)
    // A portlet the layout never references would silently not render.
    if (!box) throw new Error(`portlet ${draft.id} is not referenced by any row or group`)
    return { ...draft, ...box }
  })
}

const ENGINEERING_ONLY = { member: 'Departments.name', operator: 'equals' as const, values: ['Engineering'] }
const NOT_A_DAY_OFF = { member: 'Productivity.isDayOff', operator: 'equals' as const, values: [false] }

const THANKS_MARKDOWN = `## Thanks for scrolling this far! 🎊

Did you know that Drizzle Cube can actually do way more than just track how many lines of code you've written while questioning your life choices?

### Here's what this magical cube can do:

- **📊 Turn your data into pretty charts** - Because pie charts make everything look more important
- **🔍 Query anything** - Your database, your soul, your will to live on Monday mornings
- **⚡ Super-fast dashboards** - Watch your KPIs update faster than your coffee gets cold
- **🎨 Drag & drop chart building** - So easy, even that one coworker who still prints emails can use it
- **📱 Mobile responsive** - View your existential data crisis from anywhere!
- **🔒 Enterprise security** - Your productivity shame is safe with us

*P.S. If you made it this far, you definitely deserve a coffee break. Or maybe it's time to actually use some of this data to make decisions? Nah, let's add another chart instead.* ☕`

const groups: PortletGroup[] = [
      {
        id: 'group-kpi-strip',
        title: 'Delivery at a glance',
        direction: 'row' as const,
        // One portlet per cell. Cells share the width evenly; a cell may hold
        // several portlets to stack them on the other axis, but there is not
        // enough height for that at this row height.
        cells: [
          { portletIds: ['total-lines-kpi'] },
          { portletIds: ['total-prs-kpi'] },
          { portletIds: ['total-deployments-kpi'] },
          { portletIds: ['avg-happiness-kpi'] }
        ]
      },
      {
        id: 'group-pr-flow',
        title: 'PR event flow \u2014 the same analysis as a Sankey and a Sunburst',
        direction: 'row' as const,
        cells: [
          { portletIds: ['pr-event-flow-sankey'] },
          { portletIds: ['pr-event-flow-sunburst'] }
        ]
      }
]

// ------------------------------------------------------------------
// Layout. Each row's column widths must total 12.
// ------------------------------------------------------------------
const rows: RowLayout[] = [
      // 2.25 units (180px) is the measured minimum: below it the "vs target"
      // line clips (scrollHeight 17 into a 5px box). 3 units left ~60px of dead
      // space above and below the numbers.
      { id: 'row-kpis', h: 2.25, columns: [{ groupId: 'group-kpi-strip', w: 12 }] },
      { id: 'row-activity', h: 4, columns: [{ portletId: 'code-activity-grid', w: 12 }] },

      { id: 'row-sec-trends', h: 1, columns: [{ portletId: 'section-trends', w: 12 }] },
      { id: 'row-trend-main', h: 5, columns: [{ portletId: 'moving-average-trend', w: 8 }, { portletId: 'utilization-gauge', w: 4 }] },
      { id: 'row-trend-detail', h: 5, columns: [{ portletId: 'running-total-trend', w: 6 }, { portletId: 'period-change-bars', w: 6 }] },
      { id: 'row-deployments', h: 5, columns: [{ portletId: 'deployment-frequency', w: 12 }] },

      { id: 'row-sec-people', h: 1, columns: [{ portletId: 'section-people', w: 12 }] },
      { id: 'row-dept', h: 5, columns: [{ portletId: 'engineering-output-by-team', w: 6 }, { portletId: 'hours-by-allocation-dept', w: 6 }] },
      { id: 'row-allocation', h: 2, columns: [{ portletId: 'time-allocation-proportion', w: 12 }] },
      { id: 'row-happiness', h: 5, columns: [{ portletId: 'happiness-by-level', w: 4 }, { portletId: 'happiness-by-team-region', w: 8 }] },
      { id: 'row-treemap', h: 6, columns: [{ portletId: 'happiness-treemap', w: 12 }] },

      { id: 'row-sec-stats', h: 1, columns: [{ portletId: 'section-stats', w: 12 }] },
      { id: 'row-stats', h: 6, columns: [{ portletId: 'salary-boxplot', w: 6 }, { portletId: 'productivity-scatter', w: 6 }] },
      { id: 'row-percentiles', h: 5, columns: [{ portletId: 'percentile-thresholds-area', w: 12 }] },

      { id: 'row-sec-flow', h: 1, columns: [{ portletId: 'section-flow', w: 12 }] },
      { id: 'row-funnel', h: 6, columns: [{ portletId: 'pr-lifecycle-funnel', w: 12 }] },
      { id: 'row-flow', h: 6, columns: [{ groupId: 'group-pr-flow', w: 12 }] },

      { id: 'row-summary', h: 6, columns: [{ portletId: 'productivity-summary', w: 12 }] },
      { id: 'row-thanks', h: 6, columns: [{ portletId: 'thanks-for-scrolling', w: 12 }] }
]

const portletDrafts: PortletDraft[] = [
      // ================================================================
      // Row 1 - the headline combined portlet: four KPIs in one card.
      // Group children render headerless, so each KPI's label comes from the
      // cube measure title. `layout: 'compact'` is applied automatically on
      // mobile but must be set explicitly for desktop.
      // ================================================================
      queryPortlet({
        id: 'total-lines-kpi',
        title: 'Total Lines of Code',
        query: {
          measures: ['Productivity.totalLinesOfCode'],
          timeDimensions: [{ dimension: 'Productivity.date', granularity: 'month' }],
          filters: [NOT_A_DAY_OFF]
        },
        chartType: 'kpiNumber',
        chartConfig: { yAxis: ['Productivity.totalLinesOfCode'] },
        displayConfig: { layout: 'compact', suffix: ' lines', decimals: 0, target: '200000' },
        filters: ['date-range']
      }),
      queryPortlet({
        id: 'total-prs-kpi',
        title: 'Total Pull Requests',
        query: {
          measures: ['Productivity.totalPullRequests'],
          timeDimensions: [{ dimension: 'Productivity.date', granularity: 'month' }],
          filters: [NOT_A_DAY_OFF]
        },
        chartType: 'kpiNumber',
        chartConfig: { yAxis: ['Productivity.totalPullRequests'] },
        displayConfig: { layout: 'compact', suffix: ' PRs', decimals: 0, target: '4500' },
        filters: ['date-range']
      }),
      queryPortlet({
        id: 'total-deployments-kpi',
        title: 'Total Deployments',
        query: {
          measures: ['Productivity.totalDeployments'],
          timeDimensions: [{ dimension: 'Productivity.date', granularity: 'month' }]
        },
        chartType: 'kpiDelta',
        chartConfig: { yAxis: ['Productivity.totalDeployments'], xAxis: ['Productivity.date'] },
        displayConfig: { layout: 'compact', suffix: ' deployments', decimals: 0, showBaseline: true },
        filters: ['date-range']
      }),
      queryPortlet({
        id: 'avg-happiness-kpi',
        title: 'Average Happiness Score',
        query: {
          measures: ['Productivity.avgHappinessIndex'],
          timeDimensions: [{ dimension: 'Productivity.date', granularity: 'month' }],
          filters: [NOT_A_DAY_OFF]
        },
        chartType: 'kpiNumber',
        chartConfig: { yAxis: ['Productivity.avgHappinessIndex'] },
        displayConfig: { layout: 'compact', suffix: '/10', decimals: 1, target: '8.0' },
        filters: ['date-range']
      }),

      // Row 2 - the detail behind those four numbers.
      queryPortlet({
        id: 'code-activity-grid',
        title: 'Daily Code Output Activity',
        query: {
          measures: ['Productivity.totalLinesOfCode'],
          timeDimensions: [{ dimension: 'Productivity.date', granularity: 'day' }],
          filters: [NOT_A_DAY_OFF]
        },
        chartType: 'activityGrid',
        chartConfig: {
          dateField: ['Productivity.date'],
          valueField: ['Productivity.totalLinesOfCode']
        },
        displayConfig: { showLabels: true, showTooltip: true },
        filters: ['date-range']
      }),

      // ================================================================
      // Output over time
      // ================================================================
      sectionDivider(
        'section-trends',
        '## Output over time\nWeekly code output, cumulative totals and month-over-month change — all computed in SQL with window functions.'
      ),
      queryPortlet({
        id: 'moving-average-trend',
        title: 'Window Function: Weekly Output with 7-Period Moving Average',
        query: {
          measures: ['Productivity.totalLinesOfCode', 'Productivity.movingAvg7Period'],
          timeDimensions: [{ dimension: 'Productivity.date', granularity: 'week' }],
          filters: [NOT_A_DAY_OFF]
        },
        chartType: 'line',
        chartConfig: {
          xAxis: ['Productivity.date'],
          yAxis: ['Productivity.totalLinesOfCode', 'Productivity.movingAvg7Period'],
          series: []
        },
        displayConfig: { showLegend: true, showSummary: true },
        filters: ['date-range']
      }),
      // Gauge: utilizationRate is already a percentage, so min/max are 0-100.
      // `thresholds` values are 0-1 FRACTIONS of that range, not raw values.
      queryPortlet({
        id: 'utilization-gauge',
        title: 'Billable Utilisation',
        query: {
          measures: ['TimeEntries.utilizationRate']
        },
        chartType: 'gauge',
        chartConfig: { yAxis: ['TimeEntries.utilizationRate'] },
        displayConfig: {
          minValue: 0,
          maxValue: 100,
          showCenterLabel: true,
          showPercentage: false,
          thresholds: [
            { value: 0, color: '#ef4444' },
            { value: 0.5, color: '#f59e0b' },
            { value: 0.7, color: '#22c55e' }
          ]
        },
        filters: ['date-range']
      }),
      queryPortlet({
        id: 'running-total-trend',
        title: 'Window Function: Cumulative Lines of Code (Running Total)',
        query: {
          measures: ['Productivity.totalLinesOfCode', 'Productivity.runningTotalLines'],
          timeDimensions: [{ dimension: 'Productivity.date', granularity: 'week' }],
          filters: [NOT_A_DAY_OFF]
        },
        chartType: 'area',
        chartConfig: {
          xAxis: ['Productivity.date'],
          yAxis: ['Productivity.runningTotalLines'],
          series: []
        },
        displayConfig: { showLegend: true },
        filters: ['date-range']
      }),
      // Monthly, not weekly: a +/- delta reads as bars, and 12 months beats 52
      // near-identical weekly marks.
      queryPortlet({
        id: 'period-change-bars',
        title: 'Window Function: Month-over-Month Change in Lines of Code',
        query: {
          measures: ['Productivity.totalLinesOfCode', 'Productivity.linesOfCodeChange'],
          timeDimensions: [{ dimension: 'Productivity.date', granularity: 'month' }],
          filters: [NOT_A_DAY_OFF]
        },
        chartType: 'bar',
        chartConfig: {
          xAxis: ['Productivity.date'],
          yAxis: ['Productivity.linesOfCodeChange'],
          series: []
        },
        displayConfig: { showLegend: false, showGrid: true },
        filters: ['date-range']
      }),
      // The only multi-series line on the dashboard.
      queryPortlet({
        id: 'deployment-frequency',
        title: 'Deployment Frequency by Team',
        query: {
          measures: ['Productivity.totalDeployments'],
          dimensions: ['Teams.name'],
          timeDimensions: [{ dimension: 'Productivity.date', granularity: 'month' }],
          filters: [
            ENGINEERING_ONLY,
            { member: 'Productivity.totalDeployments', operator: 'gt', values: [0] }
          ]
        },
        chartType: 'line',
        chartConfig: {
          xAxis: ['Productivity.date'],
          yAxis: ['Productivity.totalDeployments'],
          series: ['Teams.name']
        },
        displayConfig: { showLegend: true },
        filters: ['date-range']
      }),

      // ================================================================
      // Teams, departments and where the time goes
      // ================================================================
      sectionDivider(
        'section-people',
        '## Teams, departments and where the time goes\nTeam output, department time allocation and happiness, joined across four cubes.'
      ),
      // Grouped bars, sitting next to the stacked bars below, so the two
      // stackType modes are visible as a contrast.
      // Only Engineering produces code in the seed data, so a by-department
      // breakdown of these measures is one bar and three gaps. Team is the axis
      // that actually varies.
      queryPortlet({
        id: 'engineering-output-by-team',
        title: 'Engineering Output by Team',
        query: {
          measures: ['Productivity.totalLinesOfCode', 'Productivity.totalPullRequests', 'Productivity.totalDeployments'],
          dimensions: ['Teams.name'],
          filters: [ENGINEERING_ONLY],
          order: { 'Productivity.totalLinesOfCode': 'desc' }
        },
        chartType: 'bar',
        chartConfig: {
          xAxis: ['Teams.name'],
          yAxis: ['Productivity.totalLinesOfCode', 'Productivity.totalPullRequests', 'Productivity.totalDeployments'],
          series: [],
          yAxisAssignment: {
            'Productivity.totalPullRequests': 'right',
            'Productivity.totalDeployments': 'right'
          }
        },
        displayConfig: {
          showLegend: true,
          stackType: 'none',
          showAllXLabels: true,
          leftYAxisFormat: { abbreviate: true },
          rightYAxisFormat: { abbreviate: true }
        }
      }),
      queryPortlet({
        id: 'hours-by-allocation-dept',
        title: 'Where Each Department Spends Its Hours',
        query: {
          measures: ['TimeEntries.developmentHours', 'TimeEntries.meetingHours', 'TimeEntries.maintenanceHours'],
          dimensions: ['Departments.name']
        },
        chartType: 'bar',
        chartConfig: {
          xAxis: ['Departments.name'],
          yAxis: ['TimeEntries.developmentHours', 'TimeEntries.meetingHours', 'TimeEntries.maintenanceHours'],
          series: []
        },
        displayConfig: { showLegend: true, stackType: 'normal' },
        filters: ['date-range']
      }),
      queryPortlet({
        id: 'time-allocation-proportion',
        title: 'Where the Time Goes',
        query: {
          measures: ['TimeEntries.totalHours'],
          dimensions: ['TimeEntries.allocationType'],
          order: { 'TimeEntries.totalHours': 'desc' }
        },
        chartType: 'proportionBar',
        chartConfig: {
          xAxis: ['TimeEntries.allocationType'],
          yAxis: ['TimeEntries.totalHours']
        },
        displayConfig: { showLabels: true, showPercentages: true, sortSegments: true, decimals: 1 },
        filters: ['date-range']
      }),
      // Donut rather than a full pie, so it reads differently from the
      // proportion bar directly above it.
      queryPortlet({
        id: 'happiness-by-level',
        title: 'Team Happiness Distribution',
        query: {
          measures: ['Productivity.recordCount'],
          dimensions: ['Productivity.happinessLevel'],
          filters: [NOT_A_DAY_OFF]
        },
        chartType: 'pie',
        chartConfig: {
          xAxis: ['Productivity.happinessLevel'],
          yAxis: ['Productivity.recordCount'],
          series: []
        },
        // pie's innerRadius is a STRING percentage (sunburst's is a number).
        displayConfig: { showLegend: true, innerRadius: '55%' }
      }),
      queryPortlet({
        id: 'happiness-by-team-region',
        title: 'Team Happiness by Region',
        query: {
          measures: ['Productivity.avgHappinessIndex'],
          dimensions: ['Teams.name', 'Employees.region']
        },
        chartType: 'heatmap',
        chartConfig: {
          xAxis: ['Teams.name'],
          yAxis: ['Employees.region'],
          valueField: ['Productivity.avgHappinessIndex']
        },
        displayConfig: { showLabels: true, showLegend: true }
      }),
      queryPortlet({
        id: 'happiness-treemap',
        title: 'Employee Happiness by Department (Treemap)',
        query: {
          measures: ['Productivity.avgHappinessIndex', 'Productivity.daysOffCount'],
          dimensions: ['Employees.name', 'Departments.name']
        },
        chartType: 'treemap',
        chartConfig: {
          xAxis: ['Employees.name'],
          yAxis: ['Productivity.avgHappinessIndex'],
          series: ['Departments.name']
        },
        displayConfig: { showLegend: true }
      }),

      // ================================================================
      // Distributions and statistics
      // ================================================================
      sectionDivider(
        'section-stats',
        '## Distributions and statistics\nMedian, standard deviation and percentiles — pushed down to the database, not computed in the browser.'
      ),
      // Box plot in its documented 3-measure mode: the yAxis order is
      // [avg, stddev, median].
      queryPortlet({
        id: 'salary-boxplot',
        title: 'Statistical: Salary Distribution by Department',
        query: {
          measures: ['Employees.avgSalary', 'Employees.stddevSalary', 'Employees.medianSalary'],
          dimensions: ['Departments.name']
        },
        chartType: 'boxPlot',
        chartConfig: {
          xAxis: ['Departments.name'],
          yAxis: ['Employees.avgSalary', 'Employees.stddevSalary', 'Employees.medianSalary']
        },
        displayConfig: { leftYAxisFormat: { unit: 'currency', abbreviate: true, decimals: 0 } }
      }),
      // Coloured by department rather than employee: 4 colours over ~100
      // bubbles is readable, 100 series is not.
      queryPortlet({
        id: 'productivity-scatter',
        title: 'Statistical: Productivity vs Happiness (Bubble = Consistency)',
        query: {
          measures: ['Productivity.avgLinesOfCode', 'Productivity.avgHappinessIndex', 'Productivity.stddevLinesOfCode', 'Productivity.recordCount'],
          dimensions: ['Employees.name', 'Teams.name'],
          filters: [NOT_A_DAY_OFF, ENGINEERING_ONLY]
        },
        chartType: 'bubble',
        chartConfig: {
          // xAxis/yAxis/series are arrays; sizeField/colorField are strings.
          // series labels the bubbles, colorField colours them.
          xAxis: ['Productivity.avgHappinessIndex'],
          yAxis: ['Productivity.avgLinesOfCode'],
          series: ['Teams.name'],
          sizeField: 'Productivity.stddevLinesOfCode',
          colorField: 'Teams.name'
        },
        displayConfig: { showLegend: true }
      }),
      queryPortlet({
        id: 'percentile-thresholds-area',
        title: 'Statistical: Code Output Percentiles Over Time (Median / Avg / P95)',
        query: {
          measures: ['Productivity.medianLinesOfCode', 'Productivity.p95LinesOfCode', 'Productivity.avgLinesOfCode'],
          dimensions: ['Departments.name'],
          timeDimensions: [{ dimension: 'Productivity.date', granularity: 'week' }],
          filters: [
            NOT_A_DAY_OFF,
            { member: 'Departments.name', operator: 'equals', values: ['Engineering'] }
          ]
        },
        chartType: 'area',
        chartConfig: {
          xAxis: ['Productivity.date'],
          yAxis: ['Productivity.medianLinesOfCode', 'Productivity.avgLinesOfCode', 'Productivity.p95LinesOfCode'],
          series: []
        },
        displayConfig: { showLegend: true },
        filters: ['date-range']
      }),

      // ================================================================
      // PR lifecycle and flow
      // These three use dedicated analysis modes rather than 'query', so they
      // set analysisConfig directly instead of going through queryPortlet.
      // ================================================================
      sectionDivider(
        'section-flow',
        '## PR lifecycle and flow\nFunnel and flow analysis over the PR event stream, all from one event table.'
      ),
      {
        id: 'pr-lifecycle-funnel',
        title: 'PR Lifecycle Funnel',
        analysisConfig: {
          version: 1,
          analysisType: 'funnel' as const,
          activeView: 'chart' as const,
          charts: {
            funnel: {
              chartType: 'funnel' as const,
              chartConfig: {},
              displayConfig: {
                funnelOrientation: 'horizontal',
                showLegend: true,
                showTooltip: true
              }
            }
          },
          query: {
            funnel: {
              bindingKey: 'PREvents.prNumber',
              timeDimension: 'PREvents.timestamp',
              steps: [
                { name: 'Created', filter: { member: 'PREvents.eventType', operator: 'equals', values: ['created'] } },
                { name: 'Review Requested', filter: { member: 'PREvents.eventType', operator: 'equals', values: ['review_requested'] } },
                { name: 'Approved', filter: { member: 'PREvents.eventType', operator: 'equals', values: ['approved'] } },
                { name: 'Merged', filter: { member: 'PREvents.eventType', operator: 'equals', values: ['merged'] } }
              ],
              includeTimeMetrics: true
            }
          }
        }
      },
      // The two below are the same flow analysis rendered two ways, which is
      // why they live in one combined portlet - see `group-pr-flow`. Their own
      // titles are not rendered; the group title names both.
      {
        id: 'pr-event-flow-sankey',
        title: 'PR Event Flow Analysis (Sankey)',
        analysisConfig: {
          version: 1,
          analysisType: 'flow' as const,
          activeView: 'chart' as const,
          charts: {
            flow: {
              chartType: 'sankey' as const,
              chartConfig: {},
              displayConfig: { showGrid: false, showLegend: true, showTooltip: true }
            }
          },
          query: {
            flow: {
              bindingKey: 'PREvents.prNumber',
              stepsAfter: 3,
              stepsBefore: 3,
              joinStrategy: 'auto',
              startingStep: {
                name: 'Starting Step',
                filter: { member: 'PREvents.eventType', values: ['created'], operator: 'equals' }
              },
              timeDimension: 'PREvents.timestamp',
              eventDimension: 'PREvents.eventType'
            }
          }
        }
      },
      {
        id: 'pr-event-flow-sunburst',
        title: 'PR Event Flow Analysis (Sunburst)',
        analysisConfig: {
          version: 1,
          analysisType: 'flow' as const,
          activeView: 'chart' as const,
          charts: {
            flow: {
              chartType: 'sunburst' as const,
              chartConfig: { xAxis: [], yAxis: [] },
              displayConfig: { showGrid: false, showLegend: true, showTooltip: true }
            }
          },
          query: {
            flow: {
              bindingKey: 'PREvents.prNumber',
              stepsAfter: 3,
              stepsBefore: 3,
              joinStrategy: 'auto',
              startingStep: {
                name: 'Starting Step',
                filter: { member: 'PREvents.eventType', values: ['created'], operator: 'equals' }
              },
              timeDimension: 'PREvents.timestamp',
              eventDimension: 'PREvents.eventType'
            }
          }
        }
      },

      // ================================================================
      // Detail, then the reward for scrolling.
      // ================================================================
      queryPortlet({
        id: 'productivity-summary',
        title: 'Comprehensive Productivity Summary',
        query: {
          measures: [
            'Productivity.recordCount',
            'Productivity.avgHappinessIndex',
            'Productivity.workingDaysCount',
            'Productivity.daysOffCount'
          ],
          dimensions: ['Employees.name', 'Departments.name'],
          order: { 'Productivity.avgHappinessIndex': 'desc' },
          limit: 50
        },
        chartType: 'table'
      }),
      queryPortlet({
        id: 'thanks-for-scrolling',
        title: '🎉 Congratulations, Scroll Champion!',
        query: {},
        chartType: 'markdown',
        displayConfig: {
          content: THANKS_MARKDOWN
        }
      })
    ]

export const productivityDashboardConfig = {
  name: 'Productivity Analytics Dashboard',
  description: 'Comprehensive productivity analytics including code output, deployments, happiness tracking, and team performance insights',
  order: 0,
  config: {
    layoutMode: 'rows' as const,

    filters: [
      {
        id: 'date-range',
        label: 'Date Range',
        isUniversalTime: true,
        filter: {
          member: 'Productivity.date',
          operator: 'inDateRange' as const,
          values: ['last year']
        }
      }
    ],

    // ------------------------------------------------------------------
    // Combined portlets. Children are headerless, so a group that needs a
    // heading must carry its own title.
    // ------------------------------------------------------------------
    groups,
    rows,
    portlets: withGeometry(portletDrafts, rows, groups)
  } satisfies DashboardConfig
}
