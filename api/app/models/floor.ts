import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Shelf from '#models/shelf'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Item from '#models/item'

export default class Floor extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare shelfId: number

  @belongsTo(() => Shelf)
  declare shelf: BelongsTo<typeof Shelf>

  @hasMany(() => Item)
  declare items: HasMany<typeof Item>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
