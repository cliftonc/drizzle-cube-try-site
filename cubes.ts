/**
 * Example cube definitions for Hono drizzle-cube demo
 * This demonstrates how to define type-safe analytics cubes using Drizzle ORM
 */

import { eq, sql } from 'drizzle-orm'
import { defineCube } from 'drizzle-cube/server'
import type { QueryContext, BaseQueryDefinition, Cube } from 'drizzle-cube/server'
import { employees, departments, productivity, timeEntries, prEvents, teams, employeeTeams } from './schema'

// Forward declarations for circular dependency resolution
let employeesCube: Cube
let departmentsCube: Cube
let productivityCube: Cube
let timeEntriesCube: Cube
let prEventsCube: Cube
let teamsCube: Cube
let employeeTeamsCube: Cube

/**
 * Employees cube - employee analytics (single table)
 */
employeesCube = defineCube('Employees', {
  title: 'Employee Analytics',
  description: 'Employee data and metrics',
  
  sql: (ctx: QueryContext): BaseQueryDefinition => ({
    from: employees,
    where: eq(employees.organisationId, ctx.securityContext.organisationId as number)
  }),

  // Cube-level joins for cross-cube queries
  joins: {
    Departments: {
      targetCube: () => departmentsCube,
      relationship: 'belongsTo',
      on: [
        { source: employees.departmentId, target: departments.id }
      ]
    },
    Productivity: {
      targetCube: () => productivityCube,
      relationship: 'hasMany',
      on: [
        { source: employees.id, target: productivity.employeeId }
      ]
    },
    TimeEntries: {
      targetCube: () => timeEntriesCube,
      relationship: 'hasMany',
      on: [
        { source: employees.id, target: timeEntries.employeeId }
      ]
    },
    PREvents: {
      targetCube: () => prEventsCube,
      relationship: 'hasMany',
      on: [
        { source: employees.id, target: prEvents.employeeId }
      ]
    },
    EmployeeTeams: {
      targetCube: () => employeeTeamsCube,
      relationship: 'hasMany',
      preferredFor: ['Teams'],
      on: [
        { source: employees.id, target: employeeTeams.employeeId }
      ]
    }
  },

  dimensions: {
    id: {
      name: 'id',
      title: 'Employee ID',
      type: 'number',
      sql: employees.id,
      primaryKey: true
    },
    name: {
      name: 'name',
      title: 'Employee Name',
      type: 'string',
      sql: employees.name
    },
    email: {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      sql: employees.email
    },
    departmentId: {
      name: 'departmentId',
      title: 'Department ID',
      type: 'number',
      sql: employees.departmentId
    },
    isActive: {
      name: 'isActive',
      title: 'Active Status',
      type: 'boolean',
      sql: employees.active
    },
    createdAt: {
      name: 'createdAt',
      title: 'Hire Date',
      type: 'time',
      sql: employees.createdAt
    },
    // Location dimensions
    city: {
      name: 'city',
      title: 'City',
      type: 'string',
      sql: employees.city
    },
    region: {
      name: 'region',
      title: 'State/Region',
      type: 'string',
      sql: employees.region
    },
    country: {
      name: 'country',
      title: 'Country',
      type: 'string',
      sql: employees.country
    },
    latitude: {
      name: 'latitude',
      title: 'Latitude',
      type: 'number',
      sql: employees.latitude
    },
    longitude: {
      name: 'longitude',
      title: 'Longitude',
      type: 'number',
      sql: employees.longitude
    }
  },

  measures: {
    count: {
      name: 'count',
      title: 'Total Employees',
      type: 'countDistinct',
      sql: employees.id
    },
    activeCount: {
      name: 'activeCount',
      title: 'Active Employees',
      type: 'countDistinct',
      sql: employees.id,
      filters: [
        () => eq(employees.active, true)
      ]
    },
    totalSalary: {
      name: 'totalSalary',
      title: 'Total Salary',
      type: 'sum',
      sql: employees.salary
    },
    avgSalary: {
      name: 'avgSalary',
      title: 'Average Salary',
      type: 'avg',
      sql: employees.salary,
      format: 'currency'
    },
    // Statistical measures
    medianSalary: {
      name: 'medianSalary',
      title: 'Median Salary',
      type: 'median',
      sql: employees.salary,
      description: 'Median salary (50th percentile)'
    },
    stddevSalary: {
      name: 'stddevSalary',
      title: 'Salary Std Dev',
      type: 'stddev',
      sql: employees.salary,
      description: 'Standard deviation of salaries'
    }
  }
}) as Cube

