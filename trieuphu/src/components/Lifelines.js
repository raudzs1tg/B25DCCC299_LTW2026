import React from 'react';

const Lifelines = ({
  onUse5050,
  onUseAudience,
  onStopGame,
  used5050,
  usedAudience,
  disabled,
}) => {
  return (
    <div className="lifelines-bar">
      <button
        type="button"
        className="lifeline-btn"
        onClick={onUse5050}
        disabled={disabled || used5050}
      >
        50:50
      </button>

      <button
        type="button"
        className="lifeline-btn"
        onClick={onUseAudience}
        disabled={disabled || usedAudience}
      >
        Hỏi khán giả
      </button>

      <button
        type="button"
        className="lifeline-btn"
        onClick={onStopGame}
        disabled={disabled}
      >
        Dừng cuộc chơi
      </button>
    </div>
  );
};

export default Lifelines;
