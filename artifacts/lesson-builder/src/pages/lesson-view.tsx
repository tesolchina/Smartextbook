import { useState } from "react";
import { useRoute } from "wouter";
import { Layout } from "@/components/layout";
import { ChatSidebar } from "@/components/chat-sidebar";
import { QuizView } from "@/components/quiz-view";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { useGetLesson } from "@workspace/api-client-react";
import { FileText, Lightbulb, ListTodo, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LessonView() {
  const [match, params] = useRoute("/lessons/:id");
  const lessonId = match ? parseInt(params.id, 10) : 0;
  const [activeTab, setActiveTab] = useState<"summary" | "quiz" | "chapter">("summary");

  const { data: lesson, isLoading, isError } = useGetLesson(lessonId, {
    query: {
      refetchInterval: (query) => {
        // Poll every 3s if still processing
        return query.state.data?.status === "processing" ? 3000 : false;
      }
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="font-serif text-xl">Loading your lesson...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !lesson) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-destructive/10 text-destructive p-6 rounded-2xl max-w-md text-center border border-destructive/20">
            <h2 className="text-xl font-bold mb-2">Lesson not found</h2>
            <p>We couldn't load this lesson. It may have been deleted or there was an error connecting to the server.</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Processing State overlay
  if (lesson.status === "processing") {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center bg-card">
          <div className="max-w-md w-full p-8 rounded-3xl bg-background border border-border shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </div>
            
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6 relative">
              <motion.div 
                className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            
            <h2 className="text-2xl font-serif font-bold text-foreground mb-3">AI is processing...</h2>
            <p className="text-muted-foreground mb-8">
              We are reading the chapter, extracting key concepts, and generating a custom interactive quiz. This usually takes 15-30 seconds.
            </p>
            
            <div className="space-y-3 text-left">
              <div className="h-3 w-full bg-secondary rounded animate-pulse"></div>
              <div className="h-3 w-5/6 bg-secondary rounded animate-pulse"></div>
              <div className="h-3 w-4/6 bg-secondary rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-64px)]">
        
        {/* LEFT PANE: Content area */}
        <div className="flex-1 flex flex-col bg-background relative z-0 min-w-0">
          
          {/* Header & Tabs */}
          <div className="px-6 pt-6 pb-0 border-b border-border bg-card">
            <h1 className="text-3xl font-serif font-black text-foreground mb-6 line-clamp-1" title={lesson.title}>
              {lesson.title}
            </h1>
            
            <div className="flex gap-6 border-b border-transparent">
              <TabButton 
                active={activeTab === "summary"} 
                onClick={() => setActiveTab("summary")}
                icon={<Lightbulb className="w-4 h-4" />}
                label="Summary & Concepts"
              />
              <TabButton 
                active={activeTab === "quiz"} 
                onClick={() => setActiveTab("quiz")}
                icon={<ListTodo className="w-4 h-4" />}
                label="Interactive Quiz"
              />
              <TabButton 
                active={activeTab === "chapter"} 
                onClick={() => setActiveTab("chapter")}
                icon={<FileText className="w-4 h-4" />}
                label="Source Text"
              />
            </div>
          </div>

          {/* Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-4xl mx-auto h-full"
              >
                {activeTab === "summary" && (
                  <div className="space-y-12">
                    <section>
                      <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-2 text-foreground border-b border-border pb-2">
                        <Sparkles className="w-6 h-6 text-accent" /> Chapter Summary
                      </h2>
                      <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
                        <MarkdownRenderer content={lesson.summary} className="text-lg leading-relaxed" />
                      </div>
                    </section>

                    <section>
                      <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2 text-foreground border-b border-border pb-2">
                        <BookOpenIcon className="w-6 h-6 text-primary" /> Key Concepts Glossary
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {lesson.keyConcepts?.map((concept, i) => (
                          <div key={i} className="bg-card border border-border/60 p-5 rounded-xl hover:shadow-md hover:border-primary/30 transition-all group">
                            <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                              {concept.term}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {concept.definition}
                            </p>
                          </div>
                        ))}
                        {(!lesson.keyConcepts || lesson.keyConcepts.length === 0) && (
                          <p className="text-muted-foreground col-span-full">No key concepts extracted.</p>
                        )}
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === "quiz" && (
                  <div className="h-full flex flex-col py-4">
                    <QuizView questions={lesson.quizQuestions || []} />
                  </div>
                )}

                {activeTab === "chapter" && (
                  <div className="bg-card p-8 md:p-12 rounded-2xl border border-border shadow-sm">
                    <div className="prose prose-lg font-serif max-w-none text-foreground leading-loose whitespace-pre-wrap">
                      {lesson.chapterText}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT PANE: Chat Sidebar */}
        <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 border-t lg:border-t-0 z-10 h-[50vh] lg:h-full">
          <ChatSidebar lessonId={lesson.id} />
        </div>

      </div>
    </Layout>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-3 flex items-center gap-2 font-bold text-sm transition-colors outline-none
        ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}
      `}
    >
      {icon}
      {label}
      {active && (
        <motion.div 
          layoutId="activeTab" 
          className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" 
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  );
}

function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
}
