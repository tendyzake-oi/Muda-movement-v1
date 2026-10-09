import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { events } from '../../data/content'
import Icon from '../ui/Icon'
import SectionHeading from '../ui/SectionHeading'
import './Events.css'

const AUTOPLAY_DELAY = 3200

export default function Events() {
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const [position, setPosition] = useState(events.items.length)
  const [step, setStep] = useState(0)
  const [pointerPaused, setPointerPaused] = useState(false)
  const [focusPaused, setFocusPaused] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return undefined

    const updateStep = () => {
      const card = track.querySelector('.events__item')
      if (!card) return
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0
      setStep(card.getBoundingClientRect().width + gap)
    }

    updateStep()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateStep)
      return () => window.removeEventListener('resize', updateStep)
    }

    const observer = new ResizeObserver(updateStep)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    if (pointerPaused || focusPaused || prefersReducedMotion) return undefined

    const interval = window.setInterval(() => {
      setPosition((currentPosition) => currentPosition + 1)
    }, AUTOPLAY_DELAY)
    return () => window.clearInterval(interval)
  }, [focusPaused, pointerPaused, prefersReducedMotion])

  useEffect(() => {
    if (!isResetting) return undefined
    const frame = window.requestAnimationFrame(() => setIsResetting(false))
    return () => window.cancelAnimationFrame(frame)
  }, [isResetting])

  const move = (direction) => {
    if (prefersReducedMotion) {
      setPosition((currentPosition) =>
        events.items.length +
        ((currentPosition - events.items.length + direction + events.items.length) % events.items.length),
      )
      return
    }
    setPosition((currentPosition) => currentPosition + direction)
  }

  const handleTrackTransitionEnd = (event) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform' || isResetting) return

    if (position >= events.items.length * 2) {
      setIsResetting(true)
      setPosition(events.items.length)
    } else if (position < events.items.length) {
      setIsResetting(true)
      setPosition(events.items.length * 2 - 1)
    }
  }

  const repeatedEvents = [
    ...events.items.map((item) => ({ item, copy: 'before', isDuplicate: true })),
    ...events.items.map((item) => ({ item, copy: 'main', isDuplicate: false })),
    ...events.items.map((item) => ({ item, copy: 'after', isDuplicate: true })),
  ]

  return (
    <section id="events" className="section events" aria-labelledby="events-title">
      <div className="container">
        <SectionHeading
          id="events-title"
          eyebrow={events.eyebrow}
          title={events.title}
          description={events.description}
        />

        <div
          className="events__carousel"
          role="group"
          aria-label="Galeri event"
          onPointerEnter={() => setPointerPaused(true)}
          onPointerLeave={() => setPointerPaused(false)}
          onFocusCapture={() => setFocusPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocusPaused(false)
          }}
        >
          <div className="events__viewport" ref={viewportRef}>
            <ul
              className={`events__track${isResetting ? ' events__track--resetting' : ''}`}
              ref={trackRef}
              style={{ transform: `translate3d(-${step * position}px, 0, 0)` }}
              onTransitionEnd={handleTrackTransitionEnd}
              aria-live="off"
            >
              {repeatedEvents.map(({ item, copy, isDuplicate }) => (
                <li
                  className="events__item"
                  key={`${copy}-${item.name}`}
                  aria-hidden={isDuplicate || undefined}
                >
                  <article className="event-card">
                    <figure className="event-card__photo">
                      <img src={item.photo} alt={item.name} loading="lazy" decoding="async" />
                      <figcaption className="event-card__caption">
                        <span>{item.date}</span>
                        <h3>{item.name}</h3>
                      </figcaption>
                    </figure>
                  </article>
                </li>
              ))}
            </ul>
          </div>

          <div className="events__controls">
            <button
              className="events__control events__control--previous"
              type="button"
              aria-label="Geser ke event sebelumnya"
              title="Event sebelumnya"
              onClick={() => move(-1)}
            >
              <Icon name="arrow-right" />
            </button>
            <button
              className="events__control"
              type="button"
              aria-label="Geser ke event berikutnya"
              title="Event berikutnya"
              onClick={() => move(1)}
            >
              <Icon name="arrow-right" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
