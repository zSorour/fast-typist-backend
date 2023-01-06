import HTTPError from '@errors/HTTPError';
import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

const validate =
  (schema: AnyZodObject, errorMsg: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
    } catch (e: any) {
      const error = new HTTPError(errorMsg, 400, e.errors);
      return res.status(400).json({
        error: {
          message: error.message,
          details: error.details
        }
      });
    }
    next();
  };

export default validate;
