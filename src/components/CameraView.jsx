// src/components/CameraView.jsx
import React, { useRef } from 'react';
import Webcam from 'react-webcam';

export default function CameraView({
  onCapture,
  facingMode = 'environment',
  width = '100vh',
  height = '100vh',
}) {
  const webcamRef = useRef(null);

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (onCapture) onCapture(imageSrc);
  };

  const videoConstraints = {
    facingMode,
    width: 1280,
    height: 720,
  };

  return (
    <div style={{ position: 'relative', width, height }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
        }}
      />

      <button
        onClick={capturePhoto}
        style={{
          position: 'absolute',
          zIndex: 3,
          padding: '1rem',
          borderRadius: '50%',
          background: 'white',
          border: '2px solid black',
          cursor: 'pointer',
        }}
      >
        📸
      </button>
    </div>
  );
}
