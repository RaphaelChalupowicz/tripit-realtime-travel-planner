import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import HealthCheck from "./pages/HealthCheck";
import Demo from "./pages/demoPage";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Routes>
          <Route path="/api" element={<HealthCheck />} />
          <Route path="/" element={<Demo />} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
