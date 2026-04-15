import { useState, useEffect, useRef } from "react"
import axios from "axios"

interface SearchResult {
    _id:   string
    email: string
}

export function useCustomerSearch() {
    const [query,       setQuery]       = useState("")
    const [results,     setResults]     = useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            setIsSearching(false)
            return
        }

        setIsSearching(true)

        if (timerRef.current) clearTimeout(timerRef.current)

        timerRef.current = setTimeout(async () => {
            try {
                const { data } = await axios.get("/api/customer/search", {
                    params: {
                        search: query,
                        limit:  10,
                    },
                })
                setResults(data.data ?? [])
            } catch {
                setResults([])
            } finally {
                setIsSearching(false)
            }
        }, 300)

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [query])

    function clearSearch() {
        setQuery("")
        setResults([])
        setIsSearching(false)
    }

    return { query, setQuery, results, isSearching, clearSearch }
}