import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ProductInfo from './pages/ProductInfo'; 
import Footer from './components/Footer';
import Booking from './pages/Booking';
import Categories from './pages/Categories';
import Cart from './pages/Cart'
import MyOrder from './pages/MyOrder'
import VendorAuth from './pages/vendor/VendorAuth';
import ProtectedRoute from './ProtectedRoute';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorEarnings from './pages/vendor/VendorEarnings';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorAnalytics from './pages/vendor/VendorAnalytics';
import VendorInventory from './pages/vendor/VendorInventory';
import VendorAddProduct from './pages/vendor/VendorAddProduct';
import VendorAccount from './pages/vendor/VendorAccount';
import CustomerProfile from './pages/CustomerProfile';
import VendorEditProduct from './pages/vendor/VendorEditProduct';
import BargainRoom from './pages/BargainRoom';
import SearchResults from './pages/SearchResults';
import VendorDrafts from './pages/vendor/VendorDrafts';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="app">
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
     
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product/:id" element={<ProductInfo />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/vendor/auth" element={<VendorAuth />} />
          <Route path="/categories" element={<Categories />} />

         
          <Route path="/booking/:id" element={
            <ProtectedRoute allowedRoles={['customer']} redirectPath="/auth">
              <Booking />
            </ProtectedRoute>
          } />
          
          <Route path="/cart" element={
            <ProtectedRoute allowedRoles={['customer']} redirectPath="/auth">
              <Cart />
            </ProtectedRoute>
          } />
          
          <Route path="/orders" element={
            <ProtectedRoute allowedRoles={['customer']} redirectPath="/auth">
              <MyOrder />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['customer']} redirectPath="/auth">
              <CustomerProfile />
            </ProtectedRoute>
          } />


          <Route path="/bargain/:id" element={
            
             <ProtectedRoute allowedRoles={['customer']} redirectPath="/auth">

              <BargainRoom />
            
            </ProtectedRoute>

            } />

          <Route path="/search" element={<SearchResults />} />

          
          <Route path="/vendor/dashboard" element={
            <ProtectedRoute allowedRoles={['vendor']} redirectPath="/vendor/auth">
              <VendorDashboard/>
            </ProtectedRoute>
          } />
          <Route path="/vendor/earnings" element={
            <ProtectedRoute allowedRoles={['vendor']} redirectPath="/vendor/auth">
              <VendorEarnings />
            </ProtectedRoute>
          } />
          <Route path="/vendor/orders" element={
            <ProtectedRoute allowedRoles={['vendor']} redirectPath="/vendor/auth">
              <VendorOrders />
            </ProtectedRoute>
          } />
          <Route path="/vendor/analytics" element={
            <ProtectedRoute allowedRoles={['vendor']} redirectPath="/vendor/auth">
              <VendorAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/vendor/inventory" element={
            <ProtectedRoute allowedRoles={['vendor']} redirectPath="/vendor/auth">
              <VendorInventory />
            </ProtectedRoute>
          } />
          <Route path="/vendor/draftProducts" element={
            <ProtectedRoute allowedRoles={['vendor']} redirectPath="/vendor/auth">
              <VendorDrafts />
            </ProtectedRoute>
          } />
       
          <Route path="/vendor/edit-product/:id" element={
            <ProtectedRoute allowedRoles={['vendor']} redirectPath="/vendor/auth">
              <VendorEditProduct />
            </ProtectedRoute>
          } />
          <Route path="/vendor/add-product" element={
            <ProtectedRoute allowedRoles={['vendor']} redirectPath="/vendor/auth">
              <VendorAddProduct />
            </ProtectedRoute>
          } />
          <Route path="/vendor/account" element={
            <ProtectedRoute allowedRoles={['vendor']} redirectPath="/vendor/auth">
              <VendorAccount />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;