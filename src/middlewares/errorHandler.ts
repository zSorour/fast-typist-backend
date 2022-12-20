import { AppError } from '@models/AppError';
import { HTTPError } from '@models/HTTPError';
import { NextFunction, Request, Response } from 'express';

const handleError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`\n\n${err.stack}\n\n`);

  let error: HTTPError;
  if (err instanceof AppError) {
    error = new HTTPError(err.message, res.statusCode, err.details);
  } else {
    error = new HTTPError('Oh no! We are facing an unexpected error!', 500);
  }

  res.status(error.status).json({
    error: {
      message: error.message,
      details: error.details
    }
  });
};

export default handleError;
