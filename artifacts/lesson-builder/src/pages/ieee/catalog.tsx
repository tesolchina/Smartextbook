import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Globe, Search, Clock, Calendar, BookOpen, ChevronRight,
  Loader2, AlertTriangle, Filter, BarChart2, Tag,
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Submission = {
  id: number;
  title: string;
  authorName: string;
  topicArea: string | null;
  bloomsLevel: string | null;
  publicationYear: string | null;
  estimatedMinutes: string | null;
  updatedAt: string;
};

const TOPIC_LABELS: Record<string, string> = {
  "technical-writing": "Technical Writing",
  "presentations": "Presentations",
  "intercultural-communication": "Intercultural Communication",
  "workplace-writing": "Workplace Writing",
  "digital-communication": "Digital Communication",
  "research-communication": "Research Communication",
  "leadership-communication": "Leadership Communication",
  "other": "Other",
};

const BLOOMS_COLORS: Record<string, string> = {
  remember: "bg-blue-100 text-blue-800 border-blue-200",
  understand: "bg-green-100 text-green-800 border-green-200",
  apply: "bg-yellow-100 text-yellow-800 border-yellow-200",
  analyze: "bg-orange-100 text-orange-800 border-orange-200",
  evaluate: "bg-rose-100 text-rose-800 border-rose-200",
  create: "bg-purple-100 text-purple-800 border-purple-200",
};

type LoadState =
  | { status: "loading" }
  | { status: "success"; lessons: Submission[] }
  | { status: "error"; message: string };

export default function IeeeCatalog() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [bloomsFilter, setBloomsFilter] = useState("all");

  useEffect(() => {
    fetch("/api/ieee/catalog")
      .then((r) => r.json().then((d) => ({ ok: r.ok, data: d })))
      .then(({ ok, data }) => {
        if (!ok) {
          setLoadState({ status: "error", message: data.error || "Failed to load catalog." });
        } else {
          setLoadState({ status: "success", lessons: data.lessons ?? [] });
        }
      })
      .catch((err) => setLoadState({ status: "error", message: err.message || "Network error" }));
  }, []);

  const filtered = useMemo(() => {
    if (loadState.status !== "success") return [];
    return loadState.lessons.filter((l) => {
      const matchesSearch =
        !search ||
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        (l.authorName ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesTopic = topicFilter === "all" || l.topicArea === topicFilter;
      const matchesBlooms = bloomsFilter === "all" || l.bloomsLevel === bloomsFilter;
      return matchesSearch && matchesTopic && matchesBlooms;
    });
  }, [loadState, search, topicFilter, bloomsFilter]);

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-5 h-5 text-primary" />
                <h1 className="text-2xl font-serif font-bold">IEEE ProComm Lesson Catalog</h1>
              </div>
              <p className="text-muted-foreground">
                Self-paced interactive lessons from IEEE Teaching Case articles.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-2 shrink-0">
              <Link href="/ieee/author/new">
                Contribute a Lesson
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                className="pl-9"
                placeholder="Search lessons by title or author…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={topicFilter} onValueChange={setTopicFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Topic area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {Object.entries(TOPIC_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={bloomsFilter} onValueChange={setBloomsFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Bloom's level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {["remember","understand","apply","analyze","evaluate","create"].map((l) => (
                  <SelectItem key={l} value={l} className="capitalize">{l.charAt(0).toUpperCase() + l.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loadState.status === "loading" && (
            <div className="flex flex-col items-center py-20 text-muted-foreground gap-3">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span>Loading catalog…</span>
            </div>
          )}

          {loadState.status === "error" && (
            <div className="flex flex-col items-center py-16 gap-3">
              <AlertTriangle className="w-8 h-8 text-destructive" />
              <p className="text-destructive font-medium">{loadState.message}</p>
            </div>
          )}

          {loadState.status === "success" && filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No lessons found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search terms.</p>
            </div>
          )}

          {loadState.status === "success" && filtered.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((lesson, i) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/ieee/lesson/${lesson.id}`}>
                    <div className="bg-background border border-border rounded-2xl p-5 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {lesson.title}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">By {lesson.authorName}</p>

                      <div className="flex flex-wrap gap-2">
                        {lesson.topicArea && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Tag className="w-3 h-3" />
                            {TOPIC_LABELS[lesson.topicArea] ?? lesson.topicArea}
                          </Badge>
                        )}
                        {lesson.bloomsLevel && (
                          <Badge
                            variant="outline"
                            className={`text-xs capitalize ${BLOOMS_COLORS[lesson.bloomsLevel] ?? ""}`}
                          >
                            <BarChart2 className="w-3 h-3 mr-1" />
                            {lesson.bloomsLevel}
                          </Badge>
                        )}
                        {lesson.estimatedMinutes && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {lesson.estimatedMinutes} min
                          </Badge>
                        )}
                        {lesson.publicationYear && (
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="w-3 h-3 mr-1" />
                            {lesson.publicationYear}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
