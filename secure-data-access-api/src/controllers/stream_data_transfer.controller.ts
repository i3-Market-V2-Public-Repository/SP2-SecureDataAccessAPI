import { inject, intercept } from '@loopback/core';
import { post, Request, requestBody, RestBindings } from '@loopback/rest';
import { authorize } from '../interceptors/authorize';
import { validate } from '../interceptors/validate';
import { DataRequest } from '../models/requests';
import { BAD_REQUEST, CHECK_DATA_RESPONSE, FORBIDDEN, INTERNAL_SERVER_ERROR, RETRIEVE_DATA_RESPONSE, UNAUTHORIZED } from './responses';

@intercept(authorize)
@intercept(validate)
export class StreamTransferController {
  constructor(@inject(RestBindings.Http.REQUEST) private request: Request) {}

  @post('/stream', {
    description: "Requests data from a provider in form of stream.",
    responses: {
      '200': RETRIEVE_DATA_RESPONSE,
      '400': BAD_REQUEST,
      '401': UNAUTHORIZED,
      '403': FORBIDDEN,
      '500': INTERNAL_SERVER_ERROR
    },
  })

  stream(
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

  @post('/proxy_stream', {
    description: "Requests data from a provider in form of stream. The data should be intercepted by a proxy that hides sensitive data.",
    responses: {
      '200': RETRIEVE_DATA_RESPONSE,
      '400': BAD_REQUEST,
      '401': UNAUTHORIZED,
      '403': FORBIDDEN,
      '500': INTERNAL_SERVER_ERROR
    },
  })

  proxy_stream(
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

  @post('/check_stream', {
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
    @requestBody() todo: DataRequest
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