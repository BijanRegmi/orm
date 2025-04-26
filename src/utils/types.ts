export type Ref<T> = T

export type PopulateOptions = {
  products: number
  users: number
  maxVariantsPerProducts: number
  maxOrdersPerUser: number
  maxLinesPerOrder: number
}

export type BenchmarkOptions = {
  iterations: number
  output: string
  disableTypeorm: boolean
  disablePrisma: boolean
  disableMikro: boolean
}

export type ORM = 'prisma' | 'mikro' | 'typeorm'
export type QueryResult = {
  query: string
  time: number
}
export type SingleBenchmarkRunResult = QueryResult[]
export type MultipleBenchmarkRunResults = SingleBenchmarkRunResult[]
export type AllResults = { [key in ORM]?: MultipleBenchmarkRunResults }
