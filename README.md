# Bargit: Hyperlocal E-Commerce & Dynamic Negotiation Platform

[![Stack](https://img.shields.io/badge/Stack-MERN-0F172A?logo=mongodb&logoColor=white)](#)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-646CFF?logo=vite&logoColor=white)](#)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=nodedotjs&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-FF2E63?logo=open-source-initiative&logoColor=white)](#)

Bargit is a comprehensive, three-tier marketplace designed to bridge the gap between offline local retailers and digital consumers. It introduces a unique dynamic-pricing model through a real-time negotiation engine, backed by precise geo-spatial routing.

---

## 📖 Table of Contents
1. [Platform Overview](#1-platform-overview)
2. [Visual Walkthrough - Customer Experience (B2C)](#2-visual-walkthrough---customer-experience-b2c)
3. [Visual Walkthrough - Vendor ERP (B2B)](#3-visual-walkthrough---vendor-erp-b2b)
4. [Core Technical Implementations](#4-core-technical-implementations)
5. [Tech Stack & Local Setup](#5-tech-stack--local-setup)

---

## 1. Platform Overview

Traditional e-commerce platforms operate on a static, unilateral pricing model. Bargit disrupts this by digitizing the local shopping experience. 
* **For Customers:** Discover premium products within your immediate vicinity and negotiate prices in real-time through our Dynamic Negotiation Engine.
* **For Vendors:** A complete digital storefront (ERP) to manage inventory, track deep analytics, and interact directly with local buyers.
* **For Administrators:** A master console to maintain platform integrity and vendor management.

---

## 2. Visual Walkthrough - Customer Experience (B2C)

### 🏠 1. The Home & Discovery
The entry point featuring global search, location awareness, and promotional banners.
![Customer Home Page](https://github.com/user-attachments/assets/f7202772-64f8-48e6-8b99-22aa93d6aff8)

### 🤝 2. Core Feature: Dynamic Negotiation
Detailed product view and the live bargaining room where deals are locked.
![Product Info](https://github.com/user-attachments/assets/86a1e1f9-6657-46c0-b43f-4a17b09b5e8e)

| Live Negotiation Room | Deal Locked (Proceed to Pay) |
| :---: | :---: |
| ![Bargaining](https://github.com/user-attachments/assets/b9434c49-3ce4-45d3-9ece-3b5652fd24e7) | ![Deal Locked](https://github.com/user-attachments/assets/3636a21a-556c-45b0-9e52-714039a113cb) |

### 🛒 3. Cart & Payment Gateway
| Shopping Cart | Razorpay Integration |
| :---: | :---: |
| ![Cart](https://github.com/user-attachments/assets/498689d2-8f3e-44e8-8724-4a48f760772f) | ![Razorpay](https://github.com/user-attachments/assets/45c53584-1382-43cf-bcfc-e7b7608af104) |

### 📍 4. Hyperlocal Filters & Discovery
| Nearby Tab | Bargainable Filter |
| :---: | :---: |
| ![Nearby](https://github.com/user-attachments/assets/d8f35df2-85b6-46e9-a2d4-5a29df6a5491) | ![Bargainable](https://github.com/user-attachments/assets/85427fd4-3883-4e10-9338-a80f7ed261d8) |

| Categories Hub | Search Results |
| :---: | :---: |
| ![Categories](https://github.com/user-attachments/assets/acba7db7-9da4-4682-9ae6-b33579f08339) | ![Search](https://github.com/user-attachments/assets/5c2b2ac5-8d45-4580-8721-c9ae70520ad1) |

### 👤 5. Customer Profile & Management
| Order History | Wishlist & Addresses |
| :---: | :---: |
| ![Orders](https://github.com/user-attachments/assets/ae0f5013-3867-476b-a692-f2549363d62f) | ![Addresses](https://github.com/user-attachments/assets/ddb77017-1e46-47c3-b6ca-19fa32e400ab) |

---

## 3. Visual Walkthrough - Vendor ERP (B2B)

### 🚀 1. Vendor Onboarding & Authentication
Dedicated "Sell with Us" landing page and multi-step registration flow.
![Vendor Landing](https://github.com/user-attachments/assets/a848791f-3cc3-43f1-80f2-fc28dff39c3d)

| Step 1: Shop Setup | Step 2: Verification |
| :---: | :---: |
| ![Step 1](https://github.com/user-attachments/assets/7e83d62b-a036-4080-8e60-36f1ab041201) | ![Step 2](https://github.com/user-attachments/assets/67127b46-ca70-4b09-873b-ac60a52a3380) |

### 📈 2. Dashboard & Advanced Analytics
Complete oversight of sales, revenue, and customer engagement metrics.
![Vendor Dashboard](https://github.com/user-attachments/assets/ecaec9e9-ac1e-4d1d-8bb6-ba4adb1641c7)

| Earnings & Payouts | Analytics Charts |
| :---: | :---: |
| ![Earnings](https://github.com/user-attachments/assets/5e561963-4fa9-4b07-bd0e-7cc279a40a4a) | ![Analytics 1](https://github.com/user-attachments/assets/0ad7b588-91df-4e3e-a955-76f6bb2783bb) |

### 📦 3. Store & Product Management
| Inventory List | Add New Product |
| :---: | :---: |
| ![Inventory](https://github.com/user-attachments/assets/7b8fe10d-9fc7-4ef8-9346-6474c0d0e89b) | ![Add Product](https://github.com/user-attachments/assets/adce4666-5bcc-4a8d-80d0-bafa12e428a5) |

### ⚙️ 4. Advanced Vendor Settings
| Location (Map) | Shop Profile |
| :---: | :---: |
| ![Map](https://github.com/user-attachments/assets/28482c31-3134-4a2e-9c88-3c7ddebdcfc5) | ![Shop Info](https://github.com/user-attachments/assets/12b07543-c56f-4060-a623-7b388998d560) |

---

## 4. Core Technical Implementations

* **Dynamic Negotiation Engine:** A real-time pricing module that allows bilateral agreement between buyers and sellers.
* **Geospatial Routing:** Utilizing MongoDB's `2dsphere` index to calculate real-time distance between user and vendor location.
* **RBAC (Role-Based Access Control):** Highly secure authentication layer separating Customer, Vendor, and Admin ecosystems.

## 5. Tech Stack & Local Setup

**Frontend:** React 18, Vite, Material UI, Framer Motion  
**Backend:** Node.js, Express, MongoDB Atlas, JWT, Bcrypt

```bash
# Clone the repository
git clone [https://github.com/YOUR_GITHUB_USERNAME/bargit.git](https://github.com/YOUR_GITHUB_USERNAME/bargit.git)

# Install & Start Backend
cd backend && npm install && npm start

# Install & Start Frontend
cd ../frontend && npm install && npm run dev
