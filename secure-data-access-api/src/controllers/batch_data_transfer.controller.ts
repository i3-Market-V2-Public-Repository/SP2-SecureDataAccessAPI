import { inject, intercept } from '@loopback/core';
import { post, Request, requestBody, RestBindings } from '@loopback/rest';
import { authorize } from '../interceptors/authorize';
import { validate } from '../interceptors/validate';
import { DataRequest } from '../models/requests';
import { BAD_REQUEST, CHECK_DATA_RESPONSE, FORBIDDEN, INTERNAL_SERVER_ERROR, RETRIEVE_DATA_RESPONSE, UNAUTHORIZED } from './responses';


@intercept(authorize)
@intercept(validate)
export class BatchTransferController {
  constructor(@inject(RestBindings.Http.REQUEST) private request: Request) {};

@post('/batch', {
    description: "Requests data from a provider in form of stream.",
    responses: {
      '200': RETRIEVE_DATA_RESPONSE,
      '400': BAD_REQUEST,
      '401': UNAUTHORIZED,
      '403': FORBIDDEN,
      '500': INTERNAL_SERVER_ERROR
    },
  })
  get_batch(
    @requestBody() dr: DataRequest
  ): object {
    return {
        additionalInfo: ''
    };
  }

  
@post('/proxy_batch', {
  description: "Requests data from a provider in form of batches. The data should be intercepted by a proxy that hides sensitive data.",
  responses: {
    '200': RETRIEVE_DATA_RESPONSE,
    '400': BAD_REQUEST,
    '401': UNAUTHORIZED,
    '403': FORBIDDEN,
    '500': INTERNAL_SERVER_ERROR
  },
})
proxy_batch(
  @requestBody() todo: DataRequest
): object {

  return {
      additionalInfo: ''
  };
}

@post('/check_batch', {
    description: "Verifies whether the data is available for consumption.",
    responses: {
      '200': CHECK_DATA_RESPONSE,
      '400': BAD_REQUEST,
      '401': UNAUTHORIZED,
      '403': FORBIDDEN,
      '500': INTERNAL_SERVER_ERROR
    },
  })

  check_stream(
    @requestBody() todo: DataRequest,
  ): object {

    const headers = this.request.headers;
    console.log(headers)

    const body = this.request.body
    console.log(body)
    return {
        additionalInfo: ''
    };
  }
}

