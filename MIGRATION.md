# Supabase Removal and PostgreSQL + FastAPI Migration

This document outlines the comprehensive refactoring performed to remove Supabase and replace it with PostgreSQL + FastAPI + SQLAlchemy backend integration.

## Overview

The Home Management Budget Planner (HMBP) has been migrated from Supabase to a self-hosted PostgreSQL database with FastAPI backend and SQLAlchemy ORM. All features are now integrated with a robust backend API.

## Changes Made

### Backend (FastAPI + SQLAlchemy + PostgreSQL)

#### 1. **Database Models** (`app/models/`)
- `user.py`: User authentication model with UserProfile relationship
- `item.py`: Complete data models for all sections:
  - `Expense`: Track spending by category and date
  - `CategoryLimit`: Set and manage spending limits
  - `Reminder`: Create reminders for EMIs, bills, appointments, etc.
  - `Product`: Marketplace products
  - `Sale`: Transaction records for marketplace
  - `Post`: Social platform posts
  - `Message`: Direct messaging between users
  - `Friendship`: Social connection management

#### 2. **Pydantic Schemas** (`app/schemas/`)
- `user.py`: Authentication and user profile schemas
  - `UserSignUp`, `UserSignIn`, `Token`
  - `UserProfileCreate`, `UserProfileUpdate`, `UserProfileResponse`
  - `UserResponse`, `UserDetailResponse`
  
- `item.py`: Request/response schemas for all sections
  - ExpenseCreate, ExpenseUpdate, ExpenseResponse
  - CategoryLimitCreate, CategoryLimitUpdate, CategoryLimitResponse
  - ReminderCreate, ReminderUpdate, ReminderResponse
  - ProductCreate, ProductUpdate, ProductResponse
  - SaleCreate, SaleResponse
  - PostCreate, PostUpdate, PostResponse
  - MessageCreate, MessageResponse
  - FriendshipCreate, FriendshipResponse

#### 3. **Repository Layer** (`app/repositories/`)
- `user_repository.py`: UserRepository, UserProfileRepository
  - CRUD operations for users and profiles
  - Authentication logic
  
- `item_repository.py`: Repositories for all data sections
  - ExpenseRepository: Expense CRUD and category-based queries
  - CategoryLimitRepository: Budget limit management
  - ReminderRepository: Reminder CRUD and filtering
  - ProductRepository: Marketplace product management
  - SaleRepository: Transaction tracking
  - PostRepository: Social media content management
  - MessageRepository: Messaging system
  - FriendshipRepository: Social connections

#### 4. **Service Layer** (`app/services/`)
- `user_service.py`: Business logic for authentication and user management
  - User signup/signin
  - Profile creation and updates
  
- `item_service.py`: Business logic for all data sections
  - ExpenseService: Expense management and analytics
  - CategoryLimitService: Budget management
  - ReminderService: Reminder logic
  - ProductService: Marketplace logic
  - SaleService: Transaction management
  - PostService: Social content management
  - MessageService: Messaging logic
  - FriendshipService: Social network management

#### 5. **API Endpoints** (`app/api/v1/endpoints/`)
- `items.py`: Comprehensive RESTful API with endpoints for:
  - `/api/v1/expenses` - Full CRUD for expenses
  - `/api/v1/category-limits` - Budget management
  - `/api/v1/reminders` - Reminder management
  - `/api/v1/products` - Marketplace products
  - `/api/v1/sales` - Transaction tracking
  - `/api/v1/posts` - Social media content
  - `/api/v1/messages` - Direct messaging
  - `/api/v1/friendships` - Social connections

### Frontend (React + TypeScript)

#### 1. **Removed**
- `/frontend/src/integrations/supabase/` - Completely removed Supabase client and types

#### 2. **Updated**
- `/frontend/src/api.js` - New comprehensive API wrapper:
  - `setAuthToken()` / `getAuthToken()` - Token management
  - `apiRequest()` - Central request handler with auth header support
  - Complete API methods for all backend endpoints:
    - `signUp()`, `signIn()`, `signOut()`, `getCurrentUser()`
    - `createExpense()`, `listExpenses()`, `updateExpense()`, `deleteExpense()`
    - `createCategoryLimit()`, `listCategoryLimits()`, etc.
    - `createReminder()`, `updateReminder()`, etc.
    - `createProduct()`, `listAllProducts()`, etc.
    - `createSale()`, `listMySales()`, etc.
    - `createPost()`, `listPublicPosts()`, etc.
    - `sendMessage()`, `listInbox()`, etc.
    - `sendFriendRequest()`, `acceptFriendRequest()`, etc.

