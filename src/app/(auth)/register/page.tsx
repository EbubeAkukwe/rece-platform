import type { Metadata } from 'next'
import Link from 'next/link'
import { RegisterForm } from '@/features/auth/components/register-form'

export const metadata: Metadata = { title: 'Create Account' }

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Create an account</h2>
        <p className="text-muted-foreground">
          Join thousands of buyers, sellers, and agents
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-foreground font-medium underline underline-offset-4">
          Sign in
        </Link>
      </p>

      <p className="text-center text-xs text-muted-foreground">
        By creating an account, you agree to our{' '}
        <Link href="/terms" className="underline underline-offset-4">Terms</Link>
        {' '}and{' '}
        <Link href="/privacy" className="underline underline-offset-4">Privacy Policy</Link>
      </p>
    </div>
  )
}
