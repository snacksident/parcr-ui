import React, { useEffect } from 'react';
import AppRouter from './routes/AppRouter';
import { requestCameraPermissions } from './helpers/RequestCameraPermission';

function App() {
  useEffect(() => {
    requestCameraPermissions();
  }, []);

  return <AppRouter />;
}

export default App;
