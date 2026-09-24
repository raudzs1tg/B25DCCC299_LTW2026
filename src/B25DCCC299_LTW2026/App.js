import React, { useState } from 'react';
import StudentList from './StudentList';
import './App.css';

// Khởi tạo mảng dữ liệu mẫu (dùng const)
const initialStudents = [
  { id: 1, name: 'Nguyễn Văn A', score: 8.5, className: 'D26CQCN01-B' },
  { id: 2, name: 'Trần Thị B', score: 4.2, className: 'D26CQCN02-B' },
  { id: 3, name: 'Lê Văn C', score: 6.8, className: 'D26CQCN03-B' }
];

const App = () => {
  // Quản lý state chính
  const [students, setStudents] = useState(initialStudents);
  const [formData, setFormData] = useState({ name: '', score: '', className: '' });
  const [filterType, setFilterType] = useState('ALL'); // ALL, EXCELLENT, FAILED

  // Xử lý khi gõ vào Form
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructuring
    setFormData({ ...formData, [name]: value });
  };

  // Tính năng: Thêm sinh viên
  const handleAddStudent = (e) => {
    e.preventDefault();
    const { name, score, className } = formData;

    // Ràng buộc dữ liệu (Validation)
    if (!name || !score || !className) {
      alert('Vui lòng không để trống thông tin!');
      return;
    }

    const numericScore = parseFloat(score);
    if (numericScore < 0 || numericScore > 10) {
      alert('Điểm số không hợp lệ! (Phải nằm trong khoảng 0 - 10)');
      return;
    }

    const newStudent = {
      id: Date.now(), // Tạo ID ngẫu nhiên dựa trên thời gian
      name,
      score: numericScore,
      className
    };

    // Cập nhật state ngay lập tức (không làm mất dữ liệu cũ)
    setStudents([...students, newStudent]);
    setFormData({ name: '', score: '', className: '' }); // Reset form
  };

  // Tính năng: Xóa sinh viên (dùng .filter() của ES6)
  const handleDelete = (id) => {
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);
  };

  // Tính năng: Lọc (Filter)
  const getFilteredStudents = () => {
    if (filterType === 'EXCELLENT') {
      return students.filter((s) => s.score >= 8);
    }
    if (filterType === 'FAILED') {
      return students.filter((s) => s.score < 5);
    }
    return students;
  };

  const displayedStudents = getFilteredStudents();

  // Thống kê cơ bản
  const totalStudents = students.length;
  // Tính điểm trung bình dùng .reduce() của ES6
  const averageScore = totalStudents > 0
    ? (students.reduce((total, student) => total + student.score, 0) / totalStudents).toFixed(2)
    : 0;

  return (
    <div className="container">
      <h1>Quản lý Điểm Sinh viên</h1>
      
      {/* Form thêm sinh viên */}
      <form onSubmit={handleAddStudent} className="form-container">
        <h3>Thêm Sinh Viên Mới</h3>
        <input 
          type="text" name="name" placeholder="Họ Tên" 
          value={formData.name} onChange={handleInputChange} 
        />
        <input 
          type="number" step="0.1" name="score" placeholder="Điểm số (0-10)" 
          value={formData.score} onChange={handleInputChange} 
        />
        <input 
          type="text" name="className" placeholder="Lớp" 
          value={formData.className} onChange={handleInputChange} 
        />
        <button type="submit">Thêm</button>
      </form>

      {/* Bộ lọc và Thống kê */}
      <div className="stats-filter">
        <div>
          {/* Dùng Template Literals nối chuỗi */}
          <p><strong>{`Tổng số sinh viên: ${totalStudents}`}</strong></p>
          <p><strong>{`Điểm trung bình toàn lớp: ${averageScore}`}</strong></p>
        </div>
        <div>
          <button onClick={() => setFilterType('ALL')}>Tất cả</button>
          <button onClick={() => setFilterType('EXCELLENT')}>Sinh viên Giỏi (&gt;= 8)</button>
          <button onClick={() => setFilterType('FAILED')}>Sinh viên Trượt (&lt; 5)</button>
        </div>
      </div>

      {/* Render Component con và truyền Props */}
      <StudentList students={displayedStudents} onDelete={handleDelete} />
    </div>
  );
};

export default App;