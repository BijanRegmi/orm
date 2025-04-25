import { EntityGenerator } from '@mikro-orm/entity-generator'
import { defineConfig } from '@mikro-orm/postgresql'
import { config } from 'dotenv'
import Entities from './entities/index.js'

config()

export default defineConfig({
  clientUrl: process.env.DATABASE_URL,
  allowGlobalContext: false,
  entities: Entities,
  extensions: [EntityGenerator],
  debug: true
})
