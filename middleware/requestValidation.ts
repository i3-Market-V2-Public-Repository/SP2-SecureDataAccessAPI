import { NextFunction, Request, Response } from 'express'
import niv = require('node-input-validator');

export function requestValidation(req: Request, res: Response, next: NextFunction) {

  niv.addCustomMessages(res.locals.reqParams.msg);

  const validator = new niv.Validator(
      res.locals.reqParams.input,
      res.locals.reqParams.rules,
  );
    
  validator.check().then((matched) => {
      if (!matched) {
        res.status(422).send(validator.errors);
      } else {
          next()
      }
    });
}