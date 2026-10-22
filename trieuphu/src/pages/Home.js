import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatMoney } from '../data';

const Home = ({ playerName, setPlayerName, history = [] }) => {
  const navigate = useNavigate();

  // Kỷ lục có tiền thưởng cao nhất (Bài 3)
  const topRecord =
    history.length > 0
      ? [...history].sort((a, b) => b.prize - a.prize)[0]
      : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName && playerName.trim()) {
      navigate('/play');
    }
  };

  const isStartDisabled = !playerName || !playerName.trim();

  return (
    <div className="home-container">
      <div className="hero-banner">
        <h1 className="game-title">Ai Là Triệu Phú</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
          Phiên bản Lập trình Web – Thử thách kiến thức HTML, CSS, ES6, React
        </p>

        {topRecord && (
          <div className="record-badge">
            🌟 Kỷ lục: {formatMoney(topRecord.prize)} – {topRecord.name}
          </div>
        )}

        <div className="rules-box">
          <h3>📜 Luật chơi:</h3>
          <ul>
            <li>Bộ câu hỏi gồm 15 câu trắc nghiệm kiến thức lập trình Web theo thứ tự file JSON.</li>
            <li>Mỗi câu hỏi có 30 giây để đưa ra đáp án cuối cùng. Hết giờ tính như trả lời sai.</li>
            <li>Câu 5, 10, 15 là các mốc an toàn. Trả lời sai nhận tiền mốc an toàn cao nhất đã vượt qua.</li>
            <li>Dừng cuộc chơi nhận đúng số tiền của câu vừa trả lời đúng gần nhất.</li>
            <li>Trả lời đúng cả 15 câu giành chiến thắng với 250.000.000 đ.</li>
            <li>Có 3 quyền trợ giúp: 50:50, Hỏi khán giả và Dừng cuộc chơi.</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="start-form">
          <label htmlFor="playerNameInput" className="form-label">
            Nhập tên người chơi để bắt đầu:
          </label>
          <input
            id="playerNameInput"
            type="text"
            className="name-input"
            placeholder="Ví dụ: Nguyễn Văn An"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-gold"
            disabled={isStartDisabled}
            style={{ padding: '0.9rem', fontSize: '1.15rem' }}
          >
            Bắt đầu
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
