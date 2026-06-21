# BidFlow

https://bid--flow.vercel.app/

BidFlow is a MERN auction platform with JWT authentication, role-based Buyer/Seller/Admin flows, realtime bidding through Socket.IO, product image uploads, admin analytics, notifications, and a mock winner payment flow.

## Folder Structure

```text
bidFlow/
  backend/
    src/
      config/          MongoDB connection
      controllers/     API business logic
      middleware/      Auth, validation, upload, errors
      models/          Mongoose schemas
      routes/          Express route modules
      socket/          Socket.IO realtime auction events
      utils/           Shared helpers
      validators/      Request validation rules
    uploads/           Local image uploads
  frontend/
    src/
      api/             Axios and Socket.IO clients
      components/      Reusable UI
      context/         Auth state
      hooks/           Fetch helpers
      pages/           Route pages
      utils/           UI utilities
  docs/
    API.md
```

## Environment

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/bidflow?retryWrites=true&w=majority&appName=<app-name>
MONGO_DB_NAME=bidflow
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

MongoDB Atlas is required through `MONGO_URI`. Include the database name in the URI path, for example `/bidflow`, so Mongoose writes to the expected Atlas database. The backend does not hard-code the database connection string.

## Install And Run

```bash
npm install
npm run dev
```

Backend: `http://localhost:5000`  
Frontend: `http://localhost:3000`

## Production Build

```bash
npm run build
npm run start
```

## Deployment Notes

### Vercel

This repo includes `vercel.json` and `api/[...path].mjs`, so Vercel can build the Vite frontend and serve the Express API as serverless functions from the same project.

In Vercel, import the GitHub repo with the project root set to the repository root. Use these settings:

```text
Framework Preset: Other
Build Command: npm run build --workspace frontend
Output Directory: frontend/dist
Install Command: npm install
```

Set these Vercel environment variables:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/bidflow?retryWrites=true&w=majority&appName=<app-name>
MONGO_DB_NAME=bidflow
JWT_SECRET=your_secret_key
CLIENT_URL=https://your-vercel-project.vercel.app
```

`VITE_API_URL` is optional on Vercel because the frontend defaults to `/api` in production. Set it only if the API is hosted somewhere else.

### Realtime And Uploads

Vercel serverless functions do not provide a long-running Socket.IO server. The REST API, auth, dashboards, listings, bidding requests, and admin routes can run on Vercel, but realtime bid broadcasts need the backend hosted on Render, Railway, Fly.io, or another always-on Node host. If you use a separate backend host for realtime, set `VITE_API_URL`, `VITE_SOCKET_URL`, and `CLIENT_URL` to the deployed URLs.

For production image storage, replace local `uploads/` with S3, Cloudinary, or another managed object store.
