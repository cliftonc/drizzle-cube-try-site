/**
 * Seed utilities for Cloudflare Workers
 * This file contains the core seeding logic that can be used both in CLI and scheduled contexts
 */

import { employees, departments, productivity, timeEntries, analyticsPages } from '../schema'
import { productivityDashboardConfig } from './dashboard-config'

// Sample data
const sampleDepartments = [
  { name: 'Engineering', organisationId: 1, budget: 500000 },
  { name: 'Marketing', organisationId: 1, budget: 250000 },
  { name: 'Sales', organisationId: 1, budget: 300000 },
  { name: 'HR', organisationId: 1, budget: 150000 }
]

const sampleEmployees = [
  // Engineering Team - Senior developers and DevOps
  {
    name: 'Alex Chen',
    email: 'alex.chen@company.com',
    active: true,
    departmentId: 1, // Engineering
    organisationId: 1,
    salary: 125000,
    createdAt: new Date('2022-03-15') // Senior, longer tenure
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    active: true,
    departmentId: 1, // Engineering
    organisationId: 1,
    salary: 95000,
    createdAt: new Date('2023-01-20')
  },
  {
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@company.com',
    active: true,
    departmentId: 1, // Engineering - DevOps specialist
    organisationId: 1,
    salary: 110000,
    createdAt: new Date('2022-08-10')
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    active: true,
    departmentId: 1, // Engineering - QA/Testing
    organisationId: 1,
    salary: 85000,
    createdAt: new Date('2023-03-05')
  },
  {
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    active: true,
    departmentId: 1, // Engineering - Junior developer
    organisationId: 1,
    salary: 75000,
    createdAt: new Date('2024-01-15')
  },
  
  // Marketing Team - Content and campaigns
  {
    name: 'Lisa Martinez',
    email: 'lisa.martinez@company.com',
    active: true,
    departmentId: 2, // Marketing - Team lead
    organisationId: 1,
    salary: 85000,
    createdAt: new Date('2022-11-20')
  },
  {
    name: 'David Kim',
    email: 'david.kim@company.com',
    active: true,
    departmentId: 2, // Marketing - Digital specialist
    organisationId: 1,
    salary: 72000,
    createdAt: new Date('2023-06-12')
  },
  {
    name: 'Rachel Green',
    email: 'rachel.green@company.com',
    active: false, // On leave
    departmentId: 2, // Marketing
    organisationId: 1,
    salary: 68000,
    createdAt: new Date('2023-02-28')
  },
  
  // Sales Team - Customer facing roles
  {
    name: 'Tom Anderson',
    email: 'tom.anderson@company.com',
    active: true,
    departmentId: 3, // Sales - Senior closer
    organisationId: 1,
    salary: 90000,
    createdAt: new Date('2022-05-18')
  },
  {
    name: 'Nina Patel',
    email: 'nina.patel@company.com',
    active: true,
    departmentId: 3, // Sales - Account manager
    organisationId: 1,
    salary: 78000,
    createdAt: new Date('2023-08-22')
  },
  
  // HR Team - People operations
  {
    name: 'Robert Taylor',
    email: 'robert.taylor@company.com',
    active: true,
    departmentId: 4, // HR - Director
    organisationId: 1,
    salary: 95000,
    createdAt: new Date('2021-12-01') // Most senior
  },
  {
    name: 'Jennifer Lee',
    email: 'jennifer.lee@company.com',
    active: true,
    departmentId: 4, // HR - Recruiter
    organisationId: 1,
    salary: 65000,
    createdAt: new Date('2023-10-15')
  }
]

// Employee role-based productivity profiles
const employeeProfiles: Record<number, { role: string; linesOfCodeBase: number; pullRequestsBase: number; deploymentsBase: number }> = {
  1: { role: 'Senior Engineer', linesOfCodeBase: 300, pullRequestsBase: 8, deploymentsBase: 2 },    // Alex Chen
  2: { role: 'Engineer', linesOfCodeBase: 250, pullRequestsBase: 6, deploymentsBase: 1 },           // Sarah Johnson  
  3: { role: 'DevOps Engineer', linesOfCodeBase: 150, pullRequestsBase: 4, deploymentsBase: 5 },    // Mike Rodriguez
  4: { role: 'QA Engineer', linesOfCodeBase: 100, pullRequestsBase: 12, deploymentsBase: 0 },       // Emily Davis
  5: { role: 'Junior Engineer', linesOfCodeBase: 180, pullRequestsBase: 4, deploymentsBase: 0 },    // James Wilson
  6: { role: 'Marketing Lead', linesOfCodeBase: 0, pullRequestsBase: 2, deploymentsBase: 0 },       // Lisa Martinez
  7: { role: 'Marketing Specialist', linesOfCodeBase: 0, pullRequestsBase: 1, deploymentsBase: 0 }, // David Kim
  8: { role: 'Marketing Content', linesOfCodeBase: 0, pullRequestsBase: 1, deploymentsBase: 0 },    // Rachel Green
  9: { role: 'Senior Sales', linesOfCodeBase: 0, pullRequestsBase: 0, deploymentsBase: 0 },         // Tom Anderson
  10: { role: 'Sales Account Mgr', linesOfCodeBase: 0, pullRequestsBase: 0, deploymentsBase: 0 },   // Nina Patel
  11: { role: 'HR Director', linesOfCodeBase: 0, pullRequestsBase: 1, deploymentsBase: 0 },         // Robert Taylor
  12: { role: 'HR Recruiter', linesOfCodeBase: 0, pullRequestsBase: 0, deploymentsBase: 0 }         // Jennifer Lee
}

