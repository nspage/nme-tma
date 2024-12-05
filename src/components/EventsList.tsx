import React, { useEffect, useState } from 'react'
import { fetchEvents } from '../lib/api/fetchEvents'

const EventsList = () => {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const getEvents = async () => {
      const eventsData = await fetchEvents()
      setEvents(eventsData)
    }
    getEvents()
  }, [])

  return (
    <div>
      <h1>Events</h1>
      <ul>
        {events.map((event: any) => (
          <li key={event.id}>
            <h2>{event.name}</h2>
            <p>{event.description}</p>
            <p>{new Date(event.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EventsList
