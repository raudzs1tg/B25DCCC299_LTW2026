import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { coursesReducer } from './coursesReducer';
import { CREDIT_OPTIONS, formatPoint, SEMESTERS } from './data';
import { useFetch } from './hooks/useFetch';
import { calcStats, getGrade } from './utils';

const App = () => {
  const { data, loading, error } = useFetch('/data/courses.json');
  const [courses, dispatch] = useReducer(coursesReducer, []);

  // State lọc học kỳ
  const [semesterFilter, setSemesterFilter] = useState('all');

  // State của form Thêm môn học (controlled inputs)
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState(3);
  const [semester, setSemester] = useState(SEMESTERS[0]);
  const [score, setScore] = useState('');
  const [errors, setErrors] = useState({});

  // Ref để đưa con trỏ về ô Mã môn sau khi thêm thành công
  const codeInputRef = useRef(null);

  // Khi useFetch tải xong data thì nạp vào reducer
  useEffect(() => {
    if (data) {
      dispatch({ type: 'LOAD', payload: data });
    }
  }, [data]);

  // Lọc danh sách môn theo học kỳ đang chọn
  const visibleCourses = useMemo(() => {
    if (semesterFilter === 'all') {
      return courses;
    }
    return courses.filter((course) => course.semester === semesterFilter);
  }, [courses, semesterFilter]);

  // Thống kê cho các môn đang xem (theo bộ lọc)
  const viewStats = useMemo(() => calcStats(visibleCourses), [visibleCourses]);

  // Thống kê tích lũy cho toàn bộ môn học
  const allStats = useMemo(() => calcStats(courses), [courses]);

  // Xử lý sửa điểm trực tiếp trong bảng
  const handleScoreChange = (id, e) => {
    const val = e.target.valueAsNumber;
    if (!Number.isNaN(val) && val >= 0 && val <= 10) {
      dispatch({ type: 'SET_SCORE', payload: { id, score: val } });
    }
  };

  // Xử lý xóa một môn
  const handleRemove = (id) => {
    dispatch({ type: 'REMOVE', payload: id });
  };

  // Xử lý submit form Thêm môn học
  const handleAddCourse = (e) => {
    e.preventDefault();

    const nextErrors = {};
    const trimmedCode = code.trim();
    const trimmedName = name.trim();
    const numericScore = Number(score);

    // 1. Kiểm tra mã môn
    if (!trimmedCode) {
      nextErrors.code = 'Hãy nhập mã môn';
    } else {
      const isDuplicate = courses.some(
        (c) => c.code.toLowerCase() === trimmedCode.toLowerCase()
      );
      if (isDuplicate) {
        nextErrors.code = 'Mã môn đã tồn tại';
      }
    }

    // 2. Kiểm tra tên môn
    if (!trimmedName) {
      nextErrors.name = 'Hãy nhập tên môn';
    }

    // 3. Kiểm tra điểm hệ 10
    if (
      score.trim() === '' ||
      Number.isNaN(numericScore) ||
      numericScore < 0 ||
      numericScore > 10
    ) {
      nextErrors.score = 'Điểm phải từ 0 đến 10';
    }

    // Nếu có lỗi thì hiển thị lỗi và dừng lại
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    // Hợp lệ -> dispatch ADD
    dispatch({
      type: 'ADD',
      payload: {
        code: trimmedCode.toUpperCase(),
        name: trimmedName,
        credits: Number(credits),
        semester,
        score: numericScore,
      },
    });

    // Reset form về mặc định và focus lại ô Mã môn
    setCode('');
    setName('');
    setCredits(3);
    setSemester(SEMESTERS[0]);
    setScore('');
    setErrors({});

    if (codeInputRef.current) {
      codeInputRef.current.focus();
    }
  };

  return (
    <div className="app light">
      <header className="app-header">
        <h1>Sổ điểm sinh viên</h1>
      </header>

      {loading ? (
        <p className="status-message">Đang tải bảng điểm...</p>
      ) : error ? (
        <p className="status-message error-text">Không tải được bảng điểm</p>
      ) : (
        <main className="app-main">
          {/* Khu vực Thống kê */}
          <section className="card stats-section">
            <h2>Thống kê</h2>
            <div className="stats-list">
              <p>Số môn: {viewStats.count}</p>
              <p>Tổng tín chỉ: {viewStats.credits}</p>
              <p>GPA (hệ 4): {viewStats.gpa.toFixed(2)}</p>
              <p>Xếp loại: {viewStats.rank}</p>
              <p>GPA tích lũy: {allStats.gpa.toFixed(2)}</p>
            </div>
          </section>

          {/* Khu vực Bảng điểm */}
          <section className="card table-section">
            <h2>Bảng điểm</h2>

            <div className="toolbar">
              <label htmlFor="semester-filter">Xem học kỳ</label>
              <select
                id="semester-filter"
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
              >
                <option value="all">Tất cả</option>
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            {visibleCourses.length === 0 ? (
              <p>Chưa có môn học nào</p>
            ) : (
              <table className="courses-table">
                <thead>
                  <tr>
                    <th>Mã môn</th>
                    <th>Tên môn</th>
                    <th>Tín chỉ</th>
                    <th>Học kỳ</th>
                    <th>Điểm (hệ 10)</th>
                    <th>Điểm chữ</th>
                    <th>Điểm (hệ 4)</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleCourses.map((course) => {
                    const grade = getGrade(course.score);
                    const isFail = grade.letter === 'F';

                    return (
                      <tr key={course.id} className={isFail ? 'fail-row' : ''}>
                        <td>{course.code}</td>
                        <td>{course.name}</td>
                        <td>{course.credits}</td>
                        <td>{course.semester}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            aria-label={`Điểm ${course.name}`}
                            value={course.score}
                            onChange={(e) => handleScoreChange(course.id, e)}
                          />
                        </td>
                        <td>{isFail ? 'F – Học lại' : grade.letter}</td>
                        <td>{formatPoint(grade.point)}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleRemove(course.id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </section>

          {/* Khu vực Thêm môn học */}
          <section className="card form-section">
            <h2>Thêm môn học</h2>
            <form onSubmit={handleAddCourse} noValidate className="course-form">
              <div className="form-group">
                <label htmlFor="course-code">Mã môn</label>
                <input
                  id="course-code"
                  ref={codeInputRef}
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                {errors.code ? (
                  <p role="alert" className="field-error">
                    {errors.code}
                  </p>
                ) : null}
              </div>

              <div className="form-group">
                <label htmlFor="course-name">Tên môn</label>
                <input
                  id="course-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name ? (
                  <p role="alert" className="field-error">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div className="form-group">
                <label htmlFor="course-credits">Số tín chỉ</label>
                <select
                  id="course-credits"
                  value={credits}
                  onChange={(e) => setCredits(Number(e.target.value))}
                >
                  {CREDIT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="course-semester">Học kỳ</label>
                <select
                  id="course-semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  {SEMESTERS.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="course-score">Điểm hệ 10</label>
                <input
                  id="course-score"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />
                {errors.score ? (
                  <p role="alert" className="field-error">
                    {errors.score}
                  </p>
                ) : null}
              </div>

              <button type="submit" className="btn-submit">
                Thêm môn
              </button>
            </form>
          </section>
        </main>
      )}
    </div>
  );
};

export default App;