import http from 'node:http';
import { userStorage } from './userStorage';
import { ERROR_MSG, STATUS_CODES } from './constants';
import handleRequest from './handleRequest';
import { UserError } from './model';

export const app = () => {
  const server = http.createServer(async (req, res) => {
    try {
      const response = await handleRequest(req, res, userStorage);
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
    // try {
    //   response = handleRequest(req)
    //   res.write(...)
    // } catch {
    //   //user not found, bad params ....
    // }

    // const parsedUrl = new URL(
    //   `http://${process.env.HOST ?? 'localhost'}${req.url}`
    // );
    // const path = parsedUrl.pathname;
    // const method = req.method?.toUpperCase();

    //   if (path === '/api/users' && method === 'GET') {
    //     res.writeHead(200, { 'Content-Type': 'application/json' });
    //     res.end(JSON.stringify(userStorage.get()));
    //   } else if (
    //     path.startsWith('/api/users') &&
    //     path.match(UUID_REGEXP) &&
    //     method === 'GET'
    //   ) {
    //     const userId = path.replace('/api/users/', '');
    //     const user = userStorage.getById(userId);
    //     res.writeHead(200, { 'Content-Type': 'application/json' });
    //     res.end(JSON.stringify(user));
    //   } else if (path === '/api/users' && method === 'POST') {
    //     const body: Buffer[] = [];
    //     req
    //       .on('data', (chunk) => {
    //         body.push(chunk);
    //       })
    //       .on('end', () => {
    //         const reqBody = Buffer.concat(body).toString();
    //         const newUser = JSON.parse(reqBody) as User;

    //         res.writeHead(200, { 'Content-Type': 'application/json' });
    //         res.end(JSON.stringify(userStorage.create(newUser)));
    //       });
    //   } else if (
    //     path.startsWith('/api/users') &&
    //     path.match(UUID_REGEXP) &&
    //     method === 'PUT'
    //   ) {
    //     const userId = path.replace('/api/users/', '');
    //     const user = userStorage.getById(userId);
    //     if (user) {
    //       const body: Buffer[] = [];
    //       req
    //         .on('data', (chunk) => {
    //           body.push(chunk);
    //         })
    //         .on('end', () => {
    //           const reqBody = Buffer.concat(body).toString();
    //           const updatedUser = JSON.parse(reqBody) as User;

    //           res.writeHead(200, { 'Content-Type': 'application/json' });
    //           res.end(JSON.stringify(userStorage.update(userId, updatedUser)));
    //         });
    //     }
    //   } else if (
    //     path.startsWith('/api/users') &&
    //     path.match(UUID_REGEXP) &&
    //     method === 'DELETE'
    //   ) {
    //     const userId = path.replace('/api/users/', '');
    //     userStorage.delete(userId);
    //     res.writeHead(204, { 'Content-Type': 'application/json' });
    //     res.end();
    //   } else {
    //     res.writeHead(404, { 'Content-Type': 'application/json' });
    //     res.end(JSON.stringify({ message: 'There is no such endpoint' }));
    // }
  });

  return server;
};
