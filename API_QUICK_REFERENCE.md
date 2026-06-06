# Quick Reference: API Usage in Frontend

## Authentication

```typescript
import { signUp, signIn, signOut, getCurrentUser } from '@/api';

// Sign up
const user = await signUp('user@example.com', 'password123');

// Sign in
const result = await signIn('user@example.com', 'password123');
// Token is automatically stored

// Get current user
const currentUser = await getCurrentUser();

// Sign out
signOut();
```

## Expenses

```typescript
import { 
  createExpense, 
  listExpenses, 
  listExpensesByCategory,
  getCategoryTotal,
  updateExpense,
  deleteExpense 
} from '@/api';

// Create expense
const expense = await createExpense({
  category: 'Grocery',
  amount: 50.00,
  description: 'Weekly groceries',
  date: new Date().toISOString()
});

// Get all expenses
const expenses = await listExpenses();

// Filter by category
const groceryExpenses = await listExpensesByCategory('Grocery');

// Get total spent in category for specific month
const total = await getCategoryTotal('Grocery', 10, 2025);

// Update
const updated = await updateExpense(expenseId, {
  amount: 75.00
});

// Delete
await deleteExpense(expenseId);
```

## Category Limits

```typescript
import {
  createCategoryLimit,
  listCategoryLimits,
  getCategoryLimitByCategory,
  updateCategoryLimit,
  deleteCategoryLimit
} from '@/api';

// Create limit
const limit = await createCategoryLimit({
  category: 'Grocery',
  limit: 500.00
});

// Get all limits
const allLimits = await listCategoryLimits();

// Get specific category limit
const groceryLimit = await getCategoryLimitByCategory('Grocery');

// Update limit
const updated = await updateCategoryLimit(limitId, { limit: 600.00 });

// Delete limit
await deleteCategoryLimit(limitId);
```

## Reminders

```typescript
import {
  createReminder,
  listReminders,
  listActiveReminders,
  updateReminder,
  deleteReminder
} from '@/api';

// Create reminder
const reminder = await createReminder({
  title: 'Pay electricity bill',
  description: 'Monthly electricity bill',
  type: 'bill',
  due_date: new Date('2025-11-15').toISOString(),
  frequency: 'monthly'
});

// Get all reminders
const allReminders = await listReminders();

// Get active reminders
const activeReminders = await listActiveReminders();

// Update reminder
const updated = await updateReminder(reminderId, {
  is_active: false
});

// Delete reminder
await deleteReminder(reminderId);
```

## Products (Marketplace)

```typescript
import {
  createProduct,
  listAllProducts,
  listMyProducts,
  updateProduct,
  deleteProduct
} from '@/api';

// Create product
const product = await createProduct({
  name: 'Used Laptop',
  description: 'Excellent condition, works perfectly',
  price: 500.00,
  image_url: 'https://example.com/laptop.jpg',
  status: 'available'
});

// Get all products
const allProducts = await listAllProducts();

// Get my products
const myProducts = await listMyProducts();

// Update product
const updated = await updateProduct(productId, {
  status: 'sold'
});

// Delete product
await deleteProduct(productId);
```

## Sales

```typescript
import {
  createSale,
  listMySales,
  listMyPurchases
} from '@/api';

// Create sale (buy product)
const sale = await createSale({
  product_id: 'product-uuid',
  buyer_id: 'buyer-uuid',
  amount: 500.00,
  delivery_address: '123 Main St',
  delivery_city: 'New York',
  delivery_zip: '10001',
  delivery_phone: '555-1234'
});

// Get my sales (products I sold)
const mySales = await listMySales();

// Get my purchases (products I bought)
const myPurchases = await listMyPurchases();
```

## Posts (Social)

```typescript
import {
  createPost,
  listPublicPosts,
  listMyPosts,
  updatePost,
  deletePost
} from '@/api';

// Create post
const post = await createPost({
  content: 'Just bought a new laptop!',
  video_url: null,
  is_public: true
});

// Get public posts
const publicPosts = await listPublicPosts();

// Get my posts
const myPosts = await listMyPosts();

// Update post
const updated = await updatePost(postId, {
  content: 'Updated content',
  is_public: false
});

// Delete post
await deletePost(postId);
```

## Messages

```typescript
import {
  sendMessage,
  listInbox,
  listConversation
} from '@/api';

// Send message
const message = await sendMessage({
  receiver_id: 'friend-uuid',
  content: 'Hey, how are you?',
  post_id: null  // optional, for commenting on posts
});

// Get inbox
const inbox = await listInbox();

// Get conversation with specific user
const conversation = await listConversation('friend-uuid');
```

## Friendships

```typescript
import {
  sendFriendRequest,
  listPendingRequests,
  listFriends,
  acceptFriendRequest,
  rejectFriendRequest
} from '@/api';

// Send friend request
const friendship = await sendFriendRequest('friend-uuid');

// Get pending requests
const pending = await listPendingRequests();

// Get list of friends
const friends = await listFriends();

// Accept friend request
const accepted = await acceptFriendRequest(friendshipId);

// Reject friend request
const rejected = await rejectFriendRequest(friendshipId);
```

## User Profile

```typescript
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile
} from '@/api';

// Get profile
const profile = await getUserProfile();

// Create profile (after signup)
const newProfile = await createUserProfile({
  username: 'john_doe',
  mobile: '555-1234',
  address: '123 Main St, City',
  date_of_birth: '1990-01-15',
  goal: 'Save $10,000 by year end'
});

// Update profile
const updated = await updateUserProfile({
  mobile: '555-5678',
  goal: 'Save $15,000 by year end'
});
```

## Error Handling

```typescript
import { 
  signIn,
  createExpense,
  toast 
} from '@/api';

try {
  const result = await signIn(email, password);
  // Success
  toast({
    title: 'Success',
    description: 'Logged in successfully'
  });
} catch (error) {
  const message = error instanceof Error ? error.message : 'An error occurred';
  toast({
    variant: 'destructive',
    title: 'Error',
    description: message
  });
}
```

## Storage Layer (Deprecated, use API directly)

The `lib/storage.ts` file now wraps API calls but maintains backward compatibility:

```typescript
import { expenses, categoryLimits, auth } from '@/lib/storage';

// These now call the backend API
const allExpenses = await expenses.getAll();
const limits = await categoryLimits.getAll();
const currentUser = auth.getCurrentUser(); // Synchronous - cached
```

## Important Notes

1. **Authentication**: Token is automatically stored and included in all requests
2. **Async**: All API functions are now async and return Promises
3. **Error Handling**: All errors are thrown and should be caught with try/catch
4. **Base URL**: Points to `http://localhost:8000` by default (configurable in `api.js`)
5. **Types**: Use TypeScript interfaces defined in `/lib/storage.ts`

## Troubleshooting

### 401 Unauthorized
- Token has expired
- User was logged out
- Automatically redirects to `/auth`

### 404 Not Found
- Resource doesn't exist
- Check ID is correct
- Ensure user has permission

### 500 Server Error
- Backend error occurred
- Check backend logs
- Verify request format is correct

### Network Error
- Backend server not running
- Check `VITE_API_BASE_URL` environment variable
- Verify network connectivity
