import { NextFunction, Request, Response } from 'express'
import { HttpError } from 'express-openapi-validator/dist/framework/types'
import * as Schemas from '../types/openapi'

export function errorMiddleware (err: HttpError, req: Request, res: Response, next: NextFunction): void {
    let error: Schemas.ApiError = {
      name: 'error',
      description: 'this is an error, unfortunately'
    }
    if (err.status === undefined) {
      console.error(err)
      err.status = 500
    } else {
      error = {
        name: err.name,
        description: err.message
      }
    }
    res.status(err.status).json(error)
}
