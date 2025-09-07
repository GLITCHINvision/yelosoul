import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  //  Redirect if not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  //  Only admins can access adminOnly routes
  if (adminOnly && !currentUser.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}


