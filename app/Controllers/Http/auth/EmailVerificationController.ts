import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import ResendVerificationValidator from 'App/Validators/ResendVerificationValidator'
import { DateTime } from 'luxon'
import Event from '@ioc:Adonis/Core/Event'


export default class EmailVerificationsController {

  // Resend Email View
  public async create({ view }: HttpContextContract) {
    return view.render('resend-verification')
  }


  // Resend Email
  public async store({ request, session, response }: HttpContextContract) {

    const validatedData = await request.validate(ResendVerificationValidator)

    const user = await User.findBy('email', validatedData.email)

    if (user?.emailVerifiedAt) {
      session.flash('resend-error', 'Email address has already been verified, proceed to log in')
      return response.redirect('/verification/new')
    }

    // send link
    Event.emit('userRegistered', user!)
          session.flash(
            'notification',
            'Verification link has been successfully sent to your email, kindly follow to verify'
          )
          return response.redirect('/verification/new')

  }


// Send Email while registration
  public async verify({ request, params, session, response }: HttpContextContract) {
    // check the link is valid or expired
    if (!request.hasValidSignature) {
      session.flash('verify-notification', 'Verification link is invalid or has expired')
      return response.redirect('/verification/new')
    }

    const user = await User.findBy('email', params.email)

    if (user?.emailVerifiedAt) {
      session.flash(
        'verify-notification',
        'Email address has already been verified, proceed to log in'
      )
      return response.redirect('/login')
    }

    // assign date to email verified at
    user!.emailVerifiedAt = DateTime.local()

    await user?.save()
    session.flash('notification', 'You have successfully Verified your account, proceed to log in')
    return response.redirect('/login')
  }
}
