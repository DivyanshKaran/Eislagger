# Admin Service

This service is responsible for handling administrative tasks, such as user management and system monitoring.

## Getting Started

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Set up environment variables:**

    Create a `.env` file in the root of the `AdminService` directory and add the following variables:

    ```
    PORT=3001
    USER_SERVICE_URL=http://localhost:3002
    ```

3.  **Start the service:**

    ```bash
    npm run dev
    ```

## Routes

The base path for all routes is `/api/v1/admin`.

-   `GET /users`: Get a list of all users on the platform.
-   `PUT /users/:userId/role`: Update a user's role.
-   `DELETE /users/:userId`: Delete or deactivate a user.
-   `GET /system/health`: Check the health status of all microservices.
-   `GET /audit-logs`: Get platform-wide audit logs with optional filtering.
-   `POST /broadcasts`: Create a system-wide broadcast message.
