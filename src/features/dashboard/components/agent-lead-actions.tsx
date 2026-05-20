'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { agentUpdateLeadAction, agentLogActivityAction } from '../actions/agent.actions'
import { Loader2, Phone, Mail, MessageSquare } from 'lucide-react'

interface Props {
  leadId:        string
  currentStatus: string
}

export function AgentLeadActions({ leadId, currentStatus }: Props) {
  const [status, setStatus]              = useState(currentStatus)
  const [note, setNote]                  = useState('')
  const [activityType, setActivityType]  = useState('note')
  const [isPending, startTransition]     = useTransition()
  const [feedback, setFeedback]          = useState<string | null>(null)

  function handleStatusChange(newStatus: string) {
    setStatus(newStatus)
    setFeedback(null)
    startTransition(async () => {
      const result = await agentUpdateLeadAction(leadId, newStatus)
      setFeedback(result?.error ?? 'Status updated')
    })
  }

  function handleLogActivity() {
    if (!note.trim()) return
    setFeedback(null)
    startTransition(async () => {
      const result = await agentLogActivityAction(leadId, activityType, note)
      if (!result?.error) {
        setNote('')
        setFeedback('Activity logged')
      } else {
        setFeedback(result.error)
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Status update */}
      <div className="bg-background border rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-sm">Update Status</h2>

        {feedback && (
          <div className={`text-xs px-3 py-2 rounded-lg border ${
            feedback.includes('error') || feedback.includes('Error')
              ? 'bg-destructive/10 border-destructive/20 text-destructive'
              : 'bg-green-50 border-green-200 text-green-800'
          }`}>
            {feedback}
          </div>
        )}

        <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Log activity */}
      <div className="bg-background border rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-sm">Log Activity</h2>

        {/* Quick type buttons */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { type: 'call',    icon: Phone,         label: 'Call' },
            { type: 'email',   icon: Mail,          label: 'Email' },
            { type: 'note',    icon: MessageSquare, label: 'Note' },
          ].map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => setActivityType(type)}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                activityType === type
                  ? 'border-foreground bg-foreground/5 ring-1 ring-foreground'
                  : 'border-border hover:border-foreground/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Notes</Label>
          <Textarea
            placeholder={`Log a ${activityType}…`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            disabled={isPending}
          />
        </div>

        <Button
          className="w-full"
          size="sm"
          onClick={handleLogActivity}
          disabled={isPending || !note.trim()}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Log activity'
          )}
        </Button>
      </div>
    </div>
  )
}
