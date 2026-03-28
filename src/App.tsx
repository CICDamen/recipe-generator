import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Recipes from "./pages/Recipes";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";
import SignIn from "./components/SignIn";
import NavBar from "./components/NavBar";

const queryClient = new QueryClient();

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const isAuthed = localStorage.getItem("authenticated") === "true";
    setAuthenticated(isAuthed);
  }, []);

  const handleSignIn = () => {
    setAuthenticated(true);
    localStorage.setItem("authenticated", "true");
  };

  if (!authenticated) {
    return <SignIn onSignIn={handleSignIn} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/recipes" element={<Recipes />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
