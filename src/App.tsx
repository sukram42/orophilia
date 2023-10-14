import React, { useEffect, useState } from 'react';
import './App.css';
import { Mountains, supabase } from './supabaseClient';

import { Button } from 'antd';
import { BrowserRouter, Navigate, Route, Router, Routes } from 'react-router-dom';
import Home from './views/home/home';
import Login from './views/login/login';
import { Layout } from './views/layout/Layout';
import Peaks from './views/peaks/peaks';

import '@changey/react-leaflet-markercluster/dist/styles.min.css'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Peaks />} />
              <Route path="/home" element={<Home/>}/>
            </Route>
              <Route path="/login" element={<Login />} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;