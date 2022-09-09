export const getMode = (arr) => {
  var map = {};
  for (var i = 0; i < arr.length; i++) {
    if (map[arr[i]] === undefined) {
      map[arr[i]] = 0;
    }
    map[arr[i]] += 1;
  }
  var greatestFreq = 0;
  var mode;
  for (var prop in map) {
    if (map[prop] > greatestFreq) {
      greatestFreq = map[prop];
      mode = prop;
    }
  }
  return mode;

}

export class OutputFilter {
  constructor(buffer_size = 15) {
    this.buffer = Array.apply(null, Array(buffer_size)).map(function () { return 0 });
  }

  filter(sign) {
    var p, sign;
    this.buffer.shift();
    this.buffer.push(sign);
    p = getMode(this.buffer)
    return p;
  }

}

export function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return [maxIndex, max];
}