# Auth Service

This service is responsible for handling user authentication and authorization within the Eislagger microservices architecture. It manages user registration, login, and role-based access control. It also provides a secure way to verify user identities using JSON Web Tokens (JWTs).

## Getting Started

### Prerequisites

-   Node.js
-   npm
-   A running PostgreSQL database

### Installation

1.  **Clone the repository.**
2.  **Navigate to the `AuthService` directory:**

    ```bash
    cd services/AuthService
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root of the `AuthService` directory and add the following variables:

-   `DATABASE_URL`: The connection string for your PostgreSQL database. This is used by Prisma to connect to the database.
-   `PORT`: The port on which the service will run. Defaults to `3002`.
-   `JWT_SECRET`: A secret key for signing and verifying JWTs.

Example `.env` file:

```
DATABASE_URL="postgresql://user:password@localhost:5432/eislagger_auth"
PORT=3002
JWT_SECRET="a-very-strong-and-secret-key"
```

### Database Migrations

This service uses Prisma for database management. To apply the database schema, run the following command:

```bash
npm run prisma:migrate
```

### Running the Service

To start the service in development mode, run:

```bash
npm run dev
```

## API Routes

The base path for all routes is `/api/v1/auth`.

### Public Routes

#### `POST /register`

Register a new user. By default, users are assigned the `PATRON` role.

-   **Request Body:**

    ```json
    {
      "email": "user@example.com",
      "password": "password123",
      "name": "John Doe"
    }
    ```

-   **Response:**

    ```json
    {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "PATRON"
    }
    ```

#### `POST /login`

Authenticate a user and receive a JWT.

-   **Request Body:**

    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```

-   **Response:**

    ```json
    {
      "token": "your-jwt-token"
    }
    ```

### Protected Routes

These routes require a valid JWT in the `Authorization` header (`Bearer <token>`).

#### `POST /logout`

Logs out the user. (This is a conceptual endpoint and may not have a functional implementation if using stateless JWTs).

#### `GET /me`

Get the profile of the currently authenticated user.

-   **Response:**

    ```json
    {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "PATRON"
    }
    ```

#### `POST /verify`

Verify a JWT and return the user payload.

-   **Response:**

    ```json
    {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "PATRON"
    }
    ```

### Admin Routes

These routes are intended to be used by the Admin Service and require an `ADMIN` role.

#### `GET /users`

Get a list of all users.

#### `PUT /users/:userId/role`

Update a user's role.

-   **Request Body:**

    ```json
    {
      "role": "MANUFACTURER"
    }
    ```

#### `DELETE /users/:userId`

Delete a user.