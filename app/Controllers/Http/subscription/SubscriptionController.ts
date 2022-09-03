import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Podcast from 'App/Models/Podcast'

export default class SubscriptionController {
  public async subscribe({ auth, session, response, request }: HttpContextContract) {
    const podcast = await Podcast.findOrFail(request.input('podcast_id'))

    await auth.user!.related('podcastSubscribe').attach([podcast.id])

    session.flash('notification', 'You have successfully subscribed to this podcast channel')

    return response.redirect('back')
  }


  public async unsubscribe({ auth, session, response, params }: HttpContextContract) {
    const podcast = await Podcast.findBy('id', params.id)

     await auth.user!.related('podcastSubscribe').detach([podcast!.id])


    session.flash('notification', 'You have successfully unsubscribed to this podcast channel')

    return response.redirect('back')
  }
}
