import * as express from 'express'

const openapiRouter = express.Router()

export default async (): Promise<typeof openapiRouter> => {
    
  
    openapiRouter.get('/openapi',
    (req,res) => {
        const openapi = require('../oas/open-api.json')
        res.send(openapi)
    })

    openapiRouter.get('/',
    (req,res) => {
        res.redirect('/api/doc')
    })

    return openapiRouter
}