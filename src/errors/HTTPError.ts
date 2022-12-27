import AppError from '@errors/AppError';

class HTTPError extends AppError {
  public status: number;

  constructor(message: string, status: number = 500, details: string[] = []) {
    super(message, details);
    this.status = status;
  }
}

export default HTTPError;
