import { useEffect, useState } from 'react'
import './App.css'
import Layout from './components/auth/Layout'
import { Route ,Routes} from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import AdminLayout from './components/admin-view/AdminLayout'
import AdminDashBoard from './pages/admin-view/AdminDashBoard'
import AdminProducts from './pages/admin-view/AdminProducts'
import AdminOrders from './pages/admin-view/AdminOrders'
import AdminFeatures from './pages/admin-view/AdminFeatures'
import ShoppingLayout from './components/shopping-view/ShoppingLayout'
import PageNotFound from './pages/not-found/PageNotFound'
import Shoppinghome from './pages/Shopping-view/Shoppinghome'
import ShoppingListing from './pages/Shopping-view/ShoppingListing'
import ShoppingCheckout from './pages/Shopping-view/ShoppingCheckout'
import ShoppingAcoount from './pages/Shopping-view/ShoppingAcoount'
import CheckAuth from './components/common/CheckAuth'
import UnAuthPage from './pages/unAuth-page/UnAuthPage'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from './store/auth-slice'
import PaypalReturn from './pages/Shopping-view/PaypalReturn'
import PaymentSuccess from './pages/Shopping-view/PaymentSuccess'
import OrderDetailsPage from './pages/admin-view/OrderDetailsPage'
import SearchProducts from './pages/Shopping-view/SearchProducts'


function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector(state => state.auth);

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem('token'))
    dispatch(checkAuth(token));
  }, [dispatch]);
  return (
    <div className='w-full flex flex-col overflow-hidden bg-white'>
      <Routes>
        <Route  path='/'
        element={<CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}></CheckAuth>}
        />
        <Route path="/auth" element={<CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}><Layout /></CheckAuth>}>
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
        </Route>
        <Route path='/admin' element={<CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}><AdminLayout /></CheckAuth>}>
          <Route path='dashboard' element={<CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}><AdminDashBoard /></CheckAuth>} />
          <Route path='products' element={<AdminProducts />} />
          <Route path='orders' element={<AdminOrders />} />
          <Route path='order-details' element={<OrderDetailsPage />} />
          <Route path='features' element={<AdminFeatures />} />
        </Route>
        <Route path='/shop' element={<CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}><ShoppingLayout /></CheckAuth>}>
          <Route path='home' element={<Shoppinghome />} />
          <Route path='listing' element={<ShoppingListing />} />
          <Route path='checkout' element={<ShoppingCheckout />} />
          <Route path='account' element={<ShoppingAcoount />} />
          <Route path='paypal-return' element={<PaypalReturn />} />
          <Route path='payment-success' element={<PaymentSuccess />} />
          <Route path='search' element={<SearchProducts />} />
        </Route>
        <Route path='*' element={<PageNotFound />} />
        <Route path='/unauth-page' element={<UnAuthPage />} />
      </Routes>
    </div>
  );
}

export default App;
