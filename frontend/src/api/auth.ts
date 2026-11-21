import { useMutation } from '@tanstack/react-query'

import { get, post } from './client'
import type { TokenOut, UserOut } from './types'

import { useAuthStore } from '@/stores/auth'

export const login = (email: string, password: string) =>
  post<TokenOut>('/auth/login', { email, password })

export const register = (email: string, password: string) =>
  post<UserOut>('/auth/register', { email, password })

export const exchangeCode = (code: string) => post<TokenOut>('/auth/exchange', { code })

export const fetchMe = () => get<UserOut>('/auth/me')

interface Credentials {
  email: string
  password: string
}

/** Log in and store the session. */
export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)
  return useMutation({
    mutationFn: async (v: Credentials) => {
      const token = await login(v.email, v.password)
      return { token: token.access_token, email: v.email.trim().toLowerCase() }
    },
    onSuccess: ({ token, email }) => setAuth(token, email),
  })
}

/** Register does NOT return a token, so log in right after with the same credentials. */
export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth)
  return useMutation({
    mutationFn: async (v: Credentials) => {
      await register(v.email, v.password)
      const token = await login(v.email, v.password)
      return { token: token.access_token, email: v.email.trim().toLowerCase() }
    },
    onSuccess: ({ token, email }) => setAuth(token, email),
  })
}
