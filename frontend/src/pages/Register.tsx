import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'

import { useRegister } from '@/api/auth'
import { AuthCard } from '@/components/AuthCard'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { registerSchema, type RegisterValues } from '@/lib/schemas'

export default function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const register = useRegister()

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = ({ email, password }: RegisterValues) =>
    register.mutate(
      { email, password },
      { onSuccess: () => navigate(from, { replace: true }) },
    )

  return (
    <AuthCard
      title="Create account"
      description="Sign up to buy and download digital products."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" state={location.state} className="font-medium text-foreground underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          {register.isError && (
            <Alert variant="destructive">
              <AlertDescription>{register.error.message}</AlertDescription>
            </Alert>
          )}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="register-email"
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
                <FieldLabel htmlFor="register-password">Password</FieldLabel>
                <Input
                  {...field}
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>At least 8 characters.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-confirm">Confirm password</FieldLabel>
                <Input
                  {...field}
                  id="register-confirm"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button type="submit" disabled={register.isPending}>
            {register.isPending ? 'Creating account…' : 'Sign up'}
          </Button>
        </FieldGroup>
      </form>
    </AuthCard>
  )
}
