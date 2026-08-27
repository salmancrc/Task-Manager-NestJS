import axios from 'axios'

// Single shared Axios instance — all requests go through here
const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Global response interceptor — handle errors in one place
// Later you can add 401 (unauthorized) redirect logic here for JWT auth
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong'
    return Promise.reject(new Error(Array.isArray(message) ? message.join(', ') : message))
  },
)

export default apiClient
