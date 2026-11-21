import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'

import { useLogin } from '@/api/auth'
import { AuthCard } from '@/components/AuthCard'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { loginSchema, type LoginValues } from '@/lib/schemas'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const login = useLogin()

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (values: LoginValues) =>
    login.mutate(values, { onSuccess: () => navigate(from, { replace: true }) })

  return (
    <AuthCard
      title="Log in"
      description="Welcome back! Enter your details to continue."
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register" state={location.state} className="font-medium text-foreground underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          {login.isError && (
            <Alert variant="destructive">
              <AlertDescription>{login.error.message}</AlertDescription>
            </Alert>
          )}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="you@example.com"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-password">Password</FieldLabel>
                <Input
                  {...field}
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button type="submit" disabled={login.isPending}>
            {login.isPending ? 'Logging in…' : 'Log in'}
          </Button>
        </FieldGroup>
      </form>
    </AuthCard>
  )
}
