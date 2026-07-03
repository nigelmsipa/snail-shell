import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import ChapterView from "./components/ChapterView";
import PassagePractice from "./pages/PassagePractice";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Install from "./pages/Install";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" storageKey="wolf-word-theme">
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/passage/:passageId" element={<PassagePractice />} />
          <Route path="/chapter/:book/:chapter" element={<ChapterView />} />
          <Route path="/install" element={<Install />} />
          {/* Redirect legacy routes */}
          <Route path="/practice" element={<Navigate to="/" replace />} />
          <Route path="/session" element={<Navigate to="/" replace />} />
          <Route path="/chapter/:book/:chapter/hub" element={<Navigate to="/" replace />} />
          <Route path="/chapter/:book/:chapter/practice/:pericopeId/:verseNum" element={<Navigate to="/" replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
