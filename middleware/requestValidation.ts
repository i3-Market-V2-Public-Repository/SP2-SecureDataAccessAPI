import { NextFunction, Request, Response } from 'express'
import { Validator } from 'node-input-validator';


function batchRequestValidation(req: Request, res: Response, next: NextFunction) {

    const validator = new Validator(
        res.locals.input,
        res.locals.rules,
      );
    
    validator.check().then((matched) => {
        if (!matched) {
          res.status(422).send(validator.errors);
        } else {
            next()
        }
      });
}

export { batchRequestValidation }