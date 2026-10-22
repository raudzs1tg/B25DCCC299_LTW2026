import React from 'react';
import AnswerButton from './AnswerButton';
import { LETTERS } from '../data';

const QuestionCard = ({
  question,
  questionIndex,
  status,
  selectedAnswer,
  onSelectAnswer,
  hiddenAnswers = [],
}) => {
  if (!question) return null;

  return (
    <div className="question-card">
      <div className="question-number-badge">
        Câu {questionIndex + 1}/15
      </div>

      <div className="question-content-box">
        {question.question}
      </div>

      <div className="answers-grid">
        {question.options.map((optionText, idx) => (
          <AnswerButton
            key={idx}
            index={idx}
            letter={LETTERS[idx]}
            text={optionText}
            onClick={onSelectAnswer}
            status={status}
            selectedAnswer={selectedAnswer}
            correctAnswer={question.answer}
            isHidden={hiddenAnswers.includes(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