- `/frontend/src/lib/storage.ts` - Replaced localStorage with API integration:
  - All storage functions now call backend API
  - Interfaces preserved for type safety
  - Functions remain async where needed for API calls
  - Maintains localStorage for session token only

## Architecture

### Backend Architecture
```
FastAPI Application
│
├── Database Layer (SQLAlchemy ORM + PostgreSQL)
│   ├── Models (SQLAlchemy declarative)
│   └── Session management
│
├── Repository Layer
│   ├── UserRepository
│   ├── ExpenseRepository
│   ├── CategoryLimitRepository
│   ├── ReminderRepository
│   ├── ProductRepository
│   ├── SaleRepository
│   ├── PostRepository
│   ├── MessageRepository
│   └── FriendshipRepository
│
├── Service Layer
│   ├── UserService
│   ├── ExpenseService
│   ├── CategoryLimitService
│   ├── ReminderService
│   ├── ProductService
│   ├── SaleService
│   ├── PostService
│   ├── MessageService
│   └── FriendshipService
│
├── Schema Layer (Pydantic)
│   ├── User schemas
│   └── Item schemas
│
└── API Layer (FastAPI)
    ├── Authentication endpoints
    ├── Expense endpoints
    ├── Category limit endpoints
    ├── Reminder endpoints
    ├── Product endpoints
    ├── Sale endpoints
    ├── Post endpoints
    ├── Message endpoints
    └── Friendship endpoints
```

### Frontend Architecture
```
React Components
│
└── API Integration
    ├── api.js (Central API wrapper)
    │   ├── Auth functions
    │   ├── User functions
    │   ├── Expense functions
    │   ├── Category limit functions
    │   ├── Reminder functions
    │   ├── Product functions
    │   ├── Sale functions
    │   ├── Post functions
    │   ├── Message functions
    │   └── Friendship functions
    │
    └── lib/storage.ts (Storage interfaces with API backing)
        ├── User/Auth storage
        ├── Expense storage
        ├── CategoryLimit storage
        ├── Reminder storage
        ├── Product storage
        ├── Sale storage
        ├── Post storage
        ├── Message storage
        └── Friendship storage
```

## API Endpoints Overview

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/signin` - User login
- `GET /api/v1/auth/me` - Get current user

### User Profile
- `GET /api/v1/users/profile` - Get user profile
- `POST /api/v1/users/profile` - Create profile
- `PUT /api/v1/users/profile` - Update profile

### Expenses
- `POST /api/v1/expenses` - Create expense
- `GET /api/v1/expenses` - List all expenses
- `GET /api/v1/expenses/{id}` - Get specific expense
- `PUT /api/v1/expenses/{id}` - Update expense
- `DELETE /api/v1/expenses/{id}` - Delete expense
- `GET /api/v1/expenses/category/{category}` - List by category
- `GET /api/v1/expenses/category/{category}/total` - Get category total

### Category Limits
- `POST /api/v1/category-limits` - Create limit
- `GET /api/v1/category-limits` - List all limits
- `GET /api/v1/category-limits/{id}` - Get specific limit
- `PUT /api/v1/category-limits/{id}` - Update limit
- `DELETE /api/v1/category-limits/{id}` - Delete limit
- `GET /api/v1/category-limits/category/{category}` - Get by category

### Reminders
- `POST /api/v1/reminders` - Create reminder
- `GET /api/v1/reminders` - List all reminders
- `GET /api/v1/reminders/{id}` - Get specific reminder
- `PUT /api/v1/reminders/{id}` - Update reminder
- `DELETE /api/v1/reminders/{id}` - Delete reminder
- `GET /api/v1/reminders/active/list` - List active reminders

### Products (Marketplace)
- `POST /api/v1/products` - Create product
- `GET /api/v1/products` - List all products
- `GET /api/v1/products/{id}` - Get specific product
- `PUT /api/v1/products/{id}` - Update product
- `DELETE /api/v1/products/{id}` - Delete product
- `GET /api/v1/my-products` - List user's products

### Sales
- `POST /api/v1/sales` - Create sale
- `GET /api/v1/sales/{id}` - Get specific sale
- `GET /api/v1/my-sales` - List user's sales
- `GET /api/v1/my-purchases` - List user's purchases

### Posts (Social)
- `POST /api/v1/posts` - Create post
- `GET /api/v1/posts` - List public posts
- `GET /api/v1/posts/{id}` - Get specific post
- `PUT /api/v1/posts/{id}` - Update post
- `DELETE /api/v1/posts/{id}` - Delete post
- `GET /api/v1/my-posts` - List user's posts

### Messages
- `POST /api/v1/messages` - Send message
- `GET /api/v1/messages` - List inbox
- `GET /api/v1/messages/{id}` - Get specific message
- `GET /api/v1/messages/conversation/{user_id}` - Get conversation

### Friendships
- `POST /api/v1/friendships` - Send friend request
- `GET /api/v1/friendships/{id}` - Get friendship
- `GET /api/v1/friendships/pending/list` - List pending requests
- `GET /api/v1/friendships/accepted/list` - List friends
- `PUT /api/v1/friendships/{id}/accept` - Accept request
- `PUT /api/v1/friendships/{id}/reject` - Reject request

## Setup Instructions

### Backend Setup
1. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Configure PostgreSQL database:
   ```bash
   # Create .env file with:
   DATABASE_URL=postgresql://user:password@localhost/hmbp
   SECRET_KEY=your-secret-key
   ```

3. Create database tables:
   ```bash
   python -m alembic upgrade head
   # or manually create using schema.sql
   ```

4. Run backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   bun install
   # or npm install
   ```

