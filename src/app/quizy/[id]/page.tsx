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

interface GameState {
  currentQuestionIndex: number;
  score: number;
  answers: number[];
  timeLeft: number;
  isGameActive: boolean;
  isGameFinished: boolean;
}

export default function QuizPage() {
  const params = useParams();
  const id = params.id as string;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const supabase = createClientComponentClient();
  
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    score: 0,
    answers: [],
    timeLeft: 0,
    isGameActive: false,
    isGameFinished: false
  });
  
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const startQuiz = () => {
    setGameState({
      ...gameState,
      isGameActive: true,
      timeLeft: quiz?.timePerQuestion || 30,
    });
    startTimer();
  };

  const startTimer = () => {
    if (timer) clearInterval(timer);
    
    const newTimer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          handleAnswerSubmit(-1);
          return prev;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    
    setTimer(newTimer);
  };

  const handleAnswerSubmit = async (answerIndex: number) => {
    if (timer) clearInterval(timer);
    
    const currentQuestion = quiz?.questions[gameState.currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion?.correctAnswer;
    
    const newScore = isCorrect ? gameState.score + 100 : gameState.score;
    const newAnswers = [...gameState.answers, answerIndex];
    
    if (gameState.currentQuestionIndex + 1 >= (quiz?.questions.length || 0)) {
      await saveQuizResults(newScore, newAnswers);
      setGameState({
        ...gameState,
        score: newScore,
        answers: newAnswers,
        isGameActive: false,
        isGameFinished: true
      });
    } else {
      setGameState({
        ...gameState,
        currentQuestionIndex: gameState.currentQuestionIndex + 1,
        score: newScore,
        answers: newAnswers,
        timeLeft: quiz?.timePerQuestion || 30
      });
      startTimer();
    }
  };

  const saveQuizResults = async (finalScore: number, finalAnswers: number[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('quiz_results').insert({
      quiz_id: id,
      user_id: user.id,
      score: finalScore,
      answers: finalAnswers,
      completed_at: new Date().toISOString()
    });

    if (error) {
      console.error("Błąd podczas zapisywania wyników:", error);
    }
  };

  const ActiveGame = () => {
    const currentQuestion = quiz?.questions[gameState.currentQuestionIndex];
    
    return (
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">
              Pytanie {gameState.currentQuestionIndex + 1} z {quiz?.questions.length}
            </span>
            <span className="text-lg font-medium flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {gameState.timeLeft}s
            </span>
          </div>
          
          <div className="py-4">
            <h2 className="text-xl font-semibold mb-4">{currentQuestion?.question}</h2>
            <div className="grid gap-3">
              {currentQuestion?.answers.map((answer, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start p-4 h-auto"
                  onClick={() => handleAnswerSubmit(index)}
                >
                  {answer}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Wynik: {gameState.score}</span>
          </div>
        </div>
      </Card>
    );
  };

  const GameResults = () => (
    <Card className="p-6">
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold">Quiz zakończony!</h2>
        <div className="text-4xl font-bold text-primary">{gameState.score} punktów</div>
        <div className="space-y-2">
          <p>Poprawne odpowiedzi: {
            gameState.answers.filter((answer, index) => 
              answer === quiz?.questions[index].correctAnswer
            ).length
          } z {quiz?.questions.length}</p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => window.location.reload()}>
            Zagraj ponownie
          </Button>
          <Link href="/quizy">
            <Button variant="outline">
              Wróć do listy quizów
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );

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
  }, [id, supabase]);

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
        {!gameState.isGameActive && !gameState.isGameFinished ? (
          <>
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
                    onClick={startQuiz}
                  >
                    Rozpocznij Quiz
                  </Button>
                </div>
              </div>
            </Card>
          </>
        ) : gameState.isGameFinished ? (
          <GameResults />
        ) : (
          <ActiveGame />
        )}
      </div>
    </div>
  );
}