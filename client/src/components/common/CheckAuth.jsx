import { Navigate, useLocation } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { HashLoader } from "react-spinners";



function CheckAuth({ isAuthenticated, user, isLoading, children }) {
  const location = useLocation();

  // console.log('Location:', location.pathname);
  // console.log('Authenticated:', isAuthenticated);
  // console.log('User:', user);
  if(location.pathname === '/'){
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    }else{
      return user?.role === "admin" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/shop/home" />;

    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <HashLoader color="#008B8B" size={80} speedMultiplier={2} />
      </div>
    );
  }

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    } else {
      return user?.role === "admin" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/shop/home" />;
    }
  }

  if (!isAuthenticated && !location.pathname.startsWith("/auth")) {
    return <Navigate to="/auth/login" />;
  }

  if (isAuthenticated && (location.pathname.includes("/login") || location.pathname.includes("/register"))) {
    return user?.role === "admin" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/shop/home" />;
  }

  if (isAuthenticated && user?.role !== "admin" && location.pathname.includes("/admin")) {
    return <Navigate to="/unauth-page" />;
  }

  if (isAuthenticated && user?.role === "admin" && location.pathname.startsWith("/shop")) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
