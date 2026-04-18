import AppRoutes from "./app/AppRouts";
import AuthInitializer from "./app/AuthInitializer";

function App() {
  return (
    <>
      <AuthInitializer />
      <AppRoutes />
    </>
  );
}

export default App;
