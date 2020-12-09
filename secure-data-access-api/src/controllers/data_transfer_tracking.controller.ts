import { inject, intercept } from '@loopback/core';
import { post, Request, requestBody, RestBindings } from '@loopback/rest';
import { authorize } from '../interceptors/authorize';
import { validate } from '../interceptors/validate';
import { StatusRequest, TrackingRequest } from '../models/requests';
import { BAD_REQUEST, BATCH_TRACKING_RESPONSE, FORBIDDEN, INTERNAL_SERVER_ERROR, STATUS_RESPONSE, STREAM_TRACKING_RESPONSE, UNAUTHORIZED } from './responses';

@intercept(authorize)
@intercept(validate)
export class TransferTrackingController {
  constructor(@inject(RestBindings.Http.REQUEST) private request: Request) {}



  @post('/status', {
    description: "The transfer of data needs to be tracked by consumer once the subscription was confirmed. The consumer wants to know the status of the process meaning that the transfer was: started, interrupted, stopped, resumed. The user of the marketplace need to know if the transfer was successfully completed or the data was corrupted.",
    responses: {
      '200': STATUS_RESPONSE,
      '400': BAD_REQUEST,
      '401': UNAUTHORIZED,
      '403': FORBIDDEN,
      '500': INTERNAL_SERVER_ERROR
    },
  })

  status(
    @requestBody() todo: StatusRequest,
  ): object {

    const headers = this.request.headers;
    console.log(headers)

    const body = this.request.body
    console.log(body)
    return {
        additionalInfo: ''
    };
  }


  @post('/track_stream', {
    description: "Checks the volume of data that was consumed from a stream.",
    responses: {
      '200': STREAM_TRACKING_RESPONSE,
      '400': BAD_REQUEST,
      '401': UNAUTHORIZED,
      '403': FORBIDDEN,
      '500': INTERNAL_SERVER_ERROR
    },
  })

  track_stream(
    @requestBody() todo: TrackingRequest,
  ): object {

    const headers = this.request.headers;
    console.log(headers)

    const body = this.request.body
    console.log(body)
    return {
        additionalInfo: ''
    };
  }


  @post('/track_batch', {
    description: "Checks the volume of data that was consumed in batches.",
    responses: {
      '200': BATCH_TRACKING_RESPONSE,
      '400': BAD_REQUEST,
      '401': UNAUTHORIZED,
      '403': FORBIDDEN,
      '500': INTERNAL_SERVER_ERROR
    },
  })

  track_batch(
    @requestBody() todo: TrackingRequest,
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