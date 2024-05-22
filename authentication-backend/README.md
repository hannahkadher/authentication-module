# NestJS Application

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Test](#test)
- [License](#license)

## Introduction
This is a NestJS application designed to provide authentication services. It includes basic features such as user registration, login, and token refresh.

## Features
- User registration
- User login
- Token refresh
- Protected routes with guards

## Installation
### Prerequisites
- Node.js (>= 12.x.x)
- npm (>= 6.x.x) or yarn (>= 1.x.x)

### Steps
1. Clone the repository
   ```bash
   git clone https://github.com/your-repo/nestjs-app.git
   cd nestjs-app
2. Install dependencies
   yarn install
3. Create a .env file based on the .env.example file and configure your environment variables.

```bash
   cp .env.example .env
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).