// src/contexts/ToastContext.tsx
import { createContext, useContext, useRef } from "react";
import { Toast } from "primereact/toast";

type ToastContextType = {
  showSuccess: (message: string) => void;
  showAlert: (message: string) => void;
  showError: (message: string) => void;
};

const ToastContext = createContext({} as ToastContextType);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastRef = useRef<Toast>(null);

  const showSuccess = (message: string) => {
    toastRef.current?.show({
      severity: "success",
      summary: "Sucesso",
      detail: message,
    });
  };

  const showAlert = (message: string) => {
    toastRef.current?.show({
      severity: "warn",
      summary: "Atenção",
      detail: message,
    });
  };

  const showError = (message: string) => {
    toastRef.current?.show({
      severity: "error",
      summary: "Erro",
      detail: message,
    });
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showAlert, showError }}>
      <Toast ref={toastRef} />
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
