import { ChevronDownIcon, LogOutIcon, SearchIcon, ShoppingCartIcon, UserIcon } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router'

import { useCategories } from '@/api/catalog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth'
import { useCartCount } from '@/stores/cart'

const navLinkClass =
  'text-sm font-medium uppercase tracking-wide border-b-2 border-transparent hover:border-foreground transition-colors'

function SearchForm() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  // Re-key on the URL value so the field resets when the search param changes externally
  const urlSearch = params.get('search') ?? ''

  return (
    <form
      key={urlSearch}
      role="search"
      className="relative w-full max-w-56"
      onSubmit={(e) => {
        e.preventDefault()
        const value = new FormData(e.currentTarget).get('q')
        const q = typeof value === 'string' ? value.trim() : ''
        navigate(q ? `/?search=${encodeURIComponent(q)}` : '/')
      }}
    >
      <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        name="q"
        type="search"
        defaultValue={urlSearch}
        placeholder="Search products..."
        aria-label="Search products"
        className="pl-8"
      />
    </form>
  )
}

export function Header() {
  const { data: categories } = useCategories()
  const count = useCartCount()
  const email = useAuthStore((s) => s.email)
  const authed = useAuthStore((s) => s.token !== null)
  const logout = useAuthStore((s) => s.logout)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    // Drop cached private data so the next user never sees it
    queryClient.removeQueries({ queryKey: ['orders'] })
    queryClient.removeQueries({ queryKey: ['order'] })
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-8">
        <nav className="flex flex-1 items-center gap-6">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button type="button" className={`${navLinkClass} inline-flex items-center gap-1`}>
                Catalog
                <ChevronDownIcon className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-48">
              <DropdownMenuItem onSelect={() => navigate('/')}>All products</DropdownMenuItem>
              {categories && categories.length > 0 && <DropdownMenuSeparator />}
              {categories?.map((c) => (
                <DropdownMenuItem
                  key={c.id}
                  onSelect={() => navigate(`/?category=${encodeURIComponent(c.slug)}`)}
                >
                  {c.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <Link to="/" className="text-2xl font-bold tracking-tight uppercase sm:text-3xl">
          Ecomm
        </Link>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
          <div className="hidden w-full justify-end md:flex">
            <SearchForm />
          </div>
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link to="/cart" aria-label={`Cart (${count} items)`}>
              <ShoppingCartIcon />
              {count > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full px-1 text-[10px]">
                  {count}
                </Badge>
              )}
            </Link>
          </Button>

          {authed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account">
                  <UserIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-48">
                {email && <DropdownMenuLabel className="truncate">{email}</DropdownMenuLabel>}
                <DropdownMenuItem onSelect={() => navigate('/account')}>
                  My orders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout}>
                  <LogOutIcon />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link to="/login">Log in</Link>
            </Button>
          )}
        </div>
      </div>
      <div className="px-4 pb-3 md:hidden">
        <SearchForm />
      </div>
    </header>
  )
}
