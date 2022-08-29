import React, { useState, useEffect, useRef } from "react";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "@tensorflow/tfjs-backend-webgl";
import LinearProgress from "@material-ui/core/LinearProgress";


export default function VideoComp({ sendDataToParent }) {
  const [cameraHidden, setCameraHidden] = useState("hidden");
  const webcamRef = useRef();

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

  return (
    <div 
    // style={{
    //   left: "1%",
    //   top: "45px",
    //   width: "50%",
    //   height: "auto",
    //   position: "absolute"
    // }}
    >
      {cameraHidden === "hidden" && (
        <div className="Outer">
          <div className="Spacer"></div>
          {/* <img className="Preview_image" src="/loading.gif" alt="loading" /> */}
          <LinearProgress />
          {/* <div className="Spacer"></div> */}
        </div>
      )}
      <div style={{ visibility: cameraHidden }}>
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
    </div>
  );
}