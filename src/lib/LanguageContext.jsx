import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const STORAGE_KEY = 'app_language';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(null); // null = not chosen yet

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setLanguage(saved);
    else setLanguage('__pick__'); // trigger picker
  }, []);

  const chooseLanguage = (code) => {
    localStorage.setItem(STORAGE_KEY, code);
    setLanguage(code);
  };

  return (
    <LanguageContext.Provider value={{ language, chooseLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}