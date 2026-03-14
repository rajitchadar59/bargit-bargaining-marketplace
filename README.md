# Bargit: Hyperlocal E-Commerce & Dynamic Negotiation Platform

[![Stack](https://img.shields.io/badge/Stack-MERN-0F172A?logo=mongodb&logoColor=white)](#)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-646CFF?logo=vite&logoColor=white)](#)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=nodedotjs&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-FF2E63?logo=open-source-initiative&logoColor=white)](#)

Bargit is a comprehensive, three-tier marketplace designed to bridge the gap between offline local retailers and digital consumers. It introduces a unique dynamic-pricing model through a real-time negotiation engine, backed by precise geo-spatial routing.

---

## 📖 Table of Contents
1. [Platform Overview](#1-platform-overview)
2. [Complete Visual Walkthrough](#2-complete-visual-walkthrough)
   - [Customer Experience (B2C)](#a-customer-experience)
   - [Vendor ERP Portal (B2B)](#b-vendor-erp-portal)
   - [Admin Control Center](#c-admin-control-center)
3. [Core Technical Implementations](#3-core-technical-implementations)
4. [Tech Stack](#4-tech-stack)
5. [Local Development Setup](#5-local-development-setup)
6. [System Architecture](#6-system-architecture)

---

## 1. Platform Overview

Traditional e-commerce platforms operate on a static, unilateral pricing model. Bargit disrupts this by digitizing the local shopping experience. 

* **For Customers:** Discover premium products from verified local stores within your immediate vicinity and negotiate prices in real-time before checking out.
* **For Vendors:** A complete digital storefront to manage inventory, track analytics, and interact directly with high-intent local buyers without exorbitant platform commissions.
* **For Administrators:** A master console to maintain platform integrity, manage vendor subscriptions, and monitor systemic revenue.

---

## 2. Complete Visual Walkthrough

Below is a detailed tour of the entire platform, showcasing the dedicated interfaces for Customers, Vendors, and Administrators.

### A. Customer Experience
The buyer-facing application focuses on product discovery, location awareness, and seamless interaction.

**1. Main Landing & Search (Home Page)**
> The entry point featuring global search, dynamic categories, and promotional banners.
> 
> ![Customer Home Page](https://github.com/user-attachments/assets/f7202772-64f8-48e6-8b99-22aa93d6aff8)

**2. Hyperlocal Product Feed**
> Displays products sorted by distance from the user's active delivery address. Features "Negotiable" tags for eligible items.
> 
> ![Hyperlocal Feed](https://github.com/user-attachments/assets/b0b74667-5cc5-4224-8e2e-5922690bb1cf)

**3. Product Details & Media Player**
> Showcases rich product metadata. Features our custom smart-media player capable of rendering YouTube embeds, raw MP4s, or fallback assets.
> 
> ![Product Details](https://github.com/user-attachments/assets/c2a01792-d281-4bc1-be3d-81c9cacca2b4)

**4. The Live Negotiation Room**
> The core interactive module where buyers submit price counter-offers and chat with the vendor.
> 
> ![Live Negotiation](https://github.com/user-attachments/assets/4eecdc56-1bcd-46b2-ab4a-f6e671542626)

**5. Shopping Cart & Checkout**
> A clean interface summarizing finalized deals and standard purchases before payment.
> 
> ![Shopping Cart](https://github.com/user-attachments/assets/d8f35df2-85b6-46e9-a2d4-5a29df6a5491)

**6. Comprehensive User Profile**
> The unified dashboard for buyers to manage their entire lifecycle.
> 
> ![Customer Profile Hub](https://github.com/user-attachments/assets/2080e5c2-7b3f-4939-9b07-c32b05ea2fac)

**Profile Sub-Sections:**
> * **Account Settings:**
>   ![Account Settings](https://github.com/user-attachments/assets/85427fd4-3883-4e10-9338-a80f7ed261d8)
> * **Order History:**
>   ![Order History](https://github.com/user-attachments/assets/8d72623c-b44f-46f9-b7f6-557c367587a4)
> * **Wishlist:**
>   ![Wishlist](https://github.com/user-attachments/assets/86a1e1f9-6657-46c0-b43f-4a17b09b5e8e)
> * **Address Management:**
>   ![Address Management](https://github.com/user-attachments/assets/2923cd11-0999-4d1c-aa8e-2819963a50f0)

---

### B. Vendor ERP Portal
A robust, secure environment for local business owners to operate their digital branch.

**1. Vendor Authentication**
> Secure login and registration portal specifically for business onboarding.
> 
> ![Vendor Login/Signup](https://github.com/user-attachments/assets/45c53584-1382-43cf-bcfc-e7b7608af104)

**2. Business Analytics Dashboard**
> High-level metrics displaying total revenue, active orders, and graphical sales data.
> 
> ![Vendor Dashboard Overview](https://github.com/user-attachments/assets/acba7db7-9da4-4682-9ae6-b33579f08339)

**3. Inventory Management**
> The master list of all products (both published and drafts) with quick-edit capabilities.
> 
> ![Vendor Inventory](https://github.com/user-attachments/assets/367f24ef-2ac3-4325-b21b-28ece6116c80)

**4. Product Creation Engine (Add Product)**
> A detailed form for uploading product details, setting MRP, enabling bargain status, and attaching media links.
> 
> ![Add New Product Form](https://github.com/user-attachments/assets/498689d2-8f3e-44e8-8724-4a48f760772f)

**5. Order & Bargain Management**
> The control center for reviewing incoming customer bids and processing active orders.
> 
> ![Orders and Negotiations](https://github.com/user-attachments/assets/03d2bd19-4f51-42d5-8b6c-f87caa7606a4)

**6. Advanced Vendor Settings (Account Hub)**
> The comprehensive settings module for store configuration.
> 
> ![Vendor Settings Master](https://github.com/user-attachments/assets/ae0f5013-3867-476b-a692-f2549363d62f)

**Settings Sub-Sections:**
> * **Shop Details:**
>   ![Shop Details](https://github.com/user-attachments/assets/fcfdd5fb-d750-4ff4-85ed-0b674afe7be9)
> * **Payout Details:**
>   ![Payout Details](https://github.com/user-attachments/assets/12247c93-b760-4581-bb2c-4a900af4afcc)
> * **Location Setup:**
>   ![Location Setup](https://github.com/user-attachments/assets/ddb77017-1e46-47c3-b6ca-19fa32e400ab)
> * **Subscription Plan:**
>   ![Subscription Plan](https://github.com/user-attachments/assets/5156c94c-1ed6-4d63-91f2-10362a3721c7)

---

### C. Admin Control Center
The isolated interface for system administrators to oversee the entire marketplace.

**1. System Overview Dashboard**
> Master analytics regarding platform health, total users, and total GMV (Gross Merchandise Value).
> 
> ![Admin Master Dashboard](https://github.com/user-attachments/assets/5c2b2ac5-8d45-4580-8721-c9ae70520ad1)

**2. Vendor Verification & Management**
> The gatekeeping UI to approve, reject, or audit vendor applications.
> 
> ![Admin Vendor Management](https://github.com/user-attachments/assets/97c9993a-5476-4ff6-a7cc-36853b6f5bad)

**3. Customer & Catalog Oversight**
> Tools to monitor user activity and globally moderate the product catalog.
> 
> ![Catalog & Users](https://github.com/user-attachments/assets/b9434c49-3ce4-45d3-9ece-3b5652fd24e7)

**4. Platform Settings**
> Advanced configurations for the Bargit ecosystem.
> 
> ![Admin Extra Dashboard](https://github.com/user-attachments/assets/3636a21a-556c-45b0-9e52-714039a113cb)

---

## 3. Core Technical Implementations

* **Role-Based Access Control (RBAC):** Utilizing React Context API (`AuthContext`, `AdminAuthContext`) combined with JWT validation to ensure users cannot access unauthorized routes (e.g., a buyer cannot access the vendor ERP).
* **Geospatial Queries:** Leveraging MongoDB's `2dsphere` indexes to perform `$near` queries. The system calculates the distance between the user's selected address coordinates and the vendor's physical location coordinates.
* **Smart Media Rendering:** A custom frontend logic layer that detects if a vendor's media string is a YouTube URL, a raw MP4, or empty, automatically rendering the correct HTML (`<iframe>` vs `<video>`) or injecting a local fallback asset.

---

## 4. Tech Stack

**Client-Side:**
* React 18
* Vite (Build Tool & Dev Server)
* Material UI (@mui/material) & Custom CSS
* Framer Motion (UI Animations)
* Lucide-React (Iconography)

**Server-Side:**
* Node.js & Express.js
* MongoDB Atlas (Database)
* Mongoose (ODM)
* JSON Web Tokens (JWT) & Bcrypt (Security)

---

## 5. Local Development Setup

Follow these steps to run the complete platform on your local machine.

### Prerequisites
* Node.js (v16+)
* MongoDB connection string (Atlas or Local)

### 1. Clone & Install
```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/bargit-nearby-bargain-marketplace.git](https://github.com/YOUR_GITHUB_USERNAME/bargit-nearby-bargain-marketplace.git)
cd bargit-nearby-bargain-marketplace
