import { PrismaClient } from '@prisma/client'
import measure from '../utils/measure'
import { QueryResult, SingleBenchmarkRunResult } from '../utils/types'

const prisma = new PrismaClient({
  log: process.env.DEBUG ? ['query', 'info', 'warn', 'error'] : undefined
})

let relationLoadStrategy: 'join' | 'query' = 'join'

async function findMany() {
  return prisma.user.findMany({
    relationLoadStrategy
  })
}

async function findManyWithToOneRelationJoined() {
  return prisma.order_line.findMany({
    relationLoadStrategy,
    include: {
      product_variant: {
        include: {
          product: true
        }
      },
      order: true
    }
  })
}

async function findManyWithToOneRelationJoinedWithPaginationAndFilter() {
  return prisma.order_line.findMany({
    relationLoadStrategy,
    include: {
      product_variant: {
        include: {
          product: true
        }
      },
      order: true
    },
    skip: 10,
    take: 10,
    where: {
      product_variant: {
        product: {
          name: {
            startsWith: 'B',
            mode: 'insensitive'
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

async function findManyWithToManyRelationsJoined() {
  return prisma.user.findMany({
    relationLoadStrategy,
    include: {
      order: {
        include: {
          order_line: true
        }
      }
    }
  })
}

async function findManyWithToManyRelationsJoinedWithPaginationAndFilter() {
  return prisma.user.findMany({
    relationLoadStrategy,
    include: {
      order: {
        include: {
          order_line: true
        }
      }
    },
    skip: 10,
    take: 10,
    where: {
      order: {
        some: {
          order_line: {
            some: {
              quantity: {
                gt: 10
              }
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

async function countNestedWhere() {
  return prisma.user.count({
    where: {
      order: {
        some: {
          order_line: {
            some: {
              product_variant: {
                product: {
                  name: {
                    startsWith: 'B',
                    mode: 'insensitive'
                  }
                }
              }
            }
          }
        }
      }
    }
  })
}

async function findFirst() {
  return prisma.product.findFirst({
    relationLoadStrategy
  })
}

async function findUniqueWithToOneRelationJoined() {
  return prisma.order_line.findUnique({
    relationLoadStrategy,
    include: {
      product_variant: {
        include: {
          product: true
        }
      },
      order: true
    },
    where: {
      id: 10
    }
  })
}

async function findUniqueWithToManyRelationsJoined() {
  return prisma.user.findUnique({
    relationLoadStrategy,
    include: {
      order: {
        include: {
          order_line: true
        }
      }
    },
    where: {
      id: 10
    }
  })
}

export async function main(): Promise<SingleBenchmarkRunResult> {
  await prisma.$connect()
  const results: QueryResult[] = []

  // warmup
  for (let i = 0; i < 10; i++) await prisma.$queryRaw`SELECT 1`

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

  await prisma.$disconnect()

  return results
}

if (require.main === module) {
  main()
}
