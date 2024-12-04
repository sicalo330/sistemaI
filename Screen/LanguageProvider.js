import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState('en');//Esto inicializa en qué idioma va a estar la aplicación por defecto(ver App.js)

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>{/*Todo lo que esté dentro para a tener la propiedad del cambio de idima*/}
      {children}
    </LanguageContext.Provider>
  );
};

// Hook para acceder al contexto
export const useLanguage = () => useContext(LanguageContext);//Se exportará el cambio de idioma como useLanguage similar a un hook