/**
 * Departments cube - department-level analytics (single table)
 */
departmentsCube = defineCube('Departments', {
  title: 'Department Analytics',
  description: 'Department-level metrics and budget analysis',
  
  sql: (ctx: QueryContext): BaseQueryDefinition => ({
    from: departments,
    where: eq(departments.organisationId, ctx.securityContext.organisationId as number)
  }),

  // Cube-level joins for cross-cube queries
  joins: {
    Employees: {
      targetCube: () => employeesCube,
      relationship: 'hasMany',
      on: [
        { source: departments.id, target: employees.departmentId }
      ]
    },
    TimeEntries: {
      targetCube: () => timeEntriesCube,
      relationship: 'hasMany',
      on: [
        { source: departments.id, target: timeEntries.departmentId }
      ]
    },
    Productivity: {
      targetCube: () => productivityCube,
      relationship: 'hasMany',
      on: [
        { source: departments.id, target: productivity.departmentId }
      ]
    },
    Teams: {
      targetCube: () => teamsCube,
      relationship: 'hasMany',
      on: [
        { source: departments.id, target: teams.departmentId }
      ]
    }
  },

  dimensions: {
    id: {
      name: 'id',
      title: 'Department ID',
      type: 'number',
      sql: departments.id,
      primaryKey: true
    },
    name: {
      name: 'name',
      title: 'Department Name',
      type: 'string',
      sql: departments.name
    }
  },

  measures: {
    count: {
      name: 'count',
      title: 'Department Count',
      type: 'countDistinct',
      sql: departments.id
    },
    totalBudget: {
      name: 'totalBudget',
      title: 'Total Budget',
      type: 'sum',
      sql: departments.budget
    },
    avgBudget: {
      name: 'avgBudget',
      title: 'Average Budget',
      type: 'avg',
      sql: departments.budget
    }
  }
}) as Cube

/**
 * Productivity cube - productivity metrics with time dimensions
 */
