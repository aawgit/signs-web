import React, { useState, useEffect, useRef } from "react";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "@tensorflow/tfjs-backend-webgl";
import LinearProgress from "@material-ui/core/LinearProgress";
import {  getPose2 } from "../service/detector.service";
import { GAME_STATES } from "../utils/constants";
import { cropAndSend } from "../service/trainer.service";

const UPLOAD_INTERVAL = 2000

// TODO: Replace dummy values with real
const expected = 1
const current = 1

let SEND_FLAG = true

export default function VideoComp({ sendDataToParent, gameStatus, sendData, isMobile}) {
  const [cameraHidden, setCameraHidden] = useState("hidden");
  const [pausedImage, setPausedImage] = useState();
  const webcamRef = useRef();

  // TODO: Refactor and move these 2 functions to a seperate file
  const uploadPoses = async () => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
      && SEND_FLAG
    ) {
      // const lmEst = await net.estimateHands(webcamRef.current.video)
      // TODO: Evaluate getPose and getPose2 in terms of accuracy and performance 
      const lmEst = await getPose2(webcamRef.current.video, false)
      if (lmEst && lmEst.length > 0) {
        const bbox = lmEst[0].boundingBox
        if (bbox) {
          const crop = {
            x1: bbox.topLeft[0],
            y1: bbox.topLeft[1],
            x2: bbox.bottomRight[0],
            y2: bbox.bottomRight[1]
          }
          captureAndSend(crop, expected, current)
        }
      }
    }
    setTimeout(() => {
      uploadPoses();

    }, UPLOAD_INTERVAL);
  };

  const captureAndSend = (crop, exp, cur) => {
    const image = webcamRef.current.getScreenshot();
    cropAndSend(image, crop, exp, cur)
  }
  //
  
  const capture = React.useCallback(
    () => {
      if (!pausedImage) {
        const image = webcamRef.current.getScreenshot();
        setPausedImage(image)
      }
    },
    [webcamRef]
  );

  const detect = async () => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // const poseEstimateResult = await net.estimateHands(webcamRef.current.video)
      // const poseEstimateResult = null //await getPose(webcamRef.current.video)
      // await getPose(webcamRef.current.video)
      // TODO: Evaluate getPose and getPose2 in terms of accuracy and performance 
      const poseEstimateResult = await getPose2(webcamRef.current.video, isMobile)
      sendDataToParent(poseEstimateResult);
      if (cameraHidden === "hidden") {
        setCameraHidden("visible");
      }
    }
    setTimeout(() => {
      detect();
    }, 100);
  };

  const runHandpose = async () => {
    // const net = await handpose.load();
    detect();
    uploadPoses()
  };

  useEffect(() => runHandpose(), []);

  useEffect(() => ()=>{
    // This should be the other way around, but this works. Don't know how. Shame!
    sendData? SEND_FLAG=false: SEND_FLAG=true
  }, 
    [sendData]);

  let widthx = "100%"
  if ((gameStatus == GAME_STATES.won) || cameraHidden=='hidden') widthx = 0
  const videoC = <div style={{ visibility: gameStatus != undefined }}>
    <Webcam
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      // videoConstraints={{
      //   height: 600,
      //   width: 600
      // }}
      style={{
        width: widthx,
        top: 0, left: 0, bottom: 0, right: 0
      }}
      className="rounded"
    />
  </div>

  let videoP = <div></div>
  if (gameStatus == GAME_STATES.won) {
    let image
    if (pausedImage) image = pausedImage
    else {
      capture()
    }
    // Dirty trick link this with main components state change
    setTimeout(function () {
      setPausedImage(null)
    }, 3000);
    //
    videoP =
      <img src={image} className="rounded" style={{
        visibility: cameraHidden,
        bottom: 0,
        width: "100%"
      }} />

  }

  let correctSign = <div></div>
  if (gameStatus == GAME_STATES.won) correctSign = <img src={process.env.PUBLIC_URL + "correct.png"}
    style={{
      width: "100px",
      top: "50%",
      left: "45%",
      position: "absolute"
    }}></img>
  return (
    <div >
      {cameraHidden === "hidden" && (
        <div className="Outer">
          <div className="Spacer"></div>
          <p>Loading. Please wait.</p>
          <LinearProgress />
        </div>
      )}
      <div>
        {videoC}
        {videoP}
        {correctSign}
      </div>
    </div>
  );
}