export const getMode = (arr) => {
  const map = {};
  arr.forEach((item) => {
    if (map[item] === undefined) {
      map[item] = 1;
    } else {
      map[item] += 1;
    }
  });

  let greatestFreq = 0;
  let mode;
  for (const prop in map) {
    if (map[prop] > greatestFreq) {
      greatestFreq = map[prop];
      mode = prop;
    }
  }
  return mode;
};

export class OutputFilter {
  constructor(bufferSize = 5) {
    this.buffer = new Array(bufferSize).fill(0);
  }

  filter(sign) {
    this.buffer.shift();
    this.buffer.push(sign);

    return getMode(this.buffer);
  }
}

export function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }

  let max = -Infinity;
  let maxIndex = 0;

  arr.forEach((item, index) => {
    if (item > max) {
      maxIndex = index;
      max = item;
    }
  });

  return [maxIndex, max];
}
