import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "react-hot-toast";

// Directly Imported Pages
import OccasionPage from "./pages/OccasionPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import ErrorBoundary from "./components/ErrorBoundary";
import FaqPage from "./pages/FaqPage";
import ReturnPolicyPage from "./pages/ReturnPolicyPage";
import ShippingInfoPage from "./pages/ShippingInfoPage";
import ContactUsPage from "./pages/ContactUsPage";

//  Lazy-loaded Pages
const HomePage = lazy(() => import("./pages/HomePage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const AdminStatsPage = lazy(() => import("./pages/AdminStatsPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));

//  Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatBot from "./components/ChatBot";


//  Scroll to Top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Premium Aurora Background */}
      <div className="aurora-container">
        <div className="aurora-blob aurora-1"></div>
        <div className="aurora-blob aurora-2"></div>
        <div className="aurora-blob aurora-3"></div>
      </div>

      {/*  Navbar always visible */}
      <Navbar />
      <ScrollToTop />

      {/* Main Content with Error Boundary */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="text-center py-10 text-[#4a8577] animate-pulse">
                Loading, please wait...
              </div>
            }
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/occasions" element={<OccasionPage />} />
              <Route path="/my-orders" element={<MyOrdersPage />} />
              <Route path="/admin-orders" element={<AdminOrdersPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/return-policy" element={<ReturnPolicyPage />} />
              <Route path="/shipping" element={<ShippingInfoPage />} />
              <Route path="/contact" element={<ContactUsPage />} />

              {/* Admin-only Stats Page */}
              <Route
                path="/admin-stats"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminStatsPage />
                  </ProtectedRoute>
                }
              />

              {/*  404 Page */}
              <Route
                path="*"
                element={
                  <div className="text-center text-red-500 py-10 text-lg">
                    404 | Page Not Found
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      {/*  Footer & Toast Notifications */}
      <Footer />
      <ChatBot />
      <Toaster position="top-right" reverseOrder={false} />
    </div>

  );
}



















