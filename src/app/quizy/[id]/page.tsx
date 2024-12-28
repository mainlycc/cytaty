'use client';

import { Button } from "@/app/components/ui/button"
import { Card } from "@/app/components/ui/card"
import { Clock, HelpCircle, Award, AlertCircle } from 'lucide-react'
import Link from "next/link"
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Quiz {
  id: string;
  title: string;
  description: string;
  timePerQuestion: number;
  questions: {
    question: string;
    answers: string[];
    correctAnswer: number;
  }[];
  difficulty: string;
  rules: string;
}

export default function QuizPage() {
  const params = useParams();
  const id = params.id as string;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Błąd podczas pobierania quizu:", error);
      } else {
        setQuiz(data);
      }
    };

    fetchQuiz();
  }, [id]);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-xl">Ładowanie...</div>
      </div>
    );
  }

  // Domyślne zasady, jeśli nie są zdefiniowane w bazie danych
  const defaultRules = [
    `Quiz składa się z ${quiz.questions.length} pytań`,
    "Na każde pytanie jest tylko jedna prawidłowa odpowiedź",
    `Masz ${quiz.timePerQuestion} sekund na każde pytanie`,
    "Za każdą prawidłową odpowiedź otrzymujesz 100 punktów",
    "Za złą odpowiedź nie ma punktów ujemnych",
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/quizy"
          className="text-sm text-muted-foreground hover:text-primary mb-6 inline-block"
        >
          ← Powrót do listy quizów
        </Link>

        <Card className="p-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{quiz.title}</h1>
              <p className="text-muted-foreground">{quiz.description}</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>{quiz.timePerQuestion} sekund na pytanie</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span>{quiz.questions.length} pytań</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <span>Poziom: {quiz.difficulty}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Zasady quizu</h2>
              </div>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {defaultRules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={() => {
                  // Tutaj dodaj logikę rozpoczęcia quizu
                  console.log("Rozpocznij quiz:", quiz.id);
                }}
              >
                Rozpocznij Quiz
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}