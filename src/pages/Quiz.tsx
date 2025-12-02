import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { quizApi, profileApi } from '../lib/api';
import { useNotification } from '../contexts/NotificationContext';
import { checkAndAwardBadges } from '../utils/badges';
import { CheckCircle, XCircle, Award, Clock, Target, TrendingUp, Sparkles } from 'lucide-react';
import { AdminQuizManager } from '../components/AdminQuizManager';

interface Question {
  id: string;
  question_text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
  explanation: string;
  answers: Answer[];
}

interface Answer {
  id: string;
  answer_text: string;
  is_correct: boolean;
  order_index: number;
}

export const Quiz = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ questionId: string; answerId: string; isCorrect: boolean }[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    checkAdminStatus();
    loadQuestions();
  }, []);

  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      const response = await profileApi.get();
      setIsAdmin(response.data?.role === 'admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const loadQuestions = async () => {
    try {
      const response = await quizApi.getQuestions(10);

      if (response.data && response.data.length > 0) {
        setQuestions(response.data);
      }
    } catch (error: any) {
      console.error('Error loading questions:', error);
      showNotification('error', 'Failed to load quiz questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const handleNext = async () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswerObj = currentQuestion.answers.find(a => a.id === selectedAnswer);
    const isCorrect = selectedAnswerObj?.is_correct || false;

    const newScore = isCorrect ? score + currentQuestion.points : score;
    const newCorrectAnswers = isCorrect ? correctAnswers + 1 : correctAnswers;

    setScore(newScore);
    setCorrectAnswers(newCorrectAnswers);
    setUserAnswers([
      ...userAnswers,
      {
        questionId: currentQuestion.id,
        answerId: selectedAnswer,
        isCorrect,
      },
    ]);

    setShowResult(true);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizComplete(true);
        if (user) {
          saveQuizResults(newScore, newCorrectAnswers);
        }
      }
    }, 2500);
  };

  const saveQuizResults = async (finalScore: number, finalCorrectAnswers: number) => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    try {
      await quizApi.submitAttempt({
        score: finalScore,
        totalQuestions: questions.length,
        correctAnswers: finalCorrectAnswers,
        timeTaken,
        answers: userAnswers.map(ua => ({
          questionId: ua.questionId,
          answerId: ua.answerId,
          isCorrect: ua.isCorrect,
        })),
      });

      showNotification('success', 'Quiz results saved successfully!');

      if (user?.id) {
        const badgesAwarded = await checkAndAwardBadges(user.id);
        if (badgesAwarded > 0) {
          showNotification('success', `You earned ${badgesAwarded} new badge${badgesAwarded > 1 ? 's' : ''}!`);
        }
      }
    } catch (error) {
      console.error('Error saving quiz results:', error);
      showNotification('error', 'Failed to save quiz results');
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCorrectAnswers(0);
    setUserAnswers([]);
    setQuizComplete(false);
    setStartTime(Date.now());
    loadQuestions();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (isAdmin && showAdminPanel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setShowAdminPanel(false)}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Quiz
            </button>
          </div>
          <AdminQuizManager />
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12 text-center">
            <Sparkles className="h-24 w-24 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              No Quiz Questions Available
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Check back soon for new environmental quiz questions!
            </p>
            {isAdmin && (
              <button
                onClick={() => setShowAdminPanel(true)}
                className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all transform hover:scale-105"
              >
                Add Questions
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-block p-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 animate-bounce">
                <Award className="h-20 w-20 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
                Quiz Complete!
              </h2>
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                <Sparkles className="h-6 w-6 text-emerald-500" />
                <div className="h-1 w-20 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"></div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                <Target className="h-10 w-10 mb-3 opacity-80" />
                <p className="text-sm opacity-90 mb-1">Your Score</p>
                <p className="text-4xl font-bold">{percentage}%</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                <CheckCircle className="h-10 w-10 mb-3 opacity-80" />
                <p className="text-sm opacity-90 mb-1">Correct Answers</p>
                <p className="text-4xl font-bold">{correctAnswers}/{questions.length}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                <Clock className="h-10 w-10 mb-3 opacity-80" />
                <p className="text-sm opacity-90 mb-1">Time Taken</p>
                <p className="text-4xl font-bold">{minutes}:{seconds.toString().padStart(2, '0')}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 mb-8">
              <div className="flex items-start space-x-4">
                <TrendingUp className="h-8 w-8 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Performance Analysis</h3>
                  {percentage >= 80 && (
                    <p className="text-gray-700 dark:text-gray-200">
                      Outstanding! You are an eco champion with excellent knowledge of environmental topics!
                    </p>
                  )}
                  {percentage >= 60 && percentage < 80 && (
                    <p className="text-gray-700 dark:text-gray-200">
                      Great job! You have a solid understanding of sustainability. Keep learning to become an expert!
                    </p>
                  )}
                  {percentage < 60 && (
                    <p className="text-gray-700 dark:text-gray-200">
                      Good effort! Explore our Tips and Blog sections to enhance your environmental knowledge!
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Total Points Earned: <span className="font-bold text-emerald-600">{score}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={restartQuiz}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Try Again
              </button>
              {isAdmin && (
                <button
                  onClick={() => setShowAdminPanel(true)}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105 shadow-lg"
                >
                  Manage Questions
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestionIndex];
  const selectedAnswerObj = question.answers.find(a => a.id === selectedAnswer);
  const isCorrect = selectedAnswerObj?.is_correct || false;
  const correctAnswerObj = question.answers.find(a => a.is_correct);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {isAdmin && (
          <div className="mb-6 text-right">
            <button
              onClick={() => setShowAdminPanel(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Admin Panel
            </button>
          </div>
        )}

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Eco Quiz</h1>
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty}
              </span>
              <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
          </div>

          <div className="relative bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Score: {score} points</span>
            </span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full font-medium">
              {question.category}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-8 leading-relaxed">
            {question.question_text}
          </h2>

          <div className="space-y-4 mb-8">
            {question.answers.map((answer) => {
              const isSelected = selectedAnswer === answer.id;
              const isCorrectAnswer = answer.is_correct;

              return (
                <button
                  key={answer.id}
                  onClick={() => handleAnswer(answer.id)}
                  disabled={showResult}
                  className={`w-full p-5 text-left rounded-xl border-2 transition-all duration-300 ${
                    showResult
                      ? isCorrectAnswer
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 transform scale-[1.02]'
                        : isSelected
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/30'
                        : 'border-gray-200 dark:border-gray-700 opacity-60'
                      : isSelected
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 transform scale-[1.02] shadow-lg'
                      : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 hover:transform hover:scale-[1.01]'
                  } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-gray-800 dark:text-white font-medium pr-4">
                      {answer.answer_text}
                    </span>
                    {showResult && isCorrectAnswer && (
                      <CheckCircle className="h-7 w-7 text-emerald-600 flex-shrink-0" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="h-7 w-7 text-red-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div
              className={`p-6 rounded-2xl mb-6 border-2 transition-all duration-500 ${
                isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                  : 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200'
              }`}
            >
              <p className="font-bold text-xl mb-3 flex items-center space-x-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="h-6 w-6" />
                    <span>Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6" />
                    <span>Incorrect</span>
                  </>
                )}
              </p>
              <p className="text-base leading-relaxed">{question.explanation}</p>
              {!isCorrect && correctAnswerObj && (
                <p className="mt-3 font-semibold">
                  Correct answer: {correctAnswerObj.answer_text}
                </p>
              )}
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};
