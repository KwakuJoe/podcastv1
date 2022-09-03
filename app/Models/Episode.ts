import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Podcast from './Podcast'

export default class Episode extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public podcastId: number

  @column()
  public userId: number

  @column()
  public title: string

  @column()
  public summary: string

  @column()
  public audio: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Podcast)
  public podcast: BelongsTo<typeof Podcast>
}
