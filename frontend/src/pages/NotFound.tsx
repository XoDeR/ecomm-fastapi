import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="mb-4 text-3xl font-bold uppercase">Page not found</h1>
      <Button asChild>
        <Link to="/">Back to catalog</Link>
      </Button>
    </div>
  )
}