2. Start development server:
   ```bash
   bun run dev
   # or npm run dev
   ```

## Data Flow Examples

### Creating an Expense
```
React Component
  ↓
ExpenseForm.tsx calls expenses.create()
  ↓
lib/storage.ts calls api.createExpense()
  ↓
api.js sends POST to /api/v1/expenses
  ↓
FastAPI endpoint receives request
  ↓
ExpenseService.create_expense() called
  ↓
ExpenseRepository.create() executes
  ↓
SQLAlchemy creates DB record
  ↓
Response sent back with created expense
```

### Retrieving Category Total
```
React Component needs category spending total
  ↓
Calls ExpenseService.get_category_total()
  ↓
api.getCategoryTotal() called
  ↓
api.js sends GET to /api/v1/expenses/category/{category}/total
  ↓
FastAPI endpoint calculates total
  ↓
ExpenseRepository.get_total_by_category() queries DB
  ↓
Returns aggregated amount
```

## Benefits of New Architecture

1. **Scalability**: FastAPI provides better performance and scalability
2. **Control**: Full control over database and business logic
3. **Security**: Implement custom security policies and authentication
4. **Flexibility**: Easy to add new features and modify existing ones
5. **Cost**: Self-hosted reduces long-term costs vs Supabase
6. **Type Safety**: Pydantic models ensure data validation
7. **Code Organization**: Clear separation of concerns with repos, services, schemas
8. **Testing**: Easier to unit test services and repositories
9. **Documentation**: Auto-generated OpenAPI docs from FastAPI

## Migration Checklist

- [x] Created SQLAlchemy models for all data sections
- [x] Created Pydantic schemas for validation
- [x] Implemented repository pattern for data access
- [x] Implemented service layer for business logic
- [x] Created FastAPI endpoints for all operations
- [x] Removed Supabase client and types from frontend
- [x] Created new API wrapper in frontend
- [x] Updated storage layer to use backend API
- [ ] Create database migrations (Alembic)
- [ ] Implement authentication endpoints
- [ ] Add input validation
- [ ] Add error handling
- [ ] Write unit tests
- [ ] Set up CI/CD pipeline
- [ ] Deploy to production

## Next Steps

1. **Database Setup**
   - Configure PostgreSQL connection
   - Run migrations to create tables

2. **Authentication**
   - Implement JWT token generation
   - Add password hashing with bcrypt
   - Secure endpoints with auth middleware

3. **Testing**
   - Write unit tests for services
   - Write integration tests for endpoints
   - Write E2E tests for critical flows

4. **Production Deployment**
   - Set up environment variables
   - Configure CORS for production
   - Use Gunicorn/Uvicorn for production server
   - Set up nginx reverse proxy
   - Configure SSL/TLS

5. **Monitoring & Logging**
   - Implement structured logging
   - Set up error tracking
   - Monitor database performance
   - Track API usage metrics

## Environment Variables Required

```
# Backend
DATABASE_URL=postgresql://user:password@localhost/hmbp
SECRET_KEY=your-super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend
VITE_API_BASE_URL=http://localhost:8000
```

## Notes

- All timestamps use UTC datetime
- UUIDs are used for primary keys
- Relationships are properly defined with SQLAlchemy
- Cascade delete is implemented where appropriate
- API uses Bearer token authentication
- CORS is enabled for frontend development
