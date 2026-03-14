# Bargit: Hyperlocal E-Commerce & Dynamic Negotiation Platform

[![Stack](https://img.shields.io/badge/Stack-MERN-0F172A?logo=mongodb&logoColor=white)](#)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-646CFF?logo=vite&logoColor=white)](#)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=nodedotjs&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-FF2E63?logo=open-source-initiative&logoColor=white)](#)

Bargit is a comprehensive, three-tier marketplace designed to bridge the gap between offline local retailers and digital consumers. It introduces a unique dynamic-pricing model through a real-time negotiation engine, backed by precise geo-spatial routing.

---

## 📖 Table of Contents
1. [Platform Overview](#1-platform-overview)
2. [Visual Walkthrough - Customer Flow (B2C)](#2-visual-walkthrough---customer-flow-b2c)
3. [Visual Walkthrough - Vendor ERP (B2B)](#3-visual-walkthrough---vendor-erp-b2b)
4. [Visual Walkthrough - Admin Console](#4-visual-walkthrough---admin-console)
5. [Core Technical Implementations](#5-core-technical-implementations)
6. [Tech Stack & Local Setup](#6-tech-stack--local-setup)

---

## 1. Platform Overview

Traditional e-commerce platforms operate on a static, unilateral pricing model. Bargit disrupts this by digitizing the local shopping experience. 
* **For Customers:** Discover premium products within your immediate vicinity and negotiate prices in real-time.
* **For Vendors:** A complete digital storefront to manage inventory and interact directly with local buyers.
* **For Administrators:** A master console to maintain platform integrity.

---

## 2. Visual Walkthrough - Customer Flow (B2C)

### 🏠 1. The Home Experience
The entry point featuring global search, dynamic categories, and promotional banners.
<p align="center">
  <img src="https://github.com/user-attachments/assets/f7202772-64f8-48e6-8b99-22aa93d6aff8" width="100%" alt="Customer Home Page" />
</p>

### 🛍️ 2. Product Information
Detailed view of the product, seller distance, and media.
<p align="center">
  <img src="https://github.com/user-attachments/assets/86a1e1f9-6657-46c0-b43f-4a17b09b5e8e" width="100%" alt="Product Info" />
</p>

### 🤝 3. Live Bargaining Engine & Deal Lock
Where customers negotiate the MRP directly with vendors. Once agreed, the deal is locked for checkout.
<p align="center">
  <img src="https://github.com/user-attachments/assets/b9434c49-3ce4-45d3-9ece-3b5652fd24e7" width="48%" alt="Live Bargaining Room" />
  <img src="https://github.com/user-attachments/assets/3636a21a-556c-45b0-9e52-714039a113cb" width="48%" alt="Deal Locked - Proceed to Pay" />
</p>

### 🛒 4. Cart & Payment Gateway
Seamless purchasing process with integrated Razorpay payments.
<p align="center">
  <img src="https://github.com/user-attachments/assets/498689d2-8f3e-44e8-8724-4a48f760772f" width="100%" alt="Shopping Cart" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/2923cd11-0999-4d1c-aa8e-2819963a50f0" width="48%" alt="Single Booking" />
  <img src="https://github.com/user-attachments/assets/45c53584-1382-43cf-bcfc-e7b7608af104" width="48%" alt="Razorpay Integration" />
</p>

### 📍 5. Hyperlocal Discovery & Smart Filters
Dynamic product feeds based on location and negotiation status.
<p align="center">
  <img src="https://github.com/user-attachments/assets/4eecdc56-1bcd-46b2-ab4a-f6e671542626" width="100%" alt="Location Options Feed" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/d8f35df2-85b6-46e9-a2d4-5a29df6a5491" width="48%" alt="Nearby Tab" />
  <img src="https://github.com/user-attachments/assets/85427fd4-3883-4e10-9338-a80f7ed261d8" width="48%" alt="Bargainable Filter" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/2080e5c2-7b3f-4939-9b07-c32b05ea2fac" width="48%" alt="Recent Products" />
  <img src="https://github.com/user-attachments/assets/8d72623c-b44f-46f9-b7f6-557c367587a4" width="48%" alt="Fixed Price Filter" />
</p>

### 🔍 6. Categories & Search
<p align="center">
  <img src="https://github.com/user-attachments/assets/acba7db7-9da4-4682-9ae6-b33579f08339" width="48%" alt="Categories Page" />
  <img src="https://github.com/user-attachments/assets/5c2b2ac5-8d45-4580-8721-c9ae70520ad1" width="48%" alt="Search Results" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/367f24ef-2ac3-4325-b21b-28ece6116c80" width="48%" alt="Specific Category" />
  <img src="https://github.com/user-attachments/assets/97c9993a-5476-4ff6-a7cc-36853b6f5bad" width="48%" alt="Related Categories" />
</p>

### 👤 7. Comprehensive Customer Profile
Centralized dashboard for orders, wishlist, and addresses.
<p align="center">
  <img src="https://github.com/user-attachments/assets/03d2bd19-4f51-42d5-8b6c-f87caa7606a4" width="100%" alt="Account Settings" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/ae0f5013-3867-476b-a692-f2549363d62f" width="48%" alt="My Orders" />
  <img src="https://github.com/user-attachments/assets/fcfdd5fb-d750-4ff4-85ed-0b674afe7be9" width="48%" alt="Order Details" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/12247c93-b760-4581-bb2c-4a900af4afcc" width="32%" alt="Wishlist" />
  <img src="https://github.com/user-attachments/assets/ddb77017-1e46-47c3-b6ca-19fa32e400ab" width="32%" alt="Saved Addresses" />
  <img src="https://github.com/user-attachments/assets/5156c94c-1ed6-4d63-91f2-10362a3721c7" width="32%" alt="Edit Address" />
</p>

### 🔐 8. User Authentication
<p align="center">
  <img src="https://github.com/user-attachments/assets/b0b74667-5cc5-4224-8e2e-5922690bb1cf" width="48%" alt="Customer Login" />
  <img src="https://github.com/user-attachments/assets/c2a01792-d281-4bc1-be3d-81c9cacca2b4" width="48%" alt="Customer Signup" />
</p>

---

## 3. Visual Walkthrough - Vendor ERP (B2B)
A robust environment for local business owners to operate their digital branch.

### 📊 1. Vendor Dashboard Overview
<p align="center">
  <img src="https://via.placeholder.com/800x400?text=Vendor+Dashboard+Image+Pending" width="100%" alt="Vendor Dashboard" />
</p>

### 📦 2. Inventory & Add Product
<p align="center">
  <img src="https://via.placeholder.com/800x400?text=Vendor+Inventory+Image+Pending" width="48%" alt="Vendor Inventory" />
  <img src="https://via.placeholder.com/800x400?text=Add+Product+Form+Image+Pending" width="48%" alt="Add Product" />
</p>

### ⚙️ 3. Settings (Shop, Payout, Location)
<p align="center">
  <img src="https://via.placeholder.com/800x400?text=Shop+Details+Image+Pending" width="32%" alt="Shop Details" />
  <img src="https://via.placeholder.com/800x400?text=Payout+Details+Image+Pending" width="32%" alt="Payout Details" />
  <img src="https://via.placeholder.com/800x400?text=Location+Setup+Image+Pending" width="32%" alt="Location Setup" />
</p>



## 4. Visual Walkthrough - Admin Console
The isolated interface for system administrators to oversee the marketplace.

### 🛡️ 1. Master Dashboard & Vendor Management
<p align="center">
  <img src="https://via.placeholder.com/800x400?text=Admin+Dashboard+Image+Pending" width="48%" alt="Admin Dashboard" />
  <img src="https://via.placeholder.com/800x400?text=Vendor+Approvals+Image+Pending" width="48%" alt="Vendor Management" />
</p>

---

## 5. Core Technical Implementations
* **Role-Based Access Control (RBAC):** Utilizing React Context API combined with JWT validation.
* **Geospatial Queries:** Leveraging MongoDB's `2dsphere` indexes to perform `$near` queries.
* **Real-time State Management:** Fluid cart and bargaining data synchronization.

## 6. Tech Stack & Local Setup
**Client-Side:** React 18, Vite, Material UI (@mui/material), Framer Motion, Lucide-React  
**Server-Side:** Node.js, Express.js, MongoDB Atlas, JSON Web Tokens (JWT), Bcrypt

```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/bargit-nearby-bargain-marketplace.git](https://github.com/YOUR_GITHUB_USERNAME/bargit-nearby-bargain-marketplace.git)
cd bargit-nearby-bargain-marketplace

# Backend
cd backend
npm install
npm start

# Frontend
cd ../frontend
npm install
npm run dev
