import { inject, intercept } from '@loopback/core';
import { post, Request, requestBody, RestBindings } from '@loopback/rest';
import { authorize } from '../interceptors/authorize';
import { validate } from '../interceptors/validate';
import { StatusRequest } from '../models/requests';
import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, STATUS_RESPONSE, UNAUTHORIZED } from './responses';

@intercept(authorize)
@intercept(validate)
export class TransferMonitorController {
  constructor(@inject(RestBindings.Http.REQUEST) private request: Request) {}



  @post('/report', {
    description: "The user of the marketplace wants to be informed about the data transferred between provider or data space and consumer. The marketplace displays a detailed report offering information about how much data was transferred, when the data transfer was initiated and when it was completed so that the consumer knows that the data was received and can have an overview of the costs.",
    responses: {
      '200': STATUS_RESPONSE,
      '400': BAD_REQUEST,
      '401': UNAUTHORIZED,
      '403': FORBIDDEN,
      '500': INTERNAL_SERVER_ERROR
    },
  })

  report(
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
}