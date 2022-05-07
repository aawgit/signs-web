import { scalar, tensor1d, tensor2d, matMul, tensor, add, sub, div, squaredDifference, rsqrt } from '@tensorflow/tfjs-core';
import React, { useState, useEffect } from 'react';
const fs = require('fs');
import KNN from 'ml-knn'

function normalizeMovement(landmarks) {
    const origin = landmarks[0]
    const normalized = landmarks.map(landmark => [landmark[0] - origin[0], landmark[1] - origin[1], landmark[2] - origin[2]])

    return normalized
}

function stopRotationAroundX(landmarks) {

    const point1 = landmarks[0]

    const p5 = tensor(landmarks[5]);
    const p13 = tensor(landmarks[13]);
    const p17 = tensor(landmarks[17]);

    const point2 = div(add(add(p5, p13), p17), (scalar(3))).arraySync()

    const a = point2[1] - point1[1]
    const b = point2[2] - point1[2]
    const c = Math.sqrt(a * a + b * b)

    const cos = a / c
    const sin = b / c

    const rotationMat = tensor2d([
        [1, 0, 0],
        [0, cos, sin],
        [0, -sin, cos],
    ])
    const rotated = landmarks.map(landmark =>
        matMul([landmark], rotationMat).arraySync()[0])
    return rotated

}


function stopRotationAroundY(landmarks) {
    const point1 = landmarks[0]

    const p5 = tensor(landmarks[5]);
    const p13 = tensor(landmarks[13]);
    const p17 = tensor(landmarks[17]);

    const point2 = div(add(add(p5, p13), p17), (scalar(3))).arraySync()

    const a = point2[0] - point1[0]
    const b = point2[2] - point1[2]
    const c = Math.sqrt(a * a + b * b)

    const cos = a / c
    const sin = b / c

    const rotationMat = tensor2d([
        [cos, 0, sin],
        [0, 1, 0],
        [-sin, 0, cos],
    ])

    const rotated = landmarks.map(landmark =>
        matMul([landmark], rotationMat).arraySync()[0])
    return rotated
}

function stopRotationAroundZ(landmarks) {
    const point1 = landmarks[0]

    const point2 = landmarks[9]

    const a = point2[0] - point1[0]
    const b = point2[1] - point1[1]
    const c = Math.sqrt(a * a + b * b)

    const cos = a / c
    const sin = b / c

    const rotationMat = tensor2d([
        [cos, -sin, 0],
        [sin, cos, 0],
        [0, 0, 1],
    ])

    const rotated = landmarks.map(landmark =>
        matMul([landmark], rotationMat).arraySync()[0])
    return rotated
}

function eucDistance(a, b) {
    return a
        .map((x, i) => Math.abs(x - b[i]) ** 2) // square the difference
        .reduce((sum, now) => sum + now) // sum
        ** (1 / 2)
}

function scaleVertices(landmarks) {
    const hRef1 = landmarks[5]
    const hRef2 = landmarks[17]
    const hRefLimbLength = eucDistance(hRef1, hRef2)
    const hRefUnitVector = div(sub(hRef2, hRef1), scalar(hRefLimbLength)).arraySync()

    const vRef1 = landmarks[0]
    const vRef2 = landmarks[9]
    const vRefLimbLength = eucDistance(vRef1, vRef2)
    const vRefUnitVector = div(sub(vRef1, vRef2), scalar(vRefLimbLength)).arraySync()

    const scaled = landmarks.map(lm => [
        lm[0] * hRefUnitVector[0],
        lm[1] * vRefUnitVector[1],
        lm[2]])
    return scaled
}

export function runPreprocessSteps(handData) {
    const landmarks = handData?.length > 0 ? handData[0].landmarks : null
    if (!landmarks) return null
    let preProcessed = normalizeMovement(landmarks)
    preProcessed = stopRotationAroundX(preProcessed)
    preProcessed = stopRotationAroundZ(preProcessed)
    preProcessed = stopRotationAroundY(preProcessed)
    preProcessed = scaleVertices(preProcessed)

    return preProcessed
}



function getTrainingData(path) {

    var data = fs.readFileSync(path)
        .toString() // convert Buffer to string
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array

    // console.log(JSON.stringify(data, '', 2)); // as json
    return data

}

function getKnnClassifier(trainingData) {
    trainingData.shift()
    const train_dataset = trainingData.map(row=>row.slice(0).map(val=>Number(val)))
    console.log(train_dataset)
    const train_labels = trainingData.map(row=>row[0])
    const knn = new KNN(train_dataset, train_labels, { k: 3 });
    return knn
}

function flatten(arr) {
    if(!arr) return arr
    const flatted = []
    arr.forEach(point=>{
        point.forEach(c=>flatted.push(c))
    })
    return flatted
}

export default function ClassifierComponent(props) {
    // const [trainingData, setTrainingData] = useState('');
    const [clf, setClf] = useState('');
    const path = `./td_all.csv`

    useEffect(() => {
        // You need to restrict it at some point
        // This is just dummy code and should be replaced by actual
        if (!clf) {
            getTrainingData2();
        }
      }, []);

    const getTrainingData2 = async ()=> {

        const file = await fetch(path)
        const text = await file.text()
        const data = text.split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array
        
        setClf(getKnnClassifier(data))
    }

    // const trainingData = await getTrainingData2(path)
    // const knnClassifier = getKnnClassifier(trainingData)

    const handData = props.handData
    let preProcessed = runPreprocessSteps(handData)
    preProcessed = flatten(preProcessed)
    console.log(preProcessed)
 
    return (
        <div>
            {preProcessed ? clf.predict(preProcessed) : 'No landmark'}
        </div>
    );
}