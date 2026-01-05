import { useEffect } from 'react';
import { AuthProvider } from './context/authContext';
import Router from './routes';
import { startBackendKeepWarm } from './utils/keepBackendWarm';

const App = () => {

  // context ek athule tiyna dewal meken access krnn ba wrap wela thiynna one..

  useEffect(() => {
    // Start pinging backend every 5 minutes
    startBackendKeepWarm();
  }, []);

    return (
      <AuthProvider>
        <Router />
      </AuthProvider>
    )
}

export default App