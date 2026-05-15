'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'

export function ListingsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'any') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      router.push(`/listings?${params.toString()}`)
    },
    [router, searchParams]
  )

  function clearAll() {
    router.push('/listings')
  }

  const hasFilters = searchParams.toString().length > 0

  return (
    <div className="bg-background border rounded-xl p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search city, country, or keyword…"
          defaultValue={searchParams.get('q') ?? ''}
          className="pl-9"
          onChange={(e) => updateParam('q', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Listing type */}
        <div className="space-y-1.5">
          <Label className="text-xs">Type</Label>
          <Select
            defaultValue={searchParams.get('type') ?? 'any'}
            onValueChange={(v) => updateParam('type', v)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bedrooms */}
        <div className="space-y-1.5">
          <Label className="text-xs">Bedrooms</Label>
          <Select
            defaultValue={searchParams.get('beds') ?? 'any'}
            onValueChange={(v) => updateParam('beds', v)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="0">Studio</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Min price */}
        <div className="space-y-1.5">
          <Label className="text-xs">Min Price</Label>
          <Input
            type="number"
            placeholder="0"
            className="h-9"
            defaultValue={searchParams.get('min') ?? ''}
            onChange={(e) => updateParam('min', e.target.value)}
          />
        </div>

        {/* Max price */}
        <div className="space-y-1.5">
          <Label className="text-xs">Max Price</Label>
          <Input
            type="number"
            placeholder="Any"
            className="h-9"
            defaultValue={searchParams.get('max') ?? ''}
            onChange={(e) => updateParam('max', e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <Label className="text-xs">Status</Label>
          <Select
            defaultValue={searchParams.get('status') ?? 'available'}
            onValueChange={(v) => updateParam('status', v)}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="under_offer">Under Offer</SelectItem>
              <SelectItem value="any">Any</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasFilters && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <X className="w-3.5 h-3.5 mr-1.5" />
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
