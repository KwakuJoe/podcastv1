import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PasswordResetToken from 'App/Models/PasswordResetToken'
import PasswordResetValidator from 'App/Validators/PasswordResetValidator'
import Event from '@ioc:Adonis/Core/Event'


export default class PasswordResetController {
  // Reset password View
  public async create({ view, params, session, response}: HttpContextContract) {

    try {

      const token = await PasswordResetToken.query()
        .where('token', params.token)
        .preload('user')
        .firstOrFail()
      return view.render('auth/reset-password', {
        token: token.token,
        email: token.user.email,
    })
    } catch (error) {

      session.flash('error', 'Invalid password reset token')

      response.redirect('/forgot-password')
    }

  }

  public async store({ request, session, response, }: HttpContextContract) {

    const validatedData = await request.validate(PasswordResetValidator)


    try {

    const token = await PasswordResetToken.query()
      .where('token', validatedData.token)
      .preload('user')
      .firstOrFail()

    const user = token.user

    user.password = validatedData.password

      await user.save()

      // delete the token
      await token.delete()

      // Event
      Event.emit('passwordReset', user)

      session.flash('notification', 'You have successfully changed your password')
      return response.redirect('back')

    } catch (error) {
      session.flash('error', 'Invalid password reset token, resend link and try again')
      return response.redirect('back')
    }
  }
}
