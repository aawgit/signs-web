import { useState } from "react";

import "@tensorflow/tfjs-backend-webgl";
// import "@mediapipe/hands";
import GamePanel from "./components/GamePanel"
import VideoComp from "./components/VideoComp";
import { GAME_STATES } from "./utils/constants";
// TODO:
// Neglect non-signs
//  - Max distance for KNN
//  - Prediction probability - Implemented with some hacks
//  - other category?
// Refactor the code to proper structure
// Code quality
// Remove console.logs
// Performance
//  - Remove unnecessary steps
export default function App() {
  const [handData, setHandData] = useState();
  // const [expectedSign, setExpectedSign] = useState();
  const [currentSign, setCurrentSign] = useState();

  const [gameStatus, setGameStatus] = useState()

  const sendDataToParent = (landmarks) => { // the callback. Use a better name
    setHandData(landmarks);
  };

  const sendSignToParent = (sign) => { // the callback. Use a better name
    setCurrentSign(sign);
  };

  const sendGameStatusToParent = (status) => { // the callback. Use a better name
    console.log(`Sending game status ${status} to parent...`)
    setGameStatus(status);
    setTimeout(function () {
      setGameStatus(GAME_STATES.playing);
  }, 5000);
  };
  // setExpectedSign(1)

  return (
    <div>
      <div>
        <div className="album py-5 bg-light">
          <div className="container">
            <div className="row">
              <div className="col-md-6" id="cnHolder">
                <GamePanel handData={handData} sendSignToParent={sendSignToParent} sendGameStatusToParent={sendGameStatusToParent} />
              </div>
              <div className="col-md-6">
                <VideoComp sendDataToParent={sendDataToParent} gameStatus={gameStatus} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
