import { readFileSync, existsSync, writeFileSync } from 'fs'
import { join } from 'path'
import { main as mikro } from './mikroorm/mikro'
import { main as prisma } from './prisma/prisma'
import { main as typeorm } from './typeorm/typeorm'
import {
  AllResults,
  BenchmarkOptions,
  MultipleBenchmarkRunResults,
  PopulateOptions
} from './utils/types'

async function main(options: BenchmarkOptions) {
  const allResults: AllResults = {
    prisma: undefined,
    typeorm: undefined,
    mikro: undefined
  }

  if (!options.disablePrisma) {
    const prismaResults: MultipleBenchmarkRunResults = []
    console.log('=> ORM: Prisma')
    for (let i = 0; i < options.iterations; i++) {
      console.log(`=> Iteration ${i + 1}/${options.iterations}`)
      const results = await prisma()
      prismaResults.push(results)
      console.log()
    }
    allResults.prisma = prismaResults
  }

  if (!options.disableTypeorm) {
    const typeormResults: MultipleBenchmarkRunResults = []
    console.log('=> ORM: Typeorm')
    for (let i = 0; i < options.iterations; i++) {
      console.log(`=> Iteration ${i + 1}/${options.iterations}`)
      const results = await typeorm()
      typeormResults.push(results)
      console.log()
    }
    allResults.typeorm = typeormResults
  }

  if (!options.disableMikro) {
    const mikroResults: MultipleBenchmarkRunResults = []
    console.log('=> ORM: MikroORM')
    for (let i = 0; i < options.iterations; i++) {
      console.log(`=> Iteration ${i + 1}/${options.iterations}`)
      const results = await mikro()
      mikroResults.push(results)
      console.log()
    }
    allResults.mikro = mikroResults
  }

  let populateConfig: PopulateOptions | undefined = undefined
  const populateConfigPath = join(__dirname, '../.config/populate.json')
  if (existsSync(populateConfigPath)) {
    populateConfig = JSON.parse(readFileSync(populateConfigPath, 'utf-8'))
  }

  console.log(`=> Writing results to ${options.output}`)
  writeFileSync(
    options.output,
    JSON.stringify(
      {
        populateConfig,
        benchmarkConfig: options,
        results: allResults
      },
      null,
      2
    )
  )

  return allResults
}

const defaultOptions: BenchmarkOptions = {
  iterations: 100,
  output: join(process.cwd(), `results_${Date.now()}.json`),
  disableTypeorm: false,
  disablePrisma: false,
  disableMikro: false
}

if (require.main === module) {
  const options: BenchmarkOptions = {
    iterations: defaultOptions.iterations,
    output: defaultOptions.output,
    disableTypeorm: defaultOptions.disableTypeorm,
    disablePrisma: defaultOptions.disablePrisma,
    disableMikro: defaultOptions.disableMikro
  }

  const args = process.argv.slice(2)
  while (args.length) {
    const [key, value] = args
    switch (key) {
      case '-i':
      case '--iterations':
        options.iterations = parseInt(value)
        args.shift()
        break
      case '-o':
      case '--output':
        options.output = value
        args.shift()
        break
      case '-t':
      case '--disable-typeorm':
        options.disableTypeorm = true
        break
      case '-p':
      case '--disable-prisma':
        options.disablePrisma = true
        break
      case '-m':
      case '--disable-mikro':
        options.disableMikro = true
        break
      default:
        console.error(`Unknown option: ${key}`)
        console.error(`Usage: ${process.argv[1]} [options]
Options:
  -i, --iterations <number>         Number of iterations (default: ${defaultOptions.iterations})
  -o, --output <file>               Output file (default: ${defaultOptions.output})
  -t, --disable-typeorm             Disable Typeorm
  -p, --disable-prisma              Disable Prisma
  -m, --disable-mikro               Disable MikroORM
`)
        process.exit(1)
    }
    args.shift()
  }

  main(options)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
