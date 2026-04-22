import AppRoutes from "./app/AppRouts";
import AuthInitializer from "./app/AuthInitializer";
import { ThemeModeProvider } from "./app/ThemeModeProvider";

function App() {
  return (
    <ThemeModeProvider>
      <AuthInitializer />
      <AppRoutes />
    </ThemeModeProvider>
  );
}

export default App;
