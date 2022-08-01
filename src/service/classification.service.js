import { scalar, tensor2d, matMul, tensor, add, sub, div } from '@tensorflow/tfjs-core';

export function normalizeMovement(landmarks) {
    const origin = landmarks[0]
    const normalized = landmarks.map(landmark => [landmark[0] - origin[0], landmark[1] - origin[1], landmark[2] - origin[2]])

    return normalized
}

export function multiply(A, B) {
    var result = new Array(A.length).fill(0).map(row => new Array(B[0].length).fill(0));

    return result.map((row, i) => {
        return row.map((val, j) => {
            return A[i].reduce((sum, elm, k) => sum + (elm * B[k][j]), 0)
        })
    })
}

export function stopRotationAroundX(landmarks) {

    const point1 = landmarks[0]

    const p5 = landmarks[5];
    const p13 = landmarks[13];
    const p17 = landmarks[17];

    // const point2 = div(add(add(p5, p13), p17), (scalar(3))).arraySync()
    const point2 = [p5[0] + p13[0] + p17[0], p5[1] + p13[1] + p17[1], p5[2] + p13[2] + p17[2]]

    const a = point2[1] - point1[1]
    const b = point2[2] - point1[2]
    const c = Math.sqrt(a * a + b * b)

    const cos = a / c
    const sin = b / c


    const rotationMat = tensor2d([
        [1, 0, 0],
        [0, cos, -sin],
        [0, sin, cos],
        // [0, 0, 0]
    ])

    const rotationMat2 = [[1, 0, 0],
    [0, cos, -sin],
    [0, sin, cos]]

    const rotated = landmarks.map(landmark =>
        // matMul([landmark], rotationMat).arraySync()[0])
        multiply([landmark], rotationMat2))
    return rotated.map(r => r[0])

}


export function stopRotationAroundY(landmarks) {
    const point1 = landmarks[5]

    const p5 = landmarks[5];
    const p13 = landmarks[13];
    const p17 = landmarks[17];

    const point2 = [p5[0] + p13[0] + p17[0], p5[1] + p13[1] + p17[1], p5[2] + p13[2] + p17[2]]

    // console.log(`Point 1 ${point1}`)
    // console.log(`Point 2 ${point2}`)

    const a = point2[0] - point1[0]
    const b = point2[2] - point1[2]
    const c = Math.sqrt(a * a + b * b)

    // console.log(`${a} ${b} ${c}`)

    const cos = a / c
    const sin = b / c

    // const rotationMat = tensor2d([
    //     [cos, 0, sin],
    //     [0, 1, 0],
    //     [-sin, 0, cos],
    // ])
    const rotationMat = [
        [cos, 0, -sin],
        [0, 1, 0],
        [sin, 0, cos],
    ]
    // console.log(`Sin ${sin}`)
    // console.log(`Cos ${cos}`)

    const rotated = landmarks.map(landmark =>
        // matMul([landmark], rotationMat).arraySync()[0])
        multiply([landmark], rotationMat))
    return rotated.map(r => r[0])
}

export function stopRotationAroundZ(landmarksp) {
    // console.log(`Input at z`)
    // console.log(landmarksp)
    const point1 = landmarksp[0]

    const point2 = landmarksp[9]

    const a = point2[0] - point1[0]
    const b = point2[1] - point1[1]
    const c = Math.sqrt(a * a + b * b)

    const cos = a / c
    const sin = b / c

    // const rotationMat = tensor2d([
    //     [cos, sin, 0],
    //     [-sin, cos, 0],
    //     [0, 0, -1],
    // ])

    // const rotationMat2 = [
    //     [cos, sin, 0],
    //     [-sin, cos, 0],
    //     [0, 0, 1],
    // ]
    const rotationMat2 = [
        [cos, -sin, 0],
        [sin, cos, 0],
        [0, 0, 1],
    ]

    // const rotationMat3 = [
    //     [0, -1, 0], [1, 0, 0], [0, 0, 1]
    // ]
    const rotationMat3 = [
        [0, 1, 0], [-1, 0, 0], [0, 0, 1]
    ]

    // const rotated = landmarks.map(landmark =>
    //     matMul([landmark], rotationMat).arraySync()[0])
    const rotated = landmarksp.map(landmark =>
        // matMul([landmark], rotationMat).arraySync()[0])
        multiply([landmark], rotationMat2)).map(r => r[0])
    // console.log(`Rotated 1`)
    // console.log(rotated)
    const rotated2 = rotated.map(landmark =>
        // matMul([landmark], rotationMat).arraySync()[0])
        multiply([landmark], rotationMat3))
    return rotated2.map(r => r[0])
}

function eucDistance(a, b) {
    return a
        .map((x, i) => Math.abs(x - b[i]) ** 2) // square the difference
        .reduce((sum, now) => sum + now) // sum
        ** (1 / 2)
}

export function scaleVertices(landmarks) {
    const wristJoint = landmarks[0]
    const middleFingerBase = landmarks[9]
    const vRefLimbLength = eucDistance(wristJoint, middleFingerBase)
    const vRefUnitVector = div(sub(middleFingerBase, wristJoint), scalar(vRefLimbLength)).arraySync()

    // console.log(`V Unit vector ${vRefUnitVector}`)

    const hRef1 = landmarks[5]
    const hRef2 = landmarks[17]
    const hRefLimbLength = eucDistance(hRef1, hRef2)
    const hRefUnitVector = div(sub(hRef2, hRef1), scalar(hRefLimbLength)).arraySync()
    // console.log(`H Unit vector ${hRefUnitVector}`)

    const scaleRatioH = 0.7 / hRefLimbLength
    const scaleRatioV = 1 / vRefLimbLength

    // console.log(`scaleRatioH ${scaleRatioH}`)
    // console.log(`scaleRatioV ${scaleRatioV}`)

    const scaled = landmarks.map(lm => [
        lm[0] * scaleRatioH * hRefUnitVector[0],
        lm[1] * scaleRatioV * vRefUnitVector[1],
        lm[2] * (scaleRatioH + scaleRatioV) / 2])
    return scaled
}


// Function to convert radians to degrees
function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}

// Function to find the distance between 2 points in a 3D plane
function dist(p1, p2) {
    return Math.sqrt(
        Math.pow(p1[0] - p2[0], 2) +
        Math.pow(p1[1] - p2[1], 2) +
        Math.pow(p1[2] - p2[2], 2)
    );
}

// Function to find the angle in 3D space
export function findAngle(a, b, c) {
    const ab = dist(a, b);
    const bc = dist(b, c);
    const ac = dist(a, c);

    const angle = (Math.pow(ab, 2) + Math.pow(bc, 2) - Math.pow(ac, 2)) /
        (2 * ab * bc);
    return radiansToDegrees(Math.acos(angle));
}


export function flatten(arr) {
    if (!arr) return arr
    const flatted = []
    arr.forEach(point => {
        point.forEach(c => flatted.push(c))
    })
    return flatted
}


export function unFlatten(flattenCoordinates) {
    var landmarkPoints;
    landmarkPoints = [];

    for (var i = 0, _pj_a = flattenCoordinates.length; i < _pj_a; i += 3) {
        landmarkPoints.push(flattenCoordinates.slice(i, i + 3));
    }

    // console.log(`From unFlatten() ${landmarkPoints}`)
    return landmarkPoints;
}