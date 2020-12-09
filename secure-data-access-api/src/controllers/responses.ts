import { ResponseObject } from '@loopback/rest';

export const REPORT_RESPONSE: ResponseObject = {
  description: 'TransferReport.',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'Transfer Response',
        properties: {
          report: {type: 'string', description: 'Fully report describing the transfer progress.'}
        },
      },
    },
  },
};

export const STREAM_TRACKING_RESPONSE: ResponseObject = {
  description: 'Volume of data that was consumed untill now.',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'StreamTrackingResponse',
        properties: {
          volume: {type: 'string', description: 'Volume of data that was transferred untill now. ', example: '25MB'}
        },
      },
    },
  },
};

export const BATCH_TRACKING_RESPONSE: ResponseObject = {
  description: 'Percent of data that was consumed untill now.',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'BatchTrackingResponse',
        properties: {
          percent: {type: 'string', description: 'Volume of data that was transferred untill now. ', example: '33%'}
        },
      },
    },
  },
};

export const STATUS_RESPONSE: ResponseObject = {
  description: 'Returns the status of a transfer.',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'StatusResponse',
        properties: {
          status: {type: 'string', description: '', example: 'resumed'}
        },
      },
    },
  },
};

export const CHECK_DATA_RESPONSE: ResponseObject = {
  description: 'Returns whether the data requested by the consumer is available at the provider side.',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'AvailabilityResponse',
        properties: {
          message: {type: 'string', description: 'Information related to data availability.', example: 'Data is not available due to networking issues at provider side.'},
          available: {type: 'boolean', description: 'True/False depending on the data availability', example: 'false'}
        },
      },
    },
  },
};

export const RETRIEVE_DATA_RESPONSE: ResponseObject = {
    description: 'Accepted. The data consumer provided a valid token for authentication. The data is returned to the consumer.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          title: 'DataResponse',
          properties: {
            additionalInfo: {type: 'string', description: 'Information related to data transfer process.', example: 'Transfer status: started. Progress: 0%'},
            transferId: {type: 'string', description: 'Unique identifier of a transfer', example: 'c3e3ae76-39fd-11eb-adc1-0242ac120002'}
          },
        },
      },
    },
  };


export const BAD_REQUEST: ResponseObject = {
    description: 'Occurs when one of the input fields provided in the body is invalid.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          title: 'BadRequest',
          properties: {
            message: {type: 'string', example: 'Data format xxx is not valid.'},
            code: {type: 'string', example: 400},
            logref: {type: 'string', example: 'c06534d4-6f0e-11e8-adc0-fa7ae01bbebc'}
          },
        },
      },
    },
  };

  export const UNAUTHORIZED: ResponseObject = {
    description: 'Occurs when an authentication token was not provided',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          title: 'Unauthorized',
          properties: {
            message: {type: 'string', example: 'An authentication token must be provided in order to get access to data.'},
            code: {type: 'string', example: 401},
            logref: {type: 'string', example: 'c06534d4-6f0e-11e8-adc0-fa7ae01bbebc'}
          },
        },
      },
    },
  };

  export const FORBIDDEN: ResponseObject = {
    description: 'Occurs when the authentication token does not contain the necessary scopes or the token is expired',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          title: 'Forbidden',
          properties: {
            message: {type: 'string', example: 'Authentication token provided is expired.'},
            code: {type: 'string', example: 403},
            logref: {type: 'string', example: 'c06534d4-6f0e-11e8-adc0-fa7ae01bbebc'}
          },
        },
      },
    },
  };

  export const INTERNAL_SERVER_ERROR: ResponseObject = {
    description: 'Unknown exception occured while requesting data.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          title: 'InternalServerError',
          properties: {
            message: {type: 'string', example: 'Something occured while connecting to the data source.'},            
            code: {type: 'string', example: 500},
            logref: {type: 'string', example: 'c06534d4-6f0e-11e8-adc0-fa7ae01bbebc'}
          },
        },
      },
    },
  };