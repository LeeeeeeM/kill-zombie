export const getRandomRange = (start: number, end: number): number => {
  if (start > end) {
    return Math.random() * (start - end) + end;
  }
  return Math.random() * (end - start) + start;
};

export const calculateRangeAngles = (bulletCount: number): number[] => {
  const angles: number[] = [0];
  const angleIncrement = Math.PI / 6 / (bulletCount + 1); // 计算角度增量

  let sign = 1;

  for (let i = 1; i < bulletCount; i++) {
    angles.push(Math.floor((i + 1) / 2) * sign * angleIncrement);
    sign *= -1;
  }

  return angles;
};