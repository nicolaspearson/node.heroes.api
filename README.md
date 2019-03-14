# Node Heroes API

An example REST API built using Node and PostgreSQL.

## Dependencies

This project makes use of Typescript, TypeORM, Hapi, and Nconf.

## Getting Started

**1. Clone the application**

```bash
git clone https://github.com/nicolaspearson/node.heroes.api.git
```

**2. Start the database**

```bash
docker-compose up
```

**3. Build and run the app using cargo**

#### Run the app in development mode:

```bash
npm run start
```

The app will start running at <http://localhost:8000>

#### Run the app in release mode:

```bash
npm install -g http-server
npm run build
http-server -p 8000 ./build
```

The app will start running at <http://localhost:8000>

## Endpoints

The following endpoints are available:

```
GET /heroes
```

```
POST /hero
```

```
PUT /hero/{heroId}
```

```
DELETE /hero/{heroId}
```

## Benchmarking

Run this command to benchmark request performance:

```
wrk -d1m http://localhost:8000/heroes
```

![benchmark](/img/benchmark.png)
