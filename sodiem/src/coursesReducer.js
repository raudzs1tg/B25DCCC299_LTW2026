export const coursesReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD':
      return [...action.payload];

    case 'ADD': {
      const maxId = state.reduce(
        (max, course) => (course.id > max ? course.id : max),
        0
      );
      const newCourse = { ...action.payload, id: maxId + 1 };
      return [...state, newCourse];
    }

    case 'REMOVE':
      return state.filter((course) => course.id !== action.payload);

    case 'SET_SCORE':
      return state.map((course) =>
        course.id === action.payload.id
          ? { ...course, score: action.payload.score }
          : course
      );

    default:
      return state;
  }
};