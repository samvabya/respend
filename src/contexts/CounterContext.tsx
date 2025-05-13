// contexts/CounterContext.tsx
import React, { createContext, useState, useContext } from 'react';

// Define the context type
interface CounterContextType {
  count: number;
  increment: () => void;
}

// Create the context with default values
const CounterContext = createContext<CounterContextType>({
  count: 0,
  increment: () => {},
});

// Create a provider component
export const CounterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(prev => prev + 1);
  };

  return (
    <CounterContext.Provider value={{ count, increment }}>
      {children}
    </CounterContext.Provider>
  );
};

// Custom hook to use the counter
export const useCounter = () => {
  return useContext(CounterContext);
};