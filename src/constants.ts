export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

export const ERROR_MSG = {
  INVALID_ENDPOINT: 'There is no such endpoint',
  SERVER_ERROR: 'Unexpected server side error',
  INVALID_UUID: 'Provided ID is not a valid UUID value',
  USER_NOT_FOUND: 'User not found',
  NO_BODY: 'No body is provided',
  INVALID_BODY: 'User must contain following fields: username, age, hobbies ',
};

export const PATH = '/api/users';
