import apiClient from './apiClient'
import { createFormDataWithImages } from './imageUtils'

export const createProduct = async (productData) => {
  const response = await apiClient.post('/create-listing', productData)
  return response.data.data
}

export const addMetafields = async (productId, metafields) => {
  return await apiClient.post('/add-product-metafields', {
    productId,
    metafields
  })
}

export const uploadImages = async (productId, images) => {
  const formData = createFormDataWithImages(productId, images)
  return await apiClient.post('/add-product-images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const getRecommendedPrice = async (sku, condition) => {
  try {
    const response = await apiClient.get(`/recommended-price/${sku}/${condition}`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching recommended price:', error)
    throw error
  }
}
