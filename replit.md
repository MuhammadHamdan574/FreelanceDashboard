# Task Management Dashboard

## Overview

This is a modern task management dashboard built with React, Express, and PostgreSQL. The application features a comprehensive project and task management system with real-time updates, user authentication, and a responsive design using shadcn/ui components.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit for global state management
- **Data Fetching**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Schema Definition**: Drizzle with Zod validation
- **Session Management**: connect-pg-simple for PostgreSQL-based sessions
- **Development**: Hot module replacement with Vite integration

### Key Components

#### Database Schema
- **Users**: Authentication and user profiles with roles and status
- **Projects**: Project management with categories, priorities, and team assignments
- **Tasks**: Task tracking with status, priority, and assignee management
- **Comments**: Task-level commenting system
- **Activities**: Activity tracking for audit trails

#### Frontend Components
- **Dashboard**: Main dashboard with stats cards, recent projects, and activity feed
- **Project Wizard**: Multi-step project creation with validation
- **Task Management**: Full CRUD operations with filtering and pagination
- **Notification System**: Real-time notifications with Redux state management
- **Responsive Design**: Mobile-first approach with collapsible sidebar

#### State Management (Modular Redux Toolkit Structure)
- **Store Structure**: Organized in features-based architecture
  - `/store/features/auth/` - Authentication slice with user management
  - `/store/features/projects/` - Project CRUD operations with async thunks
  - `/store/features/tasks/` - Task management with filtering and pagination
  - `/store/features/ui/` - Modal states, sidebar toggle, and loading states
  - `/store/features/notifications/` - Toast notifications and alerts
- **Types**: Centralized type definitions in `/store/types/`
- **Selectors**: Organized selectors in `/store/selectors/`
- **Hooks**: Custom typed hooks in `/store/hooks/`
- **Async Operations**: Full async thunk integration for API calls

## Data Flow

1. **Authentication**: User sessions managed through PostgreSQL-based storage
2. **Data Fetching**: React Query handles server state with automatic caching and refetching
3. **State Updates**: Redux Toolkit manages client state with predictable updates
4. **Real-time Updates**: Optimistic updates with server synchronization
5. **Form Validation**: Zod schemas ensure data integrity across client and server

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@radix-ui/***: Headless UI components for accessibility
- **@tanstack/react-query**: Server state management
- **@reduxjs/toolkit**: State management
- **framer-motion**: Animation library
- **wouter**: Lightweight routing
- **zod**: Schema validation

### Development Dependencies
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **PostCSS**: CSS processing

## Deployment Strategy

### Development Setup
- Vite dev server with HMR for frontend
- Express server with TypeScript compilation via tsx
- Database migrations through Drizzle Kit
- Environment variables for database configuration

### Production Build
- Frontend built with Vite to `dist/public`
- Backend bundled with esbuild to `dist/index.js`
- Static file serving through Express
- Database migrations applied via `drizzle-kit push`

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment flag for production optimizations
- Development-specific features disabled in production

## Changelog
```
Changelog:
- June 29, 2025. Initial setup
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```