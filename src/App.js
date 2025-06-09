import { useEffect } from 'react';
import AppRoutes from './AppRoutes';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Loading from './components/Loading/Loading';
import { useLoading } from './hooks/useLoading';
import { setLoadingInterceptor } from './interceptors/loadingInterceptor';

import './App.css'; // Global styles

function App() {
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    setLoadingInterceptor({ showLoading, hideLoading });
  }, [showLoading, hideLoading]);

  return (
    <div className="app-container">
      {/* Loading indicator */}
      <Loading />

      {/* Header at top */}
      <Header />

      {/* Main content via routes */}
      <main className="main-content">
        <AppRoutes />
      </main>

      {/* Footer at bottom */}
      <Footer />
    </div>
  );
}

export default App;
