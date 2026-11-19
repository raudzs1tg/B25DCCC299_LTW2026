import { createSlice } from '@reduxjs/toolkit';

const coursesSlice = createSlice({
  name: 'courses',
  initialState: [],
  reducers: {
    setCourses: (state, action) => {
      return [...action.payload];
    },
    addCourse: (state, action) => {
      const maxId = state.reduce(
        (max, course) => (course.id > max ? course.id : max),
        0
      );
      state.push({ ...action.payload, id: maxId + 1 });
    },
    removeCourse: (state, action) => {
      return state.filter((course) => course.id !== action.payload);
    },
    setScore: (state, action) => {
      const { id, score } = action.payload;
      const target = state.find((course) => course.id === id);
      if (target) {
        target.score = score;
      }
    },
  },
});

export const { setCourses, addCourse, removeCourse, setScore } =
  coursesSlice.actions;

export const selectCourses = (state) => state.courses;

export default coursesSlice.reducer;