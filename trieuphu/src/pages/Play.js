import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import Lifelines from '../components/Lifelines';
import AudienceChart from '../components/AudienceChart';
import { TIME_PER_QUESTION } from '../data';
import { calcPrize, generateAudiencePercentages } from '../utils';

const Play = ({
  playerName,
  questions = [],
  onAddHistory,
}) => {
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [status, setStatus] = useState('answering'); // "answering" | "locked" | "revealed"
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  // Quyền trợ giúp (Bài 3)
  const [used5050, setUsed5050] = useState(false);
  const [hiddenAnswers, setHiddenAnswers] = useState([]);
  const [usedAudience, setUsedAudience] = useState(false);
  const [audienceVotes, setAudienceVotes] = useState(null);

  const currentQuestion = questions[currentQuestionIndex];

  // Hàm kết thúc lượt chơi
  const handleFinishGame = useCallback(
    (correctCount, reason) => {
      const prize = calcPrize(correctCount, reason);

      if (onAddHistory) {
        onAddHistory({
          id: Date.now(),
          name: playerName,
          prize,
          correctCount,
          playedAt: new Date().toLocaleString('vi-VN'),
        });
      }

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
    [navigate, onAddHistory, playerName]
  );

  // 1. Tiêu đề tab: đổi theo câu khi đang chơi, trả lại "Ai là triệu phú" khi rời màn hình
  useEffect(() => {
    document.title = `Câu ${currentQuestionIndex + 1}/15 – ${playerName}`;

    return () => {
      document.title = 'Ai là triệu phú';
    };
  }, [currentQuestionIndex, playerName]);

  // 2. Đồng hồ 30 giây: chỉ chạy khi status === "answering"
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

  // 3. Quy trình các bước chờ: locked (1s) -> revealed (2s) -> câu tiếp hoặc kết thúc
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
            // Sang câu tiếp theo (đồng hồ về 30 giây, ẩn biểu đồ khán giả)
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            setHiddenAnswers([]);
            setAudienceVotes(null);
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

  // Xử lý chọn đáp án
  const handleSelectAnswer = useCallback(
    (index) => {
      if (status !== 'answering') return;
      setSelectedAnswer(index);
      setStatus('locked');
    },
    [status]
  );

  // 4. Phím tắt A, B, C, D (cả hoa và thường), phím của đáp án bị ẩn không có tác dụng
  useEffect(() => {
    const handleKey = (e) => {
      if (status !== 'answering') return;

      const key = e.key.toUpperCase();
      const keyMap = { A: 0, B: 1, C: 2, D: 3 };

      if (Object.prototype.hasOwnProperty.call(keyMap, key)) {
        const optionIndex = keyMap[key];
        if (!hiddenAnswers.includes(optionIndex)) {
          handleSelectAnswer(optionIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [status, hiddenAnswers, handleSelectAnswer]);

  // Quyền trợ giúp: 50:50 (ẩn ngẫu nhiên 2 đáp án sai)
  const handleUse5050 = () => {
    if (used5050 || status !== 'answering' || !currentQuestion) return;

    const wrongIndices = [0, 1, 2, 3].filter(
      (idx) => idx !== currentQuestion.answer
    );
    const shuffled = [...wrongIndices].sort(() => 0.5 - Math.random());
    setHiddenAnswers(shuffled.slice(0, 2));
    setUsed5050(true);
  };

  // Quyền trợ giúp: Hỏi khán giả
  const handleUseAudience = () => {
    if (usedAudience || status !== 'answering' || !currentQuestion) return;

    const percentages = generateAudiencePercentages(
      currentQuestion.answer,
      hiddenAnswers
    );
    setAudienceVotes(percentages);
    setUsedAudience(true);
  };

  // Quyền trợ giúp: Dừng cuộc chơi
  const handleStopGame = () => {
    if (status !== 'answering') return;
    handleFinishGame(currentQuestionIndex, 'stop');
  };

  // Chặn vào thẳng trang chơi khi chưa có tên người chơi
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
          <Lifelines
            onUse5050={handleUse5050}
            onUseAudience={handleUseAudience}
            onStopGame={handleStopGame}
            used5050={used5050}
            usedAudience={usedAudience}
            disabled={status !== 'answering'}
          />
        </div>

        {audienceVotes && <AudienceChart percentages={audienceVotes} />}

        <QuestionCard
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          status={status}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
          hiddenAnswers={hiddenAnswers}
        />
      </div>

      <div className="game-sidebar">
        <MoneyLadder currentQuestionIndex={currentQuestionIndex} />
      </div>
    </div>
  );
};

export default Play;
