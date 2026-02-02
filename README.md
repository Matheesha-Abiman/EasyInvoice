# 📱 EasyInvoice – Mobile Billing App

**EasyInvoice** is a cross-platform mobile application built using **React Native (Expo + TypeScript)** and **Firebase**.  
It helps users create, manage, and share invoices quickly in a simple and user-friendly way.

This project was developed as the **Final Project for ITS 2127 – Advanced Mobile Developer (AMD)**.

---

## 🚀 Features

### 🔐 User Authentication
- Secure registration and login using **Firebase Authentication**
- Each user can only see their own bills
- Logout functionality included

### 🧾 Bill Management (Full CRUD)
Users can:
- ➕ Create new bills  
- 📖 View previously created bills  
- ✏️ Edit existing bills  
- ❌ Delete bills  

Each bill includes:
- Customer name  
- Customer phone number  
- Date  
- Multiple items  
- Automatically calculated grand total  

### 📦 Bill Items
Each bill supports multiple items with:
- Item name  
- Quantity  
- Price  
- Auto-calculated item total  

Users can add, update, and remove items easily.

### 📄 PDF Invoice Generation & Sharing
- Generate a professional **PDF invoice**
- PDF is created directly on the device
- Share instantly via WhatsApp, Email, Drive, etc.
- PDF is **not stored online** (generated only when needed)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React Native (Expo)** | Cross-platform mobile development |
| **TypeScript** | Type-safe JavaScript development |
| **Firebase Authentication** | User login & registration |
| **Cloud Firestore** | Store bills and items |
| **React Navigation** | App navigation |
| **React Context API** | State management |
| **Expo Print** | Convert invoice HTML to PDF |
| **Expo File System** | Save PDF locally |
| **Expo Sharing** | Share PDF using device apps |

---
