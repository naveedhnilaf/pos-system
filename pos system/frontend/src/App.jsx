import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Root from "./pages/Root";
import Login from "./pages/Login";
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
        {/* ROOT ROUTE */}
        <Route path="/" element={<Root />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />

        {/* ADMIN DASHBOARD - PROTECTED */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoutes requireRole={['admin']}>
              <Dashboard />
            </ProtectedRoutes>
          }
        >
          <Route
            index
            element={<Summary />}
          />
         <Route
            path="categories"
            element={<Categories />}
          />
          <Route
            path="products"
            element={<Product />}
          />
          <Route
            path="suppliers"
            element={<Suppliers />}
          />
          <Route
            path="orders"
            element={<Order />}
          />
          <Route
            path="users"
            element={<User />}
          />
          <Route
            path="profile"
            element={<Profile />}
          />
          <Route
            path="logout"
            element={<h1>Logout</h1>}
          />
        </Route>
        
        {/* CUSTOMER DASHBOARD - PROTECTED */}
        <Route 
          path="/customer-dashboard" 
          element={
            <ProtectedRoutes requireRole={['customer']}>
              <CustomerDashboard />
            </ProtectedRoutes>
          }
        >
          <Route
            index
            element={<h1>Welcome to Customer Dashboard</h1>}
          />
          <Route
            path="products"
            element={<CustomerProducts />}
          />
          <Route
            path="orders"
            element={<CustomerOrders />}
          />
          <Route
            path="profile"
            element={<CustomerProfile />}
          />
        </Route>

        {/* OLD CUSTOMER DASHBOARD ROUTE - REDIRECT TO NEW ONE */}
        <Route 
          path="/customer/dashboard" 
          element={
            <ProtectedRoutes requireRole={['customer']}>
              <CustomerDashboard />
            </ProtectedRoutes>
          } 
        />

        {/* UNAUTHORIZED */}
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
      </Routes>
    </Router>
  );
}

export default App;