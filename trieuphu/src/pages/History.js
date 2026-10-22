import React from 'react';
import { formatMoney } from '../data';

const History = ({ history = [], onClearHistory }) => {
  // Sắp xếp trên bản sao mảng theo tiền thưởng giảm dần
  const sortedHistory = [...history].sort((a, b) => b.prize - a.prize);

  const totalPlays = history.length;
  const maxPrize = history.length > 0 ? sortedHistory[0].prize : 0;
  const totalPrize = history.reduce((sum, item) => sum + item.prize, 0);

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Lịch sử các lượt chơi</h2>
        {history.length > 0 && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={onClearHistory}
          >
            Xóa lịch sử
          </button>
        )}
      </div>

      <div className="history-stats-box">
        <div className="history-stats-line">
          Số lượt chơi: <span>{totalPlays}</span>
        </div>
        <div className="history-stats-line">
          Tiền thưởng cao nhất: <span>{formatMoney(maxPrize)}</span>
        </div>
        <div className="history-stats-line">
          Tổng tiền thưởng: <span>{formatMoney(totalPrize)}</span>
        </div>
      </div>

      {sortedHistory.length === 0 ? (
        <div className="empty-history">Chưa có lượt chơi nào.</div>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th>Người chơi</th>
              <th>Số câu đúng</th>
              <th>Tiền thưởng</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {sortedHistory.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.name}</strong>
                </td>
                <td>{item.correctCount}/15</td>
                <td style={{ color: '#ffbe0b', fontWeight: 'bold' }}>
                  {formatMoney(item.prize)}
                </td>
                <td style={{ color: '#8d99ae' }}>{item.playedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;
