import { z } from 'zod'

// Mirrors backend/app/schemas/auth.py: password >= 8 chars and <= 72 bytes (bcrypt limit)
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .refine((v) => new TextEncoder().encode(v).length <= 72, 'Password must be at most 72 bytes')

const email = z.string().trim().min(1, 'Email is required').pipe(z.email('Enter a valid email'))

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
})
export type LoginValues = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    email,
    password,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })
export type RegisterValues = z.infer<typeof registerSchema>
