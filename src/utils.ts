import http from 'node:http';
import { User } from './model';
import { validate } from 'uuid';
import { ERROR_MSG, STATUS_CODES } from './constants';

export function getBody(request: http.IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    const bodyParts: Buffer[] = [];
    let body;
    request
      .on('data', (chunk) => {
        bodyParts.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(bodyParts).toString();
        resolve(body);
      });
  });
}

export function isUserBodyValid(body: User) {
  const { username, age, hobbies } = body;
  const isValid = Boolean(username && age && hobbies);
  const isTypeCorrect =
    typeof body.username === 'string' &&
    typeof body.age === 'number' &&
    Array.isArray(body.hobbies) &&
    body.hobbies.every((hobby) => typeof hobby === 'string');

  return isValid && isTypeCorrect;
}

export function invalidUserId(userId: string) {
  if (!validate(userId)) {
    return {
      statusCode: STATUS_CODES.BAD_REQUEST,
      errorMessage: ERROR_MSG.INVALID_UUID,
    };
  }

  if (!userId) {
    return {
      statusCode: STATUS_CODES.NOT_FOUND,
      errorMessage: ERROR_MSG.USER_NOT_FOUND,
    };
  }
}
