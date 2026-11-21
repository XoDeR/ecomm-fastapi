import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { API_URL } from '@/api/client'

interface Props {
  title: string
  description: string
  children: React.ReactNode
  footer: React.ReactNode
}

/** Shared shell for the login and register pages (card + Google sign-in). */
export function AuthCard({ title, description, children, footer }: Props) {
  return (
    <div className="flex justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl uppercase">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {children}
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground uppercase">or</span>
            <Separator className="flex-1" />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => window.location.assign(`${API_URL}/auth/google`)}
          >
            Continue with Google
          </Button>
          <p className="text-center text-sm text-muted-foreground">{footer}</p>
        </CardContent>
      </Card>
    </div>
  )
}
