# Contributing

We love pull requests from everyone. By participating in this project, you
agree to abide by the project's [code of conduct](https://github.com/EarthlingInteractive/full-stack-starter-kit/wiki/code-of-conduct).

## Fork, then clone the repo:

    git clone git@github.com:<your-username>/fssk-node.git;

## Set up your machine:
    
Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env`.
    
    cd fssk-node && docker-compose up
    docker exec -it fssk-node-server npm run migrate && npm run seed

## Make your change

Add tests for your change.

Make sure the tests pass:

    docker exec -it fssk-node-client npm test
    docker exec -it fssk-node-server npm test

Lint your code:

      docker exec -it fssk-node-client npm run lint
      docker exec -it fssk-node-server npm run lint

Push to your fork and [submit a pull request][pr].

[pr]: https://github.com/EarthlingInteractive/fssk-node/compare/

At this point you're waiting on us. We may suggest some changes or improvements or alternatives.

Some things that will increase the chance that your pull request is accepted:

* Write tests.
* Follow our [Project Guideline](https://github.com/EarthlingInteractive/project-guidelines)
* Follow our [style guide][style].
* Write a [good commit message][commit].

[style]: https://github.com/EarthlingInteractive/full-stack-starter-kit/wiki/style
[commit]: http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html
