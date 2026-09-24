import React from 'react';
import StudentItem from './StudentItem';

const StudentList = ({ students, onDelete }) => {
  return (
    <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Họ Tên</th>
          <th>Điểm Số</th>
          <th>Lớp</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        {/* Sử dụng phương thức .map() của ES6 */}
        {students.map((student) => (
          <StudentItem 
            key={student.id} 
            student={student} 
            onDelete={onDelete} 
          />
        ))}
      </tbody>
    </table>
  );
};

export default StudentList;