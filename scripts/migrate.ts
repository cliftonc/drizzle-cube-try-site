/**
 * Database migration script
 */

import fs from 'node:fs'
import path from 'node:path'
import { config as loadDotenv } from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { migrate as migrateNeon } from 'drizzle-orm/neon-http/migrator'
import postgres from 'postgres'
import { neon } from '@neondatabase/serverless'

function readArgValue(flag: string): string | undefined {
  const args = process.argv.slice(2)
  const inlineArg = args.find((arg) => arg.startsWith(`${flag}=`))
  if (inlineArg) return inlineArg.slice(flag.length + 1)

  const index = args.findIndex((arg) => arg === flag)
  if (index >= 0 && args[index + 1]) return args[index + 1]

  return undefined
}

function loadEnvironment(): void {
  const explicitEnvFile = readArgValue('--dotenv-file') || readArgValue('--env-file') || process.env.ENV_FILE
  const filesToTry = explicitEnvFile ? [explicitEnvFile] : ['.dev.vars', '.env']
  let loadedFromFile = false

  for (const file of filesToTry) {
    const resolved = path.resolve(process.cwd(), file)
    if (!fs.existsSync(resolved)) continue

    loadDotenv({ path: resolved, override: false })
    console.log(`📥 Loaded environment from ${file}`)
    loadedFromFile = true

    if (explicitEnvFile) break
  }

  if (explicitEnvFile && !loadedFromFile) {
    console.error(`❌ Environment file not found: ${explicitEnvFile}`)
    process.exit(1)
  }
}

loadEnvironment()

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL is not set.')
    console.error('   Provide it via shell env, .dev.vars/.env, or pass --dotenv-file <path>.')
    process.exit(1)
  }

  return databaseUrl
}

const connectionString = requireDatabaseUrl()

// Auto-detect Neon vs local PostgreSQL based on connection string
function isNeonUrl(url: string): boolean {
  return url.includes('.neon.tech') || url.includes('neon.database')
}

async function runMigration() {
  console.log('🔄 Running database migrations...')
  
  if (isNeonUrl(connectionString)) {
    console.log('🚀 Using Neon serverless database for migrations')
    const sql = neon(connectionString)
    const db = drizzleNeon(sql)
    
    try {
      await migrateNeon(db, { migrationsFolder: './drizzle' })
      console.log('✅ Migrations completed successfully')
    } catch (error) {
      console.error('❌ Migration failed:', error)
      process.exit(1)
    }
  } else {
    console.log('🐘 Using local PostgreSQL database for migrations')
    const client = postgres(connectionString, { max: 1 })
    const db = drizzle(client)
    
    try {
      await migrate(db, { migrationsFolder: './drizzle' })
      console.log('✅ Migrations completed successfully')
    } catch (error) {
      console.error('❌ Migration failed:', error)
      process.exit(1)
    } finally {
      await client.end()
    }
  }
}

runMigration()
