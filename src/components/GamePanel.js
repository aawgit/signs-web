import React, { useState, useEffect } from "react";
import { trainingData } from "../data/training.data";
import {
  getMultiLevelClassifier,
  buildFeatureVector,
} from "../service/classification.service";
import { GAME_STATES, LABEL_VS_INDEX } from "../utils/constants";

const GamePanel = ({
  handData,
  sendSignToParent,
  sendGameStatusToParent,
  gameStatus: masterGameStatus,
  expectedSign,
  moveToNext
}) => {
  const [clf, setClf] = useState("");

  useEffect(() => {
    const Xtrain = [];
    const ytrain = [];

    trainingData.forEach((td, index) => {
      const [y, ...x] = td;

      ytrain.push(y);
      Xtrain.push(x);
    });

    setClf(getMultiLevelClassifier(Xtrain, ytrain));
  }, []);

  let prediction;
  if (handData && masterGameStatus !== GAME_STATES.won) {
    const landmarks = handData[0]?.landmarks ?? null;

    const [featureVector, angles] = buildFeatureVector(landmarks);

    if (featureVector) {
      prediction = clf.predict(featureVector, angles);
      sendSignToParent(prediction);
    }
  }

  // TODO: Move this block to a game controller
  if (expectedSign && expectedSign == prediction) {
    sendGameStatusToParent(GAME_STATES.won);
  }
  
  return (
    <div style={{ alignContent: "center", textAlign: "center" }}>
      <img
        src={`${process.env.PUBLIC_URL}${expectedSign}.jpg`}
        className="rounded"
        style={{ display: "block", marginLeft: "auto", marginRight: "auto", width: "100%" }}
        alt="Expected sign"
      />
      <p style={{ textAlign: "center", fontSize: "50px", color: "#eb8c34" }}>
        {expectedSign ? LABEL_VS_INDEX[expectedSign].split(" ")[1] : null}
      </p>
      {/* <p style={{ textAlign: "center", fontSize: "50px", color: "#eb8c34" }}>
        {`debug msg ${prediction}`}
      </p> */}
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={moveToNext}
      >
        Skip
      </button>
    </div>
  );
};

export default GamePanel;
