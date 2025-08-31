# Eislagger Frontend

This is the frontend for the Eislagger application, a web-based platform for managing ice cream sales, inventory, and logistics.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) and custom components.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation.
- **Charting**: [Recharts](https://recharts.org/)
- **Maps**: [Leaflet](https://leafletjs.com/) with [React Leaflet](https://react-leaflet.js.org/)

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm

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

- `npm run dev`: Starts the development server with Turbopack.
- `npm run build`: Creates a production build of the application.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase using Next.js's built-in ESLint configuration.

## Folder Structure

- `src/app`: Contains the core application logic, including pages and layouts.
- `src/components`: Contains reusable UI components.
- `src/lib`: Contains utility functions and library configurations.
- `public`: Contains static assets like images and fonts.
- `styles`: Contains global styles and Tailwind CSS configuration.

## Theming

The application uses a custom pastel theme defined in `tailwind.config.ts`. This theme provides a set of custom colors that are used throughout the application. The theme also includes a dark mode.

---

## Application Pages

### Landing Page

The landing page introduces users to the Eislagger platform with a modern UI, highlighting features and benefits.

![Landing Page Placeholder](https://res.cloudinary.com/doskdadrw/image/upload/v1756656716/landing_page_inuluh.png)

---

### Login Page

The login page allows registered users to sign in securely using email and password credentials according to their roles.

![Role-based Login](https://res.cloudinary.com/doskdadrw/image/upload/v1756656715/role_based_signin_irw4h1.png)

![Login Page Placeholder](https://res.cloudinary.com/doskdadrw/image/upload/v1756656715/loginpage_lm1hqg.png)

---

### Dashboard

The dashboard provides an overview of sales, inventory, and performance metrics, designed for quick insights.

![Dashboard Placeholder](https://res.cloudinary.com/doskdadrw/image/upload/v1756656715/dashboard_j3hun4.png)

---

### Analytics & Reports

This section contains interactive charts and downloadable reports, helping users make data-driven decisions.

![Analytics Placeholder](https://res.cloudinary.com/doskdadrw/image/upload/v1756656715/analytics_yrlsbv.png)

![Reports Placeholder](https://res.cloudinary.com/doskdadrw/image/upload/v1756656713/reports_iyqzee.png)

---

### Chat System & Email System

The communication module enables real-time chat and integrated email for smooth coordination between teams.

![Chat System Placeholder](https://res.cloudinary.com/doskdadrw/image/upload/v1756656717/chatsystem_g3qofh.png)
![Email System Placeholder](https://res.cloudinary.com/doskdadrw/image/upload/v1756656715/email_based_communications_qdlynn.png)

---

### Location Tracker

The location tracker uses Leaflet maps to display live tracking of ice cream delivery vehicles.

![Location Tracker Placeholder](https://res.cloudinary.com/doskdadrw/image/upload/v1756656715/location_tracking_rpqpoc.png)
