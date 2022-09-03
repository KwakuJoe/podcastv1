import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'
import Event from '@ioc:Adonis/Core/Event'
import LoginValidator from 'App/Validators/LoginValidator'
import Hash from '@ioc:Adonis/Core/Hash'

export default class AuthController {
  // render view
  public async showRegister({ view }: HttpContextContract) {
    return view.render('auth/signup')
  }

  public async showLogin({ view }: HttpContextContract) {
    return view.render('auth/login')
  }

  // register function

  public async register({ request, response, auth, session }: HttpContextContract) {
    const validatedData = await request.validate(RegisterValidator)

    const user = await User.create(validatedData)

    // This will handle the email sender incASE ADD AWAIT
    Event.emit('userRegistered', user)

    await auth.login(user)

    session.flash(
      'notification',
      `You have successfully register an account, A verification link has been sent to ${user.email}, kindly follow the link to verify your email address`
    )

    return response.redirect('/')
  }

  // login
  public async login({ request, response, session, auth }: HttpContextContract) {
    const { email, password, remember } = await request.validate(LoginValidator)

    // const remember = request.input('remember')

    try {
      const user = await User.query().where('email', email).firstOrFail()

      if (user) {
        if (!user.emailVerifiedAt) {
          session.flash(
            'notification',
            'Kindly verify your email address, If you did not receive a link, use the resend link below'
          )
          return response.redirect('back')
        }

        const passwordVerified = await Hash.verify(user.password, password)

        if (!passwordVerified) {
          session.flash('notification', 'We could not verify your credentials, please try again!')
          return response.redirect('back')
        }

        if (passwordVerified) {
          auth.login(user, remember)
          session.flash('notification', 'Welcome back, you are now signed in')

          const intendedUrl = session.get('intended_url', false)

          if (intendedUrl) {
            const redirectToIntendedUrl = response.redirect(intendedUrl)

            session.forget('intended_url')

            return redirectToIntendedUrl
          }

          return response.redirect('/')
        }
      }
    } catch (error) {
      session.flash('notification', 'We could not verify your credentials, please try again!')
      return response.redirect('back')
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    response.redirect('/')
  }
}
