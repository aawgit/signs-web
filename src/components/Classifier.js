import React, { useState, useEffect } from 'react';
import { trainingData } from '../data/training.data';
import {getMultiLevelClassifier, buildFeatureVector,
} from '../service/classification.service';

export default function ClassifierComponent(props) {
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
        setClf(getMultiLevelClassifier(Xtrain, ytrain))
    }

    const handData = props.handData
    if (handData) {
        const landmarks = handData.length > 0 ? handData[0].landmarks : null
        const fv = buildFeatureVector(landmarks)
        const featureVector = fv[0]
        const angles = fv[1]
        return (
            <div style={{fontSize:"100px"}}>
                {featureVector ? clf.predict(featureVector, angles) : ''}
            </div>
        );
    }
    else {
        return (
            <div>

            </div>
        )
    }
}