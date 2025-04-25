import { config } from 'dotenv'
config()

import { EntityGenerator } from '@mikro-orm/entity-generator'
import { MikroORM } from '@mikro-orm/postgresql'
import { Entities, User } from './entities'

let orm: Awaited<ReturnType<typeof MikroORM.init>>

const KEY = 'Mikro-ORM'

async function init() {
  orm = await MikroORM.init({
    clientUrl: process.env.DATABASE_URL,
    allowGlobalContext: false,
    entities: Entities,
    extensions: [EntityGenerator],
    debug: true
  })
  console.log('====> MIKRO-ORM FETCHING ALL USERS')
}

async function query() {
  const em = orm.em.fork()
  console.time(KEY)
  await em.findAll(User, {
    populate: ['orderCollection.orderLineCollection.productvariantId.productId']
  })
  console.timeEnd(KEY)
  em.flush()
  console.log('\n\n')
}

async function test() {
  const em = orm.em.fork()
  console.time(KEY)
  const [users, total] = await em.findAndCount(
    User,
    { name: { $like: '%%' } },
    {
      fields: ['id', 'createdAt', 'name', 'orderCollection.id'],
      limit: 800,
      offset: 1,
      orderBy: { createdAt: 'DESC' },
      populate: ['orderCollection']
    }
  )
  console.timeEnd(KEY)
  console.log('\n\n')
  // console.log(total, users.length)
  em.flush()
}

async function main() {
  await init()
  for (let i = 0; i < 10; i++) {
    await test()
    //   await query()
  }
}

main()
