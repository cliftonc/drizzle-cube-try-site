/**
 * Example database schema for Hono drizzle-cube demo
 * This demonstrates a typical business analytics schema with employees and departments
 */

import { pgTable, integer, text, real, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Employee table
export const employees = pgTable('employees', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  email: text('email'),
  active: boolean('active').default(true),
  departmentId: integer('department_id'),
  organisationId: integer('organisation_id').notNull(),
  salary: real('salary'),
  createdAt: timestamp('created_at').defaultNow()
})

// Department table
export const departments = pgTable('departments', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  organisationId: integer('organisation_id').notNull(),
  budget: real('budget')
})

// Productivity metrics table - daily productivity data per employee
export const productivity = pgTable('productivity', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  employeeId: integer('employee_id').notNull(),
  departmentId: integer('department_id'),
  date: timestamp('date').notNull(),
  linesOfCode: integer('lines_of_code').default(0),
  pullRequests: integer('pull_requests').default(0),
  liveDeployments: integer('live_deployments').default(0),
  daysOff: boolean('days_off').default(false),
  happinessIndex: integer('happiness_index'), // 1-10 scale
  organisationId: integer('organisation_id').notNull(),
  createdAt: timestamp('created_at').defaultNow()
})

// Time Entries table - for tracking employee time allocation with fan-out scenarios
export const timeEntries = pgTable('time_entries', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  employeeId: integer('employee_id').notNull(),
  departmentId: integer('department_id').notNull(),
  date: timestamp('date').notNull(),
  allocationType: text('allocation_type').notNull(), // 'development', 'maintenance', 'meetings', 'research'
  hours: real('hours').notNull(),
  description: text('description'),
  billableHours: real('billable_hours').default(0),
  organisationId: integer('organisation_id').notNull(),
  createdAt: timestamp('created_at').defaultNow()
})

// PR Events table - tracks PR lifecycle events for funnel analysis
// Event types: created, review_requested, reviewed, changes_requested, approved, merged, closed
export const prEvents = pgTable('pr_events', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  prNumber: integer('pr_number').notNull(),
  eventType: text('event_type').notNull(),
  employeeId: integer('employee_id').notNull(),
  organisationId: integer('organisation_id').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  createdAt: timestamp('created_at').defaultNow()
})

// Analytics Pages table - for storing dashboard configurations
export const analyticsPages = pgTable('analytics_pages', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  description: text('description'),
  organisationId: integer('organisation_id').notNull(),
  config: jsonb('config').notNull().$type<{
    portlets: Array<{
      id: string
      title: string
      query: string
      chartType: string
      chartConfig?: Record<string, unknown>
      displayConfig?: Record<string, unknown>
      dashboardFilterMapping?: string[]
      w: number
      h: number
      x: number
      y: number
    }>
    filters?: Array<{
      id: string
      label: string
      isUniversalTime?: boolean
      filter: {
        member: string
        operator: string
        values: unknown[]
      }
    }>
  }>(),
  order: integer('order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Settings table - for storing application configuration and counters
export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  organisationId: integer('organisation_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Define relations for better type inference
export const employeesRelations = relations(employees, ({ one, many }) => ({
  department: one(departments, {
    fields: [employees.departmentId],
    references: [departments.id]
  }),
  productivityMetrics: many(productivity),
  timeEntries: many(timeEntries),
  prEvents: many(prEvents)
}))

export const departmentsRelations = relations(departments, ({ many }) => ({
  employees: many(employees),
  timeEntries: many(timeEntries)
}))

export const productivityRelations = relations(productivity, ({ one }) => ({
  employee: one(employees, {
    fields: [productivity.employeeId],
    references: [employees.id]
  })
}))

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  employee: one(employees, {
    fields: [timeEntries.employeeId],
    references: [employees.id]
  }),
  department: one(departments, {
    fields: [timeEntries.departmentId],
    references: [departments.id]
  })
}))

export const prEventsRelations = relations(prEvents, ({ one }) => ({
  employee: one(employees, {
    fields: [prEvents.employeeId],
    references: [employees.id]
  })
}))

// Export schema for use with Drizzle
export const schema = {
  employees,
  departments,
  productivity,
  timeEntries,
  prEvents,
  analyticsPages,
  settings,
  employeesRelations,
  departmentsRelations,
  productivityRelations,
  timeEntriesRelations,
  prEventsRelations
}

export type Schema = typeof schema