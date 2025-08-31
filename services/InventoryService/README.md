# Inventory Service

Inventory microservice for Eislagger

This service is responsible for managing inventory-related operations, including factories, stock items, and flavors.

## Getting Started

### Prerequisites

-   Node.js
-   npm
-   A running PostgreSQL database

### Installation

1.  **Clone the repository.**
2.  **Navigate to the `InventoryService` directory:**

    ```bash
    cd services/InventoryService
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root of the `InventoryService` directory and add the following variables:

-   `DATABASE_URL`: The connection string for your PostgreSQL database.
-   `PORT`: The port on which the service will run. Defaults to `3003`.
-   `KAFKA_BROKERS`: A comma-separated list of Kafka broker addresses.

Example `.env` file:

```
DATABASE_URL="postgresql://user:password@localhost:5432/eislagger_inventory"
PORT=3003
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

The base path for all routes is `/api/v1/inventory`.

### Factory Routes

#### `GET /factories/:factoryId`

Get a factory's details, including its stock and budget.

-   **Access**: Authenticated, Manufacturer

#### `PUT /factories/:factoryId/budget`

Allocate or update a factory's budget.

-   **Access**: Authenticated, Admin
-   **Request Body**:
    ```json
    {
      "budget": 50000
    }
    ```

#### `POST /factories/:factoryId/stock-items`

Register newly produced ice cream stock.

-   **Access**: Authenticated, Manufacturer
-   **Request Body**:
    ```json
    {
      "batchId": "batch-xyz-789",
      "expiryDate": "2025-12-31",
      "flavorId": "flavor-5",
      "productionCost": 2.50,
      "quantity": 100,
      "unit": "gallons"
    }
    ```

### Flavor Routes

#### `GET /flavors`

Get a list of all available flavors.

-   **Access**: Authenticated

### Invoice Routes

#### `POST /invoices`

Create an invoice for a shop based on a purchase order. (Note: This is often triggered by Kafka events.)

-   **Access**: Authenticated
-   **Request Body**:
    ```json
    {
      "shopId": "shop-123",
      "items": [ { "flavorId": "flavor-1", "quantity": 10 } ]
    }
    ```

#### `GET /invoices/:invoiceId`

Retrieve details for a specific invoice.

-   **Access**: Authenticated

## Kafka Integration

The Inventory Service consumes events from Kafka to keep its state up-to-date. This is handled by a Kafka consumer that subscribes to relevant topics.

### Consuming Events

To consume events, the service sets up a consumer to listen to topics like `pos-transaction` and `purchase-order`.

1.  **Create a Kafka consumer instance**:

    A Kafka consumer is initialized and connected to the brokers. It is configured with a group ID to allow for multiple instances of the service to share the load.

2.  **Subscribe to topics**:

    The consumer subscribes to the topics it needs to process.

    ```typescript
    await consumer.subscribe({ topic: 'pos-transaction', fromBeginning: true });
    await consumer.subscribe({ topic: 'purchase-order', fromBeginning: true });
    ```

3.  **Process messages**:

    The consumer runs in a loop, processing each message it receives. The message payload is parsed, and the appropriate action is taken based on the event type.

    ```typescript
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const event = JSON.parse(message.value.toString());

        if (topic === 'pos-transaction') {
          // Logic to update stock based on the sale
        } else if (topic === 'purchase-order') {
          // Logic to create an invoice and prepare for shipment
        }
      },
    });
    ```

This setup allows the Inventory Service to react to events happening in other parts of the system in a decoupled and scalable way.