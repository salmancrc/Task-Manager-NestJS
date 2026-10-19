import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-9xl font-bold tracking-tight text-red-500/20">5xx</h1>
      <h2 className="mt-8 text-2xl font-bold text-white">Server error</h2>
      <p className="mt-4 text-gray-400">Something went wrong on our end. Please try again later.</p>

      <div className="mt-10">
        <Link to="/">
          <Button variant="primary">Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}
