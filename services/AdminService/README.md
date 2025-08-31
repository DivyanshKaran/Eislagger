# Admin Service

This service provides administrative functionalities for the Eislagger platform. It is responsible for user management, system health monitoring, and other administrative tasks. This service communicates with other services, such as the AuthService, to perform its duties.

## Getting Started

### Prerequisites

-   Node.js
-   npm

### Installation

1.  **Clone the repository.**
2.  **Navigate to the `AdminService` directory:**

    ```bash
    cd services/AdminService
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root of the `AdminService` directory and add the following variables:

-   `PORT`: The port on which the service will run. Defaults to `3001`.
-   `USER_SERVICE_URL`: The URL of the AuthService. This is used to make API calls to the AuthService for user management.

Example `.env` file:

```
PORT=3001
USER_SERVICE_URL=http://localhost:3002
```

### Running the Service

To start the service in development mode, run:

```bash
npm run dev
```

## API Routes

The base path for all routes is `/api/v1/admin`.

### User Management

#### `GET /users`

Get a list of all users on the platform.

-   **Access:** Private (Admin)

#### `PUT /users/:userId/role`

Update a user's role.

-   **Access:** Private (Admin)
-   **Params:**
    -   `userId` (string, required): The ID of the user to update.
-   **Request Body:**

    ```json
    {
      "role": "MANUFACTURER"
    }
    ```

#### `DELETE /users/:userId`

Delete or deactivate a user.

-   **Access:** Private (Admin)
-   **Params:**
    -   `userId` (string, required): The ID of the user to delete.

### System Monitoring

#### `GET /system/health`

Check the health status of all microservices.

-   **Access:** Private (Admin)

#### `GET /audit-logs`

Get platform-wide audit logs with optional filtering.

-   **Access:** Private (Admin)
-   **Query Params (optional):**
    -   `startDate` (string, datetime)
    -   `endDate` (string, datetime)
    -   `serviceName` (string)
    -   `userId` (string, uuid)

### Broadcasts

#### `POST /broadcasts`

Create a system-wide broadcast message.

-   **Access:** Private (Admin)
-   **Request Body:**

    ```json
    {
      "message": "The system will be down for maintenance tonight at 2am.",
      "target": "All"
    }
    ```