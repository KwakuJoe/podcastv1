import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Episode from './Episode'
import Category from './Category'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'

export default class Podcast extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['title'],
    allowUpdates: true,
  })
  public slug: string

  @column()
  public logo: string

  @column()
  public categoryId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>

  @hasMany(() => Episode)
  public episodes: HasMany<typeof Episode>

  @manyToMany(() => User, {
    pivotTable: 'subscriptions',
    pivotTimestamps: true,
  })
  public users: ManyToMany<typeof User>
}
