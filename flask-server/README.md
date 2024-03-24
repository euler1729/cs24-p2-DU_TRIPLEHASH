Code Samurai 2024
==============

You will have to design several API endpoints which will be tested against multiple input data. Make sure to follow
specifications for each endpoint as outlined in the following sections.

1. PUT http://localhost:5000/p1
-----------------------------------------

Design an endpoint that takes two integers x and y as query param and persist the data as a two dimensional coordinate point that can be used throughout the lifetime of the application.

Request body:
{
    "x": 120,
    "y": 200
}

Upon success, echo the received parameters with http status code 201:
```
{
    "added": {
        "x": 120,
        "y": 200
    }
}
```

2. GET http://localhost:5000/p2
-------------------------------

Design an endpoint that can read the coodrinates stored in the database and calculate the center of gravity. If no point is found in the database, return the origin (0, 0) following the specified format.

Upon success, return center of gravity in the following format with HTTP status code 200. Output coordinates should be returned as rounded down to the nearest integer.
```
{
    "avg": {
        "x": 120,
        "y": 200
    }
}
```

Testing
-------

Launch the application with an empty database. Then run the evaluator program.

Code Example
------------

Store your environment variables in a `.env` file. [example](./.env)

Add a simple dockerfile to build an image from your solution. Make sure to mention the environment variables you are using in the dockerfile with proper values. [example](./Dockerfile)

Add a compose.yaml file to add all local dependencies of your solution. [example](/compose.yaml)

Optionally, add a `.dockerignore` file to tell docker which files or folders you do not want to copy. [example](./.dockerignore)

**DO NOT** explicitly declare custom network in your docker compose file.

Judge Instruction
-----------------

### If a compose file exists:
Judge engine will run `docker compose up -d --build` if a compose file is found.

**RECOMMENDED**: It is highly recommended that you add a compose file as it reduces chances of making a mistake.

1. You can check logs in your docker compose using `docker compose logs -f`.

2. You can start your services by simply running
    ```sh
    docker compose up -d --build
    ```

3. You can shut down your services by running
    ```sh
    docker compose down
    ```

### Otherwise:
Judge will build the solution and run a standalone container

```sh
docker build --tag=sol:latest .
docker run -dit -p 5000:5000 --rm --name=sol sol:latest
```
**NOTE**: We will use port 5000. Make sure you are exposing correct port in your dockerfile.
