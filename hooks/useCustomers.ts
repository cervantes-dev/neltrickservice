import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { CustomerType } from "@/libs/types/customer.type"

interface UseCustomersParams {
    page?:   number
    limit?:  number
    search?: string
}

interface UseCustomersReturn {
    customers:  CustomerType[]
    total:      number
    totalPages: number
    loading:    boolean
    error:      string | null
    refetch:    () => void
}

export function useCustomers({
    page   = 1,
    limit  = 10,
    search = "",
}: UseCustomersParams = {}): UseCustomersReturn {

    const [customers,  setCustomers]  = useState<CustomerType[]>([])
    const [total,      setTotal]      = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [loading,    setLoading]    = useState(false)
    const [error,      setError]      = useState<string | null>(null)

    const fetchCustomers = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const { data } = await axios.get("/api/customer", {
                params: { page, limit, search },
            })
            setCustomers(data.data)
            setTotal(data.total)
            setTotalPages(data.totalPages)
        } catch {
            setError("Failed to fetch customers")
        } finally {
            setLoading(false)
        }
    }, [page, limit, search])

    useEffect(() => {
        fetchCustomers()
    }, [fetchCustomers])

    return { customers, total, totalPages, loading, error, refetch: fetchCustomers }
}