import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PasswordResetToken from 'App/Models/PasswordResetToken'
import User from 'App/Models/User'
import PasswordResetEmailValidator from 'App/Validators/PasswordResetEmailValidator'
import { string } from '@ioc:Adonis/Core/Helpers'
import Encryption from '@ioc:Adonis/Core/Encryption'
import Event from '@ioc:Adonis/Core/Event'


export default class PasswordResetRequestController {

  public async create({ view }: HttpContextContract) {
    return view.render('auth/forgot-password')
  }

  public async store({ request, session, response }: HttpContextContract) {

    const { email } = await request.validate(PasswordResetEmailValidator)

    const user = await User.findByOrFail('email', email)

    await PasswordResetToken.query().where('user_id', user!.id).delete()

    const { token } = await PasswordResetToken.create({
      userId: user!.id,
      token: Encryption.encrypt(string.generateRandom(32)),
    })

    Event.emit('passwordResetRequested', { user, token })

        session.flash(
          'notification',
          `Password has been sent to your email to ${user.email}, kindly follow to reset your password`
        )
        return response.redirect('back')
  }
}
