# ECO-RECYCLE-SYSTEM

## Overview

The Eco-Recycle System is a comprehensive waste management platform built with Node.js and TypeScript. The system enables users to register waste pickup requests, earn points based on recycling activities, and provides administrators with tools to manage users and confirm pickup operations. The platform includes a chatbot for user assistance and an interactive map showing pickup locations across the UAE.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Express.js with TypeScript for type safety and better development experience
- **Database**: SQLite with Sequelize ORM for simplified local development and deployment
- **Authentication**: JWT-based authentication with role-based access control (user/admin)
- **File Handling**: Multer middleware for image uploads with file type validation and size limits

### API Structure
- **RESTful Design**: Clean separation of concerns with dedicated route handlers
- **Middleware Stack**: CORS, authentication, admin authorization, and error handling middleware
- **Controllers/Services Pattern**: Business logic separated into service layers, controllers handle HTTP concerns

### Data Models
- **User Model**: Supports user registration, authentication, points tracking, and account status management
- **Pickup Model**: Tracks waste pickup requests with status, type, quantity, images, and point calculations
- **Location Model**: Stores pickup locations across UAE emirates with bilingual naming
- **Chat Models**: Supports both simple chatbot messages and conversation history

### Security Features
- **Password Hashing**: bcryptjs for secure password storage
- **JWT Tokens**: Stateless authentication with 7-day expiration
- **Role-based Access**: Separate user and admin privileges
- **Input Validation**: File type and size restrictions for uploads
- **Account Management**: Admin can activate/deactivate user accounts

### Points System
- **Dynamic Calculation**: Points awarded based on waste type and quantity
- **Admin Confirmation**: Points only awarded after admin confirms pickup
- **Tracking**: User points accumulated and displayed in profile

### File Upload System
- **Image Storage**: Local file system storage with organized directory structure
- **File Validation**: Restricted to image formats (JPEG, PNG) with 5MB size limit
- **Secure Naming**: Timestamped filenames to prevent conflicts

## External Dependencies

### Core Framework Dependencies
- **express**: Web application framework
- **sequelize**: ORM for database operations
- **sqlite3**: Database engine for local storage
- **typescript**: Type checking and compilation

### Authentication & Security
- **jsonwebtoken**: JWT token generation and verification
- **bcryptjs**: Password hashing and comparison
- **cors**: Cross-origin resource sharing configuration

### File Handling
- **multer**: Multipart form data and file upload handling

### Development Tools
- **ts-node-dev**: Development server with hot reload
- **jest**: Testing framework for unit and integration tests

### Data Validation
- **zod**: Runtime type checking and data validation

### Environment Configuration
- **dotenv**: Environment variable management for configuration