import React from 'react';

const Timer = ({ timeLeft }) => {
  const isUrgent = timeLeft <= 10;

  return (
    <div
      className={`timer-container ${isUrgent ? 'timer-urgent' : 'timer-normal'}`}
      style={isUrgent ? { color: '#e71d36' } : {}}
    >
      <span>⏱</span>
      <span>Còn {timeLeft} giây</span>
    </div>
  );
};

export default Timer;
