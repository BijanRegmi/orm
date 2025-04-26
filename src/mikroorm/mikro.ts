import { config } from 'dotenv'
config()

import { MikroORM } from '@mikro-orm/postgresql'
import measure from '../utils/measure'
import { QueryResult, SingleBenchmarkRunResult } from '../utils/types'
import Entities, { OrderLine, Product, User } from './entities'

let orm: Awaited<ReturnType<typeof MikroORM.init>>

type EntityManager = ReturnType<typeof orm.em.fork>

let relationLoadStrategy: 'joined' | 'select-in' = 'joined'

async function findMany(em: EntityManager) {
  return em.find(
    User,
    {},
    {
      strategy: relationLoadStrategy
    }
  )
}

async function findManyWithToOneRelationJoined(em: EntityManager) {
  return em.find(
    OrderLine,
    {},
    {
      strategy: relationLoadStrategy,
      populate: ['productVariantId.productId', 'orderId']
    }
  )
}

async function findManyWithToOneRelationJoinedWithPaginationAndFilter(
  em: EntityManager
) {
  return em.find(
    OrderLine,
    { productVariantId: { productId: { name: { $ilike: 'B%' } } } },
    {
      strategy: relationLoadStrategy,
      populate: ['productVariantId.productId', 'orderId'],
      offset: 10,
      limit: 10,
      orderBy: { createdAt: 'DESC' }
    }
  )
}

async function findManyWithToManyRelationsJoined(em: EntityManager) {
  return em.find(
    User,
    {},
    {
      strategy: relationLoadStrategy,
      populate: ['orderCollection.orderLineCollection']
    }
  )
}

async function findManyWithToManyRelationsJoinedWithPaginationAndFilter(
  em: EntityManager
) {
  return em.find(
    User,
    {
      orderCollection: { orderLineCollection: { quantity: { $gt: 10 } } }
    },
    {
      strategy: relationLoadStrategy,
      populate: ['orderCollection.orderLineCollection'],
      offset: 10,
      limit: 10,
      orderBy: { createdAt: 'DESC' }
    }
  )
}

async function countNestedWhere(em: EntityManager) {
  return em.count(User, {
    orderCollection: {
      orderLineCollection: {
        productVariantId: {
          productId: {
            name: {
              $ilike: 'B%'
            }
          }
        }
      }
    }
  })
}

async function findFirst(em: EntityManager) {
  return em.find(
    Product,
    {},
    {
      strategy: relationLoadStrategy,
      limit: 1
    }
  )
}

async function findUniqueWithToOneRelationJoined(em: EntityManager) {
  return em.findOne(
    OrderLine,
    { id: 10 },
    {
      strategy: relationLoadStrategy,
      populate: ['productVariantId.productId', 'orderId']
    }
  )
}

async function findUniqueWithToManyRelationsJoined(em: EntityManager) {
  return em.findOne(
    User,
    { id: 10 },
    {
      strategy: relationLoadStrategy,
      populate: ['orderCollection.orderLineCollection']
    }
  )
}

async function wrapAndMeasure(label: string, cb: (em: EntityManager) => any) {
  const em = orm.em.fork()
  const result = await measure(label, () => cb(em))
  em.flush()
  return result
}

export async function main(): Promise<SingleBenchmarkRunResult> {
  orm = await MikroORM.init({
    clientUrl: process.env.DATABASE_URL,
    allowGlobalContext: false,
    entities: Entities,
    debug: !!process.env.DEBUG
  })

  const results: QueryResult[] = []

  // warmup
  await orm.connect()

  for (const strategy of ['query', 'join'] as const) {
    relationLoadStrategy = strategy === 'query' ? 'select-in' : 'joined'
    results.push(await wrapAndMeasure(`${strategy}-find-many`, findMany))
    results.push(
      await wrapAndMeasure(
        `${strategy}-find-many-with-to-one-relation-joined`,
        findManyWithToOneRelationJoined
      )
    )
    results.push(
      await wrapAndMeasure(
        `${strategy}-find-many-with-to-one-relation-joined-with-pagination-and-filter`,
        findManyWithToOneRelationJoinedWithPaginationAndFilter
      )
    )
    results.push(
      await wrapAndMeasure(
        `${strategy}-find-many-with-to-many-relations-joined`,
        findManyWithToManyRelationsJoined
      )
    )
    results.push(
      await wrapAndMeasure(
        `${strategy}-find-many-with-to-many-relations-joined-with-pagination-and-filter`,
        findManyWithToManyRelationsJoinedWithPaginationAndFilter
      )
    )
    results.push(
      await wrapAndMeasure(`${strategy}-count-nested-where`, countNestedWhere)
    )
    results.push(await wrapAndMeasure(`${strategy}-find-first`, findFirst))
    results.push(
      await wrapAndMeasure(
        `${strategy}-find-unique-with-to-one-relation-joined`,
        findUniqueWithToOneRelationJoined
      )
    )
    results.push(
      await wrapAndMeasure(
        `${strategy}-find-unique-with-to-many-relations-joined`,
        findUniqueWithToManyRelationsJoined
      )
    )
  }

  await orm.close(true)

  return results
}

if (require.main === module) {
  main()
}
