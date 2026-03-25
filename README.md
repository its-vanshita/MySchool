# VidDarpan - Unified School ERP Ecosystem

VidDarpan is a comprehensive digital management platform for modern educational institutions, designed to bridge the gap between administration, classrooms, and homes. This repository contains the entire ecosystem, including the mobile application for all stakeholders and the dedicated web dashboards for institutional management.

## 📁 Repository Structure

The project is organized into three primary modules within this repository:

### 1. [Mobile App](mobile_app/)
A native mobile application built with **React Native (Expo)**. It provides role-based access for:
- **School Admins**: Monitor institutional health on the go.
- **Teachers**: Manage attendance, homework, and parent communication.
- **Parents**: Real-time access to child's academic progress, attendance, and fee payments.

### 2. [Marketing Website](website/viddarpan.com/)
The public-facing brand website for VidDarpan. Built with **Vite, React, and Tailwind CSS**, it serves as the primary landing page for potential institutional partners, highlighting features and ecosystem capabilities.

### 3. [ERP Dashboard](website/erp.viddarpan.com/)
The industrial-grade administrative portal for institutions. It provides high-throughput management tools for:
- **Principal Dashboard**: Financial analytics and staff oversight.
- **Teacher Hub**: Dedicated web workspace for heavy administrative tasks like grading and lesson planning.

---

## 🚀 Quick Start for Developers

Each module is independent and requires its own setup.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (for mobile app)

### Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/its-vanshita/MySchool.git
   cd MySchool
   ```

2. **Setup Mobile App:**
   ```bash
   cd mobile_app
   npm install
   npx expo start
   ```

3. **Setup Marketing Website:**
   ```bash
   cd ../website/viddarpan.com
   npm install
   npm run dev
   ```

4. **Setup ERP Dashboard:**
   ```bash
   cd ../erp.viddarpan.com
   npm install
   npm run dev
   ```

---

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Mobile**: React Native, Expo
- **Build Tooling**: Vite
- **State Management**: React Context API
- **Icons**: Lucide React
- **Animations**: Framer Motion

---

## 🔒 Security & Branding Note
- This ecosystem uses a **Unique ID system** for secure, role-based access across all platforms.
- Ensure all environment variables (`.env`) are correctly configured in each subdirectory for backend/Supabase connectivity.

---

## 📄 License
© 2024 VidDarpan. Under private institutional license. All rights reserved.
