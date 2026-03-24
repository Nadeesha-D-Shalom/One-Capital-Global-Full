# One Capital Global

A modern web platform designed for a Sri Lankan FMCG import, trading, and distribution company. The system provides a corporate-facing website along with an internal admin dashboard for managing market data, messages, and content.

---

## Project Overview

One Capital Global is built as a high-performance, responsive web application with:

- Public-facing corporate website
- Admin dashboard (secure access)
- Market data visualization
- Blog/content management
- Contact/message handling system

The platform focuses on clean UI/UX, scalability, and efficient frontend-backend communication.

---

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router DOM
- Font Awesome Icons

### Backend
- PHP (REST API)
- MySQL (XAMPP)

### Deployment
- GitHub Pages (Frontend)
- Localhost / cPanel (Backend ready)

---

## Folder Structure

```
one-capital-global/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── config/
│   └── index.php
│
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   │   ├── admin/
│   │   └── public/
│   ├── routes/
│   ├── config/
│   └── App.jsx
│
├── public/
├── dist/
├── .env
├── vite.config.js
└── package.json
```

---

## Features

### Public Website
- Optimized hero section (GPU-aware performance)
- Logistics & Services page
- Portfolio display
- Company profile page
- Blog system
- Contact form integration

### Admin Panel
- Secure admin login (protected routes)
- Dashboard overview
- Message management (contact form submissions)
- Blog management (Create / Update / Delete)
- Market data management

---

## Environment Configuration

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost/one-capital-global/backend
```

---

## Installation & Setup

### 1. Clone Repository
```
git clone https://github.com/Nadeesha-D-Shalom/One-Capital-Global-Full.git
cd one-capital-global
```

### 2. Install Frontend Dependencies
```
npm install
```

### 3. Run Frontend
```
npm run dev
```

### 4. Backend Setup
- Move `backend/` folder into XAMPP `htdocs`
- Start Apache and MySQL from XAMPP
- Import database (if available)
- Access backend:
```
http://localhost/one-capital-global/backend
```

---

## Build & Deployment

### Build Project
```
npm run build
```

### Deploy to GitHub Pages
```
npx gh-pages -d dist
```

---

## Known Issues

- Contact form may fail if API endpoint or CORS is misconfigured
- GitHub Pages routing requires correct `base` path in `vite.config.js`
- Ensure `.env` API URL matches backend location

---

## License

© 2026 Nadeesha Shalom. All rights reserved.

This software and its source code are proprietary and confidential.  
Unauthorized copying, modification, distribution, or use of this software, in whole or in part, is strictly prohibited without prior written permission from the author.

For permissions or inquiries:  
nadeeshashalom1@gmail.com

---

## Author

**Nadeesha Shalom**