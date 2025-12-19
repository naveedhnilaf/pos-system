import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Root from "./pages/Root";
import Login from "./Pages/Login";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Dashboard from "./Pages/Dashboard";
import CustomerDashboard from "./Pages/CustomerDashboard";
import Categories from "./Components/Categories";
import Suppliers from "./Components/Suppliers";
import Product from "./Components/Product";
import User from "./Components/User";
import CustomerProducts from "./Components/CustomerProducts";
import CustomerOrders from "./Components/CustomerOrders";
import CustomerProfile from "./Components/CustomerProfile";
import Summary from "./Components/Summary"; 
import Order from "./Components/Order";
import Profile from "./Components/Profile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Admin dashboard - Protected */}
        <Route 
          path="/admin-dashboard/*" 
          element={
            <ProtectedRoutes requireRole={['admin']}>
              <Dashboard />
            </ProtectedRoutes>
          }
        >
          <Route index element={<Summary />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Product />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="orders" element={<Order />} />
          <Route path="users" element={<User />} />
          <Route path="profile" element={<Profile />} />
          <Route path="logout" element={<Navigate to="/login" replace />} />
        </Route>

        {/* Customer dashboard - Protected (accepts both 'customer' and 'user') */}
        <Route 
          path="/customer-dashboard/*" 
          element={
            <ProtectedRoutes requireRole={['customer', 'user']}>
              <CustomerDashboard />
            </ProtectedRoutes>
          }
        >
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<CustomerProducts />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="profile" element={<CustomerProfile />} />
        </Route>

        {/* Old customer dashboard route redirects */}
        <Route path="/customer/dashboard" element={<Navigate to="/customer-dashboard" replace />} />

        {/* Unauthorized access */}
        <Route 
          path="/unauthorized" 
          element={
            <div className="flex items-center justify-center h-screen">
              <p className="font-bold text-3xl text-red-600">
                Unauthorized Access - You don't have permission to view this page
              </p>
            </div>
          } 
        />

        {/* 404 Not Found */}
        <Route path="*" element={<h1 className="text-center text-3xl mt-20">404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
