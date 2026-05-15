'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { Upload, X, Star, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { nanoid } from 'nanoid'

interface UploadedImage {
  id:       string
  url:      string
  file?:    File
  isCover:  boolean
  position: number
  uploading?: boolean
}

interface Props {
  onImagesChange: (images: Omit<UploadedImage, 'file' | 'uploading'>[]) => void
  maxImages?: number
}

export function ImageUploader({ onImagesChange, maxImages = 5 }: Props) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [error, setError]   = useState<string | null>(null)

  // Notify parent whenever images change — but outside of render
  useEffect(() => {
    const ready = images
      .filter((img) => !img.uploading && !img.file)
      .map(({ id, url, isCover, position }) => ({ id, url, isCover, position }))
    onImagesChange(ready)
  }, [images]) // eslint-disable-line react-hooks/exhaustive-deps

  async function uploadToSupabase(file: File): Promise<string | null> {
    const supabase = createClient()
    const ext  = file.name.split('.').pop()
    const path = `listings/${nanoid()}.${ext}`

    const { error } = await supabase.storage
      .from('property-images')
      .upload(path, file, { cacheControl: '3600', upsert: false })

    if (error) return null

    const { data } = supabase.storage
      .from('property-images')
      .getPublicUrl(path)

    return data.publicUrl
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null)

      setImages((prev) => {
        const remaining = maxImages - prev.length
        if (remaining <= 0) {
          setError(`Maximum ${maxImages} images allowed.`)
          return prev
        }
        return prev
      })

      setImages((prev) => {
        const remaining = maxImages - prev.length
        if (remaining <= 0) return prev

        const filesToProcess = acceptedFiles.slice(0, remaining)

        const newImages: UploadedImage[] = filesToProcess.map((file, i) => ({
          id:        nanoid(),
          url:       URL.createObjectURL(file),
          file,
          isCover:   prev.length === 0 && i === 0,
          position:  prev.length + i,
          uploading: true,
        }))

        // Kick off uploads after state is set
        newImages.forEach(async (img) => {
          const url = await uploadToSupabase(img.file!)
          setImages((current) =>
            current.map((c) => {
              if (c.id !== img.id) return c
              URL.revokeObjectURL(c.url)
              return url
                ? { ...c, url, file: undefined, uploading: false }
                : current.filter((x) => x.id !== img.id)[0] // remove on failure
            })
          )
          if (!url) {
            setImages((current) => current.filter((c) => c.id !== img.id))
            setError('One or more images failed to upload. Please try again.')
          }
        })

        return [...prev, ...newImages]
      })
    },
    [maxImages]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 10 * 1024 * 1024,
    disabled: images.length >= maxImages,
    onDropRejected: (rejected) => {
      const code = rejected[0]?.errors[0]?.code
      if (code === 'file-too-large')    setError('Image must be under 10MB.')
      else if (code === 'file-invalid-type') setError('Only JPG, PNG, and WEBP allowed.')
      else setError('Could not upload image.')
    },
  })

  function setCover(id: string) {
    setImages((prev) =>
      prev.map((img) => ({ ...img, isCover: img.id === id }))
    )
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const removing  = prev.find((img) => img.id === id)
      const filtered  = prev.filter((img) => img.id !== id).map((img, i) => ({
        ...img,
        position: i,
      }))
      // If removed image was cover, assign cover to first remaining
      if (removing?.isCover && filtered.length > 0) {
        filtered[0].isCover = true
      }
      return filtered
    })
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
            isDragActive
              ? 'border-foreground bg-foreground/5'
              : 'border-border hover:border-foreground/40 hover:bg-muted/30'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Upload className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse · JPG, PNG, WEBP · max 10MB each ·{' '}
                {images.length}/{maxImages} uploaded
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-destructive text-xs">{error}</p>}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className={cn(
                'relative aspect-square rounded-xl overflow-hidden border-2 transition-all',
                img.isCover
                  ? 'border-foreground ring-2 ring-foreground ring-offset-2'
                  : 'border-border'
              )}
            >
              <Image
                src={img.url}
                alt="Property image"
                fill
                className="object-cover"
                sizes="20vw"
              />

              {/* Uploading overlay */}
              {img.uploading && (
                <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}

              {!img.uploading && (
                <>
                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors shadow-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  {/* Set cover */}
                  <button
                    type="button"
                    onClick={() => setCover(img.id)}
                    className={cn(
                      'absolute bottom-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-colors shadow-sm',
                      img.isCover
                        ? 'bg-foreground text-background'
                        : 'bg-background/90 text-muted-foreground hover:bg-background'
                    )}
                    title={img.isCover ? 'Cover image' : 'Set as cover'}
                  >
                    <Star className="w-3 h-3" />
                  </button>
                </>
              )}

              {/* Cover label */}
              {img.isCover && !img.uploading && (
                <div className="absolute top-1.5 left-1.5 bg-foreground text-background text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  Cover
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          ★ Click the star on any image to set it as the cover photo.
        </p>
      )}
    </div>
  )
}
