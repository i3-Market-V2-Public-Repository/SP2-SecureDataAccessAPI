'use strict'
import * as express from 'express';
import * as session from 'express-session';
import * as http from 'http';
import * as morgan from 'morgan';
import * as crypto from 'crypto';
import batchRoutesPromise from './routes/batch.router';
import agreementRoutesPromise from './routes/agreement.router';
import dataTransferReportRouterPromise from './routes/dataTransferReport.router';
import oidcAuthRouterPromise from './routes/oidcAuth.router';
import streamAuthRouterPromise from './routes/streamAuth.router';
import streamRouterPromise from './routes/stream.router';
import openapiRouterPromise from './routes/openapi.router';
import config from './config/config';
import passportPromise from './middleware/passport';
import mqttinit from './mqtt/mqttInit';
import { mqttProcess } from './mqtt/mqtt';
import { errorMiddleware } from './middleware/error';
import { initializeDb } from './sqlite/initializeDatabase';
import swaggerUi = require('swagger-ui-express');

const swaggerFile = require('./oas/open-api.json')

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
  app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
  app.use('/', 
  await streamRouterPromise(),
  await oidcAuthRouterPromise(),
  await batchRoutesPromise(),
  await streamAuthRouterPromise(),
  await agreementRoutesPromise(),
  await dataTransferReportRouterPromise(),
  await openapiRouterPromise()
  )
  app.use(errorMiddleware)

  await initializeDb()

  mqttinit.set('client')
  const mqttClient = mqttinit.get('client')
  await mqttProcess(mqttClient)
  
  const server = http.createServer(app);
  const { addr, port } = config.server;
  server.listen(port, addr)

  server.on('listening', function (): void {
    console.log(`Listening on port ${config.server.port}`)
    console.log(`Listening on public ${config.server.publicUri}`)

  })
}
main().catch(err => { throw new Error(err) })

