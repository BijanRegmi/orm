import 'reflect-metadata'
import { config } from 'dotenv'
import { DataSource } from 'typeorm'

import entities from './entities'
import { User } from './entities/User.entity'

const KEY = 'TypeORM'

config()

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: entities
})

async function init() {
  await dataSource.initialize()
  console.log('====> TYPEORM FETCHING ALL USERS')
}

async function query() {
  console.time(KEY)
  await dataSource.getRepository(User).find({
    relations: {
      orders: {
        lines: {
          productvariant: {
            product: true
          }
        }
      }
    }
  })
  console.timeEnd(KEY)

  // const userCount = users.length;
  // const orderCount = users.reduce((l, u) => l + u.orders.length, 0);
  // const linesCount = users.reduce(
  //     (l, u) => l + u.orders.reduce((ll, o) => ll + o.lines.length, 0),
  //     0,
  // );
  // console.log(
  //     `=> FETCHED ${userCount} users\n=> FETCHED ${orderCount} orders\n=> FETCHED ${linesCount} lines`,
  // );
}

async function main() {
  await init()
  for (let i = 0; i < 10; i++) {
    await query()
  }
}

main()
