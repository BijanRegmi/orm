import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });
// const prisma = new PrismaClient()

const KEY = 'Prisma Join'

async function init() {
  await prisma.$connect()
  console.log('====> PRISMA FETCHING ALL USERS with join')
}

async function query() {
  console.time(KEY)
  await prisma.user.findMany({
    relationLoadStrategy: 'join',
    include: {
      order: {
        include: {
          order_line: {
            include: {
              product_variant: {
                include: {
                  product: true
                }
              }
            }
          }
        }
      }
    }
  })
  console.timeEnd(KEY)

  // const userCount = users.length;
  // const orderCount = users.reduce((l, u) => l + u.order.length, 0);
  // const linesCount = users.reduce(
  //     (l, u) => l + u.order.reduce((ll, o) => ll + o.order_line.length, 0),
  //     0,
  // );
  // console.log(
  //     `=> FETCHED ${userCount} users\n=> FETCHED ${orderCount} orders\n=> FETCHED ${linesCount} lines`,
  // );
}

async function main() {
  await init()
  for (let i = 0; i < 1; i++) {
    await query()
  }
}

main()
