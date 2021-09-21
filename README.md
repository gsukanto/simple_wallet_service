# Simple Wallet Service

Simple wallet microservice. This service assume that the customer verification was already done and information/profile was already stored in a separate customer service. Run `docker-compose up` to consume the service, or check the [Using the Microservice](#using-the-microservice) to learn how to develop against it.


## Content

- [Technology Stack](#technology-stack)
- [Using the Microservice](#using-the-microservice)
- [Commands](#commands)
- [Project Structure](#project-structure)
- [Coding Guidelines](#coding-guidelines)
- [Testing Guide](#testing-guide)
    - [Unit Tests](#unit-tests)
    - [Code Coverage](#code-coverage)
- [Healthchecks](#healthchecks)


## Technology Stack

Following is technology stack that is used in this service

| Name | Version | Description |
|------|---------|-------------|
| [NodeJS](https://nodejs.org/en/) | 14 | Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine. |
| [TypeScript](https://www.typescriptlang.org/) | 4 | TypeScript is a programming language developed and maintained by Microsoft. It is a strict syntactical superset of JavaScript and adds optional static typing to the language. TypeScript is designed for the development of large applications and transcompiles to JavaScript. |
| [MongoDB](https://www.mongodb.com/) | any | MongoDB is a general purpose, document-based, distributed database built for modern application developers and for the cloud era. |
| [Docker](https://www.docker.com/) | any | Enterprise Container Platform for High-Velocity Innovation. |
| [Docker Compose](https://docs.docker.com/compose/) | any | Compose is a tool for defining and running multi-container Docker applications. |
| [Jest](https://jestjs.io/) | any | Jest is a JavaScript testing framework maintained by Facebook, Inc. designed and built by Christoph Nakazawa with a focus on simplicity and support for large web applications. |
| [Chai](https://www.chaijs.com/) | any | Chai is a BDD / TDD assertion library for node and the browser that can be delightfully paired with any javascript testing framework.. |
| [Eslint](https://eslint.org/) | any | The pluggable linting utility for JavaScript and JSX. |


## Using the Microservice

The first step is to ensure you have a valid `.env` configuration. By default, `.env` in this repository is used for docker compose. Thus for local development and testing, make sure to change the `.env` using `.env.local`

The the microservice (with all dependencies running in containers) with:

```bash
docker-compose up
```

This will:

1. Run Mongo docker at: `localhost:27017`
2. Run data seeding for that Mongo docker.
3. Run the server at: `http://localhost:3000`
4. Run the API contract/documentation at: `http://localhost:3000/swagger`

For local development/test, **make sure to run mongodb first**. Do not forget to create database named `wallet`. For docker compose, this step is automated.
Use this command to init the service:

```bash
npm install
```

and run the service using this command:

```bash
npm run dev
```

## Commands

The following commands are useful when working with this repo:

| Command | Usage |
|---------|-------|
| `npm start` | Start the server in development mode. |
| `npm test` | Runs tests using Jest test runner. |
| `npm run serve` | Runs node on `dist/server.js` which is the apps entry point. |
| `npm run build-ts`| Compiles all source `.ts` files to `.js` files in the `dist` folder. |
| `npm run dev`| Full build. Runs ALL build tasks (`build-ts`, `lint`) and run `serve` command. |
| `npm run lint` | Runs ESLint on project files. |

## Project Structure

```
.
├── Dockerfile
├── README.md
├── data
│   ├── import.sh
│   ├── user.dump
│   └── wallet.dump
├── docker-compose.yml
├── jest.config.js
├── package-lock.json
├── package.json
├── src
│   ├── app.ts
│   ├── controllers
│   │   ├── transaction.ts
│   │   └── wallet.ts
│   ├── middlewares
│   │   ├── authentication.ts
│   │   └── requestValidation.ts
│   ├── models
│   │   ├── Deposit.ts
│   │   ├── User.ts
│   │   ├── Wallet.ts
│   │   └── Withdrawal.ts
│   ├── schemas
│   │   ├── transaction.ts
│   │   └── wallet.ts
│   ├── server.ts
│   └── util
│       ├── jsend.ts
│       ├── logger.ts
│       └── secrets.ts
├── test
│   ├── transaction.test.ts
│   └── wallet.test.ts
└── tsconfig.json
```


## Coding Guidelines

- **Coding Style**: Run `npm run lint` to check the code.
- **Pull Requests**: Any pull requests which drop code coverage are likely to be rejected, test your code!
- **Data Model**: Data received from the client should be validated, sanitised and new objects created before passing over to the backend.
- **Business Logic**: If writing a fair amount of business logic that should be unit tested, you should write the code in a modular way that can easily be unit tested.


## Testing Guide

We all love testing. Before running the test, **make sure to run mongodb first**.

### Unit Tests

The unit tests are all kept in the `test` folder.

To manually run the in-proc unit tests, run:

```bash
npm test
```

This will run `jest`, executing tests in the `test/` folder.

### Code Coverage

Code coverage reports can be generated with:

```bash
MONGODB_URI=mongodb://localhost:27017/wallet npm run test
```

Reports are written to the screen. This is the code coverage for current (init) project:

```
-----------------------|---------|----------|---------|---------|-------------------------
File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------|---------|----------|---------|---------|-------------------------
All files              |   92.65 |    77.27 |   93.75 |   92.91 |
 src                   |   91.89 |       50 |   33.33 |   94.44 |
  app.ts               |   91.89 |       50 |   33.33 |   94.44 | 26-27
 src/controllers       |   91.53 |     77.5 |     100 |   91.53 |
  transaction.ts       |    87.1 |    72.73 |     100 |    87.1 | 27-28,37-38,83-84,93-94
  wallet.ts            |   96.43 |    83.33 |     100 |   96.43 | 27-28
 src/middlewares       |   97.78 |    93.75 |     100 |   97.78 |
  authentication.ts    |   94.12 |     87.5 |     100 |   94.12 | 25
  requestValidation.ts |     100 |      100 |     100 |     100 |
 src/models            |     100 |      100 |     100 |     100 |
  Deposit.ts           |     100 |      100 |     100 |     100 |
  User.ts              |     100 |      100 |     100 |     100 |
  Wallet.ts            |     100 |      100 |     100 |     100 |
  Withdrawal.ts        |     100 |      100 |     100 |     100 |
 src/schemas           |     100 |      100 |     100 |     100 |
  transaction.ts       |     100 |      100 |     100 |     100 |
  wallet.ts            |     100 |      100 |     100 |     100 |
 src/util              |   82.35 |       50 |     100 |   82.35 |
  jsend.ts             |     100 |      100 |     100 |     100 |
  logger.ts            |     100 |       50 |     100 |     100 | 19
  secrets.ts           |    62.5 |       50 |     100 |    62.5 | 6-7,17-18,22-23
-----------------------|---------|----------|---------|---------|-------------------------
Test Suites: 2 passed, 2 total
Tests:       24 passed, 24 total
Snapshots:   0 total
Time:        7.267 s
```

## Healthchecks

This service exposes a basic healthcheck at `/health`:

```
GET /health HTTP/1.1
host: localhost:3000

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 15

{"status":"UP"}
```