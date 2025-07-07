import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";
import SignIn from "./components/SignIn";
import { useTranslation } from 'react-i18next';

const queryClient = new QueryClient();

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const { t, i18n } = useTranslation();

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
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      <div>
        {/* Fixed language selector in top right */}
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
          <select
            id="language-select"
            value={i18n.language}
            onChange={e => i18n.changeLanguage(e.target.value)}
            style={{ padding: '4px 8px', borderRadius: 6, fontSize: 16 }}
          >
            <option value="en">🇬🇧 English</option>
            <option value="nl">🇳🇱 Nederlands</option>
          </select>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default App;
