# Modern Blog Application

A full-featured blog application built with Next.js, TypeScript, and PostgreSQL. This project demonstrates modern web development practices and includes features like authentication, admin dashboard, and containerized deployment.

## 🌟 Features

### Authentication & Authorization

- Custom JWT-based authentication system with refresh and access tokens
- Role-based access control (Admin and User roles)
- Secure password hashing with bcrypt
- Protected API routes and middleware

### Frontend

- Modern and responsive UI built with Tailwind CSS
- Dark/Light theme support
- Reusable components using shadcn/ui
- Custom DataTable component with features:
  - Sorting
  - Pagination
  - Column visibility toggle
  - Batch operations
  - Manual and automatic pagination modes
  - Custom cell rendering

### Backend

- Next.js API Routes for backend functionality
- PostgreSQL database with Prisma ORM
- Database schema with relations:
  - Users
  - Posts
  - Categories
  - Comments
- Soft delete support for all entities

### 🏗 Architecture

The project follows a three-layer architecture:

- Client calls server actions
- Actions make fetch requests to internal API routes
- API routes communicate with the database

While direct database access from actions would have been possible, this architecture was specifically chosen to:

- Learn and practice API development
- Gain experience with fetch operations
- Maintain a clear separation of concerns
- Create a more maintainable and scalable structure

### Admin Dashboard

- User management
- Post management
- Category management
- Comment moderation
- Analytics and statistics

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Hook Form, Zod validation
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: Custom JWT implementation
- **Containerization**: Docker, Docker Compose
- **Development**: ESLint, TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version)
- Docker and Docker Compose
- pnpm (recommended) or npm

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mehmetext/blog-app-wt
   cd blog-app-wt
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start the development environment:
   ```bash
   pnpm dev
   ```

### Docker Deployment

1. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

2. The application will be available at `http://localhost:3000`

## 📦 Project Structure

```
src/
├── actions/ # Server actions
├── app/ # Next.js app router pages
│ ├── (site) # Public pages
│ ├── admin # Admin dashboard
│ └── api # API routes
├── components/ # Reusable components
│ └── ui/ # UI components
├── lib/ # Utility functions
└── middleware.ts # Authentication middleware

prisma/
├── schema.prisma # Database schema
└── seed.ts # Seed data
```

## 🔒 Environment Variables

Required environment variables:

```
API_URL=http://localhost:3000/api
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📝 License

This project is licensed under the MIT License.
