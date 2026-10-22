import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS, LETTERS } from '../data';

const QuestionDetail = ({ questions = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const numId = Number(id);

  const question = questions.find((q) => q.id === numId);

  if (!question) {
    return (
      <div className="detail-card" style={{ textAlign: 'center' }}>
        <h2 style={{ color: 'var(--accent-red)', marginBottom: '1.5rem' }}>
          Không tìm thấy câu hỏi
        </h2>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="detail-card">
      <div className="detail-header">
        <h2 className="page-title" style={{ fontSize: '1.4rem' }}>
          Câu hỏi số {question.id} ({LEVELS[question.level]})
        </h2>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>

      <div className="detail-question-text">{question.question}</div>

      <div className="detail-options-list">
        {question.options.map((option, idx) => {
          const isCorrect = idx === question.answer;
          return (
            <div
              key={idx}
              className={`detail-option-item ${
                isCorrect ? 'detail-option-correct' : ''
              }`}
            >
              <span>
                <strong>{LETTERS[idx]}.</strong> {option}
              </span>
              {isCorrect && <span className="correct-tag">(Đáp án đúng)</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionDetail;
