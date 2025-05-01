import React from 'react';
import { useLocation } from 'react-router-dom';

export default function SubmissionDetails() {
  const location = useLocation();
  const payload = location.state?.payload;

  console.log('Received payload in SubmissionDetails:', payload);

  if (!payload) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>No Submission Data</h1>
        <p>It seems there is no data to display. Please try submitting again.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Submission Details</h1>
      <pre
        style={{
          background: '#f4f4f4',
          padding: '1rem',
          borderRadius: '5px',
          overflowX: 'auto',
        }}
      >
        {JSON.stringify(payload, null, 2)}
      </pre>
    </div>
  );
}