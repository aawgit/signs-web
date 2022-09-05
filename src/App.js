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

  const [gameStatus, setGameStatus] = useState(GAME_STATES.playing)

  const [expectedSign, setExpectedSign] = useState()

  const [signsToPlayRound, setSignsToPlayRound] = useState([...signsToPlay])


  const sendDataToParent = (landmarks) => { // the callback. Use a better name
    setHandData(landmarks);
  };

  const sendSignToParent = (sign) => { // the callback. Use a better name
    setCurrentSign(sign);
  };

  const moveToNext = () => {
    const expectedSign = getRandomSign()
    setExpectedSign(expectedSign)
    setGameStatus(GAME_STATES.playing);
  }

  const sendGameStatusToParent = (status) => { // the callback. Use a better name
    console.log(`Sending game status ${status} to parent...`)
    setGameStatus(status);
    if(status==GAME_STATES.won){
      setTimeout(function () {
        moveToNext()
      }, 3000);
    }
    
  };

  const getRandomSign = () => {
    if (signsToPlayRound.length == 0) setSignsToPlayRound(signsToPlay)
    const indexOfSign = Math.floor(Math.random() * signsToPlayRound.length)
    const sign = signsToPlayRound.splice(indexOfSign, 1);
    return sign
  }

  return (
    <div>
      <div>
        <div className="album py-5 bg-light">
          <div className="container">
            <div className="row">
              <div className="col-md-5" id="cnHolder">
                <GamePanel handData={handData}
                  gameStatus={gameStatus}
                  sendSignToParent={sendSignToParent}
                  sendGameStatusToParent={sendGameStatusToParent}
                  moveToNext={moveToNext}
                  expectedSign={expectedSign ? expectedSign : 1} />
              </div>
              <div className="col-md-2" id="cnHolder2">
               some shit
              </div>
              <div className="col-md-5">
                <VideoComp sendDataToParent={sendDataToParent} gameStatus={gameStatus} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
