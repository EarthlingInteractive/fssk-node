# FSSK-Node
> Full Stack Starter Kit, using NodeJS for server.

The Earthling Interactive Full Stack Starter Kit project provides a starting point for a full-stack node application with a rich front-end framework.  It also includes related technologies to make development and deployment easier, such as bundling, testing, and containerization.

## Installing / Getting started

First, clone the project. Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env`

Run the following command:

```
$ docker-compose up -d
```

This spins up a postgres instance,
starts the webpack dev server at `http://localhost:3000`,
and starts the back-end server at `http://localhost:4000`.
The webpack dev server recompiles certain files on the fly and
forwards everything else (such as web service calls) to the back-end server.
e.g. `http://localhost:3000/api/users` will be forwarded to `http://localhost:4000/api/users`.

To initialize the database:

```shell
docker exec -it fssk-node-server npm run migrate
docker exec -it fssk-node-server npm run seed
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
- Git

### Setting up Dev

See Getting Started section for steps.

Once spun up, you can shell into the client or server instances like:

```shell
docker exec -it fssk-node-client bash
```

```shell
docker exec -it fssk-node-server bash
```

### Building

Build client side code:

```shell
cd client/ && npm run build
```

### Deploying / Publishing

The production Dockerfile lives at `deploy/prod.docker` and contains all the instructions required to build a
docker image that will run the application.

There is a GitLab CI file at the project root that contains instructions for deploying via GitLab to Rancher-based environments.
Out of the box, three environments are supported: `test`, `stage`, and `master` (aka production).  Each environment should have a
corresponding branch of the same name in git.  Changes flow from:
```
[feature branch] --> test --> stage --> master
```

To deploy code to an environment:

1. Make sure that you have access to the gitlab remote by registering your public SSH key with your gitlab account
1. Make sure that the gitlab remote has been added to your repo:
   ```bash
   git add remote deploy <your_gitlab_project_url>
   ```
1. Check out the branch for the environment you want to deploy:
   ```bash
   git checkout master
   ```
1. Push that branch to the GitLab remote:
   ```bash
   git push deploy
   ```
1. Check GitLab for the status of the deployment pipeline jobs.

When setting up the GitLab project, make sure to set all of the variables used in the `.gitlab-ci.yml` file in the Environment Variables section of the CI/CD Settings.
The $RANCHER_SERVICE_* environment variables should match the name of the service in Rancher.

#### Example Deployment
There is an example version of the fssk-node project itself running at https://fssk-node.ei-app.com
The rancher URL is https://rancher.earthlinginteractive.com/env/1a5/apps/stacks/1st7/services/1s537/containers?tags=ei-app&which=all and
the associated GitLab project is https://git.ei-platform.com/EarthlingInteractive/StarterKits/fssk-node
Since this starter kit doesn't use the `test` and `stage` environments, only the `master` branch of this repository is configured to deploy on rancher.

#### Testing Production Builds Locally

To test a production build locally, run:

```shell
docker-compose -f docker-compose-prod.yml up -d
```

This command will build the client & server code and spin up the server in a docker instance with http://localhost:4000/ pointing to client's index.html.
The static client-side files are being served using express.js.  This configuration is intended to be deployed on a rancher-based
environment with a CDN in front of it to cache static files.  The CDN mitigates node's potential performance issues when serving static files.
Depending on the scaling needs of your project and the runtime environment, you may want to consider other options for serving the files (e.g., nginx, Amazon S3, etc.)

**Note:** When switching back and forth between the local dev and prod builds, if you see docker errors complaining about the network not being found,
try running the `docker-compose down` command before switching.

## Configuration

Per the best practices in [The Twelve-Factor App](https://12factor.net/), all configuration should be stored in environment variables.
See the .env.example files in client and server directories for examples.  For production deployments, only the environment variables in the server
.env.example file need to be set.

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
Update the line endings of any files that are crlf to lf and try again.

### Windows Watching

In order for file changes to be picked up by the watchers in client side code, be sure to set `CHOKIDAR_USEPOLLING=true`
in the `.env` file.

For the server, update the npm start command in package.json to use legacy polling: `"start": "nodemon -L",`

### Running without docker

You should be able to run the site locally without docker if desired. Make
sure you have node >= v8.9.4. You will need to change the client proxy in
`client/package.json` to point to `http://localhost:4000`, and the `POSTGRES_HOST`
in `server/.env` to `localhost`.

### Working With Submodules

#### Synchronizing Submodules

If you have not cloned the project yet, you can clone the project and simultaneously initialize submodules via the `--recurse-submodules` flag, like so:
```
git clone --recurse-submodules git@github.com:EarthlingInteractive/fssk-node.git
```

When you pull updates, your submodules will not be updated by default. To include submodule updates with your pull, you can again use the `--recurse-submodules` flag, like so:
```
git pull origin master --recurse-submodules
```

You can run the following command in the top-level project directory at any time to initialize all submodules and ensure that they are up-to-date with the currently checked in commit:
```
git submodule update --init
```

#### Updating Submodules

If you would like to update a submodule to a later commit from its parent repository, you have multiple options.

One option for updating a submodule is to simply enter the directory and pull it normally, like so:
```
cd client
git pull origin master
```

Another option is to simply update the submodule to the latest commit from its respective branch, by running the following command in the top-level project directory:
```
git submodule update --remote client
```

You can similarly update ALL submodules to the latest commit on their respective branches, by leaving out the submodule name:
```
git submodule update --remote
```

Be VERY CAREFUL when blindly updating submodules to the latest commit on their branch, as they may contain breaking changes.

Regardless of how your submodules are updated, once it is done you need to check the updates into the parent repository. Navigate to the top-level directory and simply add the repositories normally:
```
git add client
git commit -m 'Update client to latest'
```

#### Stop Treating a Directory as a Submodule

There may be a time where you want to effectively copy the contents of a submodule into your project, no longer treating it as a submodule. The steps to do this are as follows:

1. Remove the submodule info from `.gitmodules`
2. Remove the submodule from your local `.git` directory
3. Delete the entire `.git` directory of the submodule
4. Stop tracking the directory (but do not delete files) and commit
5. Start tracking the directory again and commit

An example of steps 2-5 is as follows:
```
rm -rf .git/modules/client
rm -rf client/.git
git rm --cached client
git commit -m 'Remove client submodule'
git add client
git commit -m 'Add client code back in, no longer as a submodule'
```
