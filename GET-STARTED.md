# 🚀 Orthodox App - Team Onboarding Guide

Welcome to the project! Follow these steps to get your local environment up and running.

## 1. Repository Setup
First, clone the repository and switch to the active development branch:
```bash
git checkout dynamic-content-management
```

## 2. Database Setup (PostgreSQL)
We use PostgreSQL for the backend.
1. Create a database named `orthodox_db` (or your preferred name).
2. Execute the SQL script found at `backend/migration.sql`. This will create all necessary tables (Users, Churches, News, Curricula, etc.).

## 3. Environment Variables
You need to set up your local environment files:

### Frontend (`web/`)
1. Copy `web/.env.example` to `web/.env.local`.
2. Ensure `NEXT_PUBLIC_API_URL` is set to `http://localhost:3005`.

### Backend (`backend/`)
1. Create/Update `backend/.env`.
2. Configure your database connection:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_user
   DB_PASSWORD=your_password
   DB_DATABASE=orthodox_db
   JWT_SECRET=your_secret_key
   ```

## 4. Running the Project
You can launch both the backend and frontend simultaneously from the root directory:

1. **Install all dependencies** (if you haven't yet):
   ```bash
   npm run install:all
   ```

2. **Launch the App**:
   ```bash
   npm run dev
   ```

This will start the backend on port 3000 and the frontend on port 3001 using `concurrently`.

## 5. Helpful Links
- **Website**: [http://localhost:3001](http://localhost:3001)
- **CMS Admin Dashboard**: [http://localhost:3001/admin/content](http://localhost:3001/admin/content)
- **Backend API**: [http://localhost:3000](http://localhost:3000)

## 🛠️ Project Architecture Notes
- The **CMS Dashboard** is modular. You can find the individual managers in `web/components/admin/content/`.
- **API Client**: All frontend requests use the shared client in `web/lib/api/`.
