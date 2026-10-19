import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import './index.css'
import App from './App.tsx'

// Create a React Query client — handles caching, refetching, and loading states globally
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30, // Data is "fresh" for 30 seconds before re-fetching
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <ToastProvider>
    <StrictMode>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </AuthProvider>
    </StrictMode>
  </ToastProvider>,
)
