# Orthodox App

A full-stack application featuring an Orthodox Bible School platform with a Next.js frontend and a NestJS backend.

## Project Structure

- `/web`: Frontend application built with Next.js, Tailwind CSS, and GSAP.
- `/backend`: Backend API built with NestJS, TypeORM, and PostgreSQL.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) database
- [npm](https://www.npmjs.com/)

---

## Backend Setup (NestJS)

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the `backend` directory (you can use the existing one as a template) and ensure the following variables are set:
    ```env
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    DATABASE_USER=your_postgres_user
    DATABASE_PASS=your_postgres_password
    DATABASE_NAME=OrthodoxDB
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRES_IN=7d
    ```
    *Note: Ensure the database `OrthodoxDB` exists in your PostgreSQL instance.*

4.  **Run the application:**
    ```bash
    # Development mode
    npm run start:dev

    # Production mode
    npm run build
    npm run start
    ```
    The backend will start on `http://localhost:3000` by default.

---

## Frontend Setup (Next.js)

1.  **Navigate to the web directory:**
    ```bash
    cd web
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env.local` file in the `web` directory:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3000
    ```

4.  **Parse Bible Data (Required for the Bible feature):**
    Run the script to process the Bible XML files into JSON format:
    ```bash
    npm run build-bible
    ```

5.  **Run the application:**
    ```bash
    # Development mode
    npm run dev

    # Production mode
    npm run build
    npm run start
    ```
    The web application will be accessible at `http://localhost:3001`.

---

## Developer Workflow

- **Backend:** Uses TypeORM with `synchronize: true` in development, which automatically updates the database schema based on entities.
- **Frontend:** Next.js handles the UI and interacts with the NestJS API via the URL defined in `NEXT_PUBLIC_API_URL`.
- **Bible Data:** The Bible content is parsed from XML files located in `web/public/assets/Bible` into JSON for efficient client-side access.
