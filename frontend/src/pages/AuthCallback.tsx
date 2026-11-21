import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'

import { exchangeCode, fetchMe } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth'

/** Landing page of the Google OAuth flow: swaps the one-time code for a JWT. */
export default function AuthCallback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [failed, setFailed] = useState(() => !params.get('code'))
  // The code is single-use; guard against the double effect run in StrictMode
  const started = useRef(false)

  useEffect(() => {
    const code = params.get('code')
    if (!code || started.current) return
    started.current = true

    void (async () => {
      try {
        const { access_token } = await exchangeCode(code)
        // /auth/exchange does not return the email: store the token first so
        // the API client sends it, then fetch the profile.
        setAuth(access_token, '')
        try {
          const me = await fetchMe()
          setAuth(access_token, me.email)
        } catch {
          // The login itself succeeded; the email is purely cosmetic
        }
        navigate('/', { replace: true })
      } catch {
        setFailed(true)
      }
    })()
  }, [params, setAuth, navigate])

  if (failed) {
    return (
      <div className="flex justify-center py-8">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Google sign-in failed</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/login">Try again</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <p className="py-16 text-center text-muted-foreground">Signing you in…</p>
}
