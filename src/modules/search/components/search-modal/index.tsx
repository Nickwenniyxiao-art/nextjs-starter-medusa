"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useTranslations } from "next-intl"
import { useRouter, useParams } from "next/navigation"
import { MagnifyingGlassMini, XMark } from "@medusajs/icons"

const POPULAR_SEARCHES = ["sofa", "table", "chair", "lamp"]
const POPULAR_SEARCHES_ZH = ["沙发", "桌子", "椅子", "灯具"]

type SearchResult = { id: string; title: string; handle: string; thumbnail: string | null }

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const t = useTranslations("search")
  const router = useRouter()
  const params = useParams()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const locale = (params?.locale as string) || "en"
  const countryCode = (params?.countryCode as string) || "no"
  const popular = locale.startsWith("zh") ? POPULAR_SEARCHES_ZH : POPULAR_SEARCHES

  useEffect(() => { if (typeof window !== "undefined") { const saved = localStorage.getItem("nordhjem-recent-searches"); if (saved) setRecentSearches(JSON.parse(saved)) } }, [])
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 50) }, [isOpen])
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(); if (isOpen) window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k) }, [isOpen, onClose])
  useEffect(() => { if (!query.trim() || query.length < 2) return setResults([]); const timer = setTimeout(async () => { setIsLoading(true); const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}&limit=6`); if (res.ok) setResults((await res.json()).products || []); setIsLoading(false) }, 300); return () => clearTimeout(timer) }, [query])
  const handleSearch = useCallback((q: string) => { if (!q.trim()) return; const updated=[q,...recentSearches.filter((s)=>s!==q)].slice(0,5); setRecentSearches(updated); if (typeof window !== "undefined") localStorage.setItem("nordhjem-recent-searches", JSON.stringify(updated)); router.push(`/${locale}/${countryCode}/store?q=${encodeURIComponent(q)}`); onClose() }, [router, locale, countryCode, onClose, recentSearches])

  if (!isOpen) return null
  return <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true"><div className="absolute inset-0 bg-black/40" onClick={onClose} /><div className="relative mx-auto mt-20 max-w-2xl bg-white rounded-xl"><div className="flex items-center gap-3 px-5 py-4 border-b"><MagnifyingGlassMini className="w-5 h-5" /><input ref={inputRef} value={query} onChange={(e)=>setQuery(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&handleSearch(query)} placeholder={t("placeholder")} className="flex-1" />{query && <button onClick={() => setQuery("")}><XMark className="w-5 h-5" /></button>}</div><div className="p-4">{isLoading?"Searching...":results.map((r)=><button key={r.id} onClick={()=>handleSearch(r.title)}>{r.title}</button>)}{!query && popular.map((term)=><button key={term} onClick={()=>handleSearch(term)}>{term}</button>)}{recentSearches.length>0 && recentSearches.map((term)=><span key={term}>{term}</span>)}</div></div></div>
}
