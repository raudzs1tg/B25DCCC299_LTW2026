import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCourses } from '../features/coursesSlice';
import { selectGoal, setRemaining, setTarget } from '../features/goalSlice';
import { calcRequired } from '../utils';

const GoalPlanner = () => {
  const courses = useSelector(selectCourses);
  const { target, remaining } = useSelector(selectGoal);
  const dispatch = useDispatch();

  const message = useMemo(
    () => calcRequired(courses, target, remaining),
    [courses, target, remaining]
  );

  return (
    <section className="card goal-section">
      <h2>Mục tiêu GPA</h2>
      <div className="goal-inputs">
        <div className="form-group">
          <label htmlFor="goal-target">GPA mục tiêu</label>
          <input
            id="goal-target"
            type="number"
            min="0"
            max="4"
            step="0.01"
            value={target}
            onChange={(e) => dispatch(setTarget(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="goal-remaining">Số tín chỉ còn lại</label>
          <input
            id="goal-remaining"
            type="number"
            min="1"
            step="1"
            value={remaining}
            onChange={(e) => dispatch(setRemaining(e.target.value))}
          />
        </div>
      </div>
      <p className="goal-result">{message}</p>
    </section>
  );
};

export default GoalPlanner;