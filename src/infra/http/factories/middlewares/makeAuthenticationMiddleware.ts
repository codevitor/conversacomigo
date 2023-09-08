import { Middleware } from '@core/logic/Middleware'
import { EnsureAuthenticatedMiddleware } from '@infra/http/middlewares/EnsureAuthenticationMiddleware'

export function makeAuthenticationMiddleware(): Middleware {
  const middleware = new EnsureAuthenticatedMiddleware()
  return middleware
}