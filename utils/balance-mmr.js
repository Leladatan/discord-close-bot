const splitSequence = (sequence) => {
  if (sequence.length === 0) {
    return {firstArray: [], secondArray: [], difference: 0};
  }

  const sortedSequence = sequence.sort((a, b) => a - b);

  const firstArray = [];
  const secondArray = [];

  for (let i = 0; i < sortedSequence.length; i++) {
    if (i % 2 === 0) {
      firstArray.push(sortedSequence[i]);
    } else {
      secondArray.push(sortedSequence[i]);
    }
  }

  let sumFirstArray = 0;
  let sumSecondArray = 0;

  for (const num of firstArray) {
    sumFirstArray += num;
  }

  for (const num of secondArray) {
    sumSecondArray += num;
  }

  const difference = Math.abs(sumFirstArray - sumSecondArray);

  return {firstArray, secondArray, difference};
}

const shuffleArraysWithDiff = (arr1, arr2) => {
  let combined = [...arr1, ...arr2];

  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  let newArr1 = combined.slice(0, arr1.length);
  let newArr2 = combined.slice(arr1.length);

  let sum1 = newArr1.reduce((a, b) => a + b, 0);
  let sum2 = newArr2.reduce((a, b) => a + b, 0);

  let diff = Math.abs(sum1 - sum2);

  return [newArr1, newArr2, diff];
}

const BalanceMMR = (sequence) => {
  const {firstArray, secondArray, difference} = splitSequence(sequence);

  let result = {diffSum: difference};

  for (let i = 0; i < 500; i++) {
    let [shuffledArr1, shuffledArr2, diffSum] = shuffleArraysWithDiff(
      firstArray,
      secondArray
    );

    if (result.diffSum > diffSum) {
      result = {shuffledArr1, shuffledArr2, diffSum}
    }
  }
  return result
}

module.exports = BalanceMMR;