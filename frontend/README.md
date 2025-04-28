# Finance Manager Frontend

A clean, minimalistic, and modern Angular frontend for the Finance Manager application.

## Features

- Dashboard with financial summary (income, expenses, balance)
- Daily, weekly, monthly, and yearly expense tracking
- Transaction management (add, edit, delete)
- Transaction filtering and sorting
- Responsive design for all devices

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200`

## Building for Production

To build the application for production, run:
```
npm run build
```

The build artifacts will be stored in the `dist/finance-manager` directory.

## Project Structure

- `src/app/components` - Angular components
- `src/app/models` - Data models
- `src/app/services` - Services for API communication
- `src/assets` - Static assets
- `src/styles.scss` - Global styles

## Backend Integration

This frontend is designed to work with the Spring Boot backend API. Make sure the backend server is running on `http://localhost:8080` before using the frontend application.
