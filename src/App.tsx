import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import AI from "./pages/AI";
import Conventional from "./pages/Conventional";
import FHA from "./pages/FHA";
import USDA from "./pages/USDA";
import VA from "./pages/VA";
import Jumbo from "./pages/Jumbo";
import ARM from "./pages/ARM";
import SecondMortgage from "./pages/SecondMortgage";
import Heloc from "./pages/Heloc";
import Refinance from "./pages/Refinance";
import CashOutRefi from "./pages/CashOutRefi";
import Affordability from "./pages/Affordability";
import Qualification from "./pages/Qualification";
import RentOrBuy from "./pages/RentOrBuy";
import ExtraPayments from "./pages/ExtraPayments";
import BiWeeklyPayments from "./pages/BiWeeklyPayments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/mortgage-assistant" element={<AI />} />
            <Route path="/conventional-mortgage-calculator" element={<Conventional />} />
            <Route path="/fha-loan-calculator" element={<FHA />} />
            <Route path="/usda-loan-calculator" element={<USDA />} />
            <Route path="/va-loan-calculator" element={<VA />} />
            <Route path="/jumbo-loan-calculator" element={<Jumbo />} />
            <Route path="/adjustable-rate-mortgage-calculator" element={<ARM />} />
            <Route path="/second-mortgage-calculator" element={<SecondMortgage />} />
            <Route path="/heloc-calculator" element={<Heloc />} />
            <Route path="/refinance-calculator" element={<Refinance />} />
            <Route path="/cash-out-refinance-calculator" element={<CashOutRefi />} />
            <Route path="/house-affordability" element={<Affordability />} />
            <Route path="/mortgage-qualification-calculator" element={<Qualification />} />
            <Route path="/rent-or-buy" element={<RentOrBuy />} />
            <Route path="/extra-mortgage-payments-calculator" element={<ExtraPayments />} />
            <Route path="/bi-weekly-mortgage-payments-calculator" element={<BiWeeklyPayments />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
