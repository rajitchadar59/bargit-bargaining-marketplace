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

### 🏠 1. Discovery & Home Experience
<p align="center">
  <img src="https://github.com/user-attachments/assets/f7202772-64f8-48e6-8b99-22aa93d6aff8" width="48%" alt="Customer Home Page" />
  <img src="https://github.com/user-attachments/assets/86a1e1f9-6657-46c0-b43f-4a17b09b5e8e" width="48%" alt="Product Info" />
</p>

### 🤝 2. Live Bargaining Engine & Deal Lock
<p align="center">
  <img src="https://github.com/user-attachments/assets/b9434c49-3ce4-45d3-9ece-3b5652fd24e7" width="48%" alt="Live Bargaining Room" />
  <img src="https://github.com/user-attachments/assets/3636a21a-556c-45b0-9e52-714039a113cb" width="48%" alt="Deal Locked - Proceed to Pay" />
</p>

### 🛒 3. Cart & Payment Gateway
<p align="center">
  <img src="https://github.com/user-attachments/assets/498689d2-8f3e-44e8-8724-4a48f760772f" width="48%" alt="Shopping Cart" />
  <img src="https://github.com/user-attachments/assets/2923cd11-0999-4d1c-aa8e-2819963a50f0" width="48%" alt="Single Booking" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/45c53584-1382-43cf-bcfc-e7b7608af104" width="48%" alt="Razorpay Integration" />
  <img src="https://github.com/user-attachments/assets/b0b74667-5cc5-4224-8e2e-5922690bb1cf" width="48%" alt="Customer Login" />
</p>

### 📍 4. Hyperlocal Discovery & Smart Filters
<p align="center">
  <img src="https://github.com/user-attachments/assets/4eecdc56-1bcd-46b2-ab4a-f6e671542626" width="48%" alt="Location Options Feed" />
  <img src="https://github.com/user-attachments/assets/d8f35df2-85b6-46e9-a2d4-5a29df6a5491" width="48%" alt="Nearby Tab" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/85427fd4-3883-4e10-9338-a80f7ed261d8" width="48%" alt="Bargainable Filter" />
  <img src="https://github.com/user-attachments/assets/8d72623c-b44f-46f9-b7f6-557c367587a4" width="48%" alt="Fixed Price Filter" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/acba7db7-9da4-4682-9ae6-b33579f08339" width="48%" alt="Categories Page" />
  <img src="https://github.com/user-attachments/assets/5c2b2ac5-8d45-4580-8721-c9ae70520ad1" width="48%" alt="Search Results" />
</p>

### 👤 5. Comprehensive Customer Profile
<p align="center">
  <img src="https://github.com/user-attachments/assets/03d2bd19-4f51-42d5-8b6c-f87caa7606a4" width="48%" alt="Account Settings" />
  <img src="https://github.com/user-attachments/assets/ae0f5013-3867-476b-a692-f2549363d62f" width="48%" alt="My Orders" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/fcfdd5fb-d750-4ff4-85ed-0b674afe7be9" width="48%" alt="Order Details" />
  <img src="https://github.com/user-attachments/assets/12247c93-b760-4581-bb2c-4a900af4afcc" width="48%" alt="Wishlist" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/ddb77017-1e46-47c3-b6ca-19fa32e400ab" width="48%" alt="Saved Addresses" />
  <img src="https://github.com/user-attachments/assets/5156c94c-1ed6-4d63-91f2-10362a3721c7" width="48%" alt="Edit Address" />
</p>

---

## 3. Visual Walkthrough - Vendor ERP (B2B)
A robust environment for local business owners to operate their digital branch.

### 🚀 1. Vendor Onboarding & Authentication
<p align="center">
  <img src="https://github.com/user-attachments/assets/a848791f-3cc3-43f1-80f2-fc28dff39c3d" width="48%" alt="Vendor Landing Page" />
  <img src="https://github.com/user-attachments/assets/f03544b3-d66b-44d2-891b-793a46e4eff2" width="48%" alt="Vendor Login" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/7e83d62b-a036-4080-8e60-36f1ab041201" width="48%" alt="Vendor Signup Step 1" />
  <img src="https://github.com/user-attachments/assets/67127b46-ca70-4b09-873b-ac60a52a3380" width="48%" alt="Vendor Signup Step 2" />
</p>

### 📊 2. Vendor Dashboard & Orders
<p align="center">
  <img src="https://github.com/user-attachments/assets/ecaec9e9-ac1e-4d1d-8bb6-ba4adb1641c7" width="48%" alt="Vendor Dashboard" />
  <img src="https://github.com/user-attachments/assets/5c4735e5-9072-4c2b-b098-2a6e497fffb2" width="48%" alt="Vendor Orders" />
</p>

### 📈 3. Deep Vendor Analytics & Earnings
<p align="center">
  <img src="https://github.com/user-attachments/assets/91ef56ec-329a-45ad-930b-f9ae018b1c35" width="48%" alt="Analytics Main Page" />
  <img src="https://github.com/user-attachments/assets/5e561963-4fa9-4b07-bd0e-7cc279a40a4a" width="48%" alt="Vendor Earnings & Payouts" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/0ad7b588-91df-4e3e-a955-76f6bb2783bb" width="48%" alt="Analytics Chart 1" />
  <img src="https://github.com/user-attachments/assets/c3e07042-68b6-4f3d-82ba-f5b2c505e9ef" width="48%" alt="Analytics Chart 2" />
</p>

### 📦 4. Inventory & Product Management
<p align="center">
  <img src="https://github.com/user-attachments/assets/7b8fe10d-9fc7-4ef8-9346-6474c0d0e89b" width="48%" alt="Vendor Inventory" />
  <img src="https://github.com/user-attachments/assets/adce4666-5bcc-4a8d-80d0-bafa12e428a5" width="48%" alt="Add New Product - Top" />
</p>

### ⚙️ 5. Advanced Store Settings (Profile Hub)
<p align="center">
  <img src="https://github.com/user-attachments/assets/fce5f00e-cf0a-4b95-9d80-5a35c39d627f" width="48%" alt="Account & Profile" />
  <img src="https://github.com/user-attachments/assets/12b07543-c56f-4060-a623-7b388998d560" width="48%" alt="Shop Details" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/bf10ce95-c15a-45b7-9c23-d3ec7cafa0a3" width="48%" alt="Payout Details" />
  <img src="https://github.com/user-attachments/assets/28482c31-3134-4a2e-9c88-3c7ddebdcfc5" width="48%" alt="Location Setup with Map" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/c1ff16dc-d984-4c65-b992-baf61f8d2870" width="48%" alt="Advanced Actions" />
  <img src="https://github.com/user-attachments/assets/01997b73-783d-4140-a2cf-5779a0a1bbdb" width="48%" alt="Current Plan" />
</p>

---

## 4. Visual Walkthrough - Admin Console
The isolated interface for system administrators to oversee the marketplace.

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
