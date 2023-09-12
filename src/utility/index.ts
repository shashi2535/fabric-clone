export const justNumber = (string: string) => {
  const numsStr = string.replace(/[^0-9]/g, '');
  return Number(numsStr);
};

export const convertToBps = (number) => {
  const convertData = number * 1000000;
  return convertData;
};
