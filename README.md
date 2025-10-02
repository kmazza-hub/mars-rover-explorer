Mars Rover Photo Explorer (MERN)

A modern MERN stack app that lets users explore photos taken by NASA’s Mars rovers. Built with React (Vite) frontend, Node/Express backend, and MongoDB persistence.

🚀 Overview

Browse available rovers with key metadata (launch/landing dates, status, cameras, total photos).

View rover photos by Earth date or Martian sol.

Filter photos by camera.

Pagination with “Load More” and basic infinite scroll.

Modal/lightbox to enlarge photos with metadata.

Save favorites (persisted in MongoDB).

Responsive layout with basic accessibility.

Express server proxies NASA API with caching to reduce rate limit hits.

🏗 Architecture

Frontend: React (Vite) + React Router + React Query

Backend: Express + Axios proxy + MongoDB via Mongoose

Database: MongoDB for persisting favorites

Styling: CSS (modern, responsive layout)

Project structure:

mars-rover-explorer/
├── client/    # React frontend
├── server/    # Express backend + MongoDB
├── package.json (root) with dev scripts
└── README.md

⚙️ Setup
Prerequisites

Node.js v18+

MongoDB running locally (or Atlas URI)

Environment Variables

Create server/.env (from .env.example):

PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mars_rover
NASA_API_BASE=https://api.nasa.gov/mars-photos/api/v1
NASA_API_KEY=DEMO_KEY
CLIENT_ORIGIN=http://localhost:5173
CACHE_TTL_MS=300000


Create client/.env (from .env.example):

VITE_API_URL=http://localhost:5000/api

Install & Run

From project root:

# install deps for both client & server
npm run install:all

# run client + server together
npm run dev


Client: http://localhost:5173

Server API: http://localhost:5000/api

📱 Features
Core

List rovers with metadata

Select rover → fetch photos

Choose Earth date or Sol

Camera filter

Pagination (Load More + infinite scroll)

Responsive design & basic accessibility

Persistence

Mark/unmark photos as favorites

Favorites stored in MongoDB

Proxy & Caching

Express backend proxies NASA API

In-memory cache with TTL (configurable)

🧪 Testing & Tooling

Backend uses in-memory caching + error handling

Frontend uses React Query for caching/pagination

Basic error and loading states

ESLint/Prettier recommended for formatting (not enforced in this scaffold)

🔮 Future Work

Favorites page with gallery view

Dark mode toggle

Skeleton loaders & masonry layout

Offline-first experience with Service Worker

More test coverage & CI (GitHub Actions)

Redis-backed caching for scale

Authenticated users with per-user favorites

📝 Decisions & Trade-offs

React Query chosen for simplicity in caching/pagination.

Used in-memory server cache instead of Redis for faster setup.

Persistence limited to favorites to satisfy MongoDB requirement.

Kept styling minimal with plain CSS for clarity; could easily be swapped to Tailwind/MUI if desired.

Focused on core user stories due to time constraints.

📸 Screenshots (optional)

Add a few screenshots or a short GIF here if time allows.

✅ Submission

Public GitHub repo with regular commits.

This README included.

Core user stories implemented.

Documented trade-offs and future work.

## Screenshots
![Rovers list](docs/01-rovers.png)
![Photo grid](docs/02-grid.png)
![Photo modal](docs/03-modal.png)
![Favorites](docs/04-favorites.png)
