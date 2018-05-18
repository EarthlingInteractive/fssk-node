# FSSK-Node
> Full Stack Starter Kit, using NodeJS for server.

The Earthling Interactive Full Stack Starter Kit project provides a starting point for a full-stack node application with a rich front-end framework.  It also includes related technologies to make development and deployment easier, such as bundling, testing, and containerization.

## Installing / Getting started

First, clone the project. Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env`

Run the following command:

```
$ docker-compose up -d
```

This spins up a postgres instance, starts client at `http://localhost:3000` and starts server at `http://localhost:4000`.
Server calls are proxied, so `http://localhost:3000/api/users` will hit `http://localhost:4000/api/users` automagically.

To init the database:

```shell
docker exec -it fssk-server npm run migrate && npm run seed
```

Log in to the todo app with `test@earthlinginteractive.com`, password `test`.

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

- Docker 

### Setting up Dev

See Getting Started section for steps.

Once spun up, you can shell into the client or server instances like:

```shell
docker exec -it fssk-client bash
```

```shell
docker exec -it fssk-server bash
```

### Building

Build client side code:

```shell
cd client/ && npm run build
```

### Deploying / Publishing

```shell
docker-compose -f docker-compose-prod.yml up -d
```

Will build the client code, spin up the server in a docker instance with / pointing to client's index.html.

## Configuration

See the .env.example files in client and server directories.

## Tests

Client and Server code each have their own tests, using Jest. Shell into container and run:

```shell
npm test
```

## Style guide

TBD

## Api Reference

TBD

## Database

Using postgres v9.6. For local development, database runs in docker container. `db` folder contains 
init scripts, and `server/db_migrations` contains additional migrations and seeds.

You can connect to the database with your favorite client at `localhost:5432`!

## Licensing

[MIT License](LICENSE.md)


---

## Tips and Tricks

### Windows Line Endings

Make sure git globally has line endings set to LF.  This needs to be set ***before*** cloning the project.

- For windows: `git config --global core.autocrlf false`
- For linux/mac: `git config --global core.autocrlf input`

If you forget to do this in windows, you make get errors starting docker like `file not found`. 
Update the line endings of any files that are crlf to lf and try again

### Running without docker

You should be able to run the site locally without docker if desired. Make 
sure you have node >= v8.9.4. You will need to change the client proxy in
`client/package.json` to point to `http://localhost:4000`, and the `POSTGRES_HOST` 
in `server/.env` to `localhost`.