// Generate comprehensive productivity data from 2024 to current date
function generateProductivityData(insertedEmployees: any[]): any[] {
  const productivityData: any[] = []
  const startDate = new Date('2024-01-01')
  const endDate = new Date() // Current date
  
  // Iterate through each day of the year
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay() // 0 = Sunday, 6 = Saturday
    const month = date.getMonth() + 1
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const isHoliday = isHolidayDate(date)
    
    // Seasonal productivity modifier (Q4 holiday slowdown, Q1 sprint)
    let seasonalModifier = 1.0
    if (month === 12) seasonalModifier = 0.7 // December slowdown
    else if (month === 1) seasonalModifier = 1.2 // January sprint
    else if (month === 7 || month === 8) seasonalModifier = 0.85 // Summer slower
    
    // Day of week productivity modifier
    let dayModifier = 1.0
    if (dayOfWeek === 1) dayModifier = 0.8 // Monday ramp-up
    else if (dayOfWeek === 5) dayModifier = 0.7 // Friday wind-down
    else if (dayOfWeek === 2 || dayOfWeek === 3) dayModifier = 1.1 // Tuesday/Wednesday peak
    
    insertedEmployees.forEach((employee, index) => {
      const employeeId = index + 1
      const profile = employeeProfiles[employeeId] || employeeProfiles[1]
      
      // Skip weekends and holidays for most employees
      const isWorkDay = !isWeekend && !isHoliday
      
      // Some employees might work occasionally on weekends (DevOps, Senior roles)
      const weekendWork = (profile.role.includes('Senior') || profile.role.includes('DevOps')) && 
                         Math.random() < 0.15 && isWeekend
      
      let daysOff = false
      let linesOfCode = 0
      let pullRequests = 0
      let liveDeployments = 0
      let happinessIndex = 7 // Base happiness
      
      if (!employee.active) {
        // Inactive employees have no productivity
        daysOff = true
        happinessIndex = 5
      } else if (!isWorkDay && !weekendWork) {
        // Regular days off
        daysOff = true
        happinessIndex = 8 // Higher happiness on days off
      } else {
        // Working day - generate realistic productivity
        const overallModifier = seasonalModifier * dayModifier * (0.7 + Math.random() * 0.6) // Random variation
        
        // Vacation days (random 15-25 days per year)
        const vacationProbability = 0.04 + Math.random() * 0.03 // 4-7% chance per day
        if (Math.random() < vacationProbability / 365 * 20) { // Spread 20 vacation days
          daysOff = true
          happinessIndex = 9 // Very happy on vacation
        } else {
          // Regular work day
          linesOfCode = Math.max(0, Math.round(profile.linesOfCodeBase * overallModifier * (0.5 + Math.random())))
          pullRequests = Math.max(0, Math.round(profile.pullRequestsBase * overallModifier * (0.3 + Math.random() * 0.8)))
          liveDeployments = Math.max(0, Math.round(profile.deploymentsBase * overallModifier * (0.2 + Math.random() * 0.9)))
          
          // Happiness correlates with productivity but has randomness
          const productivityScore = (linesOfCode + pullRequests * 50 + liveDeployments * 100) / 400
          happinessIndex = Math.max(1, Math.min(10, Math.round(6 + productivityScore * 2 + (Math.random() - 0.5) * 3)))
        }
      }
      
      productivityData.push({
        employeeId: employee.id,
        departmentId: employee.departmentId,
        date: new Date(date),
        linesOfCode,
        pullRequests,
        liveDeployments,
        daysOff,
        happinessIndex,
        organisationId: 1
      })
    })
  }
  
  return productivityData
}

// Helper function to identify holidays
function isHolidayDate(date: Date): boolean {
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  // Major US holidays
  const holidays = [
    [1, 1],   // New Year's Day
    [7, 4],   // Independence Day  
    [11, 11], // Veterans Day
    [12, 25], // Christmas
  ]
  
  return holidays.some(([m, d]) => month === m && day === d)
}

