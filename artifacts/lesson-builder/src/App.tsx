import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsModalProvider } from "@/hooks/use-settings-modal";
import { AuthProvider } from "@/hooks/use-auth";

import Landing from "@/pages/landing";
import Home from "@/pages/home";
import LessonView from "@/pages/lesson-view";
import SharedLesson from "@/pages/shared-lesson";
import CourseView from "@/pages/course-view";
import CertificatePage from "@/pages/certificate";
import CreateCourse from "@/pages/create-course";
import CertLookup from "@/pages/cert-lookup";
import Credits from "@/pages/credits";
import TalkPage from "@/pages/talk";
import NotFound from "@/pages/not-found";
import IeeeLanding from "@/pages/ieee/landing";
import IeeeCatalog from "@/pages/ieee/catalog";
import IeeeLesson from "@/pages/ieee/lesson";
import IeeeAuthor from "@/pages/ieee/author";
import IeeeAuthorNew from "@/pages/ieee/author-new";
import IeeeAdmin from "@/pages/ieee/admin";
import IeeeAuthorEdit from "@/pages/ieee/author-edit";

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
      <Route path="/about" component={Landing} />
      <Route path="/app" component={Home} />
      <Route path="/cert-lookup" component={CertLookup} />
      <Route path="/lessons/:id" component={LessonView} />
      <Route path="/shared/:id" component={SharedLesson} />
      <Route path="/course/:id" component={CourseView} />
      <Route path="/cert/:id" component={CertificatePage} />
      <Route path="/create-course" component={CreateCourse} />
      <Route path="/credits" component={Credits} />
      <Route path="/talk" component={TalkPage} />
      <Route path="/talk15Apr" component={TalkPage} />
      <Route path="/ieee" component={IeeeLanding} />
      <Route path="/ieee/catalog" component={IeeeCatalog} />
      <Route path="/ieee/lesson/:id" component={IeeeLesson} />
      <Route path="/ieee/author" component={IeeeAuthor} />
      <Route path="/ieee/author/new" component={IeeeAuthorNew} />
      <Route path="/ieee/author/edit/:id" component={IeeeAuthorEdit} />
      <Route path="/ieee/admin" component={IeeeAdmin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SettingsModalProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
          </SettingsModalProvider>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
