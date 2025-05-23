export const base64ToFile = (base64String, index) => {
  try {
    const base64WithPrefix = base64String.startsWith('data:image/') 
      ? base64String 
      : `data:image/jpeg;base64,${base64String}`

    const base64Data = base64WithPrefix.split(',')[1]
    const byteString = atob(base64Data)
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    
    const blob = new Blob([ab], { type: 'image/jpeg' })
    return new File([blob], `image${index}.jpg`, { type: 'image/jpeg' })
  } catch (error) {
    console.error('Error converting base64 to file:', error)
    throw new Error('Failed to process image')
  }
}

export const createFormDataWithImages = (productId, images) => {
  const formData = new FormData()
  formData.append('productId', productId)
  images.forEach((image, index) => {
    formData.append('images', base64ToFile(image, index))
  })
  return formData
}
