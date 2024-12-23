import { ApiResponse } from '../types/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL is not defined in environment variables')
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')
  
  const data = isJson ? await response.json() : await response.text()
  
  if (!response.ok) {
    if (isJson && 'error' in data) {
      throw new ApiError(data.error.code, data.error.message, data.error.details)
    }
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return data as T
}

async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    return await handleResponse<ApiResponse<T>>(response)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    
    // Handle network errors
    if (error instanceof Error) {
      throw new ApiError(
        'NETWORK_ERROR',
        'Failed to connect to the server',
        error.message
      )
    }
    
    throw new ApiError(
      'UNKNOWN_ERROR',
      'An unexpected error occurred',
      error
    )
  }
}

export const apiClient = {
  get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return makeRequest<T>(endpoint, { ...options, method: 'GET' })
  },

  post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return makeRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return makeRequest<T>(endpoint, { ...options, method: 'DELETE' })
  },
}
