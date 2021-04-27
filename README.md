## About

The purpose of the `lumino-tests` project is to provide tools which can act as complex automated tests and serve as complements to the RIF Lumino unit tests, for robustness purposes.

### How it works

The project is written in [Typescript]() and uses [Jest]() as its testing framework.

Under the hood, it makes use of both [Docker]() as well as the [Lumino SDK]() in order to set up the testing scenarios and carry out actions in them.

## Getting started

Please note that all instructions are written for Ubuntu.

### Prerequisites

#### Docker

To install Docker follow the official instructions at the [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu) page. We recommend the _Install using the repository_ method.

**Make sure** to also follow the steps outlined in the first section of the [Post-installation steps for Linux](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user) page, in order to manage Docker as a non-root user. The rest of the sections on that page are not necessary.

#### Lumino SDK

Unfortunately, the latest Lumino SDK binaries have not been published yet. This means that you'll have to build this project too, after cloning it.

`lumino-test` expects its parent folder to also contain the `lumino-sdk` folder too, which should include the built project.

To achieve this, follow these steps:

1. clone the `lumino-sdk` repo.
2. in the repo folder, run `npm install`.
3. in the repo folder, run `npm run bundle`.

### Installation

## Usage

### Run tests

### Write tests

## External links

- Lumino
- Lumino SDK
