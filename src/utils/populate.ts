import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { PopulateOptions } from './types'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

/**
 * Create `count` products each with 0-10 variants
 */
async function populateProduct(count: number, maxVariantsPerProducts: number) {
  for (let i = 0; i < count; i++) {
    const name = faker.commerce.productName()
    await prisma.product.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/\s/g, ''),
        description: faker.commerce.productDescription(),
        product_variant: {
          createMany: {
            data: Array.from({
              length: Math.floor(Math.random() * maxVariantsPerProducts)
            }).map((_, idx) => {
              return {
                name: `${name}_${idx}`,
                sku: name.toUpperCase().replace(/\s/g, '') + `${idx}`,
                description: faker.commerce.productDescription(),
                price: faker.number.int({ min: 1000, max: 9999999 })
              }
            })
          }
        }
      }
    })
    console.log(`Product: ${i}/${count}`)
  }
}

/**
 * Create `count` users
 */
async function populateUser(count: number) {
  for (let i = 0; i < count; i++) {
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        age: faker.number.int({ min: 18, max: 100 }),
        password: faker.string.alphanumeric({ length: { min: 8, max: 20 } })
      }
    })
    console.log(`User: ${i}/${count}`)
  }
}

/**
 * For every user create 0-50 orders
 * Each order having 0-10 orderLines
 */
async function populateOrder(
  maxOrdersPerUser: number,
  maxLinesPerOrder: number
) {
  const variantIds = await prisma.product_variant.findMany({
    select: { id: true }
  })

  const userIds = await prisma.user.findMany({
    select: { id: true }
  })

  const userLen = userIds.length
  const variantLen = variantIds.length

  for (let i = 0; i < userLen; i++) {
    const orderCount = Math.floor(Math.random() * maxOrdersPerUser)
    for (let j = 0; j < orderCount; j++) {
      const linesCount = Math.floor(Math.random() * maxLinesPerOrder)
      await prisma.order.create({
        data: {
          userId: userIds[i].id,
          code: `ODX_${i}_${j}`,
          total: faker.number.int({ min: 1000, max: 9999999 }),
          totalWithTax: faker.number.int({ min: 1000, max: 9999999 }),
          taxRate: faker.number.int({ min: 0, max: 100 }),
          order_line: {
            createMany: {
              data: Array.from({ length: linesCount }).map((_) => {
                return {
                  quantity: Math.floor(Math.random() * 5),
                  unitPrice: faker.number.int({ min: 1000, max: 9999999 }),
                  productVariantId:
                    variantIds[Math.floor(Math.random() * variantLen)].id
                }
              })
            }
          }
        }
      })
      console.log(`Order: ${i}/${userLen} - ${j}/${orderCount}`)
    }
  }
}

async function main(opts: PopulateOptions) {
  mkdirSync(join(__dirname, '../../.config'), { recursive: true })
  writeFileSync(
    join(__dirname, '../../.config/populate.json'),
    JSON.stringify(opts, null, 2)
  )

  await populateProduct(opts.products, opts.maxVariantsPerProducts)
  await populateUser(opts.users)
  await populateOrder(opts.maxOrdersPerUser, opts.maxLinesPerOrder)
}

const defaultOptions: PopulateOptions = {
  products: 10_000,
  users: 1000,
  maxVariantsPerProducts: 10,
  maxOrdersPerUser: 50,
  maxLinesPerOrder: 10
}

if (require.main === module) {
  const options: PopulateOptions = {
    products: defaultOptions.products,
    users: defaultOptions.users,
    maxVariantsPerProducts: defaultOptions.maxVariantsPerProducts,
    maxOrdersPerUser: defaultOptions.maxOrdersPerUser,
    maxLinesPerOrder: defaultOptions.maxLinesPerOrder
  }

  const args = process.argv.slice(2)
  while (args.length) {
    const [key, value] = args
    switch (key) {
      case '-p':
      case '--products':
        options.products = parseInt(value)
        break
      case '-u':
      case '--users':
        options.users = parseInt(value)
        break
      case '-v':
      case '--variants':
        options.maxVariantsPerProducts = parseInt(value)
        break
      case '-o':
      case '--orders':
        options.maxOrdersPerUser = parseInt(value)
        break
      case '-l':
      case '--lines':
        options.maxLinesPerOrder = parseInt(value)
        break
      default:
        console.error(`Unknown option: ${key}`)
        console.error(`Usage: ${process.argv[1]} [options]
Options:
  -p, --products <number>          Number of products to create (default: ${defaultOptions.products})
  -u, --users <number>             Number of users to create (default: ${defaultOptions.users})
  -v, --variants <number>          Max variants per product (default: ${defaultOptions.maxVariantsPerProducts})
  -o, --orders <number>            Max orders per user (default: ${defaultOptions.maxOrdersPerUser})
  -l, --lines <number>             Max lines per order (default: ${defaultOptions.maxLinesPerOrder})
`)
        process.exit(1)
    }
    args.shift()
    args.shift()
  }

  main(options)
}
