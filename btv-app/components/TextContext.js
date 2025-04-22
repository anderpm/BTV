import { createContext, useState } from "react";

export const TextContext = createContext();

export const TextProvider = ({ children }) => {
  const [isDataCaptured, setIsDataCaptured] = useState(false);
  const [buscadores, setBuscadores] = useState([]);

  return (
    <TextContext.Provider
      value={{
        isDataCaptured,
        setIsDataCaptured,
        buscadores,
        setBuscadores,
      }}
    >
      {children}
    </TextContext.Provider>
  );
};
