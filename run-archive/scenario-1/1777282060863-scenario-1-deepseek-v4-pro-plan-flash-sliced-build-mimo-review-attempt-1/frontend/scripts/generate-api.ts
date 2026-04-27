import { execSync } from 'child_process'
import { existsSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const OPENAPI_SOURCE_URL = 'http://localhost:5000/openapi/v1.json'
const OPENAPI_LOCAL_PATH = resolve(__dirname, '..', 'openapi.json')

async function main() {
  try {
    console.log('Fetching OpenAPI spec from backend...')
    const response = await fetch(OPENAPI_SOURCE_URL)
    if (response.ok) {
      const json = await response.json()
      writeFileSync(OPENAPI_LOCAL_PATH, JSON.stringify(json, null, 2))
      console.log('Saved OpenAPI spec from running backend.')
    } else {
      throw new Error(`Backend returned ${response.status}`)
    }
  } catch {
    if (existsSync(OPENAPI_LOCAL_PATH)) {
      console.log('Could not reach backend. Using local openapi.json.')
    } else {
      console.error('Could not reach backend at', OPENAPI_SOURCE_URL)
      console.error(
        'Please start the backend first, or place a local openapi.json in the frontend root.',
      )
      process.exit(1)
    }
  }

  console.log('Running Orval code generation...')
  execSync('npx orval', { cwd: resolve(__dirname, '..'), stdio: 'inherit' })
  console.log('API client generated successfully.')
}

main()
