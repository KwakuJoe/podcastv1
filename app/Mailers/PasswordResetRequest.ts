import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
// import Route from '@ioc:Adonis/Core/Route'



export default class PasswordResetRequest extends BaseMailer {
  // constructor to accept user and token

  constructor(private user: User, private token: string) {
    super()
  }

  // created url

  private appUrl = Env.get('APP_URL')


  public prepare(message: MessageContract) {
    message
      .subject('Reset your password')
      .from('admin@example.com')
      .to(this.user.email)
      .htmlView('auth/email/password-reset-request', {
        user: this.user,
        token: this.token,
        // signedUrl: this.signedUrl,
        appUrl: this.appUrl,
      })
  }
}

