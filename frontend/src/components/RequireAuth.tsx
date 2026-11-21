import { Navigate, useLocation } from 'react-router'

import { useIsAuthed } from '@/stores/auth'

/** Redirects anonymous users to /login and remembers where they came from. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const authed = useIsAuthed()
  const location = useLocation()

  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }
  return <>{children}</>
}
