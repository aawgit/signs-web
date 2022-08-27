import { softmax } from '@tensorflow/tfjs-core';
import { LABEL_VS_INDEX, lrLabels, rfLabels } from '../utils/constants';
import { OutputFilter, getMode } from '../utils/helper';
import { rfModel } from './models/model_rf';
import { lrModel } from './models/model_lr';

function normalizeMovement(landmarks) {
    const origin = landmarks[0]
    const normalized = landmarks.map(landmark => [landmark[0] - origin[0], landmark[1] - origin[1], landmark[2] - origin[2]])

    return normalized
}

function multiply(A, B) {
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


    const rotationMat = [
        [1, 0, 0],
        [0, cos, -sin],
        [0, sin, cos],
        // [0, 0, 0]
    ]

    const rotationMat2 = [[1, 0, 0],
    [0, cos, -sin],
    [0, sin, cos]]

    const rotated = landmarks.map(landmark =>
        // matMul([landmark], rotationMat).arraySync()[0])
        multiply([landmark], rotationMat2))
    return [rotated.map(r => r[0]), Math.asin(sin)]

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
    return [rotated.map(r => r[0]), Math.asin(sin)]
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

    
    const rotationMat2 = [
        [cos, -sin, 0],
        [sin, cos, 0],
        [0, 0, 1],
    ]

   
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
    return [rotated2.map(r => r[0]), Math.asin(sin)]
}

function eucDistance(a, b) {
    return a
        .map((x, i) => Math.abs(x - b[i]) ** 2) // square the difference
        .reduce((sum, now) => sum + now) // sum
        ** (1 / 2)
}

function unitVector(point1, point2){
  const dis = eucDistance(point1, point2)
  const uv = []
  for(let i=0; i<point1.length; i++){
    uv[i] = (point1[i] - point2[i])/dis
  }
  return uv
}

