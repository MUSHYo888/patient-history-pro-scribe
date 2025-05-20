
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PatientProvider } from "./context/PatientContext";
import Index from "./pages/Index";
import NewPatient from "./pages/NewPatient";
import History from "./pages/History";
import Summary from "./pages/Summary";
import PatientList from "./pages/PatientList";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PatientProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/new-patient" element={<NewPatient />} />
            <Route path="/history" element={<History />} />
            <Route path="/history/:patientId" element={<History />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/summary/:patientId" element={<Summary />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PatientProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
