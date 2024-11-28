import { useState } from 'react'
import { ApiError } from '../api'

interface MutationState<T> {
  data: T | null
  isLoading: boolean
  error: ApiError | Error | null
}

interface MutationOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: ApiError | Error) => void
}

export function useMutation<TInput, TOutput>(
  mutationFn: (input: TInput) => Promise<{ data?: TOutput }>,
  options: MutationOptions<TOutput> = {}
) {
  const [state, setState] = useState<MutationState<TOutput>>({
    data: null,
    isLoading: false,
    error: null,
  })

  const mutate = async (input: TInput) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      const response = await mutationFn(input)
      const data = response.data || null
      setState({
        data,
        isLoading: false,
        error: null,
      })
      options.onSuccess?.(data as TOutput)
      return data
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Unknown error')
      setState({
        data: null,
        isLoading: false,
        error: errorObj,
      })
      options.onError?.(errorObj)
      throw errorObj
    }
  }

  return {
    ...state,
    mutate,
  }
}