// Generate comprehensive time entries data
function generateTimeEntriesData(
  insertedEmployees: any[], 
  insertedDepartments: any[]
): any[] {
  const timeEntriesData: any[] = []
  
  // Create department map for easy lookup
  const departmentMap: Record<number, any> = {}
  insertedDepartments.forEach(dept => {
    departmentMap[dept.id] = dept
  })
  
  // Allocation types with realistic distributions
  const allocationTypes = [
    { type: 'development', probability: 0.4, avgHours: 6 },
    { type: 'maintenance', probability: 0.15, avgHours: 2 },
    { type: 'meetings', probability: 0.2, avgHours: 1.5 },
    { type: 'research', probability: 0.1, avgHours: 3 },
    { type: 'documentation', probability: 0.1, avgHours: 2 },
    { type: 'testing', probability: 0.05, avgHours: 4 }
  ]
  
  // Task descriptions for realism
  const descriptions = {
    development: [
      'Feature implementation',
      'Bug fixes',
      'Code refactoring',
      'API development',
      'Frontend components',
      'Backend services'
    ],
    maintenance: [
      'Server maintenance',
      'Database optimization',
      'Security patches',
      'Performance tuning',
      'Legacy system updates'
    ],
    meetings: [
      'Daily standup',
      'Sprint planning',
      'Code review',
      'Architecture discussion',
      'Client meeting',
      'Team retrospective'
    ],
    research: [
      'Technology evaluation',
      'Proof of concept',
      'Performance analysis',
      'Market research',
      'Competitor analysis'
    ],
    documentation: [
      'API documentation',
      'User manual updates',
      'Technical specifications',
      'Process documentation',
      'Knowledge base updates'
    ],
    testing: [
      'Unit testing',
      'Integration testing',
      'Performance testing',
      'User acceptance testing',
      'Automated test development'
    ]
  }
  
  // Generate time entries for 2024 to current date
  const startDate = new Date('2024-01-01')
  const endDate = new Date()
  
  // Process each employee
  insertedEmployees.forEach((employee, employeeIndex) => {
    // Get employee's department
    const employeeDepartment = departmentMap[employee.departmentId]
    if (!employeeDepartment) return
    
    // Determine employee work pattern based on role
    const employeeId = employeeIndex + 1
    const profile = employeeProfiles[employeeId] || employeeProfiles[1]
    const isEngineer = profile.role.includes('Engineer')
    const isManager = profile.role.includes('Lead') || profile.role.includes('Director')
    const isSales = profile.role.includes('Sales')
    
    // Adjust allocation probabilities based on role
    let roleAllocationTypes = [...allocationTypes]
    if (isEngineer) {
      roleAllocationTypes[0].probability = 0.6  // More development
      roleAllocationTypes[1].probability = 0.2  // More maintenance
      roleAllocationTypes[2].probability = 0.15 // Fewer meetings
    } else if (isManager) {
      roleAllocationTypes[0].probability = 0.1  // Less development
      roleAllocationTypes[2].probability = 0.5  // More meetings
      roleAllocationTypes[3].probability = 0.2  // More research
    } else if (isSales) {
      roleAllocationTypes[0].probability = 0.05 // Minimal development
      roleAllocationTypes[2].probability = 0.7  // Lots of meetings
      roleAllocationTypes[3].probability = 0.2  // Sales research
    }
    
    // Generate entries for each work day
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay() // 0 = Sunday, 6 = Saturday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const isHoliday = isHolidayDate(date)
      
      // Skip weekends and major holidays (most of the time)
      if (isWeekend || isHoliday) {
        // 10% chance of weekend/holiday work for engineers
        if (!isEngineer || Math.random() > 0.1) continue
      }
      
      // Determine how many time entries for this day (1-4 entries per day)
      const entriesPerDay = isEngineer 
        ? Math.floor(Math.random() * 3) + 2 // 2-4 entries 
        : Math.floor(Math.random() * 2) + 1 // 1-2 entries
        
      let totalDayHours = 0
      const maxDayHours = 8 + (Math.random() * 2) // 8-10 hours max per day
      
      for (let entryIndex = 0; entryIndex < entriesPerDay; entryIndex++) {
        if (totalDayHours >= maxDayHours) break
        
        // Select allocation type based on probabilities
        let selectedType = 'development'
        const rand = Math.random()
        let cumulativeProbability = 0
        
        for (const allocType of roleAllocationTypes) {
          cumulativeProbability += allocType.probability
          if (rand <= cumulativeProbability) {
            selectedType = allocType.type
            break
          }
        }
        
        const typeConfig = roleAllocationTypes.find(t => t.type === selectedType)!
        
        // Generate realistic hours with variation
        const baseHours = typeConfig.avgHours
        const variation = (Math.random() - 0.5) * baseHours * 0.4 // ±20% variation
        let hours = Math.max(0.25, Math.min(baseHours + variation, maxDayHours - totalDayHours))
        hours = Math.round(hours * 4) / 4 // Round to nearest 0.25 hours
        
        if (hours < 0.25) continue
        
        // Calculate billable hours (some types are more billable than others)
        const billableRates = {
          development: 0.9,
          maintenance: 0.7,
          meetings: 0.3,
          research: 0.5,
          documentation: 0.6,
          testing: 0.8
        }
        
        const billableRate = billableRates[selectedType as keyof typeof billableRates] || 0.5
        const billableHours = Math.round(hours * billableRate * 4) / 4
        
        // Select random description
        const typeDescriptions = descriptions[selectedType as keyof typeof descriptions] || ['General work']
        const description = typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)]
        
        // Some cross-department collaboration (5% chance)
        let workDepartmentId = employee.departmentId
        if (Math.random() < 0.05 && selectedType === 'meetings') {
          const otherDepts = insertedDepartments.filter(d => d.id !== employee.departmentId)
          if (otherDepts.length > 0) {
            workDepartmentId = otherDepts[Math.floor(Math.random() * otherDepts.length)].id
          }
        }
        
        timeEntriesData.push({
          employeeId: employee.id,
          departmentId: workDepartmentId,
          date: new Date(date),
          allocationType: selectedType,
          hours,
          description,
          billableHours,
          organisationId: 1
        })
        
        totalDayHours += hours
      }
    }
  })
  
  console.log(`Generated ${timeEntriesData.length} time entries`)
  return timeEntriesData
}

