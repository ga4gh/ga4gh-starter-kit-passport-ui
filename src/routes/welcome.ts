import { Request, Response } from 'express'

import {
  defaultConfig,
  RouteCreator,
  RouteRegistrator,
  setSession
} from '../pkg'

export const createWelcomeRoute: RouteCreator =
  (createHelpers) => async (req, res) => {
    res.locals.projectName = 'Welcome to Ory'

    const { sdk } = createHelpers(req)
    const session = req.session

    // Create a logout URL
    const logoutUrl =
      (
        await sdk
          .createSelfServiceLogoutFlowUrlForBrowsers(req.header('cookie'))
          .catch(() => ({ data: { logout_url: '' } }))
      ).data.logout_url || ''

    res.render('welcome', {
      session: session
        ? JSON.stringify(session, null, 2)
        : `No valid Ory Session was found.
Please sign in to receive one.`,
      hasSession: Boolean(session),
      logoutUrl,
      researcherId: session ? session.identity.id : "Ory Session not found",
      researcherFirstName: session ? session.identity.traits.name.first : "Ory Session not found",
      researcherLastName: session ? session.identity.traits.name.first : "Ory Session not found",
      researcherEmail: session ? session.identity.traits.email: "Ory Session not found"
    })
  }

export const registerWelcomeRoute: RouteRegistrator = (
  app,
  createHelpers = defaultConfig,
  route = '/welcome'
) => {
  app.get(route, setSession(createHelpers), createWelcomeRoute(createHelpers))
}
