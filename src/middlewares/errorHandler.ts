import { NextFunction, Request, Response } from 'express';
import HTTPError from '@errors/HTTPError';
import AppError from '@errors/AppError';

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
