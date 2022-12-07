export function multiply(A, B) {
  const result = new Array(A.length)
    .fill()
    .map(() => new Array(B[0].length).fill(0));

  return result.map((row, i) => {
    return row.map((val, j) => {
      return A[i].reduce((sum, elm, k) => sum + elm * B[k][j], 0);
    });
  });
}

export function eucDistance(a, b) {
  return (
    a
      .map((x, i) => Math.abs(x - b[i]) ** 2) // square the difference
      .reduce((sum, now) => sum + now) ** // sum
    (1 / 2)
  );
}

export function unitVector(point1, point2) {
  const dis = eucDistance(point1, point2);

  const uv = point1.map((_, index) => (point1[index] - point2[index]) / dis);

  return uv;
}

// Function to convert radians to degrees
export function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

// Function to find the distance between 2 points in a 3D plane
function dist(p1, p2) {
  return Math.sqrt(
    (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2
  );
}

// Function to find the angle in 3D space
export function findAngle(a, b, c) {
  const ab = dist(a, b);
  const bc = dist(b, c);
  const ac = dist(a, c);

  const angle = (ab ** 2 + bc ** 2 - ac ** 2) / (2 * ab * bc);
  return radiansToDegrees(Math.acos(angle));
}
