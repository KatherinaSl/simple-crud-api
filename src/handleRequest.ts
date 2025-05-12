import {
  ERROR_MSG,
  HTTP_METHODS,
  PATH,
  STATUS_CODES,
  UUID_REGEXP,
} from './constants';
import http from 'node:http';
import { UserStorage } from './userStorage';
import { HandlerResponse, User } from './model';
import { getBody, invalidUserId, isUserBodyValid } from './utils';

const handleRequest = async (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
  userStorage: UserStorage
): Promise<HandlerResponse> => {
  const parsedUrl = new URL(
    `http://${process.env.HOST ?? 'localhost'}${req.url}`
  );
  const path = parsedUrl.pathname;
  const method = req.method?.toUpperCase();
  if (path === PATH && method === HTTP_METHODS.GET) {
    return { statusCode: STATUS_CODES.SUCCESS, body: userStorage.get() };
    // res.writeHead(STATUS_CODES.SUCCESS, { 'Content-Type': 'application/json' });
    // res.end(JSON.stringify(userStorage.get()));
  } else if (
    path.startsWith(PATH) &&
    path.match(UUID_REGEXP) &&
    method === HTTP_METHODS.GET
  ) {
    // getUser(path, userStorage, res);
    const userId = path.replace('/api/users/', '');
    invalidUserId(userId);
    // if (!validate(userId)) {
    //   return {
    //     statusCode: STATUS_CODES.BAD_REQUEST,
    //     errorMessage: ERROR_MSG.INVALID_UUID,
    //   };
    // }

    // if (!userId) {
    //   return {
    //     statusCode: STATUS_CODES.NOT_FOUND,
    //     errorMessage: ERROR_MSG.USER_NOT_FOUND,
    //   };
    // }

    return {
      statusCode: STATUS_CODES.SUCCESS,
      body: userStorage.getById(userId),
    };
  } else if (path === PATH && method === HTTP_METHODS.POST) {
    return await createUser(req, userStorage);
  } else if (
    path.startsWith(PATH) &&
    path.match(UUID_REGEXP) &&
    method === HTTP_METHODS.PUT
  ) {
    return await updateUser(path, userStorage, req);
    // return {
    //   statusCode: STATUS_CODES.SUCCESS,
    //   body: await updateUser(path, userStorage, req),
    // };
  } else if (
    path.startsWith(PATH) &&
    path.match(UUID_REGEXP) &&
    method === HTTP_METHODS.DELETE
  ) {
    const userId = path.replace('/api/users/', '');
    userStorage.delete(userId);
    invalidUserId(userId);
    // if (!validate(userId)) {
    //   return {
    //     statusCode: STATUS_CODES.BAD_REQUEST,
    //     errorMessage: ERROR_MSG.INVALID_UUID,
    //   };
    // }

    // if (!userId) {
    //   return {
    //     statusCode: STATUS_CODES.NOT_FOUND,
    //     errorMessage: ERROR_MSG.USER_NOT_FOUND,
    //   };
    // }

    return { statusCode: STATUS_CODES.NO_CONTENT };
    // deleteUser(path, userStorage, res);
  } else {
    return {
      statusCode: STATUS_CODES.NOT_FOUND,
      errorMessage: ERROR_MSG.INVALID_ENDPOINT,
    };
    // res.writeHead(STATUS_CODES.NOT_FOUND, {
    //   'Content-Type': 'application/json',
    // });
    // res.end(JSON.stringify({ message: ERROR_MSG.INVALID_ENDPOINT }));
  }
};

// function deleteUser(
//   path: string,
//   userStorage: UserStorage,
//   res: http.ServerResponse<http.IncomingMessage>
// ) {
//   const userId = path.replace(PATH, '');
//   userStorage.delete(userId);
//   res.writeHead(STATUS_CODES.NO_CONTENT, {
//     'Content-Type': 'application/json',
//   });
//   res.end();
// }

async function updateUser(
  path: string,
  userStorage: UserStorage,
  req: http.IncomingMessage
) {
  const userId = path.replace('/api/users/', '');
  const body = await getBody(req);
  const updatedUser = JSON.parse(body) as User;
  invalidUserId(userId);
  // if (!validate(userId)) {
  //   return {
  //     statusCode: STATUS_CODES.BAD_REQUEST,
  //     errorMessage: ERROR_MSG.INVALID_UUID,
  //   };
  // }

  // if (!userId) {
  //   return {
  //     statusCode: STATUS_CODES.NOT_FOUND,
  //     errorMessage: ERROR_MSG.USER_NOT_FOUND,
  //   };
  // }

  // return userStorage.update(userId, updatedUser);
  return {
    statusCode: STATUS_CODES.SUCCESS,
    body: userStorage.update(userId, updatedUser),
  };
}

//   const userId = path.replace(PATH, '');
//   const user = userStorage.getById(userId);
//   if (user) {
//     const body: Buffer[] = [];
//     req
//       .on('data', (chunk) => {
//         body.push(chunk);
//       })
//       .on('end', () => {
//         const reqBody = Buffer.concat(body).toString();
//         const updatedUser = JSON.parse(reqBody) as User;

//         res.writeHead(STATUS_CODES.SUCCESS, {
//           'Content-Type': 'application/json',
//         });
//         res.end(JSON.stringify(userStorage.update(userId, updatedUser)));
//       });

// if (userId !== user.id) {
//   res.writeHead(STATUS_CODES.NOT_FOUND, {
//     'Content-Type': 'application/json',
//   });
//   res.end(
//     JSON.stringify({
//       message: ERROR_MSG.INVALID_UUID,
//     })
//   );
// }
// };

async function createUser(
  req: http.IncomingMessage,
  userStorage: UserStorage
): Promise<HandlerResponse> {
  const body = await getBody(req);
  const user = JSON.parse(body) as User;

  if (!body) {
    return {
      statusCode: STATUS_CODES.BAD_REQUEST,
      errorMessage: ERROR_MSG.NO_BODY,
    };
  }

  if (!isUserBodyValid(user)) {
    return {
      statusCode: STATUS_CODES.BAD_REQUEST,
      errorMessage: ERROR_MSG.INVALID_BODY,
    };
  }

  return { statusCode: STATUS_CODES.CREATED, body: userStorage.create(user) };

  //   const body: Buffer[] = [];
  //   req
  //     .on('data', (chunk) => {
  //       body.push(chunk);
  //     })
  //     .on('end', () => {
  //       const reqBody = Buffer.concat(body).toString();
  //       const newUser = JSON.parse(reqBody) as User;

  //       res.writeHead(STATUS_CODES.CREATED, {
  //         'Content-Type': 'application/json',
  //       });
  //       res.end(JSON.stringify(userStorage.create(newUser)));
  //     });
}

// function getUser(
//   path: string,
//   userStorage: UserStorage,
//   res: http.ServerResponse<http.IncomingMessage>
// ) {
//   const userId = path.replace('/api/users/', '');
//   const user = userStorage.getById(userId);

//   res.writeHead(user ? STATUS_CODES.SUCCESS : STATUS_CODES.NOT_FOUND, {
//     'Content-Type': 'application/json',
//   });
//   res.end(JSON.stringify(user ? user : { message: ERROR_MSG.USER_NOT_FOUND }));
// }

export default handleRequest;
