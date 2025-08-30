# Auth Service

This service is responsible for handling user authentication and authorization.

## Getting Started

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Set up environment variables:**

    Create a `.env` file in the root of the `AuthService` directory and add the following variables:

    ```
    DATABASE_URL="your-database-url"
    PORT=3002
    JWT_SECRET="your-jwt-secret"
    ```

3.  **Start the service:**

    ```bash
    npm run dev
    ```

## Routes

The base path for all routes is `/api/v1/auth`.

### Public Routes

-   `POST /register`: Register a new user. (Patron by default)
-   `POST /login`: Authenticate a user and get a JWT.
-   `GET /health`: Health check endpoint.

### Protected Routes

-   `POST /logout`: Logs out the user.
-   `GET /me`: Get the profile of the currently authenticated user.
-   `POST /verify`: Verify a JWT and return the user payload.

### Admin Routes

These routes are intended to be used by the Admin Service.

-   `GET /users`: Get all users.
-   `PUT /users/:userId/role`: Update a user's role.
-   `DELETE /users/:userId`: Delete a user.
