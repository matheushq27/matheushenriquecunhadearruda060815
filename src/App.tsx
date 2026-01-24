import AppRoutes from "./routes/AppRoutes";
import { ToastProvider } from "./contexts/ToastContext";
import { ConfirmDialog } from 'primereact/confirmdialog';
function App() {

  return (
    <ToastProvider>
      <ConfirmDialog />
      <AppRoutes />
    </ToastProvider>
  );
}

export default App;