productivityCube = defineCube('Productivity', {
  title: 'Productivity Analytics',
  description: 'Daily productivity metrics including code output and deployments',
  
  sql: (ctx: QueryContext): BaseQueryDefinition => ({
    from: productivity,  
    where: eq(productivity.organisationId, ctx.securityContext.organisationId as number)
  }),

  // Cube-level joins for multi-cube queries
  joins: {
    Employees: {
      targetCube: () => employeesCube,
      relationship: 'belongsTo',
      on: [
        { source: productivity.employeeId, target: employees.id }
      ]
    },
    Departments: {
      targetCube: () => departmentsCube,
      relationship: 'belongsTo',
      on: [
        { source: productivity.departmentId, target: departments.id }
      ]
    }
  },
  
  dimensions: {
    id: {
      name: 'id',
      title: 'Record ID',
      type: 'number',
      sql: productivity.id,
      primaryKey: true
    },   
    date: {
      name: 'date',
      title: 'Date',
      type: 'time',
      sql: productivity.date
    },
    createdAt: {
      name: 'createdAt',
      title: 'Created At',
      type: 'time',
      sql: productivity.createdAt
    },
    isDayOff: {
      name: 'isDayOff',
      title: 'Day Off',
      type: 'boolean',
      sql: productivity.daysOff
    },
    happinessIndex: {
      name: 'happinessIndex',
      title: 'Happiness Index',
      type: 'number',
      sql: productivity.happinessIndex
    },
    happinessLevel: {
      name: 'happinessLevel',
      title: 'Happiness Level',
      type: 'string',
      sql: sql`
        CASE 
          WHEN ${productivity.happinessIndex} >= 8 THEN 'High'
          WHEN ${productivity.happinessIndex} >= 6 THEN 'Medium'
          ELSE 'Low'
        END
      `
    },
    departmentId: {
      name: 'departmentId',
      title: 'Department ID',
      type: 'number',
      sql: productivity.departmentId
    },
    employeeId: {
      name: 'employeeId',
      title: 'Employee ID',
      type: 'number',
      sql: productivity.employeeId
    },
    linesOfCode: {
      name: 'linesOfCode',
      title: 'Lines of Code',
      type: 'number',
      sql: productivity.linesOfCode,
      description: 'Raw lines of code for this record'
    },
    pullRequests: {
      name: 'pullRequests',
      title: 'Pull Requests',
      type: 'number',
      sql: productivity.pullRequests,
      description: 'Raw PR count for this record'
    }
  },

  measures: {
    count: {
      name: 'count',
      title: 'Total Records',
      type: 'count',
      sql: productivity.id
    },
    recordCount: {
      name: 'recordCount',
      title: 'Record Count',
      type: 'count',
      sql: productivity.id
    },
    workingDaysCount: {
      name: 'workingDaysCount',
      title: 'Working Days',
      type: 'count',
      sql: productivity.id,
      filters: [
        () => eq(productivity.daysOff, false)
      ]
    },
    daysOffCount: {
      name: 'daysOffCount',
      title: 'Days Off',
      type: 'count',
      sql: productivity.id,
      filters: [
        () => eq(productivity.daysOff, true)
      ]
    },
    avgLinesOfCode: {
      name: 'avgLinesOfCode',
      title: 'Average Lines of Code',
      type: 'avg',
      sql: productivity.linesOfCode
    },
    totalLinesOfCode: {
      name: 'totalLinesOfCode',
      title: 'Total Lines of Code',
      type: 'sum',
      sql: productivity.linesOfCode
    },
    totalPullRequests: {
      name: 'totalPullRequests',
      title: 'Total Pull Requests',
      type: 'sum',
      sql: productivity.pullRequests
    },
    avgPullRequests: {
      name: 'avgPullRequests',
      title: 'Average Pull Requests',
      type: 'avg',
      sql: productivity.pullRequests
    },
    totalDeployments: {
      name: 'totalDeployments',
      title: 'Total Deployments',
      type: 'sum',
      sql: productivity.liveDeployments
    },
    avgDeployments: {
      name: 'avgDeployments',
      title: 'Average Deployments',
      type: 'avg',
      sql: productivity.liveDeployments
    },
    avgHappinessIndex: {
      name: 'avgHappinessIndex',
      title: 'Average Happiness',
      type: 'avg',
      sql: productivity.happinessIndex
    },
    productivityScore: {
      name: 'productivityScore',
      title: 'Productivity Score',
      type: 'avg',
      sql: sql`(${productivity.linesOfCode} + ${productivity.pullRequests} * 50 + ${productivity.liveDeployments} * 100)`,
      description: 'Composite productivity score based on code output, reviews, and deployments'
    },

    // Statistical measures - Code Output Distribution
    stddevLinesOfCode: {
      name: 'stddevLinesOfCode',
      title: 'Lines of Code Std Dev',
      type: 'stddev',
      sql: productivity.linesOfCode,
      description: 'Variation in daily code output'
    },
    medianLinesOfCode: {
      name: 'medianLinesOfCode',
      title: 'Median Lines of Code',
      type: 'median',
      sql: productivity.linesOfCode,
      description: 'Median daily code output'
    },
    p95LinesOfCode: {
      name: 'p95LinesOfCode',
      title: '95th Percentile Lines',
      type: 'p95',
      sql: productivity.linesOfCode,
      description: 'High performer code output threshold'
    },
    // Statistical measures - Happiness Distribution
    stddevHappinessIndex: {
      name: 'stddevHappinessIndex',
      title: 'Happiness Std Dev',
      type: 'stddev',
      sql: productivity.happinessIndex,
      description: 'Variation in team happiness'
    },
    medianHappinessIndex: {
      name: 'medianHappinessIndex',
      title: 'Median Happiness',
      type: 'median',
      sql: productivity.happinessIndex,
      description: 'Median happiness score'
    },
    // Statistical measures - Pull Requests
    medianPullRequests: {
      name: 'medianPullRequests',
      title: 'Median Pull Requests',
      type: 'median',
      sql: productivity.pullRequests,
      description: 'Median daily pull requests'
    },
    p95PullRequests: {
      name: 'p95PullRequests',
      title: '95th Percentile PRs',
      type: 'p95',
      sql: productivity.pullRequests,
      description: 'High performer PR threshold'
    },

    // ============================================
    // Post-Aggregation Window Function Measures
    // These operate on aggregated data - the base measure is aggregated first,
    // then the window function is applied to the aggregated results.
    // ============================================

    // LAG - Compare to previous period's total (difference)
    linesOfCodeChange: {
      name: 'linesOfCodeChange',
      title: 'Lines Change (vs Previous)',
      type: 'lag',
      description: 'Change in lines of code compared to previous period',
      windowConfig: {
        measure: 'totalLinesOfCode',
        operation: 'difference',
        orderBy: [{ field: 'date', direction: 'asc' }]
      }
    },

    // LAG - Get previous period's total (raw value)
    previousPeriodLines: {
      name: 'previousPeriodLines',
      title: 'Previous Period Lines',
      type: 'lag',
      description: 'Lines of code from the previous period',
      windowConfig: {
        measure: 'totalLinesOfCode',
        operation: 'raw',
        orderBy: [{ field: 'date', direction: 'asc' }]
      }
    },

    // LAG - Percent change from previous period
    linesPercentChange: {
      name: 'linesPercentChange',
      title: 'Lines % Change',
      type: 'lag',
      description: 'Percent change in lines of code from previous period',
      windowConfig: {
        measure: 'totalLinesOfCode',
        operation: 'percentChange',
        orderBy: [{ field: 'date', direction: 'asc' }]
      }
    },

    // RANK - Rank periods by total lines (most productive = rank 1)
    productivityRank: {
      name: 'productivityRank',
      title: 'Productivity Rank',
      type: 'rank',
      description: 'Rank by total lines of code (1 = most productive period)',
      windowConfig: {
        measure: 'totalLinesOfCode',
        operation: 'raw',
        orderBy: [{ field: 'totalLinesOfCode', direction: 'desc' }]
      }
    },

    // Running total - Cumulative sum of lines
    runningTotalLines: {
      name: 'runningTotalLines',
      title: 'Running Total Lines',
      type: 'movingSum',
      description: 'Cumulative total lines of code over time',
      windowConfig: {
        measure: 'totalLinesOfCode',
        operation: 'raw',
        orderBy: [{ field: 'date', direction: 'asc' }],
        frame: {
          type: 'rows',
          start: 'unbounded',
          end: 'current'
        }
      }
    },

    // Moving 7-period average for trend analysis
    movingAvg7Period: {
      name: 'movingAvg7Period',
      title: '7-Period Moving Avg',
      type: 'movingAvg',
      description: '7-period moving average of lines of code',
      windowConfig: {
        measure: 'totalLinesOfCode',
        operation: 'raw',
        orderBy: [{ field: 'date', direction: 'asc' }],
        frame: {
          type: 'rows',
          start: 6,
          end: 'current'
        }
      }
    }
  }
}) as Cube

