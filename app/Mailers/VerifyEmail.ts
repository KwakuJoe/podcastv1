import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import Route from '@ioc:Adonis/Core/Route'
import Env from '@ioc:Adonis/Core/Env'




export default class VerifyEmail extends BaseMailer {
  // creating a constructor to  accept user info
  constructor(private user: User) {
    super()
  }

  // creating signURl
  private appUrl = Env.get('APP_URL')

  private signedUrl = Route.makeSignedUrl(
    'verification.verify',
    {
      email: this.user.email,
    },
    { expiresIn: '24h' }
  )

  // send email
  public prepare(message: MessageContract) {
    message
      .subject('Verify your email address')
      .from('admin@example.com')
      .to(this.user.email)
      .htmlView('auth/email/verify-email', {
        user: this.user,
        signedUrl: this.signedUrl,
        appUrl: this.appUrl,
      })
  }
}
