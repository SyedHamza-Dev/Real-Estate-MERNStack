import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search'; 
import AdminPage from './pages/AdminPage';
import EmailVerification from './pages/EmailVerification';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'animate.css/animate.min.css';
import Footer from './components/Footer';
import FavoriteProperties from './pages/Favourite';
import ContactUs from './pages/Contact'
import PriceEstimator from './pages/PriceEstimator'
export default function App() {


  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/contactus' element={<ContactUs />} />
        <Route path='/about' element={<About />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path='/search' element={<Search />} />
        <Route path='/price-estimator' element={<PriceEstimator />} />
        <Route path='/favourites' element={<FavoriteProperties />} />
        <Route path='/listing/:listingId' element={<Listing />} />
        {/* <Route path='/verifyEmail' element={<VerifyEmail />} /> Add this route */}
        
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/update-listing/:listingId' element={<UpdateListing />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
