'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { registerSchema, type RegisterInput } from '../schemas'
import { registerAction } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const ROLES = [
  {
    value: 'buyer',
    label: 'Buyer',
    description: 'Looking to purchase or rent a property',
  },
  {
    value: 'seller',
    label: 'Seller',
    description: 'Looking to list and sell a property',
  },
  {
    value: 'agent',
    label: 'Agent',
    description: 'Real estate professional managing listings',
  },
] as const

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'buyer' },
  })

  const selectedRole = watch('role')

  function onSubmit(data: RegisterInput) {
    setServerError(null)
    startTransition(async () => {
      const result = await registerAction(data)
      if (result?.error) setServerError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-lg">
          {serverError}
        </div>
      )}

      {/* Role selector */}
      <div className="space-y-2">
        <Label>I am a…</Label>
        <div className="grid grid-cols-3 gap-2">
          {ROLES.map((role) => (
            <button
              key={role.value}
              type="button"
              onClick={() => setValue('role', role.value)}
              className={cn(
                'flex flex-col items-start p-3 rounded-lg border text-left transition-all',
                selectedRole === role.value
                  ? 'border-foreground bg-foreground/5 ring-1 ring-foreground'
                  : 'border-border hover:border-foreground/40'
              )}
            >
              <span className="font-medium text-sm">{role.label}</span>
              <span className="text-xs text-muted-foreground leading-tight mt-0.5">
                {role.description}
              </span>
            </button>
          ))}
        </div>
        {errors.role && (
          <p className="text-destructive text-xs">{errors.role.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          placeholder="John Doe"
          autoComplete="name"
          disabled={isPending}
          {...register('full_name')}
        />
        {errors.full_name && (
          <p className="text-destructive text-xs">{errors.full_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isPending}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-destructive text-xs">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isPending}
            className="pr-10"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-destructive text-xs">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm_password">Confirm password</Label>
        <div className="relative">
          <Input
            id="confirm_password"
            type={showConfirm ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isPending}
            className="pr-10"
            {...register('confirm_password')}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirm_password && (
          <p className="text-destructive text-xs">{errors.confirm_password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating account…
          </>
        ) : (
          'Create account'
        )}
      </Button>
    </form>
  )
}
