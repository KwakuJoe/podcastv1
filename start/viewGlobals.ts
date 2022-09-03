import View from "@ioc:Adonis/Core/View";
import Env from "@ioc:Adonis/Core/Env"

View.global('appUrl', (path?: string) => {
  const appUrl = Env.get('APP_URL')

  if (!path || path == '/') {
    return appUrl
  }

  return path.startsWith('/') ? `${appUrl}${path}` : `${appUrl}/${path}`
})
