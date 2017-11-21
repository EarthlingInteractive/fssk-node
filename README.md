# FSSK
> Full Stack Starter Kit Playground

Messing around with different technologies 

## Installing / Getting started

Run the following:

```
$ cp server/.env.example server/.env
$ cp client/.env.example client/.env
$ docker-compose -f docker-compose.yml up -d
$ cd server && npm install and npm start
$ npm run migrate
$ npm run seed
$ cd ../client && npm install && npm start
```

This spins up a postgres instance, starts client at `http://localhost:3000` and starts server at `http://localhost:4000`.
Server calls are proxied, so `http://localhost:3000/api/users` will hit `http://localhost:4000/api/users` automagically.

## Developing

### Built With

The current technologies used by fssk are as follows:

| Type | Selected Technology | Reasoning |
| ---- | ------------------- | --------- |
| Transpiler | [TypeScript](https://www.typescriptlang.org/) | Static types make for code that is less buggy and easier to reason about.  A basic TypeScript cheatsheet can be found [here](https://www.sitepen.com/blog/2013/12/31/typescript-cheat-sheet/) and more extensive documentation [here](https://www.typescriptlang.org/docs/tutorial.html) and [here](https://www.sitepen.com/blog/2013/12/31/definitive-guide-to-typescript/) |
| View Library | [React](https://facebook.github.io/react/) | Component-based views that encourage single-directional data flow |
| Client-side State Management | [MobX](https://github.com/mobxjs/mobx) | Simpler than Redux and requires less boilerplate |
| Backend Server | [Express](https://expressjs.com/en/4x/api.html) | Well documented and widely supported web framework |
| API Protocol | REST | A familiar paradigm to most developers |
| Data Mapping Framework | [bookshelf.js](http://bookshelfjs.org/) | An easier to use ORM framework than Sequelize, based on [Knex.js](http://knexjs.org/) |
| Database Migrations | [Knex.js Migrations](http://knexjs.org/#Migrations) | Provided by knex.js, so no additional dependencies |
| Data Store | [PostgreSQL](https://www.postgresql.org/) | Open source, rock solid, industry standard |
| Package Manager | [npm](https://www.npmjs.com/) | The battle-tested choice for node development |
| Containerization | [Docker](https://www.docker.com/) | Containers make deployment easy |
| Testing Framework | [Jest](https://facebook.github.io/jest/) | Complete testing package with an intuitive syntax |
| Linter | [tslint](https://github.com/palantir/tslint) | Keeps your TypeScript code consistent |

### Prerequisites

- Docker (optional, for postgres instance)
- NodeJS >= 8.9.0

### Setting up Dev

See Getting Started section for steps. If you don't want to use Docker, set up your own postgres instance
and update the server/.env file to point to it.

### Building

Build client side code:

```shell
cd server/ && npm run build
```

A production Docker build is coming soon.

### Deploying / Publishing

Not there yet, but eventually:

```shell
docker-compose -f docker-compose-prod.yml up
```

Will build the client code, spin up the server in a docker instance with / pointing to client's index.html.

## Configuration

See the .env.example files in client and server directories.

## Tests

Client and Server code each have their own tests, using Jest.

```shell
cd client && npm test
```

and 

```shell
cd server && npm test
```

## Style guide

TBD

## Api Reference

TBD

## Database

Using postgres v9.6. For local development, database runs in docker container. `db` folder contains 
init scripts, and `server/db_migrations` contains additional migrations and seeds.

## Licensing

[MIT License](LICENSE.md)
