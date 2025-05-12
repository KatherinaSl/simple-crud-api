import http from 'node:http';
import { InvalidUserError, InvalidUserIdError } from './model';
import { validate } from 'uuid';
import { HTTP_METHODS, PATH } from './constants';

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

export function validateUser(user: string) {
  const obj = JSON.parse(user);
  const areTypesIncorrect =
    typeof obj.username !== 'string' || typeof obj.age !== 'number';
  const areHobbiesInvalid =
    !Array.isArray(obj.hobbies) || !isArrayOfStrings(obj.hobbies);

  if (areTypesIncorrect || areHobbiesInvalid) {
    throw new InvalidUserError();
  }
}

function isArrayOfStrings(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'string')
  );
}

export function getUserId(path: string): string {
  const userId = path.replace(PATH + '/', '');
  if (!validate(userId)) {
    throw new InvalidUserIdError();
  }
  return userId;
}

export function parseUrl(req: http.IncomingMessage): {
  path: string;
  method: string;
} {
  const parsedUrl = new URL(
    `http://${process.env.HOST ?? 'localhost'}${req.url}`
  );
  const path = parsedUrl.pathname;
  const method = req.method?.toUpperCase() ?? HTTP_METHODS.GET;
  return { path, method };
}

export function isBasePath(path: string): boolean {
  return path === PATH || path === PATH + '/';
}

export function isPathWithId(path: string): boolean {
  return path.startsWith(PATH + '/') && !isBasePath(path);
}
