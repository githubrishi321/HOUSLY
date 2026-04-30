# Production Deployment Guide

This guide covers deploying the **React Frontend to Vercel** and the **Node.js Backend & MySQL Database to Railway**.

I've configured the codebase to support this architecture:
- `vercel.json` added for Vercel SPA routing rules.
- Backend updated to support Railway's `MYSQL_URL` connection string.
- Frontend API calls updated to use `REACT_APP_API_URL` environment variable.

---

## Part 1: Deploy Database (Railway)
1. Log in to [Railway](https://railway.app/).
2. Create a **New Project** and select **Provision PostgreSQL**, wait, you need MySQL! 
   - Click **New Project** > **Provision MySQL**.
3. Railway will provision a free MySQL database.
4. Click on the MySQL block -> click the **Connect** tab.
5. You will see a **MySQL Connection URL** (e.g., `mysql://root:password@.../railway`). You will need this for the backend.
6. Open your local terminal, connect to this remote MySQL database using a GUI (like DBeaver or TablePlus) or CLI, and execute the contents of `database/schema.sql` to create tables and seed demo users.

---

## Part 2: Deploy Backend (Railway)
1. Push your entire repository to GitHub.
2. In your Railway project, click **New** -> **GitHub Repo** -> select your repository.
3. Configure the backend service:
   - Click on the newly added service.
   - Go to **Settings** > **General**.
   - Change **Root Directory** to `/backend`.
4. Go to **Variables** and add:
   - `MYSQL_URL`: (Click "Add Reference" and select `MYSQL_URL` from the database service, or paste the string).
   - `JWT_SECRET`: (Generate a secure random string and paste it here).
   - `JWT_EXPIRES_IN`: `8h`
   - `PORT`: `5000` (Optional, Railway injects it automatically, but good to have).
5. Railway will automatically detect the Node.js environment, run `npm run build`, and then `npm start`.
6. Once deployed, go to **Settings** > **Networking** and click **Generate Domain**. Note this URL down (e.g., `https://permission-backend-production.up.railway.app`).

---

## Part 3: Deploy Frontend (Vercel)
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** > **Project** and import your GitHub repository.
3. In the "Configure Project" step:
   - Change **Framework Preset** to `Create React App`.
   - Change **Root Directory** to `frontend`.
4. Open the **Environment Variables** section and add:
   - Name: `REACT_APP_API_URL`
   - Value: `<YOUR_RAILWAY_BACKEND_URL>/api` (e.g., `https://permission-backend-production.up.railway.app/api`)
5. Click **Deploy**.
6. Once deployed, note down your Vercel URL (e.g., `https://permission-system.vercel.app`).

---

## Part 4: Finalize CORS Configuration
1. Go back to your Backend service in **Railway**.
2. Go to the **Variables** section.
3. Add a new variable:
   - `CLIENT_ORIGIN`: `<YOUR_VERCEL_FRONTEND_URL>` (e.g., `https://permission-system.vercel.app`).
4. This ensures the backend only accepts requests from your deployed Vercel application. Railway will automatically restart the backend.

**🎉 You are now fully deployed!**
