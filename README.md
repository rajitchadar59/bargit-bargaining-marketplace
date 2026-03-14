# Bargit: Hyperlocal E-Commerce & Dynamic Negotiation Platform

[![Stack](https://img.shields.io/badge/Stack-MERN-0F172A?logo=mongodb&logoColor=white)](#)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-646CFF?logo=vite&logoColor=white)](#)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=nodedotjs&logoColor=white)](#)

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
> ![Customer Home Page]
> *📌 Note: Capture the top navbar, search bar, and the main hero section.*

**2. Hyperlocal Product Feed**
> Displays products sorted by distance from the user's active delivery address. Features "Negotiable" tags for eligible items.
> 
> ![Hyperlocal Feed](yahan-apni-image-ka-link-daalo.png)
> *📌 Note: Capture the grid of products where the distance (e.g., 500m away) is visible.*

**3. Product Details & Media Player**
> Showcases rich product metadata. Features our custom smart-media player capable of rendering YouTube embeds, raw MP4s, or fallback assets.
> 
> ![Product Details](yahan-apni-image-ka-link-daalo.png)
> *📌 Note: Capture the product image/video gallery and the pricing details.*

**4. The Live Negotiation Room**
> The core interactive module where buyers submit price counter-offers and chat with the vendor.
> 
> ![Live Negotiation](yahan-apni-image-ka-link-daalo.png)
> *📌 Note: Capture the chat interface or the modal where the user is entering a custom price.*

**5. Shopping Cart & Checkout**
> A clean interface summarizing finalized deals and standard purchases before payment.
> 
> ![Shopping Cart](yahan-apni-image-ka-link-daalo.png)
> *📌 Note: Capture the cart items and the total bill summary.*

**6. Comprehensive User Profile**
> The unified dashboard for buyers to manage their entire lifecycle.
> 
> ![Customer Profile Hub](yahan-apni-image-ka-link-daalo.png)
> *📌 Note: Capture the CustomerProfile.jsx view showing the sidebar tabs.*
> 
> **Profile Sub-Sections:**
> * ![Account Settings](yahan-apni-image-ka-link-daalo.png) *(Personal Info)*
> * ![Order History](yahan-apni-image-ka-link-daalo.png) *(Past & Active Orders)*
> * ![Wishlist](yahan-apni-image-ka-link-daalo.png) *(Saved Items)*
> * ![Address Management](yahan-apni-image-ka-link-daalo.png) *(Map/List of saved delivery locations)*

---

### B. Vendor ERP Portal
A robust, secure environment for local business owners to operate their digital branch.

**1. Vendor Authentication**
> Secure login and registration portal specifically for business onboarding.
> 
> ![Vendor Login/Signup](yahan-apni-image-ka-link-daalo.png)

**2. Business Analytics Dashboard**
> High-level metrics displaying total revenue, active orders, and graphical sales data.
> 
> ![Vendor Dashboard Overview](yahan-apni-image-ka-link-daalo.png)

**3. Inventory Management**
> The master list of all products (both published and drafts) with quick-edit capabilities.
> 
> ![Vendor Inventory](yahan-apni-image-ka-link-daalo.png)

**4. Product Creation Engine (Add Product)**
> A detailed form for uploading product details, setting MRP, enabling bargain status, and attaching media links.
> 
> ![Add New Product Form](yahan-apni-image-ka-link-daalo.png)

**5. Order & Bargain Management**
> The control center for reviewing incoming customer bids and processing active orders.
> 
> ![Orders and Negotiations](yahan-apni-image-ka-link-daalo.png)

**6. Advanced Vendor Settings (Account Hub)**
> The comprehensive settings module for store configuration.
> 
> ![Vendor Settings Master](yahan-apni-image-ka-link-daalo.png)
> *📌 Note: Capture the VendorAccount.jsx main view.*
> 
> **Settings Sub-Sections:**
> * ![Shop Details](yahan-apni-image-ka-link-daalo.png) *(Storefront UI setup)*
> * ![Payout Details](yahan-apni-image-ka-link-daalo.png) *(Bank and financial info)*
> * ![Location Setup](yahan-apni-image-ka-link-daalo.png) *(Map coordinates for the hyperlocal engine)*
> * ![Subscription Plan](yahan-apni-image-ka-link-daalo.png) *(Active tier and billing)*

---

### C. Admin Control Center
The isolated interface for system administrators to oversee the entire marketplace.

**1. System Overview Dashboard**
> Master analytics regarding platform health, total users, and total GMV (Gross Merchandise Value).
> 
> ![Admin Master Dashboard](yahan-apni-image-ka-link-daalo.png)

**2. Vendor Verification & Management**
> The gatekeeping UI to approve, reject, or audit vendor applications.
> 
> ![Admin Vendor Management](yahan-apni-image-ka-link-daalo.png)

**3. Customer & Catalog Oversight**
> Tools to monitor user activity and globally moderate the product catalog.
> 
> ![Catalog & Users](yahan-apni-image-ka-link-daalo.png)

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
