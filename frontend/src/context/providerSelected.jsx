

import React, { createContext, useState, useContext } from 'react';


export const ProviderContext = createContext();


export const useProviderContext = () => {
    return useContext(ProviderContext);
};

export function ProviderProvider({ children }) {

  const [providerSelected, setProviderSelected] = useState(null); 

  
  const contextValue = {
    providerSelected,      
    setProviderSelected   
  };

  return (
    <ProviderContext.Provider value={contextValue}>
      {children}
    </ProviderContext.Provider>
  );
}