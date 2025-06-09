import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/layout/Navbar";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const FilmDetail = lazy(() => import("./pages/films/FilmDetail"));
const Bookings = lazy(() => import("./pages/bookings/Bookings"));
const Profile = lazy(() => import("./pages/Profile"));

// Admin pages with lazy loading
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminFilms = lazy(() => import("./pages/admin/AdminFilms"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));

// Import halaman baru
const AllFilms = lazy(() => import("./pages/films/AllFilms"));
const NowPlaying = lazy(() => import("./pages/films/NowPlaying"));
const ComingSoon = lazy(() => import("./pages/films/ComingSoon"));
const Promos = lazy(() => import("./pages/promotions/Promos"));

// Memoized Loading Component
const PageLoader = React.memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <LoadingSpinner />
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
));

PageLoader.displayName = "PageLoader";

// Memoized Layout Wrapper
const LayoutWrapper = React.memo(({ children }) => <Layout>{children}</Layout>);

LayoutWrapper.displayName = "LayoutWrapper";

// Memoized Protected Route Wrapper
const ProtectedLayoutRoute = React.memo(({ children }) => (
  <ProtectedRoute>
    <LayoutWrapper>{children}</LayoutWrapper>
  </ProtectedRoute>
));

ProtectedLayoutRoute.displayName = "ProtectedLayoutRoute";

// Memoized Admin Route Wrapper
const AdminRouteWrapper = React.memo(({ children }) => (
  <AdminRoute>
    <Suspense fallback={<PageLoader />}>{children}</Suspense>
  </AdminRoute>
));

AdminRouteWrapper.displayName = "AdminRouteWrapper";

// Enhanced Error Fallback Component
const ErrorFallback = React.memo(({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-4">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Oops! Something went wrong
      </h2>
      <p className="text-gray-600 mb-6">
        We're sorry for the inconvenience. Please try refreshing the page.
      </p>
      <div className="space-y-3">
        <button
          onClick={resetErrorBoundary}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Go Home
        </button>
      </div>
      {process.env.NODE_ENV === "development" && (
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-gray-500">
            Error Details
          </summary>
          <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap bg-red-50 p-2 rounded">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  </div>
));

ErrorFallback.displayName = "ErrorFallback";

// Main App Component with optimizations
function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log error to monitoring service
        console.error("App Error:", error, errorInfo);
        // You can send to error tracking service like Sentry here
      }}
    >
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            {/* <Navbar /> */}
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Auth Routes */}
                <Route
                  path="/login"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Login />
                    </Suspense>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Register />
                    </Suspense>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ForgotPassword />
                    </Suspense>
                  }
                />
                <Route
                  path="/reset-password"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ResetPassword />
                    </Suspense>
                  }
                />

                {/* Public Routes with Layout */}
                <Route
                  path="/"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <LayoutWrapper>
                        <Home />
                      </LayoutWrapper>
                    </Suspense>
                  }
                />
                <Route
                  path="/films/:slug"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <LayoutWrapper>
                        <FilmDetail />
                      </LayoutWrapper>
                    </Suspense>
                  }
                />
                <Route
                  path="/films"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <LayoutWrapper>
                        <AllFilms />
                      </LayoutWrapper>
                    </Suspense>
                  }
                />
                <Route
                  path="/now-playing"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <LayoutWrapper>
                        <NowPlaying />
                      </LayoutWrapper>
                    </Suspense>
                  }
                />
                <Route
                  path="/coming-soon"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <LayoutWrapper>
                        <ComingSoon />
                      </LayoutWrapper>
                    </Suspense>
                  }
                />
                <Route
                  path="/promo"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <LayoutWrapper>
                        <Promos />
                      </LayoutWrapper>
                    </Suspense>
                  }
                />

                {/* Protected User Routes */}
                <Route
                  path="/bookings"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ProtectedLayoutRoute>
                        <Bookings />
                      </ProtectedLayoutRoute>
                    </Suspense>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ProtectedLayoutRoute>
                        <Profile />
                      </ProtectedLayoutRoute>
                    </Suspense>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRouteWrapper>
                      <AdminDashboard />
                    </AdminRouteWrapper>
                  }
                />
                <Route
                  path="/admin/films"
                  element={
                    <AdminRouteWrapper>
                      <AdminFilms />
                    </AdminRouteWrapper>
                  }
                />
                <Route
                  path="/admin/bookings"
                  element={
                    <AdminRouteWrapper>
                      <AdminBookings />
                    </AdminRouteWrapper>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <AdminRouteWrapper>
                      <AdminUsers />
                    </AdminRouteWrapper>
                  }
                />

                {/* 404 Route */}
                <Route
                  path="*"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <LayoutWrapper>
                        <div className="min-h-screen flex items-center justify-center">
                          <div className="text-center">
                            <h1 className="text-6xl font-bold text-gray-300 mb-4">
                              404
                            </h1>
                            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                              Page Not Found
                            </h2>
                            <p className="text-gray-500 mb-6">
                              The page you're looking for doesn't exist.
                            </p>
                            <a
                              href="/"
                              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Go Home
                            </a>
                          </div>
                        </div>
                      </LayoutWrapper>
                    </Suspense>
                  }
                />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default React.memo(App);
