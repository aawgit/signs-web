import Point from "./Point.js";

export default function HandPoints({ handData }) {
  if (handData) {
    let landmarks = [];

    handData.forEach((prediction) => {
      landmarks = prediction.landmarks;
    });

    const canvasHeight = window.innerHeight;

    return (
      <group>
        {landmarks.map((landmark) => (
          <Point
            position={[
              (7.7 * landmark[0]) / 640 - 3.85,
              (-7.7 * landmark[1]) / 480 + 3.85,
              0
            ]}
            // position={[-3.85, 3.85, 0]}
            key={landmark[0]}
          />
        ))}
      </group>
    );
  } else {
    return null;
  }
}
