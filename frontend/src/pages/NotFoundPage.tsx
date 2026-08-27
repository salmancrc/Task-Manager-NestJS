import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-9xl font-bold tracking-tight text-indigo-500/20">404</h1>
      <h2 className="mt-8 text-2xl font-bold text-white">Page not found</h2>
      <p className="mt-4 text-gray-400">Sorry, we couldn't find the page you're looking for.</p>
      
      <div className="mt-10">
        <Link to="/">
          <Button variant="primary">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
