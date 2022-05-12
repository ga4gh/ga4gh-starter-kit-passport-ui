import fetch from 'node-fetch'
import express, { Request, Response, NextFunction } from 'express';
import { Session } from 'inspector'
import {
    defaultConfig,
    getUrlForFlow,
    isQuerySet,
    logger,
    redirectOnSoftError,
    requireAuth,
    RouteCreator,
    RouteRegistrator,
    setSession
  } from '../pkg'

  export const createVisasRoute: RouteCreator =
    (createHelpers) => async (req, res, next) => {
      res.locals.projectName = 'All Visas'
  
      const { flow, return_to = '' } = req.query
      const session = req.session
      const helpers = createHelpers(req)
      const { sdk, kratosBrowserUrl } = helpers
      const initFlowUrl = getUrlForFlow(
        kratosBrowserUrl,
        'visas',
        new URLSearchParams({ return_to: return_to.toString() })
      )
      
      ////
      const visasResponse = await fetch(process.env.PASSPORT_BROKER_ADMIN_URL + "visas");
      const visas = await visasResponse.json();
      ////

      res.render('visas', {
        session: session ? session : `No valid Ory Session was found. Please sign in to receive one.`,
        visas: visas ? visas : "Couldn't get the visas from the passport broker",
      })
    }
  
  export const registerVisasRoute: RouteRegistrator = (
    app,
    createHelpers = defaultConfig,
    route = '/visas'
  ) => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.get(
      route,
      setSession(createHelpers),
      requireAuth(createHelpers),
      createVisasRoute(createHelpers)
    )
  }