export function scaleVertices(landmarks) {
    const wristJoint = landmarks[0]
    const middleFingerBase = landmarks[9]
    const vRefLimbLength = eucDistance(wristJoint, middleFingerBase)
    const vRefUnitVector = unitVector(middleFingerBase, wristJoint)

    // console.log(`V Unit vector ${vRefUnitVector}`)

    const hRef1 = landmarks[5]
    const hRef2 = landmarks[17]
    const hRefLimbLength = eucDistance(hRef1, hRef2)
    const hRefUnitVector = unitVector(hRef2, hRef1)
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

export function runPreprocessSteps(handData) {
    const landmarks = handData.length > 0 ? handData[0].landmarks : null
    if (!landmarks) return null
    // console.log(landmarks)
    
    // console.log(`After Scaling`)
    // console.log(pre1)
    const pre2 = normalizeMovement(landmarks)
    // console.log(`After normalizing`)
    // console.log(pre2)
    const pre3 = stopRotationAroundX(pre2)
    // console.log(`After X`)
    // console.log(pre3)
    const pre4 = stopRotationAroundZ(pre3[0])
    // console.log(`After Z`)
    // console.log(pre4)
    const pre5 = stopRotationAroundY(pre4[0])
    // console.log(`After pre-processing`)
    // console.log(pre5)
    const pre6 = scaleVertices(pre5[0])

    return [pre6, [pre3[1], pre4[1], pre5[1]]]
}
// const lm = [[0.02, 0.015, 0],
//                   [0.494931877409792, 0.06352074855624598, 0.34365336068146485],
//                   [0.8099269739011388, 0.15019027958648754, 0.3863764099575968],
//                   [1.0627734165622655, 0.17654285474865875, 0.3351322967874831],
//                   [1.3355245591151363, 0.1746283386709087, 0.2561532547283659],
//                   [0.7251434824494394, 0.6641893493676517, 0.18171251483504158],
//                   [0.932902424851623, 0.9301016554557303, 0.06684066416542424],
//                   [1.111041704477273, 1.0493965499714752, 0.008893074079888335],
//                   [1.264307445978213, 1.1076542445867825, -0.04771070153657935],
//                   [0.607294174410951, 0.6822616051880965, -0.09484187247584792],
//                   [0.8268744701786342, 0.9467214854650475, -0.2510124345111621],
//                   [1.0304768385086644, 1.0758103060839097, -0.3722329279343161],
//                   [1.2390680656671733, 1.1729601836348562, -0.44564335326787186],
//                   [0.4920770151005568, 0.6442160074341488, -0.35481796318674524],
//                   [0.7176113862331885, 0.8816557935631295, -0.5372253291145253],
//                   [0.9246134009031519, 1.0115041532962357, -0.6215840979328423],
//                   [1.1160672470056043, 1.1305891424379066, -0.6914260697313789],
//                   [0.37608141524413, 0.5464045797705996, -0.5721712164066598],
//                   [0.5518376222461113, 0.7192377798276867, -0.7531665396810316],
//                   [0.712010096144453, 0.8550425776047149, -0.8452783773753918],
//                   [0.8582676344036527, 0.9898679827714314, -0.9188083667001632]]
// const res = runPreprocessSteps([{landmarks: lm}, 0])
// console.log(res)

function indexOfMax(arr) {
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

const oFilter = new OutputFilter()
export class CascadedClassifier {
    constructor(model) {
        this.model = model
    }

    getPrediction(rawOutput) {
        const smPredLRTs = softmax(rawOutput)
        const smPredLR = smPredLRTs.arraySync()
        // console.log(smPredLR)
        const highestConfPred = indexOfMax(smPredLR)
        return highestConfPred
    }

    ensemblePredict(dataset) {
        const results = []
        const rawPredLR = lrModel(dataset)


        const predLR = this.getPrediction(rawPredLR)
        // if(predLR[1]<0.5) return null
        const rawPredRF = rfModel(dataset)
        const predRF = this.getPrediction(rawPredRF)

        const predIndexKNN = this.model.predict(dataset)

        results.push(rfLabels[predRF[0]])
        results.push(lrLabels[predLR[0]])
        results.push(predIndexKNN)
        if (rfLabels[predRF[0]] == lrLabels[predLR[0]]
            || rfLabels[predRF[0]] == predIndexKNN
            || lrLabels[predLR[0]] == predIndexKNN)
            return getMode(results)
    }

    ensemblePredict2(dataset) {
        const rawPredLR = lrModel(dataset)
        const predLR = this.getPrediction(rawPredLR)
        if (predLR[1] > 0.67) {
            console.log(predLR[1])
            return lrLabels[predLR[0]]
        }
        else if (predLR[1] < 0.2) { return null }
        else {
            const results = []
            const rawPredRF = rfModel(dataset)
            const predRF = this.getPrediction(rawPredRF)
            if (predRF[1] > 0.67) {
                console.log(predRF[1])
                return rfLabels[predRF[0]]
            }
            const predIndexKNN = this.model.predict(dataset)
            if (predRF[1] > 0.5 && predLR[1] > 0.5) {
                console.log(predRF[1])
                results.push(rfLabels[predRF[0]])
                results.push(lrLabels[predLR[0]])
                results.push(predIndexKNN)
                return getMode(results)
            }
        }
    }

    predict(dataset, angles) {
        const predIndex = this.ensemblePredict(dataset)
        if (predIndex) {
            const idx = oFilter.filter(predIndex)
            if (idx && idx > 0) {
                const predSignL2 = classifyRuleBased(idx, angles)
                const predSignL = LABEL_VS_INDEX[predSignL2].split(" ")[1]
                return predSignL
            }
            else return null

        }
        else return null
    }
}

export function classifyRuleBased(pred, angles) {
    // 'U උ' and 'L ල්'
    let z_rotation = null
    let sign = null
    if (pred == 7 || pred == 27) {
        z_rotation = radiansToDegrees(angles[1])
        if (z_rotation > 45)
            sign = 27
        else
            sign = 7
        return sign
    }
    // 'Dh ද්' and 'P ප්'
    if (pred == 17 || pred == 22) {
        z_rotation = radiansToDegrees(angles[1])
        z_rotation = radiansToDegrees(angles[1])
        if (z_rotation > 45)
            sign = 17
        else
            sign = 22
        return sign
    }
    // 'H හ්' and 'AW ඖ'
    if (pred == 30 || pred == 51) {
        z_rotation = radiansToDegrees(angles[1])
        if (z_rotation > 45)
            sign = 51
        else
            sign = 30
        return sign
    }
    else return pred
}