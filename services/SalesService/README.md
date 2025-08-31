# Sales Service

Sales microservice for Eislagger

This service is responsible for managing sales-related operations, including shops, menus, inventory, and transactions.

## Getting Started

### Prerequisites

-   Node.js
-   npm
-   A running PostgreSQL database

### Installation

1.  **Clone the repository.**
2.  **Navigate to the `SalesService` directory:**

    ```bash
    cd services/SalesService
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root of the `SalesService` directory and add the following variables:

-   `DATABASE_URL`: The connection string for your PostgreSQL database.
-   `PORT`: The port on which the service will run. Defaults to `3004`.
-   `KAFKA_BROKERS`: A comma-separated list of Kafka broker addresses.

Example `.env` file:

```
DATABASE_URL="postgresql://user:password@localhost:5432/eislagger_sales"
PORT=3004
KAFKA_BROKERS="localhost:9092"
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

The base path for all routes is `/api/v1/sales`.

### Shop Routes

#### `GET /shops`

Get a list of all shops.

-   **Access**: Public

#### `POST /shops`

Create a new shop.

-   **Access**: Authenticated, Admin
-   **Request Body**:
    ```json
    {
      "name": "The Scoop Shop",
      "location": "123 Main St"
    }
    ```

#### `GET /shops/:shopId`

Get details for a specific shop.

-   **Access**: Public

#### `PUT /shops/:shopId`

Update a specific shop.

-   **Access**: Authenticated, Admin
-   **Request Body**:
    ```json
    {
      "name": "The New Scoop Shop",
      "location": "456 Oak Ave"
    }
    ```

#### `DELETE /shops/:shopId`

Delete a specific shop.

-   **Access**: Authenticated, Admin

### Menu and Inventory

#### `GET /shops/:shopId/menu`

Get the publicly visible menu for a shop.

-   **Access**: Public

#### `GET /shops/:shopId/inventory`

Get the internal inventory for a shop.

-   **Access**: Authenticated, Clerk

### Transaction and Order Routes

#### `POST /shops/:shopId/pos-transactions`

Process a new point-of-sale transaction.

-   **Access**: Authenticated, Clerk
-   **Request Body**:
    ```json
    {
      "items": [
        { "flavorId": "flavor-1", "quantity": 2 },
        { "flavorId": "flavor-2", "quantity": 1 }
      ],
      "clerkId": "clerk-123",
      "patronId": "patron-456"
    }
    ```

#### `POST /shops/:shopId/purchase-orders`

Create a purchase order to request stock.

-   **Access**: Authenticated, Clerk
-   **Request Body**:
    ```json
    {
      "items": [
        { "flavorId": "flavor-1", "quantity": 10, "unit": "gallons" },
        { "flavorId": "flavor-3", "quantity": 5, "unit": "gallons" }
      ],
      "clerkId": "clerk-123"
    }
    ```

### Feedback

#### `POST /feedback`

Submit feedback or a review.

-   **Access**: Authenticated, Patron
-   **Request Body**:
    ```json
    {
      "shopId": "shop-123",
      "patronId": "patron-456",
      "rating": 5,
      "comment": "Great ice cream!"
    }
    ```

## Kafka Integration

The Sales Service produces events to Kafka for certain actions. This is handled by a central Kafka producer instance.

### Producing Events

To send an event, we use a `sendAuditLog` function that abstracts the Kafka producer logic. Here is how you can produce an event:

1.  **Import the `sendAuditLog` function**:

    ```typescript
    import { sendAuditLog } from '../kafka/kafka.ts';
    ```

2.  **Call the function with the event payload**:

    ```typescript
    const auditLog = {
      eventType: "POS_SALE_COMPLETED",
      timestamp: new Date().toISOString(),
      sourceService: "SalesService",
      userId: clerkId,
      details: {
        shopId,
        transactionId: transaction.id,
        items: transaction.items,
        totalAmount: transaction.totalAmount,
      },
    };

    await sendAuditLog(auditLog);
    ```

This will send the `auditLog` object as a JSON string to the `audit-logs` topic in Kafka.