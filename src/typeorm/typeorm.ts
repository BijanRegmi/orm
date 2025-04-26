import { config } from 'dotenv'
config()

import 'reflect-metadata'
import { DataSource, ILike, MoreThan } from 'typeorm'
import measure from '../utils/measure'
import { QueryResult, SingleBenchmarkRunResult } from '../utils/types'
import entities, { OrderLine, Product, User } from './entities'

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: !!process.env.DEBUG,
  entities: entities
})

let relationLoadStrategy: 'join' | 'query' = 'join'

async function findMany() {
  return dataSource.getRepository(User).find({
    relationLoadStrategy
  })
}

async function findManyWithToOneRelationJoined() {
  return dataSource.getRepository(OrderLine).find({
    relationLoadStrategy,
    relations: {
      productVariant: {
        product: true
      },
      order: true
    }
  })
}

async function findManyWithToOneRelationJoinedWithPaginationAndFilter() {
  return dataSource.getRepository(OrderLine).find({
    relationLoadStrategy,
    relations: {
      productVariant: {
        product: true
      },
      order: true
    },
    skip: 10,
    take: 10,
    where: {
      productVariant: {
        product: {
          name: ILike('B%')
        }
      }
    },
    order: {
      createdAt: 'DESC'
    }
  })
}

async function findManyWithToManyRelationsJoined() {
  return dataSource.getRepository(User).find({
    relationLoadStrategy,
    relations: {
      orders: {
        lines: true
      }
    }
  })
}

async function findManyWithToManyRelationsJoinedWithPaginationAndFilter() {
  return dataSource.getRepository(User).find({
    relationLoadStrategy,
    relations: {
      orders: {
        lines: true
      }
    },
    skip: 10,
    take: 10,
    where: {
      orders: {
        lines: {
          quantity: MoreThan(10)
        }
      }
    },
    order: {
      createdAt: 'DESC'
    }
  })
}

async function countNestedWhere() {
  return dataSource.getRepository(User).count({
    relationLoadStrategy,
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

async function findFirst() {
  return dataSource.getRepository(Product).find({
    relationLoadStrategy,
    take: 1
  })
}

async function findUniqueWithToOneRelationJoined() {
  return dataSource.getRepository(OrderLine).findOne({
    relationLoadStrategy,
    relations: {
      productVariant: {
        product: true
      },
      order: true
    },
    where: {
      id: 10
    }
  })
}

async function findUniqueWithToManyRelationsJoined() {
  return dataSource.getRepository(User).findOne({
    relationLoadStrategy,
    relations: {
      orders: {
        lines: true
      }
    },
    where: {
      id: 10
    }
  })
}

export async function main(): Promise<SingleBenchmarkRunResult> {
  await dataSource.initialize()
  const results: QueryResult[] = []

  // warmup
  for (let i = 0; i < 10; i++) await dataSource.query(`SELECT 1`)

  for (const strategry of ['query', 'join'] as const) {
    relationLoadStrategy = strategry
    results.push(await measure(`${relationLoadStrategy}-find-many`, findMany))
    results.push(
      await measure(
        `${relationLoadStrategy}-find-many-with-to-one-relation-joined`,
        findManyWithToOneRelationJoined
      )
    )
    results.push(
      await measure(
        `${relationLoadStrategy}-find-many-with-to-one-relation-joined-with-pagination-and-filter`,
        findManyWithToOneRelationJoinedWithPaginationAndFilter
      )
    )
    results.push(
      await measure(
        `${relationLoadStrategy}-find-many-with-to-many-relations-joined`,
        findManyWithToManyRelationsJoined
      )
    )
    results.push(
      await measure(
        `${relationLoadStrategy}-find-many-with-to-many-relations-joined-with-pagination-and-filter`,
        findManyWithToManyRelationsJoinedWithPaginationAndFilter
      )
    )
    results.push(
      await measure(
        `${relationLoadStrategy}-count-nested-where`,
        countNestedWhere
      )
    )
    results.push(await measure(`${relationLoadStrategy}-find-first`, findFirst))
    results.push(
      await measure(
        `${relationLoadStrategy}-find-unique-with-to-one-relation-joined`,
        findUniqueWithToOneRelationJoined
      )
    )
    results.push(
      await measure(
        `${relationLoadStrategy}-find-unique-with-to-many-relations-joined`,
        findUniqueWithToManyRelationsJoined
      )
    )
  }

  await dataSource.destroy()

  return results
}

if (require.main === module) {
  main()
}
