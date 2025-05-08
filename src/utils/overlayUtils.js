export const overlayImages = {
  wedge: ['/assets/wedge1.webp', '/assets/wedge2.webp'],
  driver: ['/assets/driver1.webp', '/assets/driver2.webp'],
  putter: ['/assets/putter1.webp', '/assets/putter2.webp']
}

export function getOverlayImage(type, step) {
  return overlayImages[type]?.[step - 1] || null;
}