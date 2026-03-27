import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsModalProvider } from "@/hooks/use-settings-modal";

import Landing from "@/pages/landing";
import Home from "@/pages/home";
import LessonView from "@/pages/lesson-view";
import SharedLesson from "@/pages/shared-lesson";
import CourseView from "@/pages/course-view";
import CertificatePage from "@/pages/certificate";
import CreateCourse from "@/pages/create-course";
import Credits from "@/pages/credits";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/app" component={Home} />
      <Route path="/lessons/:id" component={LessonView} />
      <Route path="/shared/:id" component={SharedLesson} />
      <Route path="/course/:id" component={CourseView} />
      <Route path="/cert/:id" component={CertificatePage} />
      <Route path="/create-course" component={CreateCourse} />
      <Route path="/credits" component={Credits} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SettingsModalProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </SettingsModalProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
