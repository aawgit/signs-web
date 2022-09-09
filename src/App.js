import { useState } from "react";
import Button from "@material-ui/core/Button";
import "@tensorflow/tfjs-backend-webgl";
// import "@mediapipe/hands";
import GamePanel from "./components/GamePanel"
import VideoComp from "./components/VideoComp";
import { GAME_STATES, signsToPlay, LABEL_VS_INDEX } from "./utils/constants";
// TODO:
// Better layout
//  - Fit the image and video to div sizes?
// Attractive way of showing correct status
//---------------Firebase release-------------
// Data collection
// --------------First "production" release ---------
// Neglect non-signs
//  - Max distance for KNN
//  - Prediction probability - Implemented with some hacks
//  - other category?
// Refactor the code to proper structure
// Code quality
//
// Performance
//  - Remove unnecessary steps
export default function App() {
  const [handData, setHandData] = useState();
  // const [expectedSign, setExpectedSign] = useState();
  const [currentSign, setCurrentSign] = useState();

  const [gameStatus, setGameStatus] = useState(GAME_STATES.playing)

  const [expectedSign, setExpectedSign] = useState(1)

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
    if (status == GAME_STATES.won) {
      setTimeout(function () {
        moveToNext()
      }, 3000);
    }

  };

  const getRandomSign = () => {
    if (signsToPlayRound.length == 1) setSignsToPlayRound([...signsToPlay])
    const indexOfSign = Math.floor(Math.random() * signsToPlayRound.length)
    const sign = signsToPlayRound.splice(indexOfSign, 1);
    if (!sign) return 1
    return sign
  }
  let expectedSignForUI = 1
  expectedSign ? expectedSignForUI = expectedSign : null
  return (

    <div className="container py-4">
      <header className="pb-3 mb-4 border-bottom">
        <a href="/" class="d-flex align-items-center text-dark text-decoration-none">
          <span class="fs-4">Let's learn Sinhala Fingerspelling Alphabet</span>
        </a>
      </header>

      <div className="row align-items-md-stretch">
        <div className="col-md-6">
          <div className="h-100 p-5 text-dark bg-light border rounded-3" >
            <GamePanel handData={handData}
              gameStatus={gameStatus}
              sendSignToParent={sendSignToParent}
              sendGameStatusToParent={sendGameStatusToParent}
              moveToNext={moveToNext}
              expectedSign={expectedSignForUI} />
             </div>
        </div>
        <div class="col-md-6">
          <div class="h-100 p-5 bg-light border rounded-3">
            <VideoComp sendDataToParent={sendDataToParent} gameStatus={gameStatus} />
            </div>
        </div>
      </div>

      <footer class="pt-3 mt-4 text-muted border-top">
        &copy; 2022
      </footer>
    </div>

  );
}
