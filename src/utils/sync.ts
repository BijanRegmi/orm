import { config } from 'dotenv'
import 'reflect-metadata'
import { DataSource } from 'typeorm'

import entities from '../typeorm/entities'
import { MikroORM } from '@mikro-orm/postgresql'
import { EntityGenerator } from '@mikro-orm/entity-generator'
import { join } from 'path'

config()

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: entities
})

async function main() {
  console.log('=> Synchronizing typeorm entities to db')
  await dataSource.initialize()

  console.log('=> Synchronizing db to mikro-orm entities')
  const orm = await MikroORM.init({
    discovery: {
      warnWhenNoEntities: false
    },
    extensions: [EntityGenerator],
    clientUrl: process.env.DATABASE_URL
  })
  await orm.entityGenerator.generate({
    save: true,
    path: join(__dirname, '../mikroorm/entities/'),
    bidirectionalRelations: true,
    scalarPropertiesForRelations: 'never',
    useCoreBaseEntity: true,
    scalarTypeInDecorator: true,
    fileName: (name: string) => `${name}.entity`
  })
  await orm.close(true)

  console.log('=> Synchronizing db to prisma schemas')
}

if (require.main === module) {
  main()
}