/**
 * Time Entries cube - time tracking analytics with allocation types
 */
timeEntriesCube = defineCube('TimeEntries', {
  title: 'Time Entries Analytics', 
  description: 'Employee time tracking with allocation types, departments, and billable hours',
  
  sql: (ctx: QueryContext): BaseQueryDefinition => ({
    from: timeEntries,    
    where: eq(timeEntries.organisationId, ctx.securityContext.organisationId as number)
  }),

  joins: {
    Employees: {
      targetCube: () => employeesCube,
      relationship: 'belongsTo',
      on: [
        { source: timeEntries.employeeId, target: employees.id }
      ]
    },
    Departments: {
      targetCube: () => departmentsCube,
      relationship: 'belongsTo', 
      on: [
        { source: timeEntries.departmentId, target: departments.id }
      ]
    }
  },

  dimensions: {
    id: {
      name: 'id',
      title: 'Time Entry ID',
      type: 'number',
      sql: timeEntries.id,
      primaryKey: true
    },
    employeeId: {
      name: 'employeeId',
      title: 'Employee ID',
      type: 'number',
      sql: timeEntries.employeeId
    },
    departmentId: {
      name: 'departmentId', 
      title: 'Department ID',
      type: 'number',
      sql: timeEntries.departmentId
    },
    allocationType: {
      name: 'allocationType',
      title: 'Allocation Type',
      type: 'string',
      sql: timeEntries.allocationType
    },
    description: {
      name: 'description',
      title: 'Task Description',
      type: 'string',
      sql: timeEntries.description
    },
    date: {
      name: 'date',
      title: 'Date',
      type: 'time',
      sql: timeEntries.date
    },
    createdAt: {
      name: 'createdAt',
      title: 'Created At',
      type: 'time',
      sql: timeEntries.createdAt
    }
  },

  measures: {
    // Basic count measures
    count: {
      name: 'count',
      title: 'Total Time Entries',
      type: 'count',
      sql: timeEntries.id,
      description: 'Total number of time entries'
    },
    
    // Hours-based measures
    totalHours: {
      name: 'totalHours',
      title: 'Total Hours',
      type: 'sum',
      sql: timeEntries.hours,
      description: 'Sum of all logged hours'
    },
    avgHours: {
      name: 'avgHours',
      title: 'Average Hours per Entry',
      type: 'avg',
      sql: timeEntries.hours,
      description: 'Average hours per time entry'
    },
    minHours: {
      name: 'minHours',
      title: 'Minimum Hours',
      type: 'min',
      sql: timeEntries.hours
    },
    maxHours: {
      name: 'maxHours',
      title: 'Maximum Hours',
      type: 'max',
      sql: timeEntries.hours
    },
    
    // Billable hours measures
    totalBillableHours: {
      name: 'totalBillableHours',
      title: 'Total Billable Hours',
      type: 'sum',
      sql: timeEntries.billableHours,
      description: 'Sum of all billable hours'
    },
    avgBillableHours: {
      name: 'avgBillableHours',
      title: 'Average Billable Hours',
      type: 'avg',
      sql: timeEntries.billableHours
    },
    
    // Allocation-specific measures with filters
    developmentHours: {
      name: 'developmentHours',
      title: 'Development Hours',
      type: 'sum',
      sql: timeEntries.hours,
      filters: [
        () => eq(timeEntries.allocationType, 'development')
      ],
      description: 'Total hours spent on development tasks'
    },
    meetingHours: {
      name: 'meetingHours',
      title: 'Meeting Hours',
      type: 'sum',
      sql: timeEntries.hours,
      filters: [
        () => eq(timeEntries.allocationType, 'meetings')
      ],
      description: 'Total hours spent in meetings'
    },
    maintenanceHours: {
      name: 'maintenanceHours',
      title: 'Maintenance Hours',
      type: 'sum',
      sql: timeEntries.hours,
      filters: [
        () => eq(timeEntries.allocationType, 'maintenance')
      ]
    },
    
    // Distinct count measures
    distinctEmployees: {
      name: 'distinctEmployees',
      title: 'Unique Employees',
      type: 'countDistinct',
      sql: timeEntries.employeeId,
      description: 'Number of unique employees with time entries'
    },
    distinctDepartments: {
      name: 'distinctDepartments',
      title: 'Unique Departments',
      type: 'countDistinct', 
      sql: timeEntries.departmentId
    },
    distinctAllocations: {
      name: 'distinctAllocations',
      title: 'Unique Allocation Types',
      type: 'countDistinct',
      sql: timeEntries.allocationType
    },
    
    // Complex calculated measures
    utilizationRate: {
      name: 'utilizationRate',
      title: 'Utilization Rate (%)',
      type: 'avg',
      sql: sql`(${timeEntries.billableHours} / NULLIF(${timeEntries.hours}, 0) * 100)`,
      description: 'Percentage of billable vs total hours'
    },
    avgDailyHours: {
      name: 'avgDailyHours',  
      title: 'Average Daily Hours',
      type: 'avg',
      sql: timeEntries.hours,
      description: 'Average hours logged per day'
    }
  }
}) as Cube

