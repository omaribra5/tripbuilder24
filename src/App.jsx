import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { LanguageProvider, useLanguage } from '@/lib/LanguageContext';
import LanguagePicker from '@/components/LanguagePicker';
import Home from '@/pages/Home';
import NewTrip from '@/pages/NewTrip';
import MyTrips from '@/pages/MyTrips';
import TripDetail from '@/pages/TripDetail';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/new-trip" element={<NewTrip />} />
      <Route path="/my-trips" element={<MyTrips />} />
      <Route path="/trip/:id" element={<TripDetail />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

const AppWithLanguage = () => {
  const { language } = useLanguage();
  if (!language) return null;
  if (language === '__pick__') return <LanguagePicker />;
  return <AuthenticatedApp />;
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AppWithLanguage />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App