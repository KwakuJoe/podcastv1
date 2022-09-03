import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import Route from '@ioc:Adonis/Core/Route'
import Podcast from 'App/Models/Podcast'

export default class NewEpisodeUpload extends BaseMailer {
  // constructor to accept user and token

  constructor(private podcast: Podcast, private subscribedUsers: any[]) {
    super()
  }

  // created url

  private appUrl = Env.get('APP_URL')

  private signedUrl = Route.makeSignedUrl(
    'podcast.show',
    {
      slug: this.podcast.slug,
    },
    { expiresIn: '24h' }
  )

  public prepare(message: MessageContract) {
    this.subscribedUsers.forEach((subscriber) => {
      message
        .subject('New Episode Uploaded')
        .from('admin@example.com')
        .to(subscriber.email)
        .htmlView('auth/email/new_episode', {
          user: subscriber.name,
          signedUrl: this.signedUrl,
          appUrl: this.appUrl,
          podcast: this.podcast,
        })
    })
  }
}
