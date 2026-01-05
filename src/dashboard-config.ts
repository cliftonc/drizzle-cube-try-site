/**
 * Shared dashboard configuration
 * Used by both seed script and create-example API endpoint
 */

export const productivityDashboardConfig = {
  name: 'Productivity Analytics Dashboard',
  description: 'Comprehensive productivity analytics including code output, deployments, happiness tracking, and team performance insights',
  order: 0,
  config: {
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
    portlets: [
      // Top Row - KPI Numbers
      {
        id: 'total-lines-kpi',
        title: 'Total Lines of Code',
        query: JSON.stringify({
          measures: ['Productivity.totalLinesOfCode'],
          timeDimensions: [{
            dimension: 'Productivity.date',
            granularity: 'month'
          }],
          filters: [{
            member: 'Productivity.isDayOff',
            operator: 'equals',
            values: [false]
          }]
        }, null, 2),
        chartType: 'kpiNumber' as const,
        chartConfig: {
          yAxis: ['Productivity.totalLinesOfCode']
        },
        displayConfig: {
          suffix: ' lines',
          target: '10000'
        },
        dashboardFilterMapping: ['date-range'],
        w: 4,
        h: 4,
        x: 0,
        y: 0
      },
      {
        id: 'total-deployments-kpi',
        title: 'Total Deployments',
        query: JSON.stringify({
          measures: ['Productivity.totalDeployments'],
          timeDimensions: [{
            dimension: 'Productivity.date',
            granularity: 'month'
          }]
        }, null, 2),
        chartType: 'kpiDelta' as const,
        chartConfig: {
          yAxis: ['Productivity.totalDeployments']
        },
        displayConfig: {
          suffix: ' deployments',
          target: '50'
        },
        dashboardFilterMapping: ['date-range'],
        w: 4,
        h: 4,
        x: 4,
        y: 0
      },
      {
        id: 'avg-happiness-kpi',
        title: 'Average Happiness Score',
        query: JSON.stringify({
          measures: ['Productivity.avgHappinessIndex'],
          timeDimensions: [{
            dimension: 'Productivity.date',
            granularity: 'month'
          }],
          filters: [{
            member: 'Productivity.isDayOff',
            operator: 'equals',
            values: [false]
          }]
        }, null, 2),
        chartType: 'kpiNumber' as const,
        chartConfig: {
          yAxis: ['Productivity.avgHappinessIndex']
        },
        displayConfig: {
          decimals: 1,
          suffix: '/10',
          target: '8.0'
        },
        dashboardFilterMapping: ['date-range'],
        w: 4,
        h: 4,
        x: 8,
        y: 0
      },
      
      // Second Row - Activity Grid
      {
        id: 'code-activity-grid',
        title: 'Daily Code Output Activity',
        query: JSON.stringify({
          measures: ['Productivity.totalLinesOfCode'],
          timeDimensions: [{
            dimension: 'Productivity.date',
            granularity: 'day'
          }],
          filters: [{
            member: 'Productivity.isDayOff',
            operator: 'equals',
            values: [false]
          }]
        }, null, 2),
        chartType: 'activityGrid' as const,
        chartConfig: {
          dateField: ['Productivity.date'],
          valueField: ['Productivity.totalLinesOfCode']
        },
        displayConfig: {
          showLabels: true,
          showTooltip: true
        },
        dashboardFilterMapping: ['date-range'],
        w: 12,
        h: 4,
        x: 0,
        y: 4
      },

      // Third Row - Bubble Chart (moved from top)
      {
        id: 'productivity-bubble',
        title: 'Productivity Metrics Correlation',
        query: JSON.stringify({
          measures: [
            'Productivity.avgLinesOfCode',
            'Productivity.avgPullRequests',
            'Productivity.avgDeployments',
            'Productivity.avgHappinessIndex'
          ],
          timeDimensions: [{
            dimension: 'Productivity.date',
            granularity: 'week'
          }]
        }, null, 2),
        chartType: 'bubble' as const,
        chartConfig: {
          xAxis: 'Productivity.avgPullRequests',
          yAxis: 'Productivity.avgLinesOfCode',
          series: 'Productivity.date',
          sizeField: 'Productivity.avgDeployments',
          colorField: 'Productivity.avgHappinessIndex'
        },
        displayConfig: {
          showLegend: true,
          stackedBarChart: false
        },
        dashboardFilterMapping: ['date-range'],
        w: 12,
        h: 8,
        x: 0,
        y: 10
      },
      
      // Fourth Row - Executive Overview
      {
        id: 'productivity-trends',
        title: 'Team Productivity Trends',
        query: JSON.stringify({
          measures: ['Productivity.avgLinesOfCode'],
          timeDimensions: [{
            dimension: 'Productivity.date',
            granularity: 'week'
          }],
          filters: [{
            member: 'Productivity.isDayOff',
            operator: 'equals',
            values: [false]
          }]
        }, null, 2),
        chartType: 'line' as const,
        chartConfig: {
          xAxis: ['Productivity.date'],
          yAxis: ['Productivity.avgLinesOfCode'],
          series: []
        },
        displayConfig: {
          showLegend: false,
          stackedBarChart: false,
          target: '80,85,90,95,100,95,90,85,80,75,80,85'
        },
        dashboardFilterMapping: ['date-range'],
        w: 8,
        h: 6,
        x: 0,
        y: 18
      },
      {
        id: 'happiness-by-level',
        title: 'Team Happiness Distribution',
        query: JSON.stringify({
          measures: ['Productivity.recordCount'],
          dimensions: ['Productivity.happinessLevel'],
          filters: [{
            member: 'Productivity.isDayOff',
            operator: 'equals',
            values: [false]
          }]
        }, null, 2),
        chartType: 'pie' as const,
        chartConfig: {
          xAxis: ['Productivity.happinessLevel'],
          yAxis: ['Productivity.recordCount'],
          series: []
        },
        displayConfig: {
          showLegend: true,
          stackedBarChart: false
        },
        w: 4,
        h: 6,
        x: 8,
        y: 18
      },
      
      // Fifth Row - Department Comparison
      {
        id: 'department-productivity',
        title: 'Productivity by Department',
        query: JSON.stringify({
          measures: ['Productivity.totalLinesOfCode', 'Productivity.totalPullRequests', 'Productivity.totalDeployments'],
          dimensions: ['Departments.name'],
          cubes: ['Productivity', 'Employees', 'Departments']
        }, null, 2),
        chartType: 'bar' as const,
        chartConfig: {
          xAxis: ['Departments.name'],
          yAxis: ['Productivity.totalLinesOfCode', 'Productivity.totalPullRequests', 'Productivity.totalDeployments'],
          series: []
        },
        displayConfig: {
          showLegend: true,
          stackedBarChart: false
        },
        w: 6,
        h: 6,
        x: 0,
        y: 24
      },
      {
        id: 'happiness-by-department',
        title: 'Happiness by Department',
        query: JSON.stringify({
          measures: ['Productivity.avgHappinessIndex'],
          dimensions: ['Departments.name'],
          cubes: ['Productivity', 'Employees', 'Departments']
        }, null, 2),
        chartType: 'bar' as const,
        chartConfig: {
          xAxis: ['Departments.name'],
          yAxis: ['Productivity.avgHappinessIndex'],
          series: []
        },
        displayConfig: {
          showLegend: false,
          stackedBarChart: false
        },
        w: 6,
        h: 6,
        x: 6,
        y: 24
      },
      
      // Sixth Row - Treemap Visualization
      {
        id: 'happiness-treemap',
        title: 'Employee Happiness by Department (Treemap)',
        query: JSON.stringify({
          measures: [
            'Productivity.avgHappinessIndex',
            'Productivity.daysOffCount'
          ],
          dimensions: [
            'Employees.name',
            'Departments.name'
          ],
          cubes: ['Productivity', 'Employees', 'Departments']
        }, null, 2),
        chartType: 'treemap' as const,
        chartConfig: {
          xAxis: [
            'Employees.name'
          ],
          yAxis: 'Productivity.avgHappinessIndex',
          series: 'Departments.name'
        },
        displayConfig: {
          showLegend: true,
          stackedBarChart: false
        },
        w: 12,
        h: 8,
        x: 0,
        y: 30
      },
      
      // Seventh Row - Individual Performance
      {
        id: 'top-performers',
        title: 'Top Performers',
        query: JSON.stringify({
          measures: ['Productivity.recordCount', 'Productivity.avgHappinessIndex'],
          dimensions: ['Employees.name', 'Departments.name'],
          cubes: ['Productivity', 'Employees', 'Departments'],
          timeDimensions: [{
            dimension: 'Productivity.date'
          }],
          order: {
            'Productivity.avgHappinessIndex': 'desc'
          },
          limit: 10
        }, null, 2),
        chartType: 'table' as const,
        chartConfig: {},
        displayConfig: {},
        dashboardFilterMapping: ['date-range'],
        w: 6,
        h: 8,
        x: 0,
        y: 38
      },
      {
        id: 'work-life-balance',
        title: 'Work-Life Balance Metrics',
        query: JSON.stringify({
          measures: ['Productivity.workingDaysCount', 'Productivity.daysOffCount'],
          dimensions: ['Employees.name'],
          cubes: ['Productivity', 'Employees']
        }, null, 2),
        chartType: 'bar' as const,
        chartConfig: {
          xAxis: ['Employees.name'],
          yAxis: ['Productivity.workingDaysCount', 'Productivity.daysOffCount'],
          series: []
        },
        displayConfig: {
          showLegend: true,
          stackedBarChart: true
        },
        w: 6,
        h: 8,
        x: 6,
        y: 38
      },
      
      // Eighth Row - Detailed Analytics
      {
        id: 'code-output-trends',
        title: 'Code Output Trends by Month',
        query: JSON.stringify({
          measures: ['Productivity.totalLinesOfCode'],
          timeDimensions: [{
            dimension: 'Productivity.date',
            granularity: 'month'
          }],
          filters: [{
            member: 'Productivity.isDayOff',
            operator: 'equals',
            values: [false]
          }]
        }, null, 2),
        chartType: 'area' as const,
        chartConfig: {
          xAxis: ['Productivity.date'],
          yAxis: ['Productivity.totalLinesOfCode'],
          series: []
        },
        displayConfig: {
          showLegend: false,
          stackedBarChart: false
        },
        dashboardFilterMapping: ['date-range'],
        w: 6,
        h: 6,
        x: 0,
        y: 46
      },
      {
        id: 'deployment-frequency',
        title: 'Deployment Frequency by Department',
        query: JSON.stringify({
          measures: ['Productivity.totalDeployments'],
          dimensions: ['Departments.name'],
          cubes: ['Productivity', 'Employees', 'Departments'],
          timeDimensions: [{
            dimension: 'Productivity.date',
            granularity: 'month'
          }],
          filters: [{
            member: 'Productivity.totalDeployments',
            operator: 'gt',
            values: [0]
          }]
        }, null, 2),
        chartType: 'line' as const,
        chartConfig: {
          xAxis: ['Productivity.date'],
          yAxis: ['Productivity.totalDeployments'],
          series: ['Departments.name']
        },
        displayConfig: {
          showLegend: true,
          stackedBarChart: false,
          target: '80,90,100,110,120,130,120,110,100,90,85,90'
        },
        dashboardFilterMapping: ['date-range'],
        w: 6,
        h: 6,
        x: 6,
        y: 46
      },
      
      // Ninth Row - Summary Table
      {
        id: 'productivity-summary',
        title: 'Comprehensive Productivity Summary',
        query: JSON.stringify({
          dimensions: ['Employees.name', 'Departments.name'],
          cubes: ['Productivity', 'Employees', 'Departments'],
          measures: [
            'Productivity.recordCount',
            'Productivity.avgHappinessIndex',
            'Productivity.workingDaysCount',
            'Productivity.daysOffCount'
          ],
          order: {
            'Productivity.avgHappinessIndex': 'desc'
          },
          limit: 50
        }, null, 2),
        chartType: 'table' as const,
        chartConfig: {},
        displayConfig: {},
        w: 12,
        h: 6,
        x: 0,
        y: 52
      },

      // ============================================
      // STATISTICAL & WINDOW FUNCTIONS SECTION
      // ============================================

      // Statistical: Salary Distribution by Department
      {
        id: 'salary-stats-by-dept',
        title: 'Statistical: Salary Distribution by Department (Median vs Avg)',
        query: JSON.stringify({
          measures: ['Employees.medianSalary', 'Employees.avgSalary', 'Employees.stddevSalary'],
          dimensions: ['Departments.name'],
          cubes: ['Employees', 'Departments']
        }, null, 2),
        chartType: 'bar' as const,
        chartConfig: {
          xAxis: ['Departments.name'],
          yAxis: ['Employees.medianSalary', 'Employees.avgSalary'],
          series: []
        },
        displayConfig: { showLegend: true },
        w: 6, h: 7, x: 0, y: 58
      },

      // Statistical: Bubble - Correlation with Stddev
      {
        id: 'productivity-scatter',
        title: 'Statistical: Productivity vs Happiness (Bubble = Consistency)',
        query: JSON.stringify({
          measures: ['Productivity.avgLinesOfCode', 'Productivity.avgHappinessIndex', 'Productivity.stddevLinesOfCode', 'Productivity.recordCount'],
          dimensions: ['Employees.name'],
          cubes: ['Productivity', 'Employees'],
          filters: [{ member: 'Productivity.isDayOff', operator: 'equals', values: [false] }]
        }, null, 2),
        chartType: 'bubble' as const,
        chartConfig: {
          xAxis: 'Productivity.avgHappinessIndex',
          yAxis: 'Productivity.avgLinesOfCode',
          sizeField: 'Productivity.stddevLinesOfCode',
          series: 'Employees.name'
        },
        displayConfig: { showLegend: false },
        w: 6, h: 7, x: 6, y: 58
      },

      // Statistical: Area - Percentile Bands Over Time (Engineering only)
      {
        id: 'percentile-thresholds-area',
        title: 'Statistical: Code Output Percentiles Over Time (Median / Avg / P95)',
        query: JSON.stringify({
          measures: ['Productivity.medianLinesOfCode', 'Productivity.p95LinesOfCode', 'Productivity.avgLinesOfCode'],
          dimensions: ['Departments.name'],
          cubes: ['Productivity', 'Employees', 'Departments'],
          timeDimensions: [{ dimension: 'Productivity.date', granularity: 'week' }],
          filters: [
            { member: 'Productivity.isDayOff', operator: 'equals', values: [false] },
            { member: 'Departments.name', operator: 'equals', values: ['Engineering'] }
          ]
        }, null, 2),
        chartType: 'area' as const,
        chartConfig: {
          xAxis: ['Productivity.date'],
          yAxis: ['Productivity.medianLinesOfCode', 'Productivity.avgLinesOfCode', 'Productivity.p95LinesOfCode'],
          series: []
        },
        displayConfig: { showLegend: true },
        dashboardFilterMapping: ['date-range'],
        w: 12, h: 6, x: 0, y: 65
      },

      // Window Function: Moving Average Line Chart
      {
        id: 'moving-average-trend',
        title: 'Window Function: Weekly Output with 7-Period Moving Average',
        query: JSON.stringify({
          measures: ['Productivity.totalLinesOfCode', 'Productivity.movingAvg7Period'],
          timeDimensions: [{
            dimension: 'Productivity.date',
            granularity: 'week'
          }],
          filters: [{ member: 'Productivity.isDayOff', operator: 'equals', values: [false] }]
        }, null, 2),
        chartType: 'line' as const,
        chartConfig: {
          xAxis: ['Productivity.date'],
          yAxis: ['Productivity.totalLinesOfCode', 'Productivity.movingAvg7Period'],
          series: []
        },
        displayConfig: { showLegend: true },
        dashboardFilterMapping: ['date-range'],
        w: 12, h: 6, x: 0, y: 71
      },

      // Window Function: Period-over-Period Change
      {
        id: 'period-change-trend',
        title: 'Window Function: Period-over-Period Lines of Code Change',
        query: JSON.stringify({
          measures: ['Productivity.totalLinesOfCode', 'Productivity.linesOfCodeChange', 'Productivity.linesPercentChange'],
          timeDimensions: [{
            dimension: 'Productivity.date',
            granularity: 'week'
          }],
          filters: [{ member: 'Productivity.isDayOff', operator: 'equals', values: [false] }]
        }, null, 2),
        chartType: 'line' as const,
        chartConfig: {
          xAxis: ['Productivity.date'],
          yAxis: ['Productivity.linesOfCodeChange'],
          series: []
        },
        displayConfig: { showLegend: true },
        dashboardFilterMapping: ['date-range'],
        w: 6, h: 6, x: 0, y: 77
      },

      // Window Function: Cumulative Running Total
      {
        id: 'running-total-trend',
        title: 'Window Function: Cumulative Lines of Code (Running Total)',
        query: JSON.stringify({
          measures: ['Productivity.totalLinesOfCode', 'Productivity.runningTotalLines'],
          timeDimensions: [{
            dimension: 'Productivity.date',
            granularity: 'week'
          }],
          filters: [{ member: 'Productivity.isDayOff', operator: 'equals', values: [false] }]
        }, null, 2),
        chartType: 'area' as const,
        chartConfig: {
          xAxis: ['Productivity.date'],
          yAxis: ['Productivity.runningTotalLines'],
          series: []
        },
        displayConfig: { showLegend: true },
        dashboardFilterMapping: ['date-range'],
        w: 6, h: 6, x: 6, y: 77
      },

      // Bonus Row - Thank You Message
      {
        id: 'thanks-for-scrolling',
        title: '🎉 Congratulations, Scroll Champion!',
        query: JSON.stringify({}, null, 2),
        chartType: 'markdown' as const,
        chartConfig: {},
        displayConfig: {
          content: `## Thanks for scrolling this far! 🎊

Did you know that Drizzle Cube can actually do way more than just track how many lines of code you've written while questioning your life choices?

### Here's what this magical cube can do:

- **📊 Turn your data into pretty charts** - Because pie charts make everything look more important
- **🔍 Query anything** - Your database, your soul, your will to live on Monday mornings
- **⚡ Super-fast dashboards** - Watch your KPIs update faster than your coffee gets cold
- **🎨 Drag & drop chart building** - So easy, even that one coworker who still prints emails can use it
- **📱 Mobile responsive** - View your existential data crisis from anywhere!
- **🔒 Enterprise security** - Your productivity shame is safe with us

*P.S. If you made it this far, you definitely deserve a coffee break. Or maybe it's time to actually use some of this data to make decisions? Nah, let's add another chart instead.* ☕`
        },
        w: 12,
        h: 8,
        x: 0,
        y: 83
      }
    ]
  }
}