import React, { useState, useEffect, useCallback, useRef } from "react";
import "@tensorflow/tfjs-backend-webgl";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import GamePanel from "./GamePanel";
import VideoComp from "./VideoComp";
import {
  GAME_STATES,
  signsToPlay,
  IMAGE_PAUSED_TIME,
} from "../utils/constants";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqF1Kkzo8tbeV9zEMdMpyyNJO_A5em2iw",
  authDomain: "signsl.firebaseapp.com",
  projectId: "signsl",
  storageBucket: "signsl.appspot.com",
  messagingSenderId: "739991459341",
  appId: "1:739991459341:web:daf1c2b3be878720c0a744",
  measurementId: "G-PKSWR9LCH1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// TODO:
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

const shuffleSigns = () =>{
  console.log(`Shufffling...`)
return  [...signsToPlay].slice().sort(() => Math.random() - 0.5);
}
 

const Home = () => {
  const [handData, setHandData] = useState();
  // const [expectedSign, setExpectedSign] = useState();
  const [currentSign, setCurrentSign] = useState();
  const [gameStatus, setGameStatus] = useState(GAME_STATES.playing);
  const [expectedSign, setExpectedSign] = useState(23);
  const randomizedSignsRef = useRef([]);
  const [sendChecked, setSendChecked] = useState(true);

  const getNextSign = useCallback(() => {
    if (!randomizedSignsRef.current.length)
      randomizedSignsRef.current = shuffleSigns();

    return randomizedSignsRef.current.shift();
  }, []);

  const isMobile = window.innerWidth <= 768;

  const handleCheckboxClick = useCallback(() => {
    setSendChecked((checked) => !checked);
  }, []);

  const sendDataToParent = (landmarks) => {
    // the callback. Use a better name
    setHandData(landmarks);
  };

  const sendSignToParent = (sign) => {
    // the callback. Use a better name
    setCurrentSign(sign);
  };

  const moveToNext = useCallback(() => {
    setExpectedSign(getNextSign);
    setGameStatus(GAME_STATES.playing);
  }, [getNextSign]);

  const sendGameStatusToParent = (status) => {
    // the callback. Use a better name
    setGameStatus(status);
  };

  // Hook responsible for initiating next game after a game is won
  useEffect(() => {
    if (gameStatus !== GAME_STATES.won) return undefined;

    const timeout = setTimeout(() => {
      moveToNext();
    }, IMAGE_PAUSED_TIME);

    return () => {
      clearTimeout(timeout);
    };
  }, [gameStatus, moveToNext]);

  let expectedSignForUI = null;
  if (expectedSign) {
    expectedSignForUI = expectedSign;
  }
  const mobileV = <div className="container py-4">
    <div className="row align-items-md-stretch">
        <div style={{ display: "flex", justifyContent: "center" }}>
          Try to do the displayed sign
        </div>
         <div className="h-100 p-1 text-dark bg-light border rounded-3 card w-50">
    <GamePanel
      handData={handData}
      gameStatus={gameStatus}
      sendSignToParent={sendSignToParent}
      sendGameStatusToParent={sendGameStatusToParent}
      moveToNext={moveToNext}
      expectedSign={expectedSignForUI}
    />
  </div>
    <div className="h-100 p-1 bg-light border rounded-3 card w-50">
      <VideoComp
        sendDataToParent={sendDataToParent}
        gameStatus={gameStatus}
        sendData={sendChecked}
      />

    </div>
    <div>
      <label
        className="form-check-label"
        htmlFor="flexCheckDefault"
        style={{ marginRight: "30px" }}
      >
        <small>Send data to improve</small>
      </label>
      <input
        className="form-check-input"
        type="checkbox"
        onChange={handleCheckboxClick}
        value=""
        id="flexCheckDefault"
        checked={sendChecked}
      />
    </div>
    <p>
      <small>
        <i>
          When enabled, a few images of your hand will be saved for
          further improving this service.
        </i>
      </small>
    </p>
  </div>
  </div>
  
 if (isMobile) return mobileV
  return (
    <div className="container py-4">
      <div className="row align-items-md-stretch">
        <div style={{ display: "flex", justifyContent: "center" }}>
          Try to do the displayed sign
        </div>
        <div className="col-md-5">
          <div className="h-100 p-5 text-dark bg-light border rounded-3">
            <GamePanel
              handData={handData}
              gameStatus={gameStatus}
              sendSignToParent={sendSignToParent}
              sendGameStatusToParent={sendGameStatusToParent}
              moveToNext={moveToNext}
              expectedSign={expectedSignForUI}
              isMobile = {isMobile}
            />
          </div>
        </div>
        <div className="col-md-7">
          <div className="h-100 p-5 bg-light border rounded-3">
            <VideoComp
              sendDataToParent={sendDataToParent}
              gameStatus={gameStatus}
              sendData={sendChecked}
              isMobile = {isMobile}
            />
            <div>
              <label
                className="form-check-label"
                htmlFor="flexCheckDefault"
                style={{ marginRight: "30px" }}
              >
                <small>Send data to improve</small>
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                onChange={handleCheckboxClick}
                value=""
                id="flexCheckDefault"
                checked={sendChecked}
              />
            </div>
            <p>
              <small>
                <i>
                  When enabled, a few images of your hand will be saved for
                  further improving this service.
                </i>
              </small>
            </p>
          </div>
        </div>
      </div>

      <footer className="pt-3 mt-4 text-muted border-top">1.0.0-alpha.5</footer>
    </div>
  );
};

export default Home;
