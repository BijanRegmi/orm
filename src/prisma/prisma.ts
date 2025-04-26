import { PrismaClient } from '@prisma/client'
import measure from '../utils/measure'
import { QueryResult } from '../utils/types'

// const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })
const prisma = new PrismaClient()

let relationLoadStrategy: 'join' | 'query' = 'join'

async function findMany() {
  return prisma.user.findMany()
}

async function findManyWithRelations() {
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

async function findManyWithRelationsFilterAndPagination() {
  return prisma.user.findMany({
    relationLoadStrategy,
    where: {
      name: { startsWith: 'B' }
    },
    skip: 10,
    take: 10,
    include: {
      order: {
        include: {
          order_line: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

async function findManyWithNestedWhere() {
  return prisma.user.findMany({
    relationLoadStrategy,
    where: {
      order: {
        some: {
          order_line: {
            some: {
              product_variant: {
                product: {
                  name: {
                    startsWith: 'B'
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

async function findManyWithNestedWhereSelectAndPagination() {
  return prisma.user.findMany({
    relationLoadStrategy,
    where: {
      order: {
        some: {
          order_line: {
            some: {
              product_variant: {
                product: {
                  name: {
                    startsWith: 'B'
                  }
                }
              }
            }
          }
        }
      }
    },
    select: {
      id: true,
      createdAt: true,
      order: {
        select: {
          id: true,
          createdAt: true,
          order_line: {
            select: {
              id: true,
              product_variant: {
                select: {
                  id: true,
                  product: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    skip: 10,
    take: 10,
    orderBy: {
      createdAt: 'desc'
    }
  })
}

async function main() {
  await prisma.$connect()
  const results: QueryResult[] = []

  for (const strategry of ['query', 'join'] as const) {
    relationLoadStrategy = strategry
    results.push(
      await measure(`prisma-${relationLoadStrategy}-find-many`, findMany)
    )
    results.push(
      await measure(
        `prisma-${relationLoadStrategy}-find-many-with-relations`,
        findManyWithRelations
      )
    )
    results.push(
      await measure(
        `prisma-${relationLoadStrategy}-find-many-with-relations-filter-and-pagination`,
        findManyWithRelationsFilterAndPagination
      )
    )
    results.push(
      await measure(
        `prisma-${relationLoadStrategy}-find-many-with-nested-where`,
        findManyWithNestedWhere
      )
    )
    results.push(
      await measure(
        `prisma-${relationLoadStrategy}-find-many-with-nested-where-select-and-pagination`,
        findManyWithNestedWhereSelectAndPagination
      )
    )
  }

  await prisma.$disconnect()
}

main()
