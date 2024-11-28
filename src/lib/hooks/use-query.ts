import { useState, useEffect } from 'react'
import { ApiError } from '../api'

interface QueryState<T> {
  data: T | null
  isLoading: boolean
  error: ApiError | Error | null
}

interface QueryOptions {
  enabled?: boolean
}

export function useQuery<T>(
  queryFn: () => Promise<{ data?: T }>,
  options: QueryOptions = {}
): QueryState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    isLoading: true,
    error: null,
  })

  const { enabled = true } = options

  const fetchData = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      const response = await queryFn()
      setState({
        data: response.data || null,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      })
    }
  }

  useEffect(() => {
    if (enabled) {
      fetchData()
    }
  }, [enabled])

  return {
    ...state,
    refetch: fetchData,
  }
}
