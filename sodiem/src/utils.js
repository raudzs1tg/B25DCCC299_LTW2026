import { GRADES, RANKS } from './data';

export const getGrade = (score) => {
  return GRADES.find((item) => score >= item.min) || GRADES[GRADES.length - 1];
};

export const getRank = (gpa) => {
  const found = RANKS.find((item) => gpa >= item.min);
  return found ? found.title : 'Yếu';
};

export const calcStats = (courses) => {
  if (courses.length === 0) {
    return {
      count: 0,
      credits: 0,
      points: 0,
      gpa: 0,
      rank: 'Chưa xếp loại',
    };
  }

  const credits = courses.reduce((sum, course) => sum + course.credits, 0);
  const points = courses.reduce(
    (sum, course) => sum + course.credits * getGrade(course.score).point,
    0
  );
  const gpa = credits > 0 ? Math.round((points / credits) * 100) / 100 : 0;
  const rank = getRank(gpa);

  return {
    count: courses.length,
    credits,
    points,
    gpa,
    rank,
  };
};