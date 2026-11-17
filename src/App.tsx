import { Suspense } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { pages, NotFoundPage } from "./routes";

// Redirect component to enforce trailing slashes
const TrailingSlashRedirect = () => {
  const location = useLocation();
  // Don't redirect real files (e.g. /404.html, /BingSiteAuth.xml, /robots.txt) because
  // it breaks static hosting and prerendered output paths.
  const looksLikeFile = location.pathname.includes(".");

  // If path doesn't end with / and isn't the root, redirect to trailing slash version
  if (!looksLikeFile && location.pathname !== "/" && !location.pathname.endsWith("/")) {
    return <Navigate to={`${location.pathname}/${location.search}${location.hash}`} replace />;
  }
  return null;
};

const queryClient = new QueryClient();

// Tags shared by every page. Page components add their own title,
// description, canonical, robots and structured data.
const SiteMeta = () => (
  <Helmet>
    <meta property="og:site_name" content="MortgageCalculation.net" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:image" content="https://mortgagecalculation.net/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="MortgageCalculation.net: free mortgage calculators" />
    <meta name="twitter:image" content="https://mortgagecalculation.net/og-image.png" />
  </Helmet>
);

const App = () => (
  <HelmetProvider>
    <SiteMeta />
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <TrailingSlashRedirect />
          <ScrollToTop />
          <Suspense fallback={null}>
            <Routes>
              {pages.flatMap(({ path, Component }) =>
                path === "/"
                  ? [<Route key={path} path="/" element={<Component />} />]
                  : [
                      <Route key={path} path={path} element={<Component />} />,
                      <Route key={`${path}/`} path={`${path}/`} element={<Component />} />,
                    ],
              )}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
