'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateUserRoleAction, toggleUserStatusAction } from '../actions/admin.actions'
import { Loader2, ShieldAlert, ShieldCheck } from 'lucide-react'
import type { UserRole } from '@/types'

interface Props {
  userId:     string
  currentRole: UserRole
  isActive:   boolean
  isVerified: boolean
  isSelf:     boolean
}

export function AdminUserActions({
  userId,
  currentRole,
  isActive,
  isSelf,
}: Props) {
  const [role, setRole]         = useState<UserRole>(currentRole)
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<string | null>(null)

  function handleRoleChange(newRole: string) {
    setRole(newRole as UserRole)
    setFeedback(null)
    startTransition(async () => {
      const result = await updateUserRoleAction(userId, newRole)
      setFeedback(result?.error ?? 'Role updated successfully')
    })
  }

  function handleToggleStatus() {
    setFeedback(null)
    startTransition(async () => {
      const result = await toggleUserStatusAction(userId, !isActive)
      setFeedback(result?.error ?? `User ${isActive ? 'suspended' : 'reactivated'} successfully`)
    })
  }

  if (isSelf) {
    return (
      <div className="bg-muted/30 border rounded-xl p-4">
        <p className="text-sm text-muted-foreground">
          You cannot modify your own account from here.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-background border rounded-xl p-6 space-y-5">
      <h2 className="font-semibold">Admin Actions</h2>

      {feedback && (
        <div className={`text-sm px-4 py-2.5 rounded-lg border ${
          feedback.includes('successfully')
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-destructive/10 border-destructive/20 text-destructive'
        }`}>
          {feedback}
        </div>
      )}

      {/* Role change */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Change role</p>
        <div className="flex gap-3">
          <Select value={role} onValueChange={handleRoleChange} disabled={isPending}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buyer">Buyer</SelectItem>
              <SelectItem value="seller">Seller</SelectItem>
              <SelectItem value="agent">Agent</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          {isPending && <Loader2 className="w-4 h-4 animate-spin mt-2.5" />}
        </div>
        <p className="text-xs text-muted-foreground">
          Changing role takes effect immediately.
        </p>
      </div>

      {/* Suspend / reactivate */}
      <div className="space-y-2 pt-4 border-t">
        <p className="text-sm font-medium">Account status</p>
        <Button
          variant={isActive ? 'destructive' : 'default'}
          size="sm"
          onClick={handleToggleStatus}
          disabled={isPending}
          className="gap-2"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isActive ? (
            <ShieldAlert className="w-4 h-4" />
          ) : (
            <ShieldCheck className="w-4 h-4" />
          )}
          {isActive ? 'Suspend account' : 'Reactivate account'}
        </Button>
        <p className="text-xs text-muted-foreground">
          {isActive
            ? 'Suspended users cannot log in or access any data.'
            : 'This will restore full access to the account.'}
        </p>
      </div>
    </div>
  )
}
