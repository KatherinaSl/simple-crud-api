import { ERROR_MSG, STATUS_CODES } from './constants';

export interface User {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
}

export interface HandlerResponse {
  statusCode: number;
  errorMessage?: string;
  body?: User | User[];
}

export class UserError extends Error {
  private statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
  public getStatusCode() {
    return this.statusCode;
  }

  public toHandleResponse(): HandlerResponse {
    return { statusCode: this.statusCode, errorMessage: this.message };
  }
}

export class UserNotFoundError extends UserError {
  constructor() {
    super(STATUS_CODES.NOT_FOUND, ERROR_MSG.USER_NOT_FOUND);
  }
}

export class InvalidUserError extends UserError {
  constructor() {
    super(STATUS_CODES.BAD_REQUEST, ERROR_MSG.INVALID_BODY);
  }
}

export class InvalidUserIdError extends UserError {
  constructor() {
    super(STATUS_CODES.BAD_REQUEST, ERROR_MSG.INVALID_UUID);
  }
}
