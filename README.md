# simple-crud-api

## Simple CRUD API task

> PORT can be configured in .env file, port 4000 is set by default

## Installation

NodeJS required version 22.x.x (22.14.0 or upper) 

```
npm install
```

## Building production application

```
npm run build
```

## Starting application

```
# Dev mode
npm run start:dev
# Production mode
npm run start:prod
```

## Endpoints available

```
GET    http://localhost:4000/api/users
GET    http://localhost:4000/api/users/{uuid}
PUT    http://localhost:4000/api/users/{uuid}
DELETE http://localhost:4000/api/users/{uuid}
POST   http://localhost:4000/api/users
```
