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

  export const createPassportRoute: RouteCreator =
    (createHelpers) => async (req, res, next) => {
      res.locals.projectName = 'Passport Token'
  
      const { flow, return_to = '' } = req.query
      const session = req.session
      const helpers = createHelpers(req)
      const { sdk, kratosBrowserUrl } = helpers
      const initFlowUrl = getUrlForFlow(
        kratosBrowserUrl,
        'passport',
        new URLSearchParams({ return_to: return_to.toString() })
      )
      
      ////
      const userVisasResponse = await fetch(process.env.PASSPORT_BROKER_ADMIN_URL + "users/" + session?.identity.id);
      const userVisasJSON = await userVisasResponse.json();

      let userVisas = []
      if(userVisasJSON.passportVisaAssertions) {
        for(let i = 0; i < userVisasJSON.passportVisaAssertions.length; i++) {
          userVisas.push(userVisasJSON.passportVisaAssertions[i].passportVisa)
        }
      }
      ////

      res.render('passport', {
        session: session ? session : `No valid Ory Session was found. Please sign in to receive one.`,
        userVisas: userVisas ? userVisas : "Couldn't get the visas from the passport broker",
      })
    }

  export const getPassportTokenRoute: RouteCreator =
  (createHelpers) => async (req, res, next) => {

    if(!Array.isArray(req.body.requestedVisas)) {
      if(req.body.requestedVisas === undefined) {
        req.body.requestedVisas = []
      } else {
        req.body.requestedVisas = [req.body.requestedVisas]
      }
    }

    console.log("REQ.BODY: ")
    console.log(req.body)

    const response = await fetch(process.env.PASSPORT_BROKER_ADMIN_URL + "mint", {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: { 'Content-Type': 'application/json' }
    });

    // console.log("WHAT WE GET BACK WITH .TEXT: ")
    // const myResponse = await response.text()
    // console.log(myResponse)

    const token = await response.text()
    // console.log(token)
 
    res.render('passport_token', {
      token : token
    })
  }
  
  export const registerPassportRoute: RouteRegistrator = (
    app,
    createHelpers = defaultConfig,
    route = '/passport'
  ) => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.get(
      route,
      setSession(createHelpers),
      requireAuth(createHelpers),
      createPassportRoute(createHelpers)
    )
    app.post(
      route,
      getPassportTokenRoute(createHelpers)
    )
  }