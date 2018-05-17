# Contributing

We love pull requests from everyone. By participating in this project, you
agree to abide by the project's [code of conduct](https://github.com/EarthlingInteractive/full-stack-starter-kit/wiki/code-of-conduct).

Fork, then clone the repo:

    git clone git@github.com:<your-username>/full-stack-starter-kit.git;

Set up your machine:

    cd full-stack-starter-kit && docker-compose up;

Make sure the tests pass:

    docker exec -it client npm test;
    docker exec -it server cd server && ./vendor/bin/phpunit

Make your change. Add tests for your change. Make the tests pass.

Push to your fork and [submit a pull request][pr].

[pr]: https://github.com/EarthlingInteractive/full-stack-starter-kit/compare/

At this point you're waiting on us. We may suggest some changes or improvements or alternatives.

Some things that will increase the chance that your pull request is accepted:

* Write tests.
* Follow our [style guide][style].
* Write a [good commit message][commit].

[style]: https://github.com/EarthlingInteractive/full-stack-starter-kit/wiki/style
[commit]: http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html
