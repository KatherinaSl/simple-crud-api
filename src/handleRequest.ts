import { ERROR_MSG, HTTP_METHODS, STATUS_CODES } from './constants';
import http from 'node:http';
import { UserStorage } from './userStorage';
import { HandlerResponse, User } from './model';
import {
  getBody,
  getUserId,
  validateUser,
  parseUrl,
  isBasePath,
  isPathWithId,
} from './utils';

const handleRequest = async (
  req: http.IncomingMessage,
  userStorage: UserStorage
): Promise<HandlerResponse> => {
  const { path, method } = parseUrl(req);

  if (isBasePath(path)) {
    switch (method) {
      case HTTP_METHODS.GET:
        return { statusCode: STATUS_CODES.SUCCESS, body: userStorage.get() };
      case HTTP_METHODS.POST:
        return await createUser(req, userStorage);
    }
  }

  if (isPathWithId(path)) {
    const userId = getUserId(path);
    switch (method) {
      case HTTP_METHODS.GET:
        return {
          statusCode: STATUS_CODES.SUCCESS,
          body: userStorage.getById(userId),
        };
      case HTTP_METHODS.PUT:
        return await updateUser(userId, userStorage, req);
      case HTTP_METHODS.DELETE:
        userStorage.delete(userId);
        return { statusCode: STATUS_CODES.NO_CONTENT };
    }
  }

  return {
    statusCode: STATUS_CODES.NOT_FOUND,
    errorMessage: ERROR_MSG.INVALID_ENDPOINT,
  };
};

async function updateUser(
  userId: string,
  userStorage: UserStorage,
  req: http.IncomingMessage
) {
  const body = await getBody(req);
  validateUser(body);
  const updatedUser = JSON.parse(body) as User;
  return {
    statusCode: STATUS_CODES.SUCCESS,
    body: userStorage.update(userId, updatedUser),
  };
}

async function createUser(
  req: http.IncomingMessage,
  userStorage: UserStorage
): Promise<HandlerResponse> {
  const body = await getBody(req);
  validateUser(body);
  const user = JSON.parse(body) as User;
  return { statusCode: STATUS_CODES.CREATED, body: userStorage.create(user) };
}

export default handleRequest;
