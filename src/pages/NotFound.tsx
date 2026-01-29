import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Home, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Page Not Found | Mortgage Calculation</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to our mortgage calculators." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md">
          Skip to main content
        </a>
        <Header />
        
        <main id="main-content" className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <span className="text-8xl md:text-9xl font-display font-bold text-primary">404</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-4">
              Page Not Found
            </h1>
            
            <p className="text-muted-foreground mb-8">
              Sorry, we couldn't find the page you're looking for. It may have been moved or doesn't exist.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <a href="/">
                  <Home className="h-4 w-4" />
                  Go to Homepage
                </a>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="gap-2" onClick={() => window.history.back()}>
                <button type="button" onClick={() => window.history.back()}>
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </button>
              </Button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default NotFound;
