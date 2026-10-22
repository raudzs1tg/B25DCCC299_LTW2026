import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { formatMoney } from '../data';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { name, prize, correctCount, reason } = state;

  const getReasonInfo = () => {
    switch (reason) {
      case 'win':
        return {
          text: 'Chúc mừng! Bạn đã trở thành triệu phú',
          className: 'result-title-win',
        };
      case 'wrong':
        return {
          text: 'Rất tiếc, bạn đã trả lời sai',
          className: 'result-title-wrong',
        };
      case 'timeout':
        return {
          text: 'Hết giờ!',
          className: 'result-title-timeout',
        };
      case 'stop':
        return {
          text: 'Bạn đã dừng cuộc chơi',
          className: 'result-title-stop',
        };
      default:
        return {
          text: 'Kết thúc lượt chơi',
          className: '',
        };
    }
  };

  const info = getReasonInfo();

  return (
    <div className="result-card">
      <h2 className={`result-title ${info.className}`}>{info.text}</h2>

      <div className="result-info-box">
        <div>
          <strong>Người chơi:</strong> {name}
        </div>
        <div>
          <strong>Số câu trả lời đúng:</strong> {correctCount}
        </div>
        <div>
          <strong>Tiền thưởng:</strong>{' '}
          <span className="result-prize-highlight">{formatMoney(prize)}</span>
        </div>
      </div>

      <div className="result-actions">
        <button
          type="button"
          className="btn btn-gold"
          onClick={() => navigate('/play')}
        >
          Chơi lại
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/')}
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default Result;