// Use shared dashboard configuration
const sampleAnalyticsPage = {
  ...productivityDashboardConfig,
  organisationId: 1
}

export async function executeSeed(db: any) {
  console.log('🌱 Seeding database with sample data...')
  
  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await db.delete(timeEntries)
    await db.delete(productivity)
    await db.delete(employees)
    await db.delete(departments)
    await db.delete(analyticsPages)
    
    // Insert departments first (referenced by employees)
    console.log('🏢 Inserting departments...')
    const insertedDepartments = await db.insert(departments)
      .values(sampleDepartments)
      .returning()
    
    console.log(`✅ Inserted ${insertedDepartments.length} departments`)
    
    // Update employee department IDs to match actual inserted IDs
    const updatedEmployees = sampleEmployees.map(emp => ({
      ...emp,
      departmentId: insertedDepartments[emp.departmentId - 1]?.id || null
    }))
    
    // Insert employees
    console.log('👥 Inserting employees...')
    const insertedEmployees = await db.insert(employees)
      .values(updatedEmployees)
      .returning()
    
    console.log(`✅ Inserted ${insertedEmployees.length} employees`)
    
    // Generate and insert productivity data
    console.log('📊 Generating productivity data from 2024 to current date...')
    const productivityData = generateProductivityData(insertedEmployees)
    console.log(`📊 Generated ${productivityData.length} productivity records`)
    
    // Insert productivity data in batches to avoid memory issues
    const batchSize = 1000
    let insertedProductivityCount = 0
    
    for (let i = 0; i < productivityData.length; i += batchSize) {
      const batch = productivityData.slice(i, i + batchSize)
      await db.insert(productivity).values(batch)
      insertedProductivityCount += batch.length
      console.log(`📊 Inserted productivity batch: ${insertedProductivityCount}/${productivityData.length}`)
    }
    
    console.log(`✅ Inserted ${insertedProductivityCount} productivity records`)
    
    // Generate and insert time entries data
    console.log('⏰ Generating time entries data from 2024 to current date...')
    const timeEntriesData = generateTimeEntriesData(insertedEmployees, insertedDepartments)
    console.log(`⏰ Generated ${timeEntriesData.length} time entry records`)
    
    // Insert time entries data in batches to avoid memory issues
    const timeEntriesBatchSize = 1000
    let insertedTimeEntriesCount = 0
    
    for (let i = 0; i < timeEntriesData.length; i += timeEntriesBatchSize) {
      const batch = timeEntriesData.slice(i, i + timeEntriesBatchSize)
      await db.insert(timeEntries).values(batch)
      insertedTimeEntriesCount += batch.length
      console.log(`⏰ Inserted time entries batch: ${insertedTimeEntriesCount}/${timeEntriesData.length}`)
    }
    
    console.log(`✅ Inserted ${insertedTimeEntriesCount} time entry records`)
    
    // Insert sample analytics page
    console.log('📊 Inserting sample analytics page...')
    const insertedPage = await db.insert(analyticsPages)
      .values(sampleAnalyticsPage)
      .returning()
    
    console.log(`✅ Inserted analytics page: ${insertedPage[0].name}`)
    
    console.log('🎉 Database seeded successfully!')
    
    return { success: true, message: 'Database seeded successfully' }
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}