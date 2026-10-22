import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import { TIME_PER_QUESTION } from '../data';
import { calcPrize } from '../utils';

const Play = ({
  playerName,
  questions = [],
}) => {
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [status, setStatus] = useState('answering'); // "answering" | "locked" | "revealed"
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const currentQuestion = questions[currentQuestionIndex];

  // Hàm kết thúc lượt chơi
  const handleFinishGame = useCallback(
    (correctCount, reason) => {
      const prize = calcPrize(correctCount, reason);

      navigate('/result', {
        replace: true,
        state: {
          name: playerName,
          prize,
          correctCount,
          reason,
        },
      });
    },
    [navigate, playerName]
  );

  // 1. Đồng hồ 30 giây: chỉ đếm khi status === "answering"
  useEffect(() => {
    if (status !== 'answering') return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [status, currentQuestionIndex]);

  // Xử lý khi hết giờ
  useEffect(() => {
    if (timeLeft === 0 && status === 'answering') {
      handleFinishGame(currentQuestionIndex, 'timeout');
    }
  }, [timeLeft, status, currentQuestionIndex, handleFinishGame]);

  // 2. Quy trình các bước chờ: locked (1s) -> revealed (2s) -> câu tiếp theo hoặc kết thúc
  useEffect(() => {
    let timeoutId;

    if (status === 'locked') {
      timeoutId = setTimeout(() => {
        setStatus('revealed');
      }, 1000);
    } else if (status === 'revealed') {
      timeoutId = setTimeout(() => {
        if (!currentQuestion) return;

        const isCorrect = selectedAnswer === currentQuestion.answer;

        if (isCorrect) {
          if (currentQuestionIndex === questions.length - 1) {
            // Thắng cả 15 câu
            handleFinishGame(15, 'win');
          } else {
            // Sang câu tiếp theo
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            setTimeLeft(TIME_PER_QUESTION);
            setStatus('answering');
          }
        } else {
          // Trả lời sai
          handleFinishGame(currentQuestionIndex, 'wrong');
        }
      }, 2000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    status,
    currentQuestionIndex,
    selectedAnswer,
    currentQuestion,
    questions.length,
    handleFinishGame,
  ]);

  // Chọn đáp án
  const handleSelectAnswer = useCallback(
    (index) => {
      if (status !== 'answering') return;
      setSelectedAnswer(index);
      setStatus('locked');
    },
    [status]
  );

  // Chặn vào thẳng trang chơi khi chưa có tên
  if (!playerName || !playerName.trim()) {
    return <Navigate to="/" replace />;
  }

  if (!currentQuestion) {
    return (
      <div className="state-message-box loading-text">
        Đang chuẩn bị câu hỏi...
      </div>
    );
  }

  return (
    <div className="play-layout">
      <div className="game-main-area">
        <div className="top-bar-controls">
          <Timer timeLeft={timeLeft} />
        </div>

        <QuestionCard
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          status={status}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
        />
      </div>

      <div className="game-sidebar">
        <MoneyLadder currentQuestionIndex={currentQuestionIndex} />
      </div>
    </div>
  );
};

export default Play;
