import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Podcast from 'App/Models/Podcast'
import EpisodeValidator from 'App/Validators/EpisodeValidator'
import Application from '@ioc:Adonis/Core/Application'
import Episode from 'App/Models/Episode'
import Event from '@ioc:Adonis/Core/Event'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'


export default class EpisodesController {
  public async create({ view, params }: HttpContextContract) {
    const podcast = await Podcast.findByOrFail('slug', params.slug)
    return view.render('episodes/create', { podcast })
  }

  public async store({ request, response, auth, session }: HttpContextContract) {
    const user = auth.user
    const payload = await request.validate(EpisodeValidator)

    // find the podcast
    const podcast = await Podcast.query()
      .where('id', payload.podcastId)
      .withCount('episodes')
      .first()

    await payload.audio!.move(Application.publicPath('/upload/episode_audio'), {
      name: `${podcast!.slug}_${podcast!.$extras.episodes_count + 1}.${payload.audio!.extname}`,
    })

    // if (!payload.audio.hasErrors) {
    //   session.flash('error', payload.audio.errors)
    //   return response.redirect('back')
    // }

    const episode = new Episode()
    episode.podcastId = payload.podcastId
    episode.userId = user!.id
    episode.title = payload.title
    episode.summary = payload.summary
    episode.audio = `/upload/episode_audio/${payload.audio.fileName}`

    await episode.save()

    // const subscribers = await user!.related('podcastSubscribe').query()
    // query all subcribed isd
    const subscribers = await Database.query().from('subscriptions').select('user_id')

    // mao user ids
    const user_id = subscribers.map((s) => s.user_id)

    // find a user using subscribed ID
    const subscribedUsers = await User.query().where('id', user_id)
    // if there a subscribers
    if (subscribedUsers.length > 0) {
      Event.emit('newEpisodeUpload', { podcast, subscribedUsers })
    }

    session.flash('notification', 'Episode uploadedSuccessfully')
    // return subscribedUsers
    return response.redirect('my-podcast')
  }

  // download episodes
  public async download({ params, response }: HttpContextContract) {
    const episode = await Episode.findBy('id',params.id)

    return response.attachment(Application.publicPath(episode!.audio))
  }
}
