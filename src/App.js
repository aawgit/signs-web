import { useState } from "react";

import "@tensorflow/tfjs-backend-webgl";
// import "@mediapipe/hands";
import GamePanel from "./components/GamePanel"
import VideoComp from "./components/VideoComp";
import { GAME_STATES, signsToPlay } from "./utils/constants";
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

  const [expectedSign, setExpectedSign] = useState()

  
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
      const expectedSign = getRandomSign()
      setExpectedSign(expectedSign)
  }, 3000);
  };
  
  const getRandomSign = () => {
    return signsToPlay[Math.floor(Math.random() * signsToPlay.length)];
  }

  return (
    <div>
      <div>
        <div className="album py-5 bg-light">
          <div className="container">
            <div className="row">
              <div className="col-md-6" id="cnHolder">
                <GamePanel handData={handData} 
                gameStatus={gameStatus}
                sendSignToParent={sendSignToParent} 
                sendGameStatusToParent={sendGameStatusToParent} 
                expectedSign={expectedSign? expectedSign: 1}/>
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
