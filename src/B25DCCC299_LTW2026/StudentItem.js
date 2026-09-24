import React from 'react';

// Dùng Arrow function và Destructuring ở tham số nhận Props
const StudentItem = ({ student, onDelete }) => {
  // Dùng Destructuring bóc tách dữ liệu
  const { id, name, score, className } = student;

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{score}</td>
      <td>{className}</td>
      <td>
        {/* Dùng Arrow function ẩn danh cho sự kiện onClick */}
        <button onClick={() => onDelete(id)} style={{ color: 'red' }}>
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default StudentItem;