import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Hash from '@ioc:Adonis/Core/Hash'
import Podcast from 'App/Models/Podcast'
import Env from '@ioc:Adonis/Core/Env'


export default class UserController {
  // shw userpodcast
  public async index({ auth, view }: HttpContextContract) {
    const appUrl = Env.get('APP_URL')
    const user = auth.user
    const podcasts = await Podcast.query().where('user_id', user!.id).preload('category')
    return view.render('user/my-podcast', { podcasts, appUrl })
  }

  // user subscription

  public async subscriptions({ auth, view }: HttpContextContract) {
    const appUrl = Env.get('APP_URL')
    const subscriptions = await auth.user!.related('podcastSubscribe').query()

    return view.render('user/subscriptions', { subscriptions, appUrl })
  }

  public showEditAccount({view}: HttpContextContract) {
    return view.render('user/account')
  }

  public async updateAccount({ session, request, auth, response }: HttpContextContract) {
    // const data = request.only(['email', 'name'])

    const UpdateUserSchema = schema.create({
      name: schema.string(),
      email: schema.string({}, [
        rules.email(),
        rules.unique({
          table: 'users',
          column: 'email',
          whereNot: {
            id: auth.user!.id,
          },
        }),
      ]),
    })

    const payload = await request.validate({
      schema: UpdateUserSchema,
      messages: {
        'required': 'The {{ field }} is required to create a new account',
        'email.unique': 'This email already has an account',
      },
    })

    const user = await auth.user!.merge({
      name: payload.name,
      email: payload.email,
    })

    await user.save()

    session.flash('notification', 'User details updated successfully')

    response.redirect('back')
  }

  public async showChangePassword({ view }: HttpContextContract) {
    return view.render('user/password')
  }

  public async changePassword({ session, request, auth, response }: HttpContextContract) {
    const UpdateUserSchema = schema.create({
      currentPassword: schema.string(),
      newPassword: schema.string({}, [rules.minLength(8), rules.confirmed('passwordConfirmation')]),
    })

    const payload = await request.validate({
      schema: UpdateUserSchema,
      messages: {
        'required': 'The {{ field }} is required to create a new account',
        'newPassword.minLength': 'Password must be at least 8 characters',
        'newPassword.confirmed': 'Password confirmation failed, please try again',
      },
    })

    // check the parameters arrangement the (database password, input password)
    const passwordVerified = await Hash.verify(auth.user!.password, payload.currentPassword)

    if (!passwordVerified) {
      session.flash(
        'error',
        'Current password could not your current password be verified!, please try again'
      )
      return response.redirect('back')
    }

    auth.user!.password = payload.newPassword

    await auth.user!.save()
    session.flash('notification', 'Password changed successfully!')
    return response.redirect('back')
  }
}
