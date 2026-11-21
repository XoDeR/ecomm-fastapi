import { QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router'

import { Layout } from '@/components/Layout'
import { RequireAuth } from '@/components/RequireAuth'
import { queryClient } from '@/lib/query'
import Account from '@/pages/Account'
import AuthCallback from '@/pages/AuthCallback'
import Cart from '@/pages/Cart'
import Catalog from '@/pages/Catalog'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import OrderCancel from '@/pages/OrderCancel'
import OrderSuccess from '@/pages/OrderSuccess'
import Product from '@/pages/Product'
import Register from '@/pages/Register'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Catalog /> },
      { path: '/product/:slug', element: <Product /> },
      { path: '/cart', element: <Cart /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      {
        path: '/account',
        element: (
          <RequireAuth>
            <Account />
          </RequireAuth>
        ),
      },
      { path: '/auth/callback', element: <AuthCallback /> },
      { path: '/order/success', element: <OrderSuccess /> },
      { path: '/order/cancel', element: <OrderCancel /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
