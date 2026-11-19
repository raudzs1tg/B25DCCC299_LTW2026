import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddCourseForm from './components/AddCourseForm';
import GoalPlanner from './components/GoalPlanner';
import { useNotice } from './context/NoticeContext';
import { useTheme } from './context/ThemeContext';
import { formatPoint, SEMESTERS } from './data';
import {
  removeCourse,
  selectCourses,
  setCourses,
  setScore,
} from './features/coursesSlice';
import { useFetch } from './hooks/useFetch';
import { calcStats, getGrade } from './utils';

const App = () => {
  const { data, loading, error } = useFetch('/data/courses.json');
  const courses = useSelector(selectCourses);
  const dispatch = useDispatch();

  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();

  const [semesterFilter, setSemesterFilter] = useState('all');

  useEffect(() => {
    if (data) {
      dispatch(setCourses(data));
    }
  }, [data, dispatch]);

  const visibleCourses = useMemo(() => {
    if (semesterFilter === 'all') {
      return courses;
    }
    return courses.filter((course) => course.semester === semesterFilter);
  }, [courses, semesterFilter]);

  const viewStats = useMemo(() => calcStats(visibleCourses), [visibleCourses]);
  const allStats = useMemo(() => calcStats(courses), [courses]);

  const handleScoreChange = (id, e) => {
    const val = e.target.valueAsNumber;
    if (!Number.isNaN(val) && val >= 0 && val <= 10) {
      dispatch(setScore({ id, score: val }));
    }
  };

  const handleRemove = (id, name) => {
    dispatch(removeCourse(id));
    showNotice(`Đã xóa môn ${name}`);
  };

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <h1>Sổ điểm sinh viên</h1>
        <button type="button" onClick={toggleTheme} className="btn-theme">
          {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
        </button>
      </header>

      {loading ? (
        <p className="status-message">Đang tải bảng điểm...</p>
      ) : error ? (
        <p className="status-message error-text">Không tải được bảng điểm</p>
      ) : (
        <main className="app-main">
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
                            onClick={() => handleRemove(course.id, course.name)}
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

          <AddCourseForm />

          <GoalPlanner />
        </main>
      )}
    </div>
  );
};

export default App;