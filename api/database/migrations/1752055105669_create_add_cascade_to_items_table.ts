import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'items'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Drop the existing foreign key constraint
      table.dropForeign(['floor_id'])
      
      // Add the foreign key constraint with CASCADE
      table.foreign('floor_id').references('id').inTable('floors').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Drop the CASCADE foreign key constraint
      table.dropForeign(['floor_id'])
      
      // Add back the foreign key constraint without CASCADE
      table.foreign('floor_id').references('id').inTable('floors')
    })
  }
}
