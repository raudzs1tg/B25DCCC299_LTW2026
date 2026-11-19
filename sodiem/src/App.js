import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddCourseForm from './components/AddCourseForm';
import CourseRow from './components/CourseRow';
import GoalPlanner from './components/GoalPlanner';
import { useNotice } from './context/NoticeContext';
import { useTheme } from './context/ThemeContext';
import { GRADES, SEMESTERS } from './data';
import {
  removeCourse,
  selectCourses,
  setCourses,
  setScore,
} from './features/coursesSlice';
import { useDebounce } from './hooks/useDebounce';
import { useFetch } from './hooks/useFetch';
import { useLocalStorage } from './hooks/useLocalStorage';
import { hasSaved } from './store';
import { calcStats, getGrade } from './utils';
import './App.css';

const BUILD_TAG = 'TH03';

const App = () => {
  const { data, loading, error } = useFetch('/data/courses.json');
  const courses = useSelector(selectCourses);
  const dispatch = useDispatch();

  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();

  const [semesterFilter, setSemesterFilter] = useLocalStorage(
    'ltw_sodiem_semester',
    'all'
  );
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!hasSaved && data) {
      dispatch(setCourses(data));
    }
  }, [data, dispatch]);

  const semesterCourses = useMemo(() => {
    if (semesterFilter === 'all') {
      return courses;
    }
    return courses.filter((course) => course.semester === semesterFilter);
  }, [courses, semesterFilter]);

  const displayedCourses = useMemo(() => {
    const keyword = debouncedSearch.trim().toLowerCase();
    if (!keyword) {
      return semesterCourses;
    }
    return semesterCourses.filter(
      (course) =>
        course.name.toLowerCase().includes(keyword) ||
        course.code.toLowerCase().includes(keyword)
    );
  }, [semesterCourses, debouncedSearch]);

  const viewStats = useMemo(() => calcStats(semesterCourses), [semesterCourses]);
  const allStats = useMemo(() => calcStats(courses), [courses]);

  const gradeDistribution = useMemo(() => {
    const counts = semesterCourses.reduce((acc, course) => {
      const { letter } = getGrade(course.score);
      acc[letter] = (acc[letter] || 0) + 1;
      return acc;
    }, {});

    return GRADES.map((item) => ({
      letter: item.letter,
      count: counts[item.letter] || 0,
    }));
  }, [semesterCourses]);

  useEffect(() => {
    if (courses.length > 0) {
      document.title = `GPA ${allStats.gpa.toFixed(2)} – Sổ điểm`;
    } else {
      document.title = 'Sổ điểm';
    }
  }, [courses.length, allStats.gpa]);

  useEffect(() => {
    const handleKey = (e) => {
      const tag = e.target.tagName;
      const isTyping =
        tag === 'INPUT' ||
        tag === 'SELECT' ||
        tag === 'TEXTAREA' ||
        e.target.isContentEditable;

      if (e.key === '/' && !isTyping) {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      } else if (
        e.key === 'Escape' &&
        document.activeElement === searchInputRef.current
      ) {
        setSearch('');
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  const handleCourseShift = (e) => {
    setSearch(e.target.value);
  };

  const handleScoreChange = useCallback(
    (id, score) => {
      dispatch(setScore({ id, score }));
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (id, name) => {
      dispatch(removeCourse(id));
      showNotice(`Đã xóa môn ${name}`);
    },
    [dispatch, showNotice]
  );

  const handleResetSample = () => {
    if (data) {
      dispatch(setCourses(data));
      showNotice('Đã đặt lại dữ liệu mẫu');
    }
  };

  const showLoading = !hasSaved && loading;
  const showError = !hasSaved && Boolean(error);

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <header className="app-header">
        <h1>Sổ điểm sinh viên</h1>
        <button type="button" onClick={toggleTheme} className="btn-theme">
          {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
        </button>
      </header>

      {showLoading ? (
        <p className="status-message">Đang tải bảng điểm...</p>
      ) : showError ? (
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

            <div className="distribution-block">
              <h3>Phân bố điểm chữ</h3>
              <ul className="grade-distribution">
                {gradeDistribution.map(({ letter, count }) => (
                  <li key={letter} className="grade-dist-item">
                    <span className="grade-dist-label">
                      {letter}: {count}
                    </span>
                    <span
                      className="grade-bar"
                      style={{ width: `${count * 24}px` }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="card table-section">
            <h2>Bảng điểm</h2>

            <div className="toolbar">
              <div className="toolbar-group">
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

              <div className="toolbar-group">
                <label htmlFor="course-search">Tìm môn học</label>
                <input
                  id="course-search"
                  ref={searchInputRef}
                  type="text"
                  placeholder="Nhập tên hoặc mã môn..."
                  value={search}
                  onChange={handleCourseShift}
                />
              </div>

              <span className="search-count">
                Tìm thấy {displayedCourses.length} môn
              </span>
            </div>

            {displayedCourses.length === 0 ? (
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
                    <th>Số lần render</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedCourses.map((course) => (
                    <CourseRow
                      key={course.id}
                      course={course}
                      onScore={handleScoreChange}
                      onRemove={handleRemove}
                    />
                  ))}
                </tbody>
              </table>
            )}

            <div className="table-actions">
              <button
                type="button"
                onClick={handleResetSample}
                disabled={!data}
              >
                Đặt lại dữ liệu mẫu
              </button>
            </div>
          </section>

          <AddCourseForm />

          <GoalPlanner />
        </main>
      )}
    </div>
  );
};

export default App;