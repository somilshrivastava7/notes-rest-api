# Notes REST API

A small REST API for creating, reading, updating, and deleting notes. It is built with Node.js and Express and keeps notes in memory.

## Requirements

- Node.js 18 or later
- npm

## Run locally

```bash
npm install
npm start
```

The server listens at `http://localhost:3000`. To restart it automatically when files change, run:

```bash
npx nodemon server.js
```

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/notes` | Get all notes |
| `GET` | `/notes/:id` | Get one note by ID |
| `POST` | `/notes` | Create a note |
| `PUT` | `/notes/:id` | Update one or more fields on a note |
| `DELETE` | `/notes/:id` | Delete a note |

Requests that include a body must use `Content-Type: application/json`.

### Note format

```json
{
  "id": 1,
  "title": "Project Reminders",
  "content": "Review the API documentation.",
  "isFavorite": false,
  "createdAt": "2026-10-15T14:32:00.000Z",
  "updatedAt": "2026-10-15T14:32:00.000Z"
}
```

### Create a note

Send a non-empty `title` and `content`. `isFavorite` is optional and defaults to `false`.

```http
POST /notes
Content-Type: application/json
```

```json
{
  "title": "Meeting notes",
  "content": "Discuss the project timeline.",
  "isFavorite": true
}
```

Successful creation returns `201 Created` and the new note, including its assigned ID and timestamps.

### Update a note

Provide at least one field to change. The request can include `title`, `content`, and/or `isFavorite`; `updatedAt` is refreshed.

```http
PUT /notes/1
Content-Type: application/json
```

```json
{
  "isFavorite": true
}
```

### Example requests

```bash
# List all notes
curl http://localhost:3000/notes

# Get note 1
curl http://localhost:3000/notes/1

# Create a note
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Meeting notes","content":"Discuss the project timeline."}'

# Update note 1
curl -X PUT http://localhost:3000/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"isFavorite":true}'

# Delete note 1
curl -X DELETE http://localhost:3000/notes/1
```

## Responses and errors

- `200 OK` — successful reads, updates, and deletes
- `201 Created` — note created
- `400 Bad Request` — invalid ID, invalid fields, or no update fields provided
- `404 Not Found` — no note exists with the requested ID

Errors return a JSON object with a `message`, for example:

```json
{
  "message": "Note not found"
}
```

## Data storage

Notes are stored in the server's memory, not in a database or file. The initial example note is loaded each time the server starts; notes created or changed through the API are lost when the server stops or restarts.
