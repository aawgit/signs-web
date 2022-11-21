import React, { useState, useEffect, useRef, useCallback } from "react";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "@tensorflow/tfjs-backend-webgl";
import LinearProgress from "@material-ui/core/LinearProgress";
import { GAME_STATES } from "../utils/constants";
import { cropAndSend } from "../service/trainer.service";

const UPLOAD_INTERVAL = 2000;

// TODO: Replace dummy values with real
const expected = 1;
const current = 1;

const VideoComp = ({ sendDataToParent, gameStatus, sendData }) => {
  const [net, setNet] = useState();
  const [cameraHidden, setCameraHidden] = useState("hidden");
  const [pausedImage, setPausedImage] = useState(null);
  const webcamRef = useRef();

  // Hook responsible for loading the net
  useEffect(() => {
    handpose.load().then(setNet);
  }, []);

  // Hook responsible for getting a paused image for 3s after a game is won
  useCallback(() => {
    if (gameStatus !== GAME_STATES.won) return undefined;

    const image = webcamRef.current.getScreenshot();
    setPausedImage(image);

    const timeout = setTimeout(() => {
      setPausedImage(null);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [gameStatus]);

  // TODO: Refactor and move these 2 functions to a seperate file
  const uploadPoses = useCallback(async () => {
    if (webcamRef.current?.video?.readyState === 4) {
      const lmEst = await net.estimateHands(webcamRef.current.video);
      if (lmEst && lmEst.length > 0) {
        const bbox = lmEst[0].boundingBox;
        if (bbox) {
          const crop = {
            x1: bbox.topLeft[0],
            y1: bbox.topLeft[1],
            x2: bbox.bottomRight[0],
            y2: bbox.bottomRight[1],
          };
          const image = webcamRef.current.getScreenshot();
          cropAndSend(image, crop, expected, current);
        }
      }
    }
  }, [net]);

  useEffect(() => {
    if (!net || !sendData) return undefined;
    const interval = setInterval(uploadPoses, UPLOAD_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [net, sendData, uploadPoses]);

  const detect = useCallback(async () => {
    if (webcamRef.current?.video?.readyState === 4) {
      const poseEstimateResult = await net.estimateHands(
        webcamRef.current.video
      );
      sendDataToParent(poseEstimateResult);
      setCameraHidden("visible");
    }
  }, [net, sendDataToParent]);

  useEffect(() => {
    if (!net) return undefined;
    const interval = setInterval(detect, 100);

    return () => {
      clearInterval(interval);
    };
  }, [net, detect]);

  return (
    <div>
      {cameraHidden === "hidden" && (
        <div className="Outer">
          <div className="Spacer" />
          <p>Loading. Please wait.</p>
          <LinearProgress />
        </div>
      )}
      <div>
        {/* Webcam feed */}
        <div style={{ visibility: gameStatus !== undefined }}>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{
              width:
                gameStatus === GAME_STATES.won || cameraHidden === "hidden"
                  ? 0
                  : "100%",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
            className="rounded"
          />
        </div>

        {/* Paused image (displayed on win) */}
        {gameStatus === GAME_STATES.won &&
          !!pausedImage(
            <img
              alt="Accepted solution"
              src={pausedImage}
              className="rounded"
              style={{
                visibility: cameraHidden,
                bottom: 0,
                width: "100%",
              }}
            />
          )}

        {/* Correct image */}
        {gameStatus === GAME_STATES.won && (
          <img
            src={`${process.env.PUBLIC_URL}correct.png`}
            alt="Correct sign"
            style={{
              width: "100px",
              top: "50%",
              left: "45%",
              position: "absolute",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default VideoComp;
