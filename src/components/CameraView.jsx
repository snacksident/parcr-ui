// src/components/CameraView.jsx
import React, { useEffect, useRef, useState } from 'react';
import Overlay from './Overlay';

export default function CameraView({ onCapture, facingMode = 'environment', clubType, step }) {
  const videoRef = useRef(null);
  const [overlayVisible, setOverlayVisible] = useState(false); // State to toggle overlay visibility

  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');
    onCapture(imageData);
  };

  const toggleOverlay = () => {
    setOverlayVisible((prev) => !prev); // Toggle overlay visibility
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        autoPlay
        muted
      />
      {overlayVisible && <Overlay clubType={clubType} step={step} />}
      <button
        onClick={capturePhoto}
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '0.5rem 1rem',
          background: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 3,
        }}
      >
        Capture
      </button>
      <button
        onClick={toggleOverlay}
        style={{
          position: 'absolute',
          bottom: '4rem',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '0.5rem 1rem',
          background: overlayVisible ? 'red' : 'green',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 3,
        }}
      >
        {overlayVisible ? 'Hide Overlay' : 'Show Overlay'}
      </button>
    </div>
  );
}
