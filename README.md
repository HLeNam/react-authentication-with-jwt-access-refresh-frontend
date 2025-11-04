# User Registration System - Frontend

A modern React application for user authentication with registration and login functionality, built with React Router, React Hook Form, and shadcn/ui components.

## 📋 Features

-   User-friendly registration and login interface
-   Form validation with React Hook Form
-   Real-time form error messages
-   API integration using Axios and React Query
-   Responsive design with Tailwind CSS
-   shadcn/ui component library for consistent UI
-   Dark/Light theme support
-   Toast notifications with Sonner
-   Type-safe development with TypeScript
-   Client-side routing with React Router

## 🛠️ Tech Stack

-   **React**: 19.x (Latest)
-   **TypeScript**: 5.9
-   **Routing**: React Router 7.x
-   **Form Management**: React Hook Form 7.x
-   **API Client**: Axios 1.12.x
-   **Data Fetching**: TanStack React Query 5.x
-   **UI Components**: shadcn/ui with Tailwind CSS
-   **Styling**: Tailwind CSS 4.x
-   **Notifications**: Sonner 2.x
-   **Build Tool**: Vite 7.x

## 📦 Prerequisites

Before running the project, ensure you have:

-   Node.js (v18 or higher)
-   npm or yarn package manager
-   Backend API running on `http://localhost:3000` (configurable)

## 🚀 Installation

1. **Clone the repository** (if applicable)

    ```bash
    git clone https://github.com/HLeNam/user-registration-system-frontend
    cd user-registration-system-frontend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment variables**

    Create a `.env` file in the root directory:

    ```env
    VITE_API_BASE_URL=http://localhost:3000/api
    ```

## 🏃 Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 🔌 API Integration

### Available API Endpoints

#### User Registration

**Endpoint**: `POST /user/register`

```typescript
export const authService = {
    ...
    register: async (data: RegisterRequest) => {
        const response = await apiClient.post<ApiSuccessResponse<RegisterResponse>>(
            `${PATH}/register`,
            data,
            { withCredentials: true }
        );
        return response.data.data;
    },
    ...
};
```

```typescript
export const useRegisterUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: RegisterRequest) => authService.register(data),
        onSuccess: (data) => {
            console.log("Registration successful:", data);
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        },
    });
};
```

**Request**:

```json
{
    "email": "user@example.com",
    "password": "SecurePassword123!"
}
```

## 📖 Pages Overview

### Home Page

-   Landing page with navigation to Login and Sign Up
-   Displays welcome message and feature highlights

### Register Page

-   Email and password input fields
-   Real-time form validation
-   Submit button with loading state
-   Success/error toast notifications
-   Link to login page for existing users
-   Password strength indicator

### Login Page

-   Email and password input fields
-   Form validation
-   Link to sign up page for new users

## 🎨 UI Components

The application uses shadcn/ui components styled with Tailwind CSS:

-   **Button**: Interactive buttons with variants
-   **Input**: Text input fields with validation
-   **Form**: Form wrapper with error handling
-   **Card**: Container for content sections
-   **Label**: Form labels
-   **Toast**: Notifications (using Sonner)
-   **Loading States**: Visual feedback during API calls

## ✅ Form Validation

Validation is handled by React Hook Form with Zod schemas:

```typescript
import { z } from "zod";

export const registerSchema = z
    .object({
        email: z.email("Invalid email address"),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .refine((val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val), {
                message:
                    "Password must contain at least one lowercase letter, one uppercase letter, and one number",
            }),
        confirmPassword: z
            .string()
            .min(6, "Confirm Password must be at least 6 characters")
            .refine((val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val), {
                message:
                    "Confirm password must contain at least one lowercase letter, one uppercase letter, and one number",
            }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });
```

### Validation Rules

-   **Email**: Valid email format required
-   **Password**: Password must contain at least one lowercase letter, one uppercase letter, and one number

## 🔄 State Management

-   **Form State**: React Hook Form manages form state
-   **Server State**: React Query handles API data fetching and caching
-   **UI State**: React hooks for UI state management

## 🌐 Responsive Design

The application is fully responsive and works on:

-   Desktop (1024px and above)
-   Tablet (768px - 1023px)
-   Mobile (320px - 767px)

## 🚨 Error Handling

The application handles various error scenarios:

-   **Network Errors**: Displays connection failure messages
-   **Validation Errors**: Shows field-specific validation messages
-   **Server Errors**: Displays server error messages from the backend
-   **Loading States**: Shows loading indicators during API calls
