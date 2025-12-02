import { useState, useEffect } from 'react';
import { quizApi } from '../lib/api';
import { useNotification } from '../contexts/NotificationContext';
import { Plus, Trash2, Save, X, CheckCircle } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question_text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
  explanation: string;
  is_active: boolean;
  answers: QuizAnswer[];
}

interface QuizAnswer {
  id: string;
  answer_text: string;
  is_correct: boolean;
  order_index: number;
}

export const AdminQuizManager = () => {
  const { showNotification } = useNotification();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    questionText: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    category: 'General',
    points: 10,
    explanation: '',
    isActive: true,
    answers: [
      { answerText: '', isCorrect: false, orderIndex: 0 },
      { answerText: '', isCorrect: false, orderIndex: 1 },
      { answerText: '', isCorrect: false, orderIndex: 2 },
      { answerText: '', isCorrect: false, orderIndex: 3 },
    ],
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await quizApi.getAllQuestions();
      setQuestions(response.data || []);
    } catch (error: any) {
      console.error('Error loading questions:', error);
      showNotification('error', 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!formData.questionText.trim() || !formData.explanation.trim()) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    const hasCorrectAnswer = formData.answers.some(a => a.isCorrect);
    if (!hasCorrectAnswer) {
      showNotification('error', 'Please mark at least one answer as correct');
      return;
    }

    const filledAnswers = formData.answers.filter(a => a.answerText.trim());
    if (filledAnswers.length < 2) {
      showNotification('error', 'Please provide at least 2 answer options');
      return;
    }

    try {
      await quizApi.createQuestion({
        questionText: formData.questionText,
        difficulty: formData.difficulty,
        category: formData.category,
        points: formData.points,
        explanation: formData.explanation,
        answers: filledAnswers.map((answer, index) => ({
          answerText: answer.answerText,
          isCorrect: answer.isCorrect,
          orderIndex: index,
        })),
      });

      showNotification('success', 'Question added successfully');
      setShowAddForm(false);
      resetForm();
      loadQuestions();
    } catch (error: any) {
      console.error('Error adding question:', error);
      showNotification('error', 'Failed to add question');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      await quizApi.deleteQuestion(questionId);
      showNotification('success', 'Question deleted successfully');
      loadQuestions();
    } catch (error: any) {
      console.error('Error deleting question:', error);
      showNotification('error', 'Failed to delete question');
    }
  };

  const handleToggleActive = async (questionId: string, currentStatus: boolean) => {
    try {
      await quizApi.updateQuestion(questionId, { isActive: !currentStatus });
      showNotification('success', `Question ${!currentStatus ? 'activated' : 'deactivated'}`);
      loadQuestions();
    } catch (error: any) {
      console.error('Error updating question:', error);
      showNotification('error', 'Failed to update question');
    }
  };

  const resetForm = () => {
    setFormData({
      questionText: '',
      difficulty: 'medium',
      category: 'General',
      points: 10,
      explanation: '',
      isActive: true,
      answers: [
        { answerText: '', isCorrect: false, orderIndex: 0 },
        { answerText: '', isCorrect: false, orderIndex: 1 },
        { answerText: '', isCorrect: false, orderIndex: 2 },
        { answerText: '', isCorrect: false, orderIndex: 3 },
      ],
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-600 dark:text-gray-300">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Quiz Questions Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {showAddForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          <span>{showAddForm ? 'Cancel' : 'Add Question'}</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Add New Question</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Question Text *
            </label>
            <textarea
              value={formData.questionText}
              onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder="Enter your question..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Energy, Water"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Points
              </label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                min={1}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Explanation *
            </label>
            <textarea
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              rows={2}
              placeholder="Explain the correct answer..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Answer Options (mark one as correct)
            </label>
            <div className="space-y-3">
              {formData.answers.map((answer, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={answer.isCorrect}
                    onChange={(e) => {
                      const newAnswers = [...formData.answers];
                      newAnswers[index].isCorrect = e.target.checked;
                      setFormData({ ...formData, answers: newAnswers });
                    }}
                    className="h-5 w-5 text-green-600 rounded"
                  />
                  <input
                    type="text"
                    value={answer.answerText}
                    onChange={(e) => {
                      const newAnswers = [...formData.answers];
                      newAnswers[index].answerText = e.target.value;
                      setFormData({ ...formData, answers: newAnswers });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder={`Answer option ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-5 w-5 text-green-600 rounded"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active (visible to users)
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowAddForm(false);
                resetForm();
              }}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddQuestion}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="h-5 w-5" />
              <span>Save Question</span>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 dark:text-gray-300 text-lg">No questions yet. Add your first question!</p>
          </div>
        ) : (
          questions.map((question) => (
            <div
              key={question.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${
                !question.is_active ? 'opacity-60' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600">
                      {question.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {question.points} points
                    </span>
                    {!question.is_active && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                        Inactive
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                    {question.question_text}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleActive(question.id, question.is_active)}
                    className={`p-2 rounded-lg transition-colors ${
                      question.is_active
                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                    title={question.is_active ? 'Deactivate' : 'Activate'}
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {question.answers && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Answer Options:</p>
                  {question.answers.map((answer) => (
                    <div
                      key={answer.id}
                      className={`flex items-center space-x-2 p-3 rounded-lg ${
                        answer.is_correct
                          ? 'bg-green-50 dark:bg-green-900 border-2 border-green-500'
                          : 'bg-gray-50 dark:bg-gray-700'
                      }`}
                    >
                      {answer.is_correct && (
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      )}
                      <span className={`${answer.is_correct ? 'font-semibold text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        {answer.answer_text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
