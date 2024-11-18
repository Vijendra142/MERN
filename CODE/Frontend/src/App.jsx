import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import Home from './Home/Home';
import Login from './Users/Login';
import Register from './Users/Register';
import Cart from './Users/Cart';
import Detils from './Users/Detils';
import Shipping from './Users/Shipping';
import Payment from './Users/Payment';
import Grid from './Users/Grid';
import Navbar from './Admin/Navbar';

import Vieworders from './Users/Vieworders';
import ProfileComponent from './Users/ProfileComponent ';
import AutoPlay from './Users/AutoPlay';
import Nav from './Users/Nav';
import Moreproduct from './Users/Moreproduct';
import Dashboard from './Users/Dashboard';
import Rating from './Users/Rating';
import Vieworder from './Users/Vieworder';
import CartPage from './Users/CartPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchProduct from './Users/SearchProduct';
import PaymentPage from './Users/PaymentPage';
import OrderConfirm from './Users/OrderConfirm';
import FeedbackForm from './Users/FeedbackForm';
import { HelmetProvider } from 'react-helmet-async';
import {Navigate, BrowserRouter as Router ,Route, Routes } from 'react-router-dom';
import RejectOrder from './Users/RejectOrder';
import Layout from './Admin/Layout';
import VerifyOTP from './Users/VerifyOTP';







// admin
import AddProduct from './Admin/AddProduct';
import AddCouponForm from './Admin/AddCouponForm';
import ViewCupon from './Admin/ViewCupon';
import Dahboard from './Admin/Dahboard';
import Users from './Admin/Users';
import ViewProducts from './Admin/ViewProducts';
import Orders from './Admin/Orders';
import Feedbacks from './Admin/Feedbacks';
import Update from './Admin/Update';







const App = () => {
  
  
const [authoer , setauthor] = useState(null)
  

 useEffect(()=>{
  const token = Cookies.get('token');
  setauthor(token)

 console.log(token,"authenticate")
 },[])

 
 
  return (
    <div>
          <HelmetProvider>
      <Router>
        <Routes>
          {/* users router */}
          <Route path='/' element={<Home/>} />
          <Route path='/main' element={<Nav/>} />
          <Route path='/more' element={<Moreproduct/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
  
        <Route path='/home' element={<Dashboard/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/detils/:id' element={<Detils/>} />
        <Route path='/shipping' element={<Shipping/>} />
        <Route path='/payment' element={<PaymentPage/>} />
        <Route path='/gird' element={<Grid/>} />
        <Route path='/orders' element={<Vieworders/>} />
        <Route path='/profile' element={<ProfileComponent/>} />
        <Route path='/play' element={<AutoPlay/>} />
        <Route path='/rating' element={<Rating/>} />
        <Route path='/page' element={<CartPage/>} />
        <Route path='/search' element={<SearchProduct/>} />
        <Route path='/conformorders' element={<OrderConfirm/>} />
        <Route path='/reject' element={<RejectOrder/>} />
        <Route path='/feedback' element={<FeedbackForm/>} />
        {/* <Route path='/admin' element={<Navbar/>} /> */}

      
     
        <Route
        path='*'
        element={<Navigate to='/login' replace />}
      />
   

<Route path='/admin' element={<Navbar/>} />
<Route path='/searchs' element={<SearchProduct/>} />
<Route path='/layout' element={<Layout/>} >
<Route path='dashboard' element={<Dahboard/>} />
<Route path='users' element={<Users/>} />
<Route path='add-product' element={<AddProduct/>} />
<Route path='view-products' element={<ViewProducts/>} />
<Route path='orders' element={<Orders/>} />
<Route path='feedbacks' element={<Feedbacks/>} />
<Route path='update' element={<Update/>} />
<Route path='add-coupon' element={<AddCouponForm/>} />
<Route path='view-coupon' element={<ViewCupon/>} />

</Route>

<Route path='otp' element={<VerifyOTP/>}/>
  





 {/* <Route path='/order' element={<Vieworder/>} /> */}




          {/* admin routes */}

        {/* // <Route path='/admin' element={<Navbar/>} /> */}
        {/* <Route path='/user' element={<Users/>} /> */}
        </Routes>

      </Router>
      <ToastContainer/>
        </HelmetProvider>
      
 
    </div>
  )
}

export default App
