import express, { NextFunction, Response, Request } from 'express'
import path from 'path'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

import routes from './routes'
import login from './routes/login'
import logout from './routes/logout'
import consent from './routes/consent'

const app = express()

// view engine setup (view engine maps HTML templates to routes)
app.set('views', path.join(__dirname, '..', '..', 'views/hydra/ejs')) // __dirname: /usr/src/app/lib/hydra
app.set('view engine', 'ejs') // switching view engines (pug -> ejs)

// uncomment after placing your favicon in /public
var favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, '..', '..', 'public', 'hydra', 'favicon.ico')));
app.use('/favicon.ico', express.static('images/favicon.ico'));

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes) // the base page
app.use('/login', login)
app.use('/logout', logout)
app.use('/consent', consent)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new Error('Not Found'))
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err: Error, req: Request, res: Response) => {
    res.status(500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use((err: Error, req: Request, res: Response) => {
  res.status(500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).render('error', {
    message: JSON.stringify(err, null, 2)
  })
})

const listenOn = Number(process.env.PORT || 3000)
app.listen(listenOn, () => {
  console.log(`Listening on http://0.0.0.0:${listenOn}`)
})