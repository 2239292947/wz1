'use client'

import { useState, useEffect, useCallback } from 'react'

interface Question {
  num1: number
  num2: number
  answer: number
}

function generateQuestion(): Question {
  const num1 = Math.floor(Math.random() * 100) + 1
  const num2 = Math.floor(Math.random() * (100 - num1)) + 1
  return {
    num1,
    num2,
    answer: num1 + num2
  }
}

export default function Home() {
  const [question, setQuestion] = useState<Question>({ num1: 0, num2: 0, answer: 0 })
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [stats, setStats] = useState({ correct: 0, total: 0 })
  const [showCelebration, setShowCelebration] = useState(false)

  const newQuestion = useCallback(() => {
    setQuestion(generateQuestion())
    setUserAnswer('')
    setFeedback(null)
    setShowCelebration(false)
  }, [])

  useEffect(() => {
    newQuestion()
  }, [newQuestion])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const answer = parseInt(userAnswer, 10)
    
    if (isNaN(answer)) return
    
    const isCorrect = answer === question.answer
    setFeedback(isCorrect ? 'correct' : 'wrong')
    setStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }))
    
    if (isCorrect) {
      setShowCelebration(true)
      setTimeout(() => {
        newQuestion()
      }, 1000)
    }
  }

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          🎯 100以内加法练习
        </h1>

        {/* 题目卡片 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 mb-8 text-center">
          <div className="text-6xl font-bold text-white mb-4">
            <span className="inline-block animate-bounce">{question.num1}</span>
            <span className="mx-4">+</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>{question.num2}</span>
          </div>
          <div className="text-2xl text-white opacity-80">= ?</div>
        </div>

        {/* 答题区域 */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="输入答案"
              className={`flex-1 text-2xl p-4 rounded-xl border-2 text-center font-bold outline-none transition-all ${
                feedback === 'correct' 
                  ? 'border-green-500 bg-green-50 text-green-600' 
                  : feedback === 'wrong'
                  ? 'border-red-500 bg-red-50 text-red-600'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              autoFocus
              disabled={feedback === 'correct'}
            />
            <button
              type="submit"
              disabled={!userAnswer || feedback === 'correct'}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-4 px-8 rounded-xl transition-colors"
            >
              回答
            </button>
          </div>
        </form>

        {/* 反馈信息 */}
        {feedback === 'correct' && (
          <div className="text-center mb-8 animate-pulse">
            <span className="text-4xl">🎉</span>
            <p className="text-green-600 font-bold text-xl mt-2">回答正确！</p>
          </div>
        )}
        
        {feedback === 'wrong' && (
          <div className="text-center mb-8">
            <p className="text-red-600 font-bold text-lg">
              回答错误，正确答案是 {question.answer}
            </p>
            <button
              onClick={newQuestion}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-xl transition-colors"
            >
              下一题
            </button>
          </div>
        )}

        {/* 统计信息 */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">📊 练习统计</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-500">练习次数</div>
            </div>
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-600">{stats.correct}</div>
              <div className="text-sm text-gray-500">正确次数</div>
            </div>
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="text-3xl font-bold text-purple-600">{accuracy}%</div>
              <div className="text-sm text-gray-500">正确率</div>
            </div>
          </div>
        </div>

        {/* 重新开始按钮 */}
        <button
          onClick={() => {
            setStats({ correct: 0, total: 0 })
            newQuestion()
          }}
          className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
        >
          重新开始
        </button>
      </div>

      {/* 庆祝动画 */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`
              }}
            >
              {['⭐', '✨', '🌟', '💫', '🎊'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
