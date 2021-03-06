<h1 align="center">lumino-tests</h1>

<h2 style="display: inline-block">Table of Contents</h2>
<ol>
  <li><a href="#about">About</a>
    <ul>
      <li><a href="#how-it-works">How it Works</a></li>
    </ul>
  </li>
  <li>
    <a href="#getting-started">Getting Started</a>
    <ul>
      <li><a href="#prerequisites">Prerequisites</a>
        <ul>
          <li><a href="#nodejs">NodeJS</a></li>
          <li><a href="#docker">Docker</a></li>
        </ul>
      </li>
      <li><a href="#installation">Installation</a></li>
    </ul>
  </li>
  <li><a href="#usage">Usage</a>
    <ul>
      <li><a href="#test-suite">Test Suite</a>
        <ul>
          <li><a href="#individual-tests">Individual Tests</a></li>
        </ul>
      </li>
      <li><a href="#new-tests">New Tests</a>
      <li><a href="#rebuild-docker-images">Rebuild Docker Images</a>
    </ul>
  </li>
  <li><a href="#external-links">External Links</a></li>
</ol>

## About

The purpose of the `lumino-tests` project is to provide tools which can run arbitrarily complex automated tests. These aim to serve as complements to the RIF Lumino unit tests, for robustness purposes.

### How it Works

The project is written chiefly in [TypeScript](https://www.typescriptlang.org/) and uses [Jest](https://jestjs.io/) as its testing framework.

Under the hood it makes use of [Docker](https://www.docker.com/) and [Testcontainers](https://github.com/testcontainers/testcontainers-node), as well as the [Lumino SDK](https://github.com/rsksmart/lumino-sdk), in order to boot up testing scenarios and carry out actions in them.

## Getting Started

Please note that all instructions are written for Ubuntu.

## Prerequisites

The following prerequisites and dependencies must be installed manually beforehand.

### NodeJS

NodeJS should be included with your Ubuntu distribution. `node v14.x` with `npm 7.x` should be more than enough. You can check these by executing:

```bash
node -v
npm -v
```

The use of [`nvm`](https://github.com/nvm-sh/nvm) is **recommended**.

If you have any doubts please check the official documentation here:

- [Node.js](https://nodejs.org/en/)
- [npm | get npm](https://www.npmjs.com/get-npm)
- [nvm-sh/nvm: Node Version Manager](https://github.com/nvm-sh/nvm)

### Docker

To install Docker please follow the official instructions at the [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu) page. We recommend the _Install using the repository_ method.

**Make sure** to also follow the steps outlined in the first section of the [Post-installation steps for Linux](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user) page in order to manage Docker as a non-root user. The rest of the sections on said page are not necessary.

## Installation

Clone this repo through your favorite means, e.g.:

```
git clone https://github.com/rsksmart/lumino-tests.git
```

Run `npm i` to install all the required dependencies. 
This will likely take more than a couple of minutes and will need around 6 GB of disk space.

## Usage

### Test Suite

To run the entire test suite, execute the following command at the root directory:

```bash
npm run test
```

Please be aware that running the whole test suite may take a while.

At end of the execution you should see an output similar this one:

```
-------------------------------------|---------|----------|---------|---------|---------------------------
File                                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------------------|---------|----------|---------|---------|---------------------------
All files                            |   88.71 |    61.62 |    89.8 |   89.22 |
 lumino-tests                        |     100 |      100 |     100 |     100 |
  jest-log.config.ts                 |     100 |      100 |     100 |     100 |
 lumino-tests/src                    |     100 |      100 |     100 |     100 |
  constants.ts                       |     100 |      100 |     100 |     100 |
  index.ts                           |     100 |      100 |     100 |     100 |
 lumino-tests/src/channel-manager    |     100 |       80 |     100 |     100 |
  index.ts                           |     100 |       80 |     100 |     100 | 21,27
 lumino-tests/src/container-manager  |   81.32 |     43.9 |   66.67 |   81.82 |
  index.ts                           |   81.32 |     43.9 |   66.67 |   81.82 | 41-49,53,67-76,99,107-108
 lumino-tests/src/environment-loader |   88.24 |    76.19 |     100 |   92.86 |
  index.ts                           |   88.24 |    76.19 |     100 |   92.86 | 26-27,31
 lumino-tests/src/lumino-client      |     100 |      100 |     100 |     100 |
  index.ts                           |     100 |      100 |     100 |     100 |
 lumino-tests/src/types              |     100 |    81.82 |     100 |     100 |
  lumino-test-environment.ts         |     100 |      100 |     100 |     100 |
  wait.ts                            |     100 |       80 |     100 |     100 | 4
 lumino-tests/src/util               |      75 |       50 |   83.33 |   73.68 |
  token.ts                           |      75 |       50 |   83.33 |   73.68 | 10-12,22,34-36
 lumino-tests/test/utils             |     100 |       50 |     100 |     100 |
  index.ts                           |     100 |       50 |     100 |     100 | 2
-------------------------------------|---------|----------|---------|---------|---------------------------

Test Suites: 3 passed, 3 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        559.714 s, estimated 577 s
Ran all test suites.
```

#### Individual Tests

Tests can be run individually if needed. A complete list of available test cases can be found in [the `test/cases` directory](./test/cases).

If, for example, you want to run the specific `channels.test.ts` test, execute:

```bash
npm run test channels
```

and so on.

### New Tests

If you want to write new tests, you can take any of the `*.test.ts` files (located in [the `test/cases` directory](./test/cases)) as a starting point.

You may need to modify the logic for the manager classes located in the [`src` directory](./src), depending on the complexity of the test case you want to write.

Be sure to also check out the existing [topologies](./topologies), as they might come in handy.

## External Links

- [RIF Lumino Network](https://github.com/rsksmart/lumino)
- [Lumino JavaScript SDK](https://github.com/rsksmart/lumino-sdk)
