import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'


export default class PasswordReset extends BaseMailer {
  // constructor to accept user and token

  constructor(private user: User) {
    super()
  }

  // created url

  private appUrl = Env.get('APP_URL')

  public prepare(message: MessageContract) {
    message
      .subject('Your password has been successfully changed')
      .from('admin@example.com')
      .to(this.user.email)
      .htmlView('auth/email/password-reset', {
        user: this.user,
        // signedUrl: this.signedUrl,
        appUrl: this.appUrl,
      })
  }
}
