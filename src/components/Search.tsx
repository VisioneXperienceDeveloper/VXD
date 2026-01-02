"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search as SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function Search() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("search") || "")
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get("search") || ""
      if (currentSearch === query) return

      const params = new URLSearchParams(searchParams.toString())
      if (query) {
        params.set("search", query)
      } else {
        params.delete("search")
      }
      router.push(`/?${params.toString()}`)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, router, searchParams])

  const toggleSearch = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  return (
    <div className="flex items-center">
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "w-[160px] sm:w-[200px] opacity-100 mr-2" : "w-0 opacity-0 mr-0"
        )}
      >
        <input
          ref={inputRef}
          type="text"
          className="block w-full py-2 px-3 text-sm text-neutral-900 bg-transparent border-none outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] rounded-4xl dark:text-neutral-100 placeholder:text-neutral-500"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => {
            if (!query) setIsOpen(false)
          }}
        />
      </div>
      <button
        onClick={toggleSearch}
        className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        aria-label="Toggle search"
      >
        <SearchIcon className="h-5 w-5" />
      </button>
    </div>
  )
}
