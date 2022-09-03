import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'subscriptions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable()
      table.integer('podcast_id').unsigned().notNullable()
      table.timestamps(true,true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
