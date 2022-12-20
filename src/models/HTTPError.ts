import { AppError } from '@models/AppError';

export class HTTPError extends AppError {
  public status: number;

  constructor(message: string, status: number = 500, details: string[] = []) {
    super(message, details);
    this.status = status;
  }
}
