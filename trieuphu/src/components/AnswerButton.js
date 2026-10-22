import React from 'react';

const AnswerButton = ({
  index,
  letter,
  text,
  onClick,
  status,
  selectedAnswer,
  correctAnswer,
  isHidden = false,
}) => {
  if (isHidden) {
    return <div className="answer-btn answer-btn-hidden" aria-hidden="true" />;
  }

  let buttonClass = 'answer-btn';

  if (status === 'locked' && selectedAnswer === index) {
    buttonClass += ' answer-btn-locked';
  } else if (status === 'revealed') {
    if (index === correctAnswer) {
      buttonClass += ' answer-btn-correct';
    } else if (index === selectedAnswer) {
      buttonClass += ' answer-btn-wrong';
    }
  }

  return (
    <button
      type="button"
      className={buttonClass}
      disabled={status !== 'answering'}
      onClick={() => onClick(index)}
    >
      <span>
        <strong>{letter}.</strong> {text}
      </span>
    </button>
  );
};

export default AnswerButton;
