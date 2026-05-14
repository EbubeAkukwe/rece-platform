import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/features/auth/components/login-form'

export const metadata: Metadata = { title: 'Sign In' }

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string; reset?: string }
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      {searchParams.reset === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-lg">
          Password reset successful. Please sign in with your new password.
        </div>
      )}

      <LoginForm redirectTo={searchParams.redirectTo} />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-foreground font-medium underline underline-offset-4">
          Create one
        </Link>
      </p>
    </div>
  )
}
