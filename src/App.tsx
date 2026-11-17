import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";

// Every route except the homepage is loaded on demand so each calculator
// only downloads its own code (recharts, chatbot, Supabase client, etc.).
const AI = lazy(() => import("./pages/AI"));
const Conventional = lazy(() => import("./pages/Conventional"));
const FHA = lazy(() => import("./pages/FHA"));
const USDA = lazy(() => import("./pages/USDA"));
const VA = lazy(() => import("./pages/VA"));
const Jumbo = lazy(() => import("./pages/Jumbo"));
const ARM = lazy(() => import("./pages/ARM"));
const SecondMortgage = lazy(() => import("./pages/SecondMortgage"));
const Heloc = lazy(() => import("./pages/Heloc"));
const Refinance = lazy(() => import("./pages/Refinance"));
const CashOutRefi = lazy(() => import("./pages/CashOutRefi"));
const Affordability = lazy(() => import("./pages/Affordability"));
const Qualification = lazy(() => import("./pages/Qualification"));
const RentOrBuy = lazy(() => import("./pages/RentOrBuy"));
const ExtraPayments = lazy(() => import("./pages/ExtraPayments"));
const BiWeeklyPayments = lazy(() => import("./pages/BiWeeklyPayments"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Redirect component to enforce trailing slashes
const TrailingSlashRedirect = () => {
  const location = useLocation();
  // Don't redirect real files (e.g. /404.html, /BingSiteAuth.xml, /robots.txt) because
  // it breaks static hosting + react-snap output paths.
  const looksLikeFile = location.pathname.includes(".");

  // If path doesn't end with / and isn't the root, redirect to trailing slash version
  if (!looksLikeFile && location.pathname !== "/" && !location.pathname.endsWith("/")) {
    return <Navigate to={`${location.pathname}/${location.search}${location.hash}`} replace />;
  }
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <TrailingSlashRedirect />
          <ScrollToTop />
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/mortgage-assistant" element={<AI />} />
              <Route path="/mortgage-assistant/" element={<AI />} />
              <Route path="/conventional-mortgage-calculator" element={<Conventional />} />
              <Route path="/conventional-mortgage-calculator/" element={<Conventional />} />
              <Route path="/fha-loan-calculator" element={<FHA />} />
              <Route path="/fha-loan-calculator/" element={<FHA />} />
              <Route path="/usda-loan-calculator" element={<USDA />} />
              <Route path="/usda-loan-calculator/" element={<USDA />} />
              <Route path="/va-loan-calculator" element={<VA />} />
              <Route path="/va-loan-calculator/" element={<VA />} />
              <Route path="/jumbo-loan-calculator" element={<Jumbo />} />
              <Route path="/jumbo-loan-calculator/" element={<Jumbo />} />
              <Route path="/adjustable-rate-mortgage-calculator" element={<ARM />} />
              <Route path="/adjustable-rate-mortgage-calculator/" element={<ARM />} />
              <Route path="/second-mortgage-calculator" element={<SecondMortgage />} />
              <Route path="/second-mortgage-calculator/" element={<SecondMortgage />} />
              <Route path="/heloc-calculator" element={<Heloc />} />
              <Route path="/heloc-calculator/" element={<Heloc />} />
              <Route path="/refinance-calculator" element={<Refinance />} />
              <Route path="/refinance-calculator/" element={<Refinance />} />
              <Route path="/cash-out-refinance-calculator" element={<CashOutRefi />} />
              <Route path="/cash-out-refinance-calculator/" element={<CashOutRefi />} />
              <Route path="/house-affordability" element={<Affordability />} />
              <Route path="/house-affordability/" element={<Affordability />} />
              <Route path="/mortgage-qualification-calculator" element={<Qualification />} />
              <Route path="/mortgage-qualification-calculator/" element={<Qualification />} />
              <Route path="/rent-or-buy" element={<RentOrBuy />} />
              <Route path="/rent-or-buy/" element={<RentOrBuy />} />
              <Route path="/extra-mortgage-payments-calculator" element={<ExtraPayments />} />
              <Route path="/extra-mortgage-payments-calculator/" element={<ExtraPayments />} />
              <Route path="/bi-weekly-mortgage-payments-calculator" element={<BiWeeklyPayments />} />
              <Route path="/bi-weekly-mortgage-payments-calculator/" element={<BiWeeklyPayments />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
