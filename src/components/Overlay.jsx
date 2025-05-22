import React from 'react'
import { useClubData } from '../context/GlobalStateContext'

export default function Overlay() {
  const { clubData } = useClubData();
  
  // Don't render if club type is not provided
  if (!clubData.productType) return null;

  // Normalize club type for path construction
  let overlayType = clubData.productType;
  if (overlayType === 'Individual Irons') {
    overlayType = 'individualIron';
  } else if (overlayType === 'Wedges') {
    overlayType = 'wedge'
  } else if (overlayType === 'Putters') {
    overlayType = clubData.specs?.putterType === 'Blade' ? 'putter' : 'putterMallet'
  } else if (overlayType === 'Hybrids') {
    overlayType = 'Hybrids'
  } else if (overlayType === 'Drivers') {
    overlayType = 'driver'
  } else if (overlayType === 'Fairway Woods') {
    overlayType = 'fairway'
  }

  // Construct the overlay image path dynamically
  const overlaySrc = `/assets/${overlayType}/${clubData.currentStep}.jpg`;
  console.log('Current handedness:', clubData.specs?.handedness);

  return (
    <img
      src={overlaySrc}
      alt={`Overlay for ${overlayType} - Step ${clubData.currentStep}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        zIndex: 2,
        pointerEvents: 'none',
        transform: clubData.specs?.handedness === 'Left-Handed' ? 'scaleX(-1)' : 'none',
        opacity: 0.3,
      }}
    />
  );
}