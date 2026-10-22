import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ playerName, setPlayerName }) => {
  const navigate = useNavigate();

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

        <div className="rules-box">
          <h3>📜 Luật chơi:</h3>
          <ul>
            <li>Bộ câu hỏi gồm 15 câu trắc nghiệm lập trình Web theo thứ tự file JSON.</li>
            <li>Mỗi câu hỏi có 30 giây để đưa ra đáp án cuối cùng. Hết giờ tính như trả lời sai.</li>
            <li>Câu 5, 10, 15 là các mốc an toàn. Trả lời sai nhận tiền mốc an toàn cao nhất đã vượt qua.</li>
            <li>Trả lời đúng cả 15 câu nhận giải thưởng tối đa 250.000.000 đ.</li>
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
