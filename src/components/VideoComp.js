import React, { useState, useEffect, useRef } from "react";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "@tensorflow/tfjs-backend-webgl";
import LinearProgress from "@material-ui/core/LinearProgress";
import { GAME_STATES } from "../utils/constants";


export default function VideoComp({ sendDataToParent, gameStatus }) {
  const [cameraHidden, setCameraHidden] = useState("hidden");
  const [pausedImage, setPausedImage] = useState();
  const webcamRef = useRef();

  const capture = React.useCallback(
    () => {
      if (!pausedImage) {
        const imageSrc = webcamRef.current.getScreenshot();
        return imageSrc
      }
    },
    [webcamRef]
  );

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const poseEstimateResult = await net.estimateHands(webcamRef.current.video)
      sendDataToParent(poseEstimateResult);
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
  };

  useEffect(() => runHandpose(), []);

  const videoC = <div style={{ visibility: cameraHidden }}>
    <Webcam
      // className="Webcam"
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      // style={{ visibility: "hidden" }}
      style={{
        // left: "1%",
        // top: "45px",
        width: "100%",
        height: "auto",
        // position: "absolute"
      }}
      className="rounded"
    />
  </div>

  let videoP = <div></div>
  if (gameStatus == GAME_STATES.won) {
    let image
    if (pausedImage) image = pausedImage
    else {
      image = capture()
      setPausedImage(image)
    }
    videoP = <img src={image} />
  }

  return (
    <div  >
      {cameraHidden === "hidden" && (
        <div className="Outer">
          <div className="Spacer"></div>
          <LinearProgress />
        </div>
      )}
      {videoC}
      {videoP}
    </div>
  );
}