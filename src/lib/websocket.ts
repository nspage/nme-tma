import { EventUpdate } from "@/types/event"

const WS_URL = import.meta.env.VITE_WS_URL || "wss://api.yourservice.com/ws"

export class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private listeners: ((update: EventUpdate) => void)[] = []

  connect() {
    try {
      this.ws = new WebSocket(WS_URL)

      this.ws.onopen = () => {
        console.log("WebSocket connected")
        this.reconnectAttempts = 0
      }

      this.ws.onmessage = (event) => {
        try {
          const update = JSON.parse(event.data) as EventUpdate
          this.notifyListeners(update)
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error)
        }
      }

      this.ws.onclose = () => {
        console.log("WebSocket disconnected")
        this.attemptReconnect()
      }

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error)
      }
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error)
      this.attemptReconnect()
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached")
      return
    }

    this.reconnectAttempts++
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
    setTimeout(() => this.connect(), delay)
  }

  subscribe(listener: (update: EventUpdate) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners(update: EventUpdate) {
    this.listeners.forEach((listener) => {
      try {
        listener(update)
      } catch (error) {
        console.error("Error in WebSocket listener:", error)
      }
    })
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else {
      console.error("WebSocket is not connected")
    }
  }
}
