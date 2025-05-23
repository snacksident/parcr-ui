import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://parcr-backend.onrender.com/api',
  timeout: 60000
})

// Add request interceptor for auth if needed later
apiClient.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
)

// Add response interceptor for consistent error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    const customError = new Error(
      error.response?.data?.message || 
      error.message || 
      'An unexpected error occurred'
    )
    customError.status = error.response?.status
    customError.data = error.response?.data
    return Promise.reject(customError)
  }
)

export default apiClient
