import {
  MikroORM as BaseMikroORM,
  Connection,
  EntityManager,
  IDatabaseDriver
} from '@mikro-orm/core'
import {
  MikroORM,
  PostgreSqlDriver,
  SqlEntityManager
} from '@mikro-orm/postgresql'
import { User } from './entities/User.js'

let orm: BaseMikroORM<
  PostgreSqlDriver,
  SqlEntityManager<PostgreSqlDriver> &
  EntityManager<IDatabaseDriver<Connection>>
>

const KEY = 'Mikro-ORM'

async function init() {
  orm = await MikroORM.init()
  console.log('====> MIKRO-ORM FETCHING ALL USERS')
}

async function query(em: any) {
  console.time(KEY)
  const users = await em.findAll(User, {
    populate: [
      'orderCollection.orderLineCollection.productvariantId.productId'
    ],
    disableIdentityMap: true,
    cache: true
  })
  console.timeEnd(KEY)

  const userCount = users.length
  const orderCount = users.reduce((l, u) => l + u.orderCollection.length, 0)
  const linesCount = users.reduce(
    (l, u) =>
      l +
      u.orderCollection.reduce((ll, o) => ll + o.orderLineCollection.length, 0),
    0
  )
  console.log(
    `=> FETCHED ${userCount} users\n=> FETCHED ${orderCount} orders\n=> FETCHED ${linesCount} lines`
  )
}

async function main() {
  await init()
  const em = orm.em.fork()
  for (let i = 0; i < 10; i++) {
    await query(em)
  }
}

main()
