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
4. [Visual Walkthrough - Admin Control Center](#4-visual-walkthrough---admin-control-center)
5. [Core Technical Implementations](#5-core-technical-implementations)
6. [Tech Stack & Local Setup](#6-tech-stack--local-setup)

---

## 1. Platform Overview
Traditional e-commerce platforms operate on a static, unilateral pricing model. Bargit disrupts this by digitizing the local shopping experience through **Dynamic Negotiation**.

---

## 2. Visual Walkthrough - Customer Experience (B2C)

### 🏠 1. The Home Experience
<p align="center">
  <img src="https://github.com/user-attachments/assets/f7202772-64f8-48e6-8b99-22aa93d6aff8" width="100%" alt="Customer Home Page" />
</p>

### 🛍️ 2. Product Information & Live Negotiation
<p align="center">
  <img src="https://github.com/user-attachments/assets/86a1e1f9-6657-46c0-b43f-4a17b09b5e8e" width="100%" alt="Product Info" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/b9434c49-3ce4-45d3-9ece-3b5652fd24e7" width="48%" alt="Live Bargaining Room" />
  <img src="https://github.com/user-attachments/assets/3636a21a-556c-45b0-9e52-714039a113cb" width="48%" alt="Deal Locked" />
</p>

### 🛒 3. Cart & Payment Gateway
<p align="center">
  <img src="https://github.com/user-attachments/assets/498689d2-8f3e-44e8-8724-4a48f760772f" width="100%" alt="Shopping Cart" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/2923cd11-0999-4d1c-auto" width="48%" alt="Single Booking" />
  <img src="https://github.com/user-attachments/assets/45c53584-1382-43cf-bcfc-e7b7608af104" width="48%" alt="Razorpay Integration" />
</p>

### 👤 4. Profile & Account Management
<p align="center">
  <img src="https://github.com/user-attachments/assets/03d2bd19-4f51-42d5-8b6c-f87caa7606a4" width="100%" alt="Account Settings" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/ae0f5013-3867-476b-a692-f2549363d62f" width="48%" alt="My Orders" />
  <img src="https://github.com/user-attachments/assets/fcfdd5fb-d750-4ff4-85ed-0b674afe7be9" width="48%" alt="Order Details" />
</p>

---

## 3. Visual Walkthrough - Vendor ERP (B2B)

### 📈 1. Dashboard & Analytics
<p align="center">
  <img src="https://github.com/user-attachments/assets/ecaec9e9-ac1e-4d1d-8bb6-ba4adb1641c7" width="100%" alt="Vendor Dashboard" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/91ef56ec-329a-45ad-930b-f9ae018b1c35" width="48%" alt="Analytics Main" />
  <img src="https://github.com/user-attachments/assets/5e561963-4fa9-4b07-bd0e-7cc279a40a4a" width="48%" alt="Earnings" />
</p>

### 📦 2. Inventory & Store Hub
<p align="center">
  <img src="https://github.com/user-attachments/assets/7b8fe10d-9fc7-4ef8-9346-6474c0d0e89b" width="48%" alt="Inventory" />
  <img src="https://github.com/user-attachments/assets/adce4666-5bcc-4a8d-80d0-bafa12e428a5" width="48%" alt="Add Product" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/12b07543-c56f-4060-a623-7b388998d560" width="48%" alt="Shop Details" />
  <img src="https://github.com/user-attachments/assets/28482c31-3134-4a2e-9c88-3c7ddebdcfc5" width="48%" alt="Map Setup" />
</p>

---

## 4. Visual Walkthrough - Admin Control Center

### 🛡️ 1. Authentication & Core Dashboard
Master entry point and high-level platform health metrics.
<p align="center">
  <img src="https://github.com/user-attachments/assets/c5fa78cc-e2cb-4772-a51f-031819a7f798" width="48%" alt="Admin Login Page" />
  <img src="https://github.com/user-attachments/assets/c98d75d0-f2d6-482e-a0ef-506a803a4134" width="48%" alt="Admin Dashboard" />
</p>

### 🏢 2. Vendor & Customer Directory
Management of marketplace participants including a lifecycle 'Trash' system for vendors.
<p align="center">
  <img src="https://github.com/user-attachments/assets/214569c0-e186-4a74-a528-7ec2aeddc68d" width="48%" alt="Vendor Management" />
  <img src="https://github.com/user-attachments/assets/d36e03a5-9add-4269-9453-9630d1fd97de" width="48%" alt="Vendor Management Trash" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/6f63361f-995d-4685-ab4a-bc85df0624c5" width="48%" alt="Customer Directory" />
  <img src="https://github.com/user-attachments/assets/7743f604-5dd3-42c5-b798-dc16384df138" width="48%" alt="Global Catalog" />
</p>

### ⚙️ 3. Platform Configuration & Subscriptions
Tuning platform-wide parameters and managing vendor subscription models.
<p align="center">
  <img src="https://github.com/user-attachments/assets/9e4f025a-d996-4666-bceb-cc21f0472fb5" width="48%" alt="Platform Settings" />
  <img src="https://github.com/user-attachments/assets/a6c7a69d-e57c-4ca8-ab4c-0bfd32428945" width="48%" alt="Vendor Plans" />
</p>

---

## 5. Core Technical Implementations
* **Dynamic Negotiation Engine:** Real-time bilateral pricing module.
* **Geospatial Queries:** MongoDB `2dsphere` index for precise location-based store discovery.
* **RBAC:** Secure architecture for Customer, Vendor, and Admin ecosystems.

## 6. Tech Stack & Local Setup
**MERN Stack:** React 18 (Vite), Node.js, Express, MongoDB Atlas

```bash
# Clone & Setup
git clone [https://github.com/YOUR_USERNAME/bargit.git](https://github.com/YOUR_USERNAME/bargit.git)
cd bargit && cd backend && npm install && npm start
cd ../frontend && npm install && npm run dev
