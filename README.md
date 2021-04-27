## About

The purpose of the `lumino-tests` project is to provide tools which can run arbitrarily complex automated tests and serve as complements to the RIF Lumino unit tests, for robustness purposes.

### How it works

The project is written in [TypeScript](https://www.typescriptlang.org/) and uses [Jest](https://jestjs.io/) as its testing framework.

Under the hood, it makes use of both [Docker](https://www.docker.com/) as well as the [Lumino SDK]() in order to set up the testing scenarios and carry out actions in them.

## Getting started

Please note that all instructions are written for Ubuntu.

### Prerequisites

The following prerequisites and dependencies must be installed manually beforehand.

#### Node.js & `npm`

These should be included with your Ubuntu distribution. `node v14.x` and `npm 7.x` should be more than enough. You can check these by executing:

```bash
node -v
npm -v
```

The use of [`nvm`]() is **recommended**.

If you have any doubts, please check the official documentation here:

- [Node.js](https://nodejs.org/en/)
- [npm | get npm](https://www.npmjs.com/get-npm)
- [nvm-sh/nvm: Node Version Manager](https://github.com/nvm-sh/nvm)

#### Typescript

Install TypeScript by running this in a terminal:

```
npm install typescript
```

#### Docker

To install Docker please follow the official instructions at the [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu) page. We recommend the _Install using the repository_ method.

**Make sure** to also follow the steps outlined in the first section of the [Post-installation steps for Linux](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user) page, in order to manage Docker as a non-root user. The rest of the sections on that page are not necessary.

#### Lumino SDK

Unfortunately, the latest Lumino SDK binaries have not been published yet. This means that you'll have to build this project too, after cloning it.

`lumino-test` expects its parent folder to also contain the `lumino-sdk` folder, and the latter must include the built project.

To achieve this, follow these steps:

1. clone the `lumino-sdk` repo.
2. in the repo folder, run `npm install`.
3. in the repo folder, run `npm run bundle`.

### Installation

Th

## Usage

### Run tests

### Write tests

## External links

- Lumino
- Lumino SDK
