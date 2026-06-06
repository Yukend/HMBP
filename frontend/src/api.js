// src/api/api.js
const API_BASE_URL = "http://localhost:8000";

let authToken = localStorage.getItem("auth_token");

export function setAuthToken(token) {
  authToken = token;
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

export function getAuthToken() {
  return authToken;
}

export async function apiRequest(endpoint, method = "GET", data = null, shouldRedirectOn401 = true) {
  const headers = { "Content-Type": "application/json" };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  console.log(`[apiRequest] ${method} ${endpoint}`, data);

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  });

  console.log(`[apiRequest] Response status: ${res.status}`);

  // Handle 401 Unauthorized - don't redirect during auth endpoints
  if (res.status === 401) {
    const errorData = await res.json().catch(() => ({}));
    if (shouldRedirectOn401) {
      setAuthToken(null);
      window.location.href = "/auth";
    }
    throw new Error(errorData.detail || "Unauthorized");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `API error: ${res.statusText}`);
  }

  const result = await res.json();
  console.log(`[apiRequest] Response data:`, result);
  return result;
}

// ==================== Auth API ====================
export async function signUp(email, password) {
  console.log("[signUp] Called with email:", email);
  const result = await apiRequest("/api/v1/auth/signup", "POST", {
    email,
    password,
  }, false);
  console.log("[signUp] Got response:", result);
  setAuthToken(result.access_token);
  return result;
}

export async function signIn(email, password) {
  console.log("[signIn] Called with email:", email);
  const result = await apiRequest("/api/v1/auth/login", "POST", {
    username: email,
    password,
  }, false);
  console.log("[signIn] Got response:", result);
  setAuthToken(result.access_token);
  console.log("[signIn] Token set successfully");
  return result;
}

export function signOut() {
  setAuthToken(null);
}

export async function getCurrentUser() {
  try {
    return await apiRequest("/api/v1/auth/me", "GET");
  } catch {
    return null;
  }
}

// ==================== User Profile API ====================
export async function getUserProfile() {
  return await apiRequest("/api/v1/users/profile", "GET");
}

export async function createUserProfile(profileData) {
  return await apiRequest("/api/v1/users/profile", "POST", profileData);
}

export async function updateUserProfile(profileData) {
  return await apiRequest("/api/v1/users/profile", "PUT", profileData);
}

// ==================== Expense API ====================
export async function createExpense(expense) {
  return await apiRequest("/api/v1/expenses", "POST", expense);
}

export async function getExpense(expenseId) {
  return await apiRequest(`/api/v1/expenses/${expenseId}`, "GET");
}

export async function listExpenses() {
  return await apiRequest("/api/v1/expenses", "GET");
}

export async function listExpensesByCategory(category) {
  return await apiRequest(`/api/v1/expenses?category=${category}`, "GET");
}

export async function getCategoryTotal(category, month, year) {
  let url = `/api/v1/expenses/total?category=${category}`;
  if (month !== undefined) url += `&month=${month}`;
  if (year !== undefined) url += `&year=${year}`;
  return await apiRequest(url, "GET");
}

export async function updateExpense(id, updates) {
  return await apiRequest(`/api/v1/expenses/${id}`, "PUT", updates);
}

export async function deleteExpense(id) {
  return await apiRequest(`/api/v1/expenses/${id}`, "DELETE");
}

// ==================== Category Limits API ====================
export async function listCategoryLimits() {
  return await apiRequest("/api/v1/category-limits", "GET");
}

export async function getCategoryLimitByCategory(category) {
  return await apiRequest(`/api/v1/category-limits/${category}`, "GET");
}

export async function createCategoryLimit(limit) {
  return await apiRequest("/api/v1/category-limits", "POST", limit);
}

export async function updateCategoryLimit(category, updates) {
  return await apiRequest(`/api/v1/category-limits/${category}`, "PUT", updates);
}

export async function deleteCategoryLimit(category) {
  return await apiRequest(`/api/v1/category-limits/${category}`, "DELETE");
}

// ==================== Reminders API ====================
export async function listReminders() {
  return await apiRequest("/api/v1/reminders", "GET");
}

export async function listActiveReminders() {
  return await apiRequest("/api/v1/reminders/active", "GET");
}

export async function createReminder(reminder) {
  return await apiRequest("/api/v1/reminders", "POST", reminder);
}

export async function updateReminder(id, updates) {
  return await apiRequest(`/api/v1/reminders/${id}`, "PUT", updates);
}

export async function deleteReminder(id) {
  return await apiRequest(`/api/v1/reminders/${id}`, "DELETE");
}

// ==================== Products API ====================
export async function listAllProducts() {
  return await apiRequest("/api/v1/products", "GET");
}

export async function listMyProducts() {
  return await apiRequest("/api/v1/products/my", "GET");
}

export async function createProduct(product) {
  return await apiRequest("/api/v1/products", "POST", product);
}

export async function updateProduct(id, updates) {
  return await apiRequest(`/api/v1/products/${id}`, "PUT", updates);
}

export async function deleteProduct(id) {
  return await apiRequest(`/api/v1/products/${id}`, "DELETE");
}

// ==================== Sales API ====================
export async function listMySales() {
  return await apiRequest("/api/v1/sales/my", "GET");
}

export async function listMyPurchases() {
  return await apiRequest("/api/v1/sales/purchases", "GET");
}

export async function createSale(sale) {
  return await apiRequest("/api/v1/sales", "POST", sale);
}

// ==================== Posts API ====================
export async function listPublicPosts() {
  return await apiRequest("/api/v1/posts", "GET");
}

export async function listMyPosts() {
  return await apiRequest("/api/v1/posts/my", "GET");
}

export async function createPost(post) {
  return await apiRequest("/api/v1/posts", "POST", post);
}

export async function updatePost(id, updates) {
  return await apiRequest(`/api/v1/posts/${id}`, "PUT", updates);
}

export async function deletePost(id) {
  return await apiRequest(`/api/v1/posts/${id}`, "DELETE");
}

// ==================== Messages API ====================
export async function listInbox() {
  return await apiRequest("/api/v1/messages/inbox", "GET");
}

export async function listConversation(userId) {
  return await apiRequest(`/api/v1/messages/${userId}`, "GET");
}

export async function sendMessage(message) {
  return await apiRequest("/api/v1/messages", "POST", message);
}
