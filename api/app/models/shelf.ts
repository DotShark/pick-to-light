import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Floor from '#models/floor'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Shelf extends BaseModel {
  static table = 'shelves'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @hasMany(() => Floor)
  declare floors: HasMany<typeof Floor>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
