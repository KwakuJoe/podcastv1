/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

import './subscribe/subscribe_routes'

Route.group(() => {

  Route.get('/','HomeController.index').as('home').middleware('auth')
}).namespace('App/Controllers/Http/home')

//  Auth Controller
Route.group(() => {
  Route.group(() => {
    Route.get('/register', 'AuthController.showRegister').as('register')
    Route.post('/register', 'AuthController.register')

    Route.post('/logout', 'AuthController.logout')

    Route.get('/password/reset', 'PasswordResetController.create')
    Route.post('/password/reset', 'PasswordResetController.store')

    Route.get('/verification/new', 'EmailVerificationController.create').as('verification.new')
    Route.post('/verification', 'EmailVerificationController.store')
    Route.get('/verification/:email', 'EmailVerificationController.verify').as('verification.verify')

    Route.get('/login', 'AuthController.showLogin').as('login')
    Route.post('/login', 'AuthController.login')

    Route.get('/forgot-password', 'PasswordResetRequestController.create')
    Route.post('/forgot-password', 'PasswordResetRequestController.store')

    Route.get('/reset-password/:token', 'PasswordResetController.create').as('reset-password')
    Route.post('/reset-password', 'PasswordResetController.store')
  }).middleware('guest')
}).namespace('App/Controllers/Http/Auth')

// user Controller including the user password reset and account update
Route.group(() => {
  Route.group(() => {
    Route.get('/account', 'UserController.showEditAccount').as('settings.account')
    Route.post('/account', 'UserController.updateAccount')
    Route.get('/password', 'UserController.showChangePassword').as('settings.password')
    Route.post('/password', 'UserController.changePassword')
  }).prefix('/settings').middleware('auth')
   Route.get('/my-podcast', 'UserController.index').as('my-podcast')
   Route.get('/subscriptions', 'UserController.subscriptions').as('subscriptions')

}).namespace('App/Controllers/Http/user').middleware('auth')

// categories
Route.group(() => {
  Route.get('/categories/:slug', 'CategoriesController.show').as('categories.show')
}).namespace('App/Controllers/Http/category').middleware('auth')


//Episodes
Route.group(() => {
  Route.get('/:slug/episodes/create', 'EpisodesController.create').as('episode.create')
  Route.post('/episodes', 'EpisodesController.store').as('episode.store')
  Route.get('/:slug/episode/:id', 'EpisodesController.download').as('episode.download')
}).namespace('App/Controllers/Http/episodes').middleware('auth')



// Podcast Controller
Route.group(() => {
  Route.resource('podcast', 'PodcastController').except(['show', 'index'])
  Route.get('/podcast/:slug', 'PodcastController.show').as('podcast.show')
}).namespace('App/Controllers/Http/podcast').middleware('auth')

//user podcast

