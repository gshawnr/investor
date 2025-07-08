import { createContext, useState, useContext, ReactNode } from "react";

type AppError = {
  message: string;
  statusCode?: number;
  source?: string;
};

type ErrorContextType = {
  error: AppError | null;
  setError: (err: AppError) => void;
  clearError: () => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setErrorState] = useState<AppError | null>(null);

  const setError = (err: AppError) => {
    setErrorState(err);
  };

  const clearError = () => setErrorState(null);

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
