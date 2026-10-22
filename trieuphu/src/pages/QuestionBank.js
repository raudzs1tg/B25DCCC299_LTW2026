import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data';

const QuestionBank = ({ questions = [] }) => {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesLevel =
      selectedLevel === 'all' ||
      String(q.level) === selectedLevel ||
      LEVELS[q.level] === selectedLevel;

    const matchesQuery = q.question
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesLevel && matchesQuery;
  });

  const getLevelBadgeClass = (level) => {
    if (level === 1) return 'level-easy';
    if (level === 2) return 'level-medium';
    return 'level-hard';
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Ngân hàng câu hỏi</h2>
        <span className="question-count-badge">
          Có {filteredQuestions.length} câu hỏi
        </span>
      </div>

      <div className="filter-bar">
        <select
          className="select-input"
          value={selectedLevel}
          onChange={handleLevelChange}
        >
          <option value="all">Tất cả mức độ</option>
          <option value="1">Dễ</option>
          <option value="2">Trung bình</option>
          <option value="3">Khó</option>
        </select>

        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm theo nội dung câu hỏi..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <table className="custom-table">
        <thead>
          <tr>
            <th style={{ width: '80px' }}>STT</th>
            <th style={{ width: '150px' }}>Mức độ</th>
            <th>Câu hỏi</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuestions.map((q, idx) => (
            <tr key={q.id}>
              <td>{idx + 1}</td>
              <td>
                <span className={`level-badge ${getLevelBadgeClass(q.level)}`}>
                  {LEVELS[q.level]}
                </span>
              </td>
              <td>
                <Link to={`/questions/${q.id}`} className="table-link">
                  {q.question}
                </Link>
              </td>
            </tr>
          ))}
          {filteredQuestions.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>
                Không tìm thấy câu hỏi phù hợp.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;
