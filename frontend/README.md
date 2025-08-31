# Eislagger Frontend

This is the frontend for the Eislagger application, a web-based platform for managing ice cream sales, inventory, and logistics.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (with Turbopack)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Radix UI](https://www.radix-ui.com/) and custom components.
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation.
-   **Charting**: [Recharts](https://recharts.org/)
-   **Maps**: [Leaflet](https://leafletjs.com/) with [React Leaflet](https://react-leaflet.js.org/)

## Getting Started

### Prerequisites

-   Node.js (v20 or later)
-   npm

### Installation

1.  **Navigate to the `frontend` directory:**

    ```bash
    cd frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

### Running the Development Server

To start the development server, run:

```bash
npm run dev
```

This will start the application on [http://localhost:3000](http://localhost:3000).

## Available Scripts

-   `npm run dev`: Starts the development server with Turbopack.
-   `npm run build`: Creates a production build of the application.
-   `npm run start`: Starts the production server.
-   `npm run lint`: Lints the codebase using Next.js's built-in ESLint configuration.

## Folder Structure

-   `src/app`: Contains the core application logic, including pages and layouts.
-   `src/components`: Contains reusable UI components.
-   `src/lib`: Contains utility functions and library configurations.
-   `public`: Contains static assets like images and fonts.
-   `styles`: Contains global styles and Tailwind CSS configuration.

## Theming

The application uses a custom pastel theme defined in `tailwind.config.ts`. This theme provides a set of custom colors that are used throughout the application. The theme also includes a dark mode.