/**
 * PR Events cube - PR lifecycle events for funnel analysis
 */
prEventsCube = defineCube('PREvents', {
  title: 'PR Events',
  description: 'Pull request lifecycle events for funnel analysis',

  sql: (ctx: QueryContext): BaseQueryDefinition => ({
    from: prEvents,
    where: eq(prEvents.organisationId, ctx.securityContext.organisationId as number)
  }),

  joins: {
    Employees: {
      targetCube: () => employeesCube,
      relationship: 'belongsTo',
      on: [
        { source: prEvents.employeeId, target: employees.id }
      ]
    }
  },

  dimensions: {
    id: {
      name: 'id',
      title: 'Event ID',
      type: 'number',
      sql: prEvents.id,
      primaryKey: true
    },
    prNumber: {
      name: 'prNumber',
      title: 'PR Number',
      type: 'number',
      sql: prEvents.prNumber
    },
    eventType: {
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      sql: prEvents.eventType
    },
    employeeId: {
      name: 'employeeId',
      title: 'Employee ID',
      type: 'number',
      sql: prEvents.employeeId
    },
    timestamp: {
      name: 'timestamp',
      title: 'Event Timestamp',
      type: 'time',
      sql: prEvents.timestamp
    },
    createdAt: {
      name: 'createdAt',
      title: 'Created At',
      type: 'time',
      sql: prEvents.createdAt
    }
  },

  measures: {
    count: {
      name: 'count',
      title: 'Event Count',
      type: 'count',
      sql: prEvents.id
    },
    uniquePRs: {
      name: 'uniquePRs',
      title: 'Unique PRs',
      type: 'countDistinct',
      sql: prEvents.prNumber
    },
    uniqueActors: {
      name: 'uniqueActors',
      title: 'Unique Actors',
      type: 'countDistinct',
      sql: prEvents.employeeId
    }
  },

  // Event stream marker for funnel queries
  meta: {
    eventStream: {
      bindingKey: 'PREvents.prNumber',
      timeDimension: 'PREvents.timestamp'
    }
  }
}) as Cube

