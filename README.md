# Bargit: Hyperlocal E-Commerce & Dynamic Negotiation Platform

[![Stack](https://img.shields.io/badge/Stack-MERN-0F172A?logo=mongodb&logoColor=white)](#)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-646CFF?logo=vite&logoColor=white)](#)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=nodedotjs&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-FF2E63?logo=open-source-initiative&logoColor=white)](#)

Bargit is a comprehensive, three-tier marketplace designed to bridge the gap between offline local retailers and digital consumers. It introduces a unique dynamic-pricing model through a real-time negotiation engine, backed by precise geo-spatial routing.

---

## 📖 Table of Contents
1. [Platform Overview](#1-platform-overview)
2. [Complete Visual Walkthrough (Customer Flow)](#2-complete-visual-walkthrough-customer-flow)
3. [Core Technical Implementations](#3-core-technical-implementations)
4. [Tech Stack](#4-tech-stack)
5. [Local Development Setup](#5-local-development-setup)
6. [System Architecture](#6-system-architecture)

---

## 1. Platform Overview

Traditional e-commerce platforms operate on a static, unilateral pricing model. Bargit disrupts this by digitizing the local shopping experience. 

* **For Customers:** Discover premium products from verified local stores within your immediate vicinity and negotiate prices in real-time before checking out.
* **For Vendors:** A complete digital storefront to manage inventory, track analytics, and interact directly with high-intent local buyers.
* **For Administrators:** A master console to maintain platform integrity and monitor systemic revenue.

---

## 2. Complete Visual Walkthrough (Customer Flow)

Below is a detailed, step-by-step visual journey of the buyer experience on Bargit.

### 🔐 1. Authentication
Secure access portals for customers.
* **Customer Login:**
  ![Customer Login](https://github.com/user-attachments/assets/b0b74667-5cc5-4224-8e2e-5922690bb1cf)
* **Customer Signup:**
  ![Customer Signup](https://github.com/user-attachments/assets/c2a01792-d281-4bc1-be3d-81c9cacca2b4)

### 🏠 2. Discovery & Home Experience
The entry point featuring categories and search functionalities.
* **Customer Home Page:**
  ![Customer Home Page](https://github.com/user-attachments/assets/f7202772-64f8-48e6-8b99-22aa93d6aff8)
* **Categories Overview:**
  ![Categories Page](https://github.com/user-attachments/assets/acba7db7-9da4-4682-9ae6-b33579f08339)
* **Specific Category Products:**
  ![Specific Category](https://github.com/user-attachments/assets/367f24ef-2ac3-4325-b21b-28ece6116c80)
* **Search Results Page:**
  ![Search Results](https://github.com/user-attachments/assets/5c2b2ac5-8d45-4580-8721-c9ae70520ad1)
* **Related Categories Section:**
  ![Related Categories](https://github.com/user-attachments/assets/97c9993a-5476-4ff6-a7cc-36853b6f5bad)

### 📍 3. Hyperlocal Routing & Smart Filters
Dynamic product feeds based on location and negotiation status.
* **Location/Nearby Options Feed:**
  ![Location Options Feed](https://github.com/user-attachments/assets/4eecdc56-1bcd-46b2-ab4a-f6e671542626)
* **"Nearby" Tab Active:**
  ![Nearby Tab Items](https://github.com/user-attachments/assets/d8f35df2-85b6-46e9-a2d4-5a29df6a5491)
* **"Recent" Products Feed:**
  ![Recent Feed](https://github.com/user-attachments/assets/2080e5c2-7b3f-4939-9b07-c32b05ea2fac)
* **"Bargainable" Products Filter:**
  ![Bargainable Filter](https://github.com/user-attachments/assets/85427fd4-3883-4e10-9338-a80f7ed261d8)
* **"Fixed Price" Products Filter:**
  ![Fixed Price Filter](https://github.com/user-attachments/assets/8d72623c-b44f-46f9-b7f6-557c367587a4)

### ⚖️ 4. Product Details & Live Negotiation
The core feature where customers check info and negotiate the MRP.
* **Product Information Page:**
  ![Product Info](https://github.com/user-attachments/assets/86a1e1f9-6657-46c0-b43f-4a17b09b5e8e)
* **Live Bargaining Room:**
  ![Bargaining Room](https://github.com/user-attachments/assets/b9434c49-3ce4-45d3-9ece-3b5652fd24e7)
* **Bargain Deal Locked (Proceed to Pay):**
  ![Deal Locked](https://github.com/user-attachments/assets/3636a21a-556c-45b0-9e52-714039a113cb)

### 🛒 5. Cart & Checkout Flow
Seamless purchasing process with integrated payments.
* **Single Item Booking Page:**
  ![Single Booking](https://github.com/user-attachments/assets/2923cd11-0999-4d1c-aa8e-2819963a50f0)
* **Shopping Cart (`Cart.jsx`):**
  ![Shopping Cart](https://github.com/user-attachments/assets/498689d2-8f3e-44e8-8724-4a48f760772f)
* **Razorpay Payment Gateway:**
  ![Razorpay Integration](https://github.com/user-attachments/assets/45c53584-1382-43cf-bcfc-e7b7608af104)

### 👤 6. Comprehensive Customer Profile
The centralized dashboard to manage the entire user lifecycle.
* **Account Settings:**
  ![Account Settings](https://github.com/user-attachments/assets/03d2bd19-4f51-42d5-8b6c-f87caa7606a4)
* **My Orders List:**
  ![My Orders](https://github.com/user-attachments/assets/ae0f5013-3867-476b-a692-f2549363d62f)
* **Detailed Order View:**
  ![Order Details](https://github.com/user-attachments/assets/fcfdd5fb-d750-4ff4-85ed-0b674afe7be9)
* **Wishlist:**
  ![Wishlist](https://github.com/user-attachments/assets/12247c93-b760-4581-bb2c-4a900af4afcc)
* **Saved Addresses Hub:**
  ![Saved Addresses](https://github.com/user-attachments/assets/ddb77017-1e46-47c3-b6ca-19fa32e400ab)
* **Add/Edit Address Form:**
  ![Edit Address Form](https://github.com/user-attachments/assets/5156c94c-1ed6-4d63-91f2-10362a3721c7)

---

## 3. Core Technical Implementations

* **Role-Based Access Control (RBAC):** Utilizing React Context API combined with JWT validation.
* **Geospatial Queries:** Leveraging MongoDB's `2dsphere` indexes to perform `$near` queries.
* **Real-time State Management:** Fluid cart and bargaining data synchronization.

---

## 4. Tech Stack

**Client-Side:** React 18, Vite, Material UI (@mui/material), Framer Motion, Lucide-React  
**Server-Side:** Node.js, Express.js, MongoDB Atlas, JSON Web Tokens (JWT), Bcrypt

---

## 5. Local Development Setup

### 1. Clone & Install
```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/bargit-nearby-bargain-marketplace.git](https://github.com/YOUR_GITHUB_USERNAME/bargit-nearby-bargain-marketplace.git)
cd bargit-nearby-bargain-marketplace
