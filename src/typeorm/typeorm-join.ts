import { config } from 'dotenv'
config()

import 'reflect-metadata'
import { DataSource, ILike } from 'typeorm'
import measure from '../utils/measure'
import { QueryResult } from '../utils/types'
import entities, { User } from './entities'

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: entities
})

async function findMany() {
  return dataSource.getRepository(User).find()
}

async function findManyWithRelations() {
  return dataSource.getRepository(User).find({
    relationLoadStrategy: 'join',
    relations: {
      orders: {
        lines: true
      }
    }
  })
}

async function findManyWithRelationsFilterAndPagination() {
  return dataSource.getRepository(User).find({
    relationLoadStrategy: 'join',
    where: {
      name: ILike('B%')
    },
    skip: 10,
    take: 10,
    relations: {
      orders: {
        lines: true
      }
    },
    order: {
      createdAt: 'DESC'
    }
  })
}

async function findManyWithNestedWhere() {
  return dataSource.getRepository(User).find({
    relationLoadStrategy: 'join',
    where: {
      orders: {
        lines: {
          productVariant: {
            product: {
              name: ILike('B%')
            }
          }
        }
      }
    }
  })
}

async function findManyWithNestedWhereSelectAndPagination() {
  return dataSource.getRepository(User).find({
    relationLoadStrategy: 'join',
    where: {
      orders: {
        lines: {
          productVariant: {
            product: {
              name: ILike('B%')
            }
          }
        }
      }
    },
    select: {
      id: true,
      createdAt: true,
      orders: {
        id: true,
        lines: {
          id: true,
          productVariant: {
            id: true,
            product: {
              id: true,
              name: true
            }
          }
        }
      }
    },
    relations: {
      orders: {
        lines: {
          productVariant: {
            product: true
          }
        }
      }
    },
    skip: 10,
    take: 10,
    order: {
      createdAt: 'DESC'
    }
  })
}

async function main() {
  await dataSource.initialize()
  const results: QueryResult[] = []

  results.push(await measure('typeorm-join-find-many', findMany))
  results.push(
    await measure(
      'typeorm-join-find-many-with-relations',
      findManyWithRelations
    )
  )
  results.push(
    await measure(
      'typeorm-join-find-many-with-relations-filter-and-pagination',
      findManyWithRelationsFilterAndPagination
    )
  )
  results.push(
    await measure(
      'typeorm-join-find-many-with-nested-where',
      findManyWithNestedWhere
    )
  )
  results.push(
    await measure(
      'typeorm-join-find-many-with-nested-where-select-and-pagination',
      findManyWithNestedWhereSelectAndPagination
    )
  )

  await dataSource.destroy()
}

main()
