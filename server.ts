'use strict'
import * as express from 'express'
import * as session from 'express-session'
import * as http from 'http'
import * as morgan from 'morgan'
import * as crypto from 'crypto'
import batchRoutesPromise from './routes/batch.router'
import agreementRoutesPromise from './routes/agreement.router'
import dataTransferReportRouterPromise from './routes/dataTransferReport.router'
import authRouterPromise from './routes/auth.routes'
import config from './config/config'
import passportPromise from './middleware/passport'
import { errorMiddleware } from './middleware/error'
import { initializeDb } from './sqlite/initializeDatabase'


const main = async function (): Promise<void> {

  const app = express();
  const passport = await passportPromise()

  app.use(session({
    secret: crypto.randomBytes(32).toString('base64'),
    resave: false,
    saveUninitialized: false
  }))

  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(morgan('dev'))
  app.use(passport.initialize())
  app.use('/', await authRouterPromise())
  app.use('/batch', await batchRoutesPromise())
  app.use('/agreement', await agreementRoutesPromise())
  app.use('/report', await dataTransferReportRouterPromise())
  app.use(errorMiddleware)

  await initializeDb()

  const server = http.createServer(app);
  const { addr, port } = config.server;
  server.listen(port, addr)

  server.on('listening', function (): void {
    console.log(`Listening on http://localhost:${config.server.port}`)
    console.log(`Listening on public ${config.server.publicUri}`)

  })
}
main().catch(err => { throw new Error(err) })

