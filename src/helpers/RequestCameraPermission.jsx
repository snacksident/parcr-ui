export async function requestCameraPermissions() {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('Camera permissions granted');
    } catch (error) {
      console.error('Camera permissions denied:', error);
    }
  }