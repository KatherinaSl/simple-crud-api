import http from 'node:http';
import { userStorage } from './userStorage';
import { ERROR_MSG, STATUS_CODES } from './constants';
import handleRequest from './handleRequest';
import { UserError } from './model';

export const app = () => {
  const server = http.createServer(async (req, res) => {
    try {
      const response = await handleRequest(req, userStorage);
      res.writeHead(response.statusCode, {
        'Content-Type': 'application/json',
      });
      if (response.body) {
        res.end(JSON.stringify(response.body));
      } else if (response.errorMessage) {
        res.end(JSON.stringify(response));
      } else {
        res.end();
      }
    } catch (error) {
      if (error instanceof UserError) {
        res.writeHead(error.getStatusCode(), {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify(error.toHandleResponse()));
      } else {
        res.writeHead(STATUS_CODES.SERVER_ERROR, {
          'Content-Type': 'application/json',
        });
        res.end(
          JSON.stringify({
            message: ERROR_MSG.SERVER_ERROR,
          })
        );
      }
    }
  });

  return server;
};
