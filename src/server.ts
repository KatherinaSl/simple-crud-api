import http from 'node:http';
import UserStorage from './userStorage';
import { User } from './model';

const UUID_REGEXP =
  /[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

const userStorage = new UserStorage();

export const app = () => {
  const server = http.createServer((req, res) => {
    const parsedUrl = new URL(
      `http://${process.env.HOST ?? 'localhost'}${req.url}`
    );
    const path = parsedUrl.pathname;
    const method = req.method?.toUpperCase();

    if (path === '/api/users' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(userStorage.get()));
    } else if (
      path.startsWith('/api/users') &&
      path.match(UUID_REGEXP) &&
      method === 'GET'
    ) {
      const userId = path.replace('/api/users/', '');
      const user = userStorage.getById(userId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else if (path === '/api/users' && method === 'POST') {
      const body: Buffer[] = [];
      req
        .on('data', (chunk) => {
          body.push(chunk);
        })
        .on('end', () => {
          const reqBody = Buffer.concat(body).toString();
          const newUser = JSON.parse(reqBody) as User;

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(userStorage.create(newUser)));
        });
    } else if (
      path.startsWith('/api/users') &&
      path.match(UUID_REGEXP) &&
      method === 'PUT'
    ) {
      console.log('PUT');
      const userId = path.replace('/api/users/', '');
      const user = userStorage.getById(userId);
      if (user) {
        const body: Buffer[] = [];
        req
          .on('data', (chunk) => {
            body.push(chunk);
          })
          .on('end', () => {
            const reqBody = Buffer.concat(body).toString();
            const updatedUser = JSON.parse(reqBody) as User;

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(userStorage.update(userId, updatedUser)));
          });
      }
    } else if (
      path.startsWith('/api/users') &&
      path.match(UUID_REGEXP) &&
      method === 'DELETE'
    ) {
      const userId = path.replace('/api/users/', '');
      userStorage.delete(userId);
      res.writeHead(204, { 'Content-Type': 'application/json' });
      res.end();
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'There is no such endpoint' }));
    }
  });

  return server;
};
