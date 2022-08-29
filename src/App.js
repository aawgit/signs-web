import React, { useState, useEffect, useRef } from "react";
// import "./styles.css";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "@tensorflow/tfjs-backend-webgl";
// import "@mediapipe/hands";
import ClassifierComponent from "./components/Classifier"

// TODO:
// Neglect non-signs
//  - Max distance for KNN
//  - Prediction probability?
//  - other category?
// Refactor the code to proper structure
// Code quality
// Remove console.logs
// Performance
//  - Remove unnecessary steps
export default function App() {
  const [cameraHidden, setCameraHidden] = useState("hidden");
  const [handData, setHandData] = useState();
  const webcamRef = useRef();
  const [photo, setPhoto] = useState();

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const screenshot = webcamRef.current.getScreenshot();
      const poseEstimateResult = await net.estimateHands(webcamRef.current.video)
      setHandData(poseEstimateResult);
      // setPhoto(screenshot);

      if (cameraHidden === "hidden") {
        setCameraHidden("visible");
      }
    }
    setTimeout(() => {
      detect(net);
    }, 0);
  };

  const runHandpose = async () => {
    const net = await handpose.load();

    detect(net);
    // setInterval(() => {
    //   detect(net);
    // }, 4);
  };

  useEffect(() => runHandpose(), []);

  return (
    <div>
    <div className="App">
      {cameraHidden === "hidden" && (
        <div className="Outer">
          <div className="Spacer"></div>
          <img className="Preview_image" src="/logo.png" alt="logo" />
          <div className="Spacer"></div>
        </div>
      )}

      {
        <div>
          <div className="Video-Container" style={{ visibility: cameraHidden }}>
            <Webcam
              className="Webcam"
              ref={webcamRef}
              screenshotFormat="image/jpeg"
            // style={{ visibility: "hidden" }}
            />

            <img
              className="Photo"
              src={photo}
              // src="test.jpeg"
              alt="screenshot"
              height="480"
              width="640"
            />
          </div>
          {/* <div
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              top: "0px"
            }}
          >
          </div> */}
        </div>
      }
    </div>
    <ClassifierComponent handData={handData} />
    </div>
  );
}
