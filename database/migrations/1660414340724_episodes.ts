import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'episodes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('podcast_id').unsigned().notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.string('title').notNullable()
      table.string('audio').notNullable()
      table.string('summary').notNullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