/**
 * Teams cube - team analytics
 */
teamsCube = defineCube('Teams', {
  title: 'Team Analytics',
  description: 'Team structure and membership analysis',

  sql: (ctx: QueryContext): BaseQueryDefinition => ({
    from: teams,
    where: eq(teams.organisationId, ctx.securityContext.organisationId as number)
  }),

  joins: {
    Departments: {
      targetCube: () => departmentsCube,
      relationship: 'belongsTo',
      on: [
        { source: teams.departmentId, target: departments.id }
      ]
    },
    EmployeeTeams: {
      targetCube: () => employeeTeamsCube,
      relationship: 'hasMany',
      on: [
        { source: teams.id, target: employeeTeams.teamId }
      ]
    }
  },

  dimensions: {
    id: {
      name: 'id',
      title: 'Team ID',
      type: 'number',
      sql: teams.id,
      primaryKey: true
    },
    name: {
      name: 'name',
      title: 'Team Name',
      type: 'string',
      sql: teams.name
    },
    description: {
      name: 'description',
      title: 'Description',
      type: 'string',
      sql: teams.description
    },
    departmentId: {
      name: 'departmentId',
      title: 'Department ID',
      type: 'number',
      sql: teams.departmentId
    },
    createdAt: {
      name: 'createdAt',
      title: 'Created At',
      type: 'time',
      sql: teams.createdAt
    }
  },

  measures: {
    count: {
      name: 'count',
      title: 'Total Teams',
      type: 'countDistinct',
      sql: teams.id
    }
  }
}) as Cube

/**
 * EmployeeTeams cube - junction table for many-to-many analysis
 */
employeeTeamsCube = defineCube('EmployeeTeams', {
  title: 'Employee Team Membership',
  description: 'Employee team assignments and roles',

  sql: (ctx: QueryContext): BaseQueryDefinition => ({
    from: employeeTeams,
    where: eq(employeeTeams.organisationId, ctx.securityContext.organisationId as number)
  }),

  joins: {
    Employees: {
      targetCube: () => employeesCube,
      relationship: 'belongsTo',
      on: [
        { source: employeeTeams.employeeId, target: employees.id }
      ]
    },
    Teams: {
      targetCube: () => teamsCube,
      relationship: 'belongsTo',
      on: [
        { source: employeeTeams.teamId, target: teams.id }
      ]
    }
  },

  dimensions: {
    id: {
      name: 'id',
      title: 'Membership ID',
      type: 'number',
      sql: employeeTeams.id,
      primaryKey: true
    },
    employeeId: {
      name: 'employeeId',
      title: 'Employee ID',
      type: 'number',
      sql: employeeTeams.employeeId
    },
    teamId: {
      name: 'teamId',
      title: 'Team ID',
      type: 'number',
      sql: employeeTeams.teamId
    },
    role: {
      name: 'role',
      title: 'Team Role',
      type: 'string',
      sql: employeeTeams.role
    },
    joinedAt: {
      name: 'joinedAt',
      title: 'Joined Team',
      type: 'time',
      sql: employeeTeams.joinedAt
    }
  },

  measures: {
    count: {
      name: 'count',
      title: 'Total Memberships',
      type: 'count',
      sql: employeeTeams.id
    },
    uniqueEmployees: {
      name: 'uniqueEmployees',
      title: 'Unique Employees',
      type: 'countDistinct',
      sql: employeeTeams.employeeId
    },
    uniqueTeams: {
      name: 'uniqueTeams',
      title: 'Unique Teams',
      type: 'countDistinct',
      sql: employeeTeams.teamId
    },
    leadCount: {
      name: 'leadCount',
      title: 'Team Leads',
      type: 'count',
      sql: employeeTeams.id,
      filters: [
        () => eq(employeeTeams.role, 'lead')
      ]
    }
  }
}) as Cube

/**
 * Export cubes for use in other modules
 */
export { employeesCube, departmentsCube, productivityCube, timeEntriesCube, prEventsCube, teamsCube, employeeTeamsCube }

/**
 * All cubes for registration
 */
export const allCubes = [
  employeesCube,
  departmentsCube,
  productivityCube,
  timeEntriesCube,
  prEventsCube,
  teamsCube,
  employeeTeamsCube
]