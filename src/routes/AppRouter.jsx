import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import ScanBarcode from '../pages/ScanBarcode';
import TakePhotos from '../pages/TakePhotos';
import EnterSpecs from '../pages/EnterSpecs';
import ConfirmUpload from '../pages/ConfirmUpload';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/scan" element={<ScanBarcode />} />
        <Route path="/photos" element={<TakePhotos />} />
        <Route path="/specs" element={<EnterSpecs />} />
        <Route path="/confirm" element={<ConfirmUpload />} />
      </Routes>
    </Router>
  );
}
