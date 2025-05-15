import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import PaymentSuccess from './payment-success'; // Bunu ekle!
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/payment-success" element={<PaymentSuccess />} /> {/* Burayı ekle! */}
      </Routes>
    </Router>
  </React.StrictMode>
);
