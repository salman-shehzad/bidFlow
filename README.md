# BidFlow

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

Deploy the backend to Render, Railway, Fly.io, or a Node-capable VPS. Set `PORT`, `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` in the host environment.

Deploy the frontend to Vercel, Netlify, or static hosting. Set `VITE_API_URL` and `VITE_SOCKET_URL` to the deployed backend URL.

For production image storage, replace local `uploads/` with S3, Cloudinary, or another managed object store.
