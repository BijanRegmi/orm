import { config } from 'dotenv'
config()

import measure from '../utils/measure'
import { QueryResult } from '../utils/types'
import { MikroORM } from '@mikro-orm/postgresql'
import Entities, { User } from './entities'

let orm: Awaited<ReturnType<typeof MikroORM.init>>

type EntityManager = ReturnType<typeof orm.em.fork>

async function findMany(em: EntityManager) {
  return em.find(User, {})
}

async function findManyWithRelations(em: EntityManager) {
  return em.find(
    User,
    {},
    { strategy: 'joined', populate: ['orderCollection.orderLineCollection'] }
  )
}

async function findManyWithRelationsFilterAndPagination(em: EntityManager) {
  return em.find(
    User,
    {
      name: { $like: 'B%' }
    },
    {
      strategy: 'joined',
      offset: 10,
      limit: 10,
      orderBy: { createdAt: 'DESC' },
      populate: ['orderCollection.orderLineCollection']
    }
  )
}

async function findManyWithNestedWhere(em: EntityManager) {
  return em.find(
    User,
    {
      orderCollection: {
        orderLineCollection: {
          productVariantId: {
            productId: {
              name: { $like: 'B%' }
            }
          }
        }
      }
    },
    { strategy: 'joined' }
  )
}

async function findManyWithNestedWhereSelectAndPagination(em: EntityManager) {
  return em.find(
    User,
    {
      orderCollection: {
        orderLineCollection: {
          productVariantId: {
            productId: {
              name: { $like: 'B%' }
            }
          }
        }
      }
    },
    {
      strategy: 'joined',
      fields: [
        'id',
        'createdAt',
        'orderCollection.id',
        'orderCollection.orderLineCollection.id',
        'orderCollection.orderLineCollection.productVariantId.id',
        'orderCollection.orderLineCollection.productVariantId.productId.id'
      ],
      offset: 10,
      limit: 10,
      orderBy: { createdAt: 'DESC' }
    }
  )
}

async function wrapAndMeasure(label: string, cb: (em: EntityManager) => any) {
  const em = orm.em.fork()
  const result = await measure(label, () => cb(em))
  em.flush()
  return result
}

async function main() {
  orm = await MikroORM.init({
    clientUrl: process.env.DATABASE_URL,
    allowGlobalContext: false,
    entities: Entities,
    debug: false
  })

  const results: QueryResult[] = []

  results.push(await wrapAndMeasure('mikro-orm-joined-find-many', findMany))
  results.push(
    await wrapAndMeasure(
      'mikro-orm-joined-find-many-with-relations',
      findManyWithRelations
    )
  )
  results.push(
    await wrapAndMeasure(
      'mikro-orm-joined-find-many-with-relations-filter-and-pagination',
      findManyWithRelationsFilterAndPagination
    )
  )
  results.push(
    await wrapAndMeasure(
      'mikro-orm-joined-find-many-with-nested-where',
      findManyWithNestedWhere
    )
  )
  results.push(
    await wrapAndMeasure(
      'mikro-orm-joined-find-many-with-nested-where-select-and-pagination',
      findManyWithNestedWhereSelectAndPagination
    )
  )

  await orm.close(true)
}

main()
