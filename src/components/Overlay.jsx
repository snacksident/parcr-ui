import React from 'react'
import { useClubData } from '../context/GlobalStateContext'

export default function Overlay({ clubType, step }) {
  const { clubData } = useClubData();
  
  if (!clubType) return null;

  // Map club types to correct folder names
  const getFolderName = () => {
    const type = clubType.toLowerCase();
    
    if (type === 'putters') {
      // Use putterType from context
      const putterType = clubData.specs?.putterType;
      const folderName = putterType === 'mallet' ? 'putterMallet' : 'putter';
      console.log('Putter type from context:', putterType, 'Using folder:', folderName);
      return folderName;
    }
    
    // Map other club types to their folder names
    const folderMap = {
      'drivers': 'driver',
      'fairway woods': 'fairway',
      'hybrids': 'hybrid',
      'irons': 'iron',
      'iron sets': 'ironSet',
      'wedges': 'wedge'
    };
    return folderMap[type] || type;
  };

  const folderName = getFolderName();
  const overlaySrc = `/assets/${folderName}/${step}.jpg`;

  console.log('Overlay path:', {
    clubType,
    putterType: clubData.specs?.putterType,
    handedness: clubData.specs?.handedness,
    folderName,
    path: overlaySrc
  });

  return (
    <img
      src={overlaySrc}
      alt={`Overlay for ${clubType} - Step ${step}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        zIndex: 2,
        pointerEvents: 'none',
        opacity: 0.3,
        transform: clubData.specs?.handedness?.toLowerCase() === 'left' ? 'scaleX(-1)' : 'none'
      }}
    />
  )
}