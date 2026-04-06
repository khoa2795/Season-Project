# Project Season

A modern Next.js application designed for a seasonal shopping experience.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.17 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Getting Started

Follow these steps to set up the project locally:

### 1. Clone the repository
```bash
git clone <repository-url>
cd ProjectSeason/my-app
```

### 2. Install dependencies
Install the required packages using npm:
```bash
npm install
```

### 3. Run the development server
Start the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Installation on Windows

If you're using Windows, follow these additional steps:

### 1. Install Node.js and npm
- Download the installer from [Node.js Official Website](https://nodejs.org/)
- Run the `.msi` installer and follow the setup wizard
- Ensure "Add to PATH" is checked during installation
- Verify installation by opening Command Prompt and running:
```cmd
node --version
npm --version
```

### 2. Clone the repository using Git Bash or Command Prompt
```cmd
git clone <repository-url>
cd ProjectSeason\my-app
```

### 3. Install dependencies
```cmd
npm install
```

### 4. Run the development server
```cmd
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components.
  - `sections/`: Main page sections (Hero, Category, Newsletter, etc.).
  - `ui/`: Base UI components (Button, Card, Input, etc.).
- `lib/`: Utility functions and shared logic.
- `public/`: Static assets like icons and fonts.
- `images/`: Project images and assets.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality issues.

## Technologies Used

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
- **Carousel**: [Embla Carousel](https://www.embla-carousel.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
