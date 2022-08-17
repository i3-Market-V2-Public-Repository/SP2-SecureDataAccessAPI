'use strict'
import * as express from 'express'
import * as session from 'express-session'
import * as http from 'http'
import * as morgan from 'morgan'
import getRoutesPromise from './routes/get.router'
import postRoutesPromise from './routes/post.router'
import nrpRoutesPromise from './routes/nrp.router'
import * as crypto from 'crypto'
import config from './config/config'
import { errorMiddleware } from './middleware/error'

const main = async function (): Promise<void> {
  const app = express()
  app.use(session({
    secret: crypto.randomBytes(32).toString('base64'),
    resave: false,
    saveUninitialized: false
  }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(morgan('dev'))
  app.use('/get', await getRoutesPromise())
  app.use('/name', await postRoutesPromise())
  app.use('/', await nrpRoutesPromise())
  app.use(errorMiddleware)

  const server = http.createServer(app)
  const { addr, port } = config.server
  server.listen(port, addr)

  server.on('listening', function (): void {
    console.log(`Listening on http://localhost:${config.server.port}`)
    console.log(`Listening on public ${config.server.publicUri}`)

  })
}
main().catch(err => { throw new Error(err) })

