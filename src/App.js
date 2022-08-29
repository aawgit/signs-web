import { useState } from "react";

import "@tensorflow/tfjs-backend-webgl";
// import "@mediapipe/hands";
import ClassifierComponent from "./components/Classifier"
import VideoComp from "./components/VideoComp";
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


  const sendDataToParent = (landmarks) => { // the callback. Use a better name
    setHandData(landmarks);
  };


  return (
    <div>
     <div>
        <div className="album py-5 bg-light">
          <div className="container">
            {/* <a href="/">
              Back
            </a> */}
            <div className="row">
              <div className="col-md-8" id="cnHolder">
              <ClassifierComponent handData={handData} />
              </div>
              <div className="col-md-4">
                {/* <h5>Foo</h5> */}
                <VideoComp sendDataToParent={sendDataToParent} />
                
                </div>
            </div>
          </div>
        </div>
    </div>
    </div>
  );
}
