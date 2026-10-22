# 🚀 Journey Architect — Hostinger Deployment Guide

This repository is ready to deploy directly to **Hostinger**. Two deployment packages are provided:

---

## 📦 Provided Deployment Zip Files

1. **`hostinger-fullstack-deployment.zip`** (Recommended)
   - Contains the complete Full-Stack application (Node.js API + SQLite database + React frontend build in `dist/`).
   - Use this if you are using **Hostinger Node.js App** (hPanel/cPanel) or **Hostinger VPS**.

2. **`hostinger-static-frontend.zip`**
   - Contains only the static production build (`dist/` contents + `.htaccess`).
   - Use this if you are deploying to **Hostinger Shared Web Hosting** (`public_html`) using standard file manager or FTP.

---

## Method 1: Deploy with Hostinger Node.js Web App (Recommended)

1. **Log in to Hostinger hPanel**:
   - Go to **Websites** → Select your domain → Click **Manage**.
   - Search for **Node.js** in the search bar (available on Hostinger Cloud and Business plans).

2. **Upload the Files**:
   - Go to **File Manager** (`public_html` or your designated app folder).
   - Upload **`hostinger-fullstack-deployment.zip`** and click **Extract**.

3. **Configure the Node.js App**:
   - **Node.js version**: Choose `18.x` or `20.x`.
   - **Application root**: `/` (or path where files were extracted).
   - **Application startup file**: `server.js` (or `server/server.js`).
   - Click **Save**.

4. **Install Dependencies**:
   - Click **"npm install"** (or run `npm install --omit=dev` in terminal / SSH).

5. **Start Application**:
   - Click **Start / Restart Application**.
   - Your website and backend API will run seamlessly together on your domain!

---

## Method 2: Deploy Static Frontend on Hostinger Shared Hosting (`public_html`)

If your plan is basic PHP/Shared hosting without Node.js:
1. Open **File Manager** → navigate into `public_html`.
2. Upload **`hostinger-static-frontend.zip`** and **Extract** its contents directly into `public_html`.
3. The included `.htaccess` file automatically configures:
   - React Single Page Application (SPA) routing (no 404 on page refresh).
   - Fast Gzip compression and caching headers.
   - HTTPS and security headers.

---

## 🔐 Default Admin Credentials
- **Admin Portal**: `https://yourdomain.com/admin`
- **Username**: `admin`
- **Password**: `journeyarchitect2026`
*(You can change credentials anytime in `.env` or in the admin settings)*.
