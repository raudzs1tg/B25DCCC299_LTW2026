import { PRIZES, MILESTONES } from './data';

// Hàm tính tiền thưởng theo số câu đúng và lý do kết thúc
export const calcPrize = (correctCount, reason) => {
  if (correctCount === 0) {
    return 0;
  }

  // Dừng cuộc chơi: nhận tiền của câu vừa trả lời đúng gần nhất
  if (reason === 'stop') {
    return PRIZES[correctCount - 1] || 0;
  }

  // Thắng 15 câu: nhận mức cao nhất 250.000.000 đ
  if (reason === 'win' || correctCount >= 15) {
    return PRIZES[14];
  }

  // Trả lời sai hoặc hết giờ: nhận mốc an toàn cao nhất đã vượt qua
  const passedMilestones = MILESTONES.filter((m) => m <= correctCount);
  if (passedMilestones.length === 0) {
    return 0;
  }

  const highestMilestone = passedMilestones[passedMilestones.length - 1];
  return PRIZES[highestMilestone - 1] || 0;
};

// Hàm tính tỉ lệ % cho khán giả (Bài 3)
export const generateAudiencePercentages = (correctIndex, hiddenIndices = []) => {
  // Đáp án đúng ngẫu nhiên 40% - 70%
  const correctPercent = Math.floor(Math.random() * 31) + 40; // 40..70
  let remainingPercent = 100 - correctPercent;

  // Lọc các đáp án sai còn hiển thị (không bị ẩn bởi 50:50)
  const remainingWrongIndices = [0, 1, 2, 3].filter(
    (idx) => idx !== correctIndex && !hiddenIndices.includes(idx)
  );

  const percentages = [0, 0, 0, 0];
  percentages[correctIndex] = correctPercent;

  if (remainingWrongIndices.length === 1) {
    percentages[remainingWrongIndices[0]] = remainingPercent;
  } else if (remainingWrongIndices.length > 1) {
    let allocated = 0;
    for (let i = 0; i < remainingWrongIndices.length - 1; i++) {
      const maxRand = remainingPercent - (remainingWrongIndices.length - 1 - i);
      const val = Math.floor(Math.random() * (maxRand > 0 ? maxRand : 1));
      percentages[remainingWrongIndices[i]] = val;
      allocated += val;
    }
    percentages[remainingWrongIndices[remainingWrongIndices.length - 1]] = remainingPercent - allocated;
  }

  return percentages;
};
