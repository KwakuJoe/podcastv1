import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import Application from '@ioc:Adonis/Core/Application'
import { uuid } from 'uuidv4';
import Podcast from 'App/Models/Podcast';
import CreatePodcastValidator from 'App/Validators/CreatePodcastValidator';
import UpdatePodcastValidator from 'App/Validators/UpdatePodcastValidator';
import Env from '@ioc:Adonis/Core/Env'
import Database from '@ioc:Adonis/Lucid/Database';
import Episode from 'App/Models/Episode';

export default class PodcastController {

  public async create({ view }: HttpContextContract) {


    const categories = await Category.all()

    return view.render('podcast/create', { categories })
  }

  public async store({ request, session, auth, response }: HttpContextContract) {
    const user = auth.user

    // const validatedData = await request.validate(CreatePodcastValidator)

    const payload = await request.validate(CreatePodcastValidator)

    // // // const logo = validatedData.logo
    if (payload.logo.hasErrors) {
      session.flash('error', 'Please upload a logo banner')
      return response.redirect('back')
    }

    await payload.logo!.move(Application.publicPath('/upload/podcast_logos'), {
      name: `${uuid()}.${payload.logo!.extname}`,
    })

    // creating new podcast
    const podcast = new Podcast()
    podcast.title = payload.title
    podcast.description = payload.description
    podcast.categoryId = payload.categoryId
    podcast.userId = user!.id
    podcast.logo = `/upload/podcast_logos/${payload.logo.fileName}`

    await podcast.save()
    session.flash('notification', 'Podcast Created Successfully')
    response.redirect('/')
    // not Done
  }



  public async show({ params, view, }: HttpContextContract) {
    const appUrl = Env.get('APP_URL')
    const podcast = await Podcast.query().where('slug', params.slug).preload('user').first()

    // query all its episodes
    const episodes = await Episode.query().where('podcast_id', podcast!.id).orderBy('id', 'desc')

    // const subscriptions = await Database.from('subscriptions')
    //   .select('user_id')
    //   .where('podcast_id', podcast!.id)

    const subscriptions = await Database.query()
      .from('subscriptions')
      .select('user_id')
      .where('podcast_id', podcast!.id)

    // if(auth.user!.id)

    // return subscriptions

    return view.render('podcast/show', { podcast, appUrl, subscriptions, episodes })
  }




  public async edit({ view, params }: HttpContextContract) {
    // const podcast_id = params.id
    const podcast = await Podcast.findOrFail(params.id)

    const categories = await Category.all()

    return view.render('podcast/edit', { podcast, categories })
  }

  public async update({ request, response, session, params,  auth}: HttpContextContract) {
    const podcast = await Podcast.findOrFail(params.id)
    const payload = await request.validate(UpdatePodcastValidator)
    const user = auth.user

    if (payload.logo){
      await payload.logo!.move(Application.publicPath('/upload/podcast_logos'), {
      name: `${uuid()}.${payload.logo!.extname}`,
    })


      podcast.logo = `upload/logos/${payload.logo.fileName}`
    }

    podcast.title = payload.title
    podcast.description = payload.description
    podcast.categoryId = payload.categoryId
    podcast.userId = user!.id
    await podcast.save()

    session.flash('notification', 'Podcast Updated Successfully')

    response.redirect('/my-podcast')

  }


  public async destroy({ params, session, response, auth }: HttpContextContract) {
    const podcast = await Podcast.find(params.id)
    if (auth.user!.id != podcast!.userId) {
      session.flash('error', 'You can only delete your own podcast')
      response.redirect('back')
    }

    await podcast!.delete()
    session.flash('notification', 'Podcast Deleted Successfully')
    response.redirect('back')
   }
}
