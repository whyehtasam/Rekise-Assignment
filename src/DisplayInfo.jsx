
const DisplayInfo = ({
  totalDistance,
  totalTimeMs,
  elapsedTime,
  speedKmh,
  position,
  increaseSpeed,
  decreaseSpeed,
}) => {
  // Calculate distance traveled
  const distanceTraveled = Math.round((elapsedTime / 3600000) * speedKmh * 100) / 100; // Convert elapsed time from ms to hours

  // Calculate distance remaining
  const distanceRemaining = Math.round((totalDistance - distanceTraveled) * 100) / 100;

  // Ensure time remaining is non-negative
  const timeRemaining = Math.max(0, Math.floor((totalTimeMs - elapsedTime) / 1000)); // Convert ms to seconds

  return (
    <div className="info-panel">
      <div className="info-item">
        <span className="label">Total Distance:</span>
        <span className="value">{Math.round(totalDistance * 100) / 100} km</span>
      </div>
      <div className="info-item">
        <span className="label">Time Remaining:</span>
        <span className="value">{timeRemaining} seconds</span>
      </div>
      <div className="info-item">
        <span className="label">Speed:</span>
        <span className="value">{speedKmh} km/h</span>
        <div className="controls">
          <button onClick={increaseSpeed} className="control-button">Increase Speed</button>
          <button onClick={decreaseSpeed} className="control-button">Decrease Speed</button>
        </div>
      </div>
      <div className="info-item">
        <span className="label">Position:</span>
        <span className="value">{position[0].toFixed(4)}, {position[1].toFixed(4)}</span>
      </div>
      <div className="info-item">
        <span className="label">Elapsed Time:</span>
        <span className="value">{Math.floor(elapsedTime / 1000)} seconds</span>
      </div>
      <div className="info-item">
        <span className="label">Total Time:</span>
        <span className="value">{Math.floor(totalTimeMs / 1000)} seconds</span>
      </div>
      <div className="info-item">
        <span className="label">Fraction:</span>
        <span className="value">{(elapsedTime / totalTimeMs).toFixed(2)}</span>
      </div>
      <div className="info-item">
        <span className="label">Distance Traveled:</span>
        <span className="value">{distanceTraveled} km</span>
      </div>
      <div className="info-item">
        <span className="label">Distance Remaining:</span>
        <span className="value">{distanceRemaining} km</span>
      </div>
    </div>
  );
};

export default DisplayInfo;
