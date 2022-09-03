import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Podcast from 'App/Models/Podcast'
import Env from '@ioc:Adonis/Core/Env'

export default class HomeController {
  public async index({ view, request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 1
    const appUrl = Env.get('APP_URL')
    const podcasts = await Podcast.query()
      .orderBy('id', 'desc')
      .preload('category')
      .preload('user')
      .paginate(page, limit)



    return view.render('welcome', { podcasts, appUrl,  })
  }
}
