import { config } from 'dotenv'
import 'reflect-metadata'
import { DataSource } from 'typeorm'

import entities from '../typeorm/entities'

config()

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: entities
})

dataSource.initialize()
