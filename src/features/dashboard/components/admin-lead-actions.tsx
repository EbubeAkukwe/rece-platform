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
import {
  updateLeadStatusAction,
  assignLeadToAgentAction,
} from '../actions/admin.actions'
import { Loader2 } from 'lucide-react'

interface Agent {
  id:        string
  full_name: string
  email:     string
}

interface Props {
  leadId:         string
  currentStatus:  string
  currentAgentId: string | null
  agents:         Agent[]
}

export function AdminLeadActions({
  leadId,
  currentStatus,
  currentAgentId,
  agents,
}: Props) {
  const [status, setStatus]           = useState(currentStatus)
  const [agentId, setAgentId]         = useState(currentAgentId ?? '')
  const [isPending, startTransition]  = useTransition()
  const [feedback, setFeedback]       = useState<string | null>(null)

  function handleStatusChange(newStatus: string) {
    setStatus(newStatus)
    setFeedback(null)
    startTransition(async () => {
      const result = await updateLeadStatusAction(leadId, newStatus)
      setFeedback(result?.error ?? 'Status updated successfully')
    })
  }

  function handleAgentAssign() {
    if (!agentId) return
    setFeedback(null)
    startTransition(async () => {
      const result = await assignLeadToAgentAction(leadId, agentId)
      setFeedback(result?.error ?? 'Agent assigned successfully')
    })
  }

  return (
    <div className="bg-background border rounded-xl p-6 space-y-5">
      <h2 className="font-semibold">Manage Lead</h2>

      {feedback && (
        <div className={`text-sm px-4 py-2.5 rounded-lg border ${
          feedback.includes('successfully')
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-destructive/10 border-destructive/20 text-destructive'
        }`}>
          {feedback}
        </div>
      )}

      {/* Status */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Lead status</p>
        <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
          <SelectTrigger className="w-52">
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

      {/* Agent assignment */}
      <div className="space-y-2 pt-4 border-t">
        <p className="text-sm font-medium">Assign to agent</p>
        <div className="flex gap-3">
          <Select value={agentId} onValueChange={setAgentId} disabled={isPending}>
            <SelectTrigger className="flex-1 max-w-xs">
              <SelectValue placeholder="Select an agent…" />
            </SelectTrigger>
            <SelectContent>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            onClick={handleAgentAssign}
            disabled={isPending || !agentId}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Assign'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
