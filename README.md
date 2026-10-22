# Challenge Backend

## Project description

Challenge Backend is a Fastify-based REST API for an event management system. The
service provides access to users and events through a small HTTP API and proxies
the requests to the event service at `http://event.com`. During local
development, that external service is simulated by the MSW mock server started
by `services/index.js`.

The API listens on `http://localhost:3000`.

## Running the service

Install dependencies and start the API:

```bash
npm install
npm start
```

For development with automatic restarts:

```bash
npm run dev
```

## Endpoints

### `GET /getUsers`

Returns all users known to the event service.

Example:

```bash
curl http://localhost:3000/getUsers
```

Example response:

```json
[
  {
    "userName": "user1",
    "id": 1,
    "email": "hello@gmail.com",
    "events": ["event-1", "event-3"]
  }
]
```

### `POST /addEvent`

Creates an event and associates it with the user supplied in the request body.
The service adds an `id` based on the current timestamp before forwarding the
request.

Request body:

| Field     | Type             | Description                              |
| --------- | ---------------- | ---------------------------------------- |
| `name`    | string           | Event name                               |
| `userId`  | number or string | ID of the user associated with the event |
| `details` | string           | Event details                            |

Example:

```bash
curl --request POST http://localhost:3000/addEvent \
  --header "Content-Type: application/json" \
  --data "{\"name\":\"Team meeting\",\"userId\":\"1\",\"details\":\"Weekly sync\"}"
```

Example response:

```json
{
  "success": true
}
```

### `GET /getEvents`

Returns all events known to the event service.

Example:

```bash
curl http://localhost:3000/getEvents
```

Example response:

```json
[
  {
    "id": 1,
    "name": "Event 1",
    "userId": 1,
    "details": "This is the first event"
  }
]
```

### `GET /getEventsByUserId/:id`

Returns the events associated with a user ID. The endpoint first looks up the
user and then fetches the referenced events concurrently.

Example:

```bash
curl http://localhost:3000/getEventsByUserId/1
```

Example response:

```json
[
  {
    "id": 1,
    "name": "Event 1",
    "userId": 1,
    "details": "This is the first event"
  },
  {
    "id": 1,
    "name": "Event 1",
    "userId": 1,
    "details": "This is the first event"
  }
]
```

## Configure

First thing was installing the packages. 

Then I installed nodemon to make the development process easier. Then I added a script to the package.json.

```JSON
"dev": "nodemon services"
```

After running the script I can save the files and the server will update automatically, without having to stop and start it every time.

Add .gitignore to prevent the node_modules to be pushed.
