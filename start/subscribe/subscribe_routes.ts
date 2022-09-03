// subscription

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/', 'SubscriptionController.subscribe').as('subscription.store')
  Route.delete('/:id', 'SubscriptionController.unsubscribe').as('subscription.destroy')
})
  .prefix('subscriptions')
  .namespace('App/Controllers/Http/subscription')
