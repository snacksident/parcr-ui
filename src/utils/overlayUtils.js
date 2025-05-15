export const overlayImages = {
  wedge: ['/assets/wedge1.webp', '/assets/wedge2.webp'],
  driver: ['/assets/driver1.webp', '/assets/driver2.webp'],
  putter: {
    blade: ['/assets/putter/1.webp', '/assets/putter/2.webp', '/assets/putter/3.webp'],
    mallet: ['/assets/putter.mallet/1.webp', '/assets/putter.mallet/2.webp', '/assets/putter.mallet/3.webp']
  }
};

export function getOverlayImage(type, step, putterType = null) {
  if (type?.toLowerCase() === 'putters' && putterType) {
    return overlayImages.putter[putterType]?.[step - 1] || null;
  }
  return overlayImages[type?.toLowerCase()]?.[step - 1] || null;
}