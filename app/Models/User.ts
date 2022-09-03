import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Podcast from './Podcast'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public name: string

  @column()
  public email: string

  @column()
  public rememberMeToken: string

  @column.dateTime()
  public emailVerifiedAt: DateTime

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  // user -podcast relations
  @hasMany(() => Podcast)
  public podcasts: HasMany<typeof Podcast>

  // user - podcast (many to many) = subscription
  @manyToMany(() => Podcast, {
    pivotTable: 'subscriptions',
    pivotTimestamps: true,
  })
  public podcastSubscribe: ManyToMany<typeof Podcast>
}
