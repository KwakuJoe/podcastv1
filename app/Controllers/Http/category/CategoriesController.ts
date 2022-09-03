import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import Podcast from 'App/Models/Podcast'
import Env from '@ioc:Adonis/Core/Env'

export default class CategoriesController {
  public async show({ params, view }: HttpContextContract) {
    const appUrl = Env.get('APP_URL')
    const category = await Category.findByOrFail('slug', params.slug)
    const podcasts = await Podcast.query().orderBy('id', 'desc').where('category_id', category.id)
    const categories = await Category.query().withCount('podcast')

    return view.render('category/show-podcast-by-category', {
      podcasts,
      categories,
      category,
      appUrl,
    })
  }
}
