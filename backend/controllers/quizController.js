import QuizQuestion from '../models/QuizQuestion.js';
import QuizAttempt from '../models/QuizAttempt.js';

// @desc    Get active quiz questions
// @route   GET /api/quiz/questions
// @access  Private
export const getQuestions = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const questions = await QuizQuestion.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit);

    // Transform for frontend
    const transformedQuestions = questions.map(q => ({
      id: q._id,
      question_text: q.questionText,
      difficulty: q.difficulty,
      category: q.category,
      points: q.points,
      explanation: q.explanation,
      answers: q.answers.map(a => ({
        id: a._id,
        answer_text: a.answerText,
        is_correct: a.isCorrect,
        order_index: a.orderIndex
      }))
    }));

    res.json({
      success: true,
      count: transformedQuestions.length,
      data: transformedQuestions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all questions (admin)
// @route   GET /api/quiz/questions/all
// @access  Private/Admin
export const getAllQuestions = async (req, res, next) => {
  try {
    const questions = await QuizQuestion.find()
      .sort({ createdAt: -1 });

    const transformedQuestions = questions.map(q => ({
      id: q._id,
      question_text: q.questionText,
      difficulty: q.difficulty,
      category: q.category,
      points: q.points,
      explanation: q.explanation,
      is_active: q.isActive,
      answers: q.answers.map(a => ({
        id: a._id,
        answer_text: a.answerText,
        is_correct: a.isCorrect,
        order_index: a.orderIndex
      }))
    }));

    res.json({
      success: true,
      count: transformedQuestions.length,
      data: transformedQuestions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create question
// @route   POST /api/quiz/questions
// @access  Private/Admin
export const createQuestion = async (req, res, next) => {
  try {
    const { questionText, difficulty, category, points, explanation, answers } = req.body;

    const question = await QuizQuestion.create({
      questionText,
      difficulty,
      category,
      points,
      explanation,
      answers: answers.map((a, index) => ({
        answerText: a.answer_text || a.answerText,
        isCorrect: a.is_correct || a.isCorrect,
        orderIndex: a.order_index || a.orderIndex || index
      })),
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: {
        id: question._id,
        question_text: question.questionText,
        difficulty: question.difficulty,
        category: question.category,
        points: question.points,
        explanation: question.explanation,
        is_active: question.isActive,
        answers: question.answers.map(a => ({
          id: a._id,
          answer_text: a.answerText,
          is_correct: a.isCorrect,
          order_index: a.orderIndex
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update question
// @route   PUT /api/quiz/questions/:id
// @access  Private/Admin
export const updateQuestion = async (req, res, next) => {
  try {
    const { questionText, difficulty, category, points, explanation, answers, isActive } = req.body;

    const updateData = {
      updatedAt: new Date()
    };

    if (questionText) updateData.questionText = questionText;
    if (difficulty) updateData.difficulty = difficulty;
    if (category) updateData.category = category;
    if (points) updateData.points = points;
    if (explanation !== undefined) updateData.explanation = explanation;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (answers) {
      updateData.answers = answers.map((a, index) => ({
        answerText: a.answer_text || a.answerText,
        isCorrect: a.is_correct || a.isCorrect,
        orderIndex: a.order_index || a.orderIndex || index
      }));
    }

    const question = await QuizQuestion.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: question._id,
        question_text: question.questionText,
        difficulty: question.difficulty,
        category: question.category,
        points: question.points,
        explanation: question.explanation,
        is_active: question.isActive,
        answers: question.answers.map(a => ({
          id: a._id,
          answer_text: a.answerText,
          is_correct: a.isCorrect,
          order_index: a.orderIndex
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete question
// @route   DELETE /api/quiz/questions/:id
// @access  Private/Admin
export const deleteQuestion = async (req, res, next) => {
  try {
    const question = await QuizQuestion.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz attempt
// @route   POST /api/quiz/attempts
// @access  Private
export const submitAttempt = async (req, res, next) => {
  try {
    const { score, totalQuestions, correctAnswers, timeTaken, answers } = req.body;

    const attempt = await QuizAttempt.create({
      userId: req.user._id,
      score,
      totalQuestions,
      correctAnswers,
      timeTaken,
      answers: answers.map(a => ({
        questionId: a.questionId,
        answerId: a.answerId,
        isCorrect: a.isCorrect
      }))
    });

    res.status(201).json({
      success: true,
      data: attempt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user quiz attempts
// @route   GET /api/quiz/attempts
// @access  Private
export const getAttempts = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user._id })
      .sort({ completedAt: -1 })
      .limit(parseInt(req.query.limit) || 10);

    // Transform for frontend compatibility
    const transformedAttempts = attempts.map(a => ({
      id: a._id,
      score: a.correctAnswers,
      total_questions: a.totalQuestions,
      completed_at: a.completedAt
    }));

    res.json({
      success: true,
      count: transformedAttempts.length,
      data: transformedAttempts
    });
  } catch (error) {
    next(error);
  }
};

