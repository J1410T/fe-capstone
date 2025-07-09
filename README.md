# 🚀 FPTU Science Research Project Management (SRPM)

**Vietnamese**: Ứng dụng quản lý đề tài nghiên cứu khoa học cấp trường
**Abbreviation**: SRPM

A comprehensive web application for managing university-level science research projects, built with React, TypeScript, and modern web technologies.

---

## 🌐 Overview

This is the client-side frontend of **SRPM**, built with modern web technologies to provide a responsive, efficient, and user-friendly interface for managing university-level science research projects.

### Related Repositories

- [Backend Website](https://github.com/johnnypham14112003/be-capstone)

## 🚀 Features

### Core Functionality

- **Project Management**: Create, track, and manage research projects
- **Task Management**: Assign and monitor tasks with deadlines and priorities
- **Milestone Tracking**: Set and track project milestones with progress indicators
- **User Management**: Role-based access control for different user types
- **Document Management**: Upload, organize, and share project documents
- **Budget Tracking**: Monitor project budgets and expenses
- **Evaluation System**: Comprehensive project evaluation and approval workflows

### User Roles

- **Principal Investigator (PI)**: Project leaders with full project control
- **Team RESEARCHERs**: Researchers and staff assigned to projects
- **Host Institution**: Administrative oversight and resource management
- **Council RESEARCHERs**: Project evaluation and approval authority
- **Staff**: Administrative support and system management

## 🛠️ Technology Stack

### Frontend

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Modern component library
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Tanstack Table** - Advanced data tables
- **Tanstack Query** - Data fetching and state management
- **Axios** - Promise-based HTTP client for API integration
- **Lucide React** - Icon library

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Vite** - Build tool and dev server

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/UI components
│   ├── common/         # Shared components (StatusBadge, DataCard, etc.)
│   ├── forms/          # Form components (FormField, FormSection)
│   └── tasks/          # Task-related components
├── pages/              # Page components
│   ├── ProjectDetail/  # Project detail pages
│   ├── TaskManagement/ # Task management pages
│   ├── PrincipalInvestigator/ # PI-specific pages
│   └── ...            # Other page directories
├── layouts/            # Layout components
├── contexts/           # React contexts (Auth, Theme, etc.)
├── hooks/              # Custom hooks
├── lib/                # Utility libraries
├── shared/             # Shared utilities and types
│   ├── utils/          # Consolidated utility functions
│   └── types/          # TypeScript types
├── types/              # Global type definitions
└── assets/             # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd fe-capstone
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development server**

   ```bash
   pnpm dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## 👨‍💻 Developers

- [Phùng Trần Mai Hà](https://github.com/J1410T)
- [Đoàn Huỳnh Tường Vy](https://github.com/tuong-vy-se173622)

---
