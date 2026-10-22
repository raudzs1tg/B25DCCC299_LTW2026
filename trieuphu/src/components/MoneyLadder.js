import React from 'react';
import { PRIZES, MILESTONES, formatMoney } from '../data';

const MoneyLadder = ({ currentQuestionIndex }) => {
  const ladderItems = [...PRIZES]
    .map((prize, idx) => ({
      level: idx + 1,
      prize,
    }))
    .reverse();

  return (
    <div className="money-ladder-container">
      <div className="money-ladder-title">Thang tiền thưởng</div>
      <ul className="ladder-list">
        {ladderItems.map((item) => {
          const isCurrent = item.level === currentQuestionIndex + 1;
          const isMilestone = MILESTONES.includes(item.level);
          const isPassed = item.level < currentQuestionIndex + 1;

          let itemClasses = 'ladder-item';
          if (isMilestone) itemClasses += ' ladder-milestone';
          if (isCurrent) itemClasses += ' ladder-current';
          else if (isPassed) itemClasses += ' ladder-passed';

          return (
            <li
              key={item.level}
              className={itemClasses}
              style={{
                fontWeight: isMilestone || isCurrent ? 'bold' : 'normal',
              }}
            >
              <span>Câu {item.level}</span>
              <span>{formatMoney(item.prize)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MoneyLadder;
