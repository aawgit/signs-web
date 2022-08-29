import React, { useState, useEffect } from 'react';
import { EDGE_PAIRS_FOR_ANGLES, verticesToIgnore, importantFeatures } from '../utils/constants';

import KNN from 'ml-knn'
import { trainingData } from './training.data';
import {
    findAngle, unFlatten, flatten, CascadedClassifier, runPreprocessSteps
} from '../service/classification.service';



function getAngles(landmarks) {
    const anglesForTheRow = []
    EDGE_PAIRS_FOR_ANGLES.forEach(limbPair => {
        const limb1 = [landmarks[limbPair[0][0]], landmarks[limbPair[0][1]]]
        const limb2 = [landmarks[limbPair[1][0]], landmarks[limbPair[1][1]]]
        const angle = findAngle(limb1[0], limb1[1], limb2[1])
        anglesForTheRow.push((angle - 90) / 90)
    })
    return anglesForTheRow
}

function buildCoordinateFeatures(dataRow) {
    // console.log(dataRow)
    const verticesToIgnore = [0, 5, 9, 13, 17]
    const indexSet = new Set(verticesToIgnore);
    const arrayWithValuesRemoved = dataRow.filter((value, i) => !indexSet.has(i));
    return arrayWithValuesRemoved
}

const selectImportantFeatures = (flattCoAndAngles) => {
    const indexSet = new Set(importantFeatures);
    const selected = flattCoAndAngles.filter((value, i) => indexSet.has(i));
    return selected
}

const buildFeatureVector = (landmarks, ratio = 1) => {
    if (!landmarks) return [undefined, undefined]
    const preProcessed = runPreprocessSteps(landmarks)
    let preProcessedLandmark = preProcessed[0]
    const orientations = preProcessed[1]
    let angles = getAngles(landmarks)
    if (ratio != 1) {
        angles = angles.map(a => a * ratio)
    }

    const indexSet = new Set(verticesToIgnore);
    preProcessedLandmark = preProcessedLandmark.filter((value, i) => !indexSet.has(i));

    let flatted = flatten(preProcessedLandmark)
    flatted = flatted.concat(angles)

    flatted = selectImportantFeatures(flatted)
    return [flatted, orientations]
}

function buildFeatures(data) {
    const features = data.map(row => {
        const coordinates = buildCoordinateFeatures(row)
        const flattenedCoordinates = flatten(coordinates)
        const angles = getAngles(row)
        return flattenedCoordinates.concat(angles)
    })
    return features
}

function getCascadedClassifier(Xtrain, ytrain) {
    // console.log(`Input...`)
    // console.log(trainingData)

    // const trainY = trainingData.map(row => row[0])
    // console.log(`trainY`)
    // console.log(trainY)
    // const trainXUnProcessed = trainingData.map(row => row.slice(1))
    // console.log(`trainXUnProcessed...`)
    // console.log(trainXUnProcessed)
    // const unFlattenData = trainXUnProcessed.map(td => unFlatten(td))
    // console.log(`Unflattened training data...`)
    // console.log(unFlattenData)
    // const trainX = buildFeatures(unFlattenData)
    // // const train_dataset = trainingData.map(row => row.slice(0).map(val => Number(val)))
    // console.log(trainX)


    const knn = new KNN(Xtrain, ytrain, { k: 3 });

    const cascadedClassifier = new CascadedClassifier(knn)

    return cascadedClassifier
}



export default function ClassifierComponent(props) {
    // const [trainingData, setTrainingData] = useState('');
    const [clf, setClf] = useState('');

    useEffect(() => {
        // You need to restrict it at some point
        // This is just dummy code and should be replaced by actual
        if (!clf) {
            setClassifier();
        }
    }, []);

    const setClassifier = async () => {
        const Xtrain = []
        const ytrain = []
        for(let i=0; i<trainingData.length; i++){
            const td = trainingData[i]
            ytrain[i] = td.shift()
            Xtrain[i] = td
        }
        setClf(getCascadedClassifier(Xtrain, ytrain))
    }

    // const trainingData = await getTrainingData2(path)
    // const knnClassifier = getKnnClassifier(trainingData)

    const handData = props.handData
    // const handData = [{
    //     landmarks: [[0.12916257977485657, 0.6669284105300903, 0.0000005],
    //     [0.19915251433849335, 0.6252729296684265, -0.025281822308897972],
    //     [0.2569730281829834, 0.5577287077903748, -0.03176458552479744],
    //     [0.29888710379600525, 0.495349645614624, -0.036887526512145996],
    //     [0.33298933506011963, 0.4516623914241791, -0.04114971309900284],
    //     [0.2167578637599945, 0.4554523825645447, 0.0013439585454761982],
    //     [0.24108736217021942, 0.37097349762916565, -0.009149455465376377],
    //     [0.25029873847961426, 0.3193632662296295, -0.02236662246286869],
    //     [0.25695210695266724, 0.27322307229042053, -0.03248090669512749],
    //     [0.1796128749847412, 0.4416337311267853, 0.0029476438648998737],
    //     [0.20054547488689423, 0.3515053987503052, -0.004890798591077328],
    //     [0.21257251501083374, 0.29389503598213196, -0.01875048317015171],
    //     [0.22257906198501587, 0.24550750851631165, -0.029583381488919258],
    //     [0.1403188705444336, 0.443098247051239, -0.00030933006200939417],
    //     [0.15258841216564178, 0.3554060459136963, -0.0099945655092597],
    //     [0.16394123435020447, 0.30211561918258667, -0.020518245175480843],
    //     [0.17508232593536377, 0.2587372660636902, -0.028138941153883934],
    //     [0.09694679081439972, 0.4555051922798157, -0.006637724116444588],
    //     [0.10199353098869324, 0.3867417573928833, -0.016510093584656715],
    //     [0.10778825730085373, 0.3411574065685272, -0.02101042866706848],
    //     [0.1160956397652626, 0.2981507182121277, -0.023680033162236214]]
    // }]
    if (handData) {
        const landmarks = handData.length > 0 ? handData[0].landmarks : null
        const fv = buildFeatureVector(landmarks)
        const featureVector = fv[0]
        const angles = fv[1]
        return (
            <div>
                {featureVector ? clf.predict(featureVector, angles) : 'No landmark'}
            </div>
        );
    }
    else {
        return (
            <div>

            </div>
        )
    }
    // let angles = buildAngleFeatures([preProcessed])
    // console.log(angles)
    // preProcessed = flatten(preProcessed)
}