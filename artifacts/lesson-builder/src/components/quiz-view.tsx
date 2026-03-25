import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import type { QuizQuestion } from "@workspace/api-client-react";

interface QuizViewProps {
  questions: QuizQuestion[];
}

export function QuizView({ questions }: QuizViewProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
          <Trophy className="w-8 h-8 opacity-50" />
        </div>
        <h3 className="text-xl font-serif font-bold text-foreground">No Quiz Available</h3>
        <p className="text-muted-foreground mt-2">There are no quiz questions for this lesson yet.</p>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const isCorrect = selectedOpt === currentQ.correctIndex;

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);
    if (idx === currentQ.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto mt-12 bg-card rounded-3xl p-8 border-2 border-border shadow-xl text-center"
      >
        <div className="w-24 h-24 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-6">
          <Trophy className="w-12 h-12 text-accent" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Quiz Completed!</h2>
        <p className="text-lg text-muted-foreground mb-8">
          You scored <strong className="text-primary">{score}</strong> out of <strong>{questions.length}</strong> ({percentage}%)
        </p>
        
        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          Retake Quiz
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Question {currentIdx + 1} of {questions.length}
        </span>
        <div className="flex-1 ml-6 mr-6 h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: `${((currentIdx) / questions.length) * 100}%` }}
            animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <span className="text-sm font-bold text-primary">
          Score: {score}
        </span>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-card rounded-3xl p-6 md:p-10 border border-border/60 shadow-xl shadow-black/5"
      >
        <h3 className="text-2xl font-serif font-bold text-foreground mb-8 leading-snug">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOpt === idx;
            const isCorrectOption = idx === currentQ.correctIndex;
            
            let btnClass = "border-border/50 hover:border-primary/50 hover:bg-secondary/50";
            if (isAnswered) {
              if (isCorrectOption) btnClass = "border-green-500 bg-green-50 text-green-900 shadow-sm";
              else if (isSelected) btnClass = "border-destructive bg-destructive/10 text-destructive";
              else btnClass = "border-border/50 opacity-50";
            } else if (isSelected) {
              btnClass = "border-primary bg-primary/5 text-primary shadow-md";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${btnClass}`}
              >
                <span className="font-medium text-base">{opt}</span>
                {isAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 ml-3" />
                )}
                {isAnswered && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-destructive shrink-0 ml-3" />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 24 }}
              className="overflow-hidden"
            >
              <div className={`p-5 rounded-2xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-secondary/50 border border-border'}`}>
                <h4 className={`font-bold mb-2 ${isCorrect ? 'text-green-800' : 'text-foreground'}`}>
                  {isCorrect ? '✨ Correct!' : 'Not quite.'}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {currentQ.explanation}
                </p>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-colors font-medium"
                  >
                    {currentIdx < questions.length - 1 ? 'Next Question' : 'See Results'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